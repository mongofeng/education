
import fetchTeacherHook from '@/common/hooks/teacher'
import ActionModal from '@/page/student/components/common-sign-modal'
import { Button, DatePicker, Icon, Input, message, Modal, Table, Tag } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import * as React from 'react'
import { useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as api from '../../api/hour'
import { caculatePackage } from '../../api/statistics'
import { sendTemplate } from '../../api/template'
import fetchApiHook from '../../common/hooks/featchApiList'
import { isDev, templateIds } from '../../config/index'
import * as enums from '../../const/enum'
import { COURSE_HOUR_ACTION_TYPE } from '../../const/enum'
import { IHour } from '../../const/type/hour'
import { ICourse } from '../../const/type/student-operation'
import formatDate from '../../utils/format-date'
import { formateTemplate } from '../../utils/template'

const confirm = Modal.confirm;

const Search = Input.Search;
const { RangePicker } = DatePicker;


const initList: IHour[] = [];


// 模态框的加载
const initModalState = {
  desc: '',
  teacherId: '',
  visible: false,
  confirmLoading: false,
}


interface IProps {
  package: {
    [key in string]: string;
  };
  student: {
    [key in string]: string;
  }
  openIds: Map<string, string[]>
}

function List(props: IProps): JSX.Element {

  const onDel = (id: string) => {
    confirm({
      title: '提示',
      content: '确定删除该课程记录,请确保没有课程包,请先删除不需要的课程包,防止数据的错乱',
      onOk: async () => {
        try {
          await api.delHour(id)
          message.success('删除成功')
          fetchData(true)
        } catch (error) {
          message.error('删除失败')
        }
      },
    });
  }


  const onPushMessage = (row: IHour) => {
    confirm({
      title: '提示',
      content: '是否推送微信的消息',
      onOk: async () => {
        try {

          let openids = props.openIds.get(row.studentId)

          const templateId = templateIds.get(row.type)

          if (!openids || !openids.length || !templateId) {
            message.error('找不到绑定的微信号')
            return
          }

          openids = openids.filter(key => !!key)

          const studentName = props.student[row.studentId]

          let viewData: { [key in string]: string | number } = {}

          if (row.type === COURSE_HOUR_ACTION_TYPE.buy) {
            const packageName = props.package[row.packageId]
            viewData = {
              first: `您好,${studentName}同学,您所购买的套餐已经充值成功！`,
              keyword1: studentName,
              keyword2: packageName,
              keyword3: `${row.num}课时`,
              remark: '祝您生活愉快！',
            };
          } else {
            const params = {
              studentIds: row.studentId,
            }
            const { data: { data } } = await caculatePackage(params as any)
            const [target] = data
            if (!target) {
              message.error('搜索不了当前用户的剩余课时')
              return;
            }

            const keyword4 = `${target.surplus}课时`;
            const date = new Date();
            const time = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}号`;
            const count = `${row.num}课时` // 扣除的课时
            const courseName = row.course.map(item => item.name).join(',') // 课程名称
            const remark: string = '祝您生活愉快！'
            if (row.type === COURSE_HOUR_ACTION_TYPE.sign) {
              viewData = {
                first: `您好,${studentName}同学,签到成功！`,
                keyword1: time,
                keyword2: courseName,
                keyword3: count, // 扣除的课时
                keyword4,
                remark,
              };
            } else {
              viewData = {
                first: '亲爱的家长您好，我们已为您孩子的学习课程进行补签',
                keyword1: courseName,
                keyword2: time,
                keyword3: count, // 扣除的课时
                keyword4,
                keyword5: row.desc,
                remark,
              };
            }
          }

          const PromiseRequests = openids.map(openId => {
            const params = {
              touser: openId,
              template_id: templateId,
              data: formateTemplate(viewData),
            }
            return sendTemplate(params)
          })
          const res = await Promise.all(PromiseRequests);
          const successCount = res.reduce((initVal: number, item: { data: { errcode: number; msgid: number } }) => {
            return (item.data.errcode === 0 && item.data.msgid) ? initVal + 1 : initVal;
          }, 0)
          message.success(`推送${successCount}个微信消息成功`)
        } catch (error) {
          message.error('推送失败')
        }
      },
    });
  }

  const columns: Array<ColumnProps<IHour>> = [
    {
      title: "学员",
      dataIndex: "studentId",
      render: (val: string) => {
        return props.student[val]
      }
    },

    {
      title: "所属老师",
      dataIndex: "teacherId",
      render: (teacherId: string, row) => {
        if (teacherId && teacherObj[teacherId]) {
          return [
            <span key="1">{teacherObj[teacherId]}</span>,
            (<Button
              key="2"
              className="ml5"
              icon="edit"
              size="small"
              onClick={() => {
                showSupplementModal(row)
              }} />),
          ]
        }
        return [
          (<span key="1">-</span>),
          (<Button
            key="2"
            className="ml5"
            icon="edit"
            size="small"
            onClick={() => {
              showSupplementModal(row)
            }} />),
        ]
      }
    },

    {
      title: "课时数量",
      dataIndex: "num",
    },
    {
      title: "操作类型",
      dataIndex: "type",
      filterMultiple: false,
      filters: Object.keys(enums.COURSE_HOUR_ACTION_TYPE_LABEL).map(key => ({ text: enums.COURSE_HOUR_ACTION_TYPE_LABEL[key], value: key })),
      render: (str: enums.COURSE_HOUR_ACTION_TYPE) => {
        return (
          <Tag color={enums.COURSE_HOUR_ACTION_TYPE_COLOR[str]}>
            {enums.COURSE_HOUR_ACTION_TYPE_LABEL[str]}
          </Tag>
        )
      }
    },
    {
      title: "课程",
      dataIndex: "course",
      render: (val: ICourse[]) => {
        if (!val || !val.length) {
          return '-'
        }
        return val.map((item) => {
          return [
            (
              <div key={item.id}>
                {`${item.name}:${item.count}课时`}
              </div>
            )
          ]
        })
      }
    },
    {
      title: "创建时间",
      dataIndex: "createDate",
      sorter: true,
      render: (date: string) => formatDate(new Date(date))
    },


    {
      title: "操作",
      render: (val: string, row: any) => {
        const result = [
          (<Link to={`detail/${row._id}`} key='1'>
            <Icon type="codepen" />
          </Link>),
          (<Button
            key="2"
            className="ml5"
            type="link"
            icon="wechat"
            size="small"
            onClick={() => {
              onPushMessage(row)
            }} />),
          (<Button
            key="3"
            className="ml5"
            type="link"
            icon="delete"
            size="small"
            onClick={() => {
              onDel(row._id)
            }} />)
        ]
        if (isDev) {
          return result
        }
        return result.slice(0, result.length - 1)
      }
    }
  ];

  const {
    loading,
    data,
    pagination,
    handleTableChange,
    onDateChange,
    onSearch,
    fetchData
  } = fetchApiHook(initList, api.getHourrList)


  const {
    teacherObj,
  } = fetchTeacherHook()








  /**
   * 补签
   */
  const [supplementState, setSupplementState] = useState(initModalState)
  const [hourId, setHourId] = useState<string>('')

  const showSupplementModal = (row: IHour) => {
    setHourId(row._id)
    setSupplementState({
      ...supplementState,
      desc: row.desc || '',
      visible: true,
      teacherId: row.teacherId
    })
  }

  const handleSupplementCancel = () => {
    setSupplementState({
      ...initModalState,
    })
  }

  const handleSupplementSumbit = async (values) => {
    const {
      desc,
      teacherId
    } = values



    setSupplementState({
      ...supplementState,
      confirmLoading: true,
    })
    try {
      await api.updateHour(
        hourId,
        {
          desc,
          teacherId
        }
      )

      message.success(`发送成功`);
      fetchData();

    } finally {
      handleSupplementCancel();
    }

  }








  return (
    <div>
      <div className="main-title clearfix">
        <h2>课时流水</h2>
      </div>

      <div className="content-wrap">




        {/*补签模块*/}
        <ActionModal
          title="修改"
          isHideNum={true}
          onCreate={handleSupplementSumbit}
          onCancel={handleSupplementCancel}
          {...supplementState} />


        <div className="mb10">
          <RangePicker onChange={onDateChange} />

          <Search
            className="ml10"
            placeholder="请输入学员名字"
            onSearch={onSearch}
            style={{ width: 200 }}
          />
        </div>

        <Table<IHour>
          bordered={true}
          columns={columns}
          rowKey="_id"
          dataSource={data}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange} />
      </div>
    </div>
  );
}

export default connect((state: any) => {
  return {
    student: state.student.labels,
    openIds: state.student.openIds,
    package: state.package.labels,
  }
})(List);
