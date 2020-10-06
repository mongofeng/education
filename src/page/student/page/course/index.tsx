import { Button, DatePicker, Input, message, Modal, Table, Tag } from "antd";
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import { Link, withRouter } from "react-router-dom";
import * as api from "../../../../api/course";
import * as apiPack from '../../../../api/student-operation'
import fetchApiHook from '../../../../common/hooks/featchApiList'
import * as enums from "../../../../const/enum";
import { ICourse } from "../../../../const/type/course";
import { ISign, ISupplement } from '../../../../const/type/student-operation'
import formatDate from "../../../../utils/format-date";
import SupplementModal from '../../components/common-sign-modal'
import CourseModal from './course-modal'


const { useState } = React;
const Search = Input.Search;
const { RangePicker } = DatePicker;

const confirm = Modal.confirm;


const initList: ICourse[] = [];

// 模态框的加载
const initModalState = {
  teacherId: '',
  visible: false,
  confirmLoading: false,
}


interface IProps {
  id: string
  update: () => Promise<void>
}


const columns: Array<ColumnProps<ICourse>> = [
  {
    title: "课程",
    dataIndex: "name",
    render: (val: string, row: any) => {
      return <Link to={`../../course/detail/${row._id}`}>{val}</Link>;
    }
  },
  {
    title: "一周",
    dataIndex: "day",
    render: (days: enums.WEEK[]) => {
      return days.map((key) => {
        return (
          <Tag color="blue" key={key}>
            {enums.WEEK_LABEL[key]}
          </Tag>
        )
      })
    },
  },
  // {
  //   title: "一天",
  //   dataIndex: "time",
  //   filterMultiple: false,
  //   filters: Object.keys(enums.DAY_LABEL).map(key => ({ text: enums.DAY_LABEL[key], value: key })),
  //   render: (str: enums.DAY) => (
  //     <span>{enums.DAY_LABEL[str]}</span>
  //   )
  // },
  {
    title: "开课时间",
    dataIndex: "startDate",
    render: (date: number) => <span>{formatDate(new Date(date), {
      format: 'yyyy-MM-dd',
    })}</span>
  },
  {
    title: "结课时间",
    dataIndex: "endDate",
    render: (date: number) => <span>{formatDate(new Date(date), {
      format: 'yyyy-MM-dd',
    })}</span>
  },
  {
    title: "状态",
    dataIndex: "status",
    filterMultiple: false,
    filters: Object.keys(enums.COURSE_STATUS_LABEL).map(key => ({ text: enums.COURSE_STATUS_LABEL[key], value: key })),
    render: (str: enums.COURSE_STATUS) => (
      <span>{enums.COURSE_STATUS_LABEL[str]}</span>
    )
  },
];

type IType = 'sign' | 'supplement'
const initType: IType = 'supplement'

const List: React.FC<IProps> = (props) => {

  console.log(props, '1111111111')

  const {
    loading,
    data,
    pagination,
    handleTableChange,
    onDateChange,
    onSearch,
    fetchData
  } = fetchApiHook(initList, api.getCourserList, {
    page: 1,
    limit: 10,
    size: 10,
    query: {
      studentIds: {
        $in: [props.id]
      }
    },
    sort: {
      createDate: -1
    }
  })

  // 模态框
  const [modalState, setModalState] = useState(initModalState)

  const [type, setType] = useState<IType>(initType)

  /**
   * 打开模态框
   */
  const showModal = () => {
    setModalState({
      ...modalState,
      visible: true
    })
  }

  /**
   * 确定模态框
   */
  const handleOk = async (selectRows: object[]) => {
    // 打开loading
    if (!selectRows.length) { return }
    setModalState({
      ...modalState,
      confirmLoading: true,
    })
    try {
      await api.batchCourse({
        id: props.id,
        courseIds: (selectRows as Array<Required<ICourse>>).map(item => item._id)
      })
      message.success('关联成功')
      fetchData(true)
    } finally {
      setModalState({
        ...initModalState,
      })
    }
  }


  const onDelCourse = (courseId: string) => {
    confirm({
      title: '提示',
      content: '确定取消改课程的关联?',
      onOk: async () => {
        try {
          await api.delCourseByStudent({
            id: props.id,
            courseIds: [courseId]
          })
          message.success('取消关联成功')
          fetchData(true)
        } catch (error) {
          message.error('取消关联失败')
        }

      },
    });

  }

  /**
   * 取消模态框
   */
  const handleCancel = () => {
    setModalState({
      ...modalState,
      visible: false
    })
  }




  /**
   * 补签
   */
  const [supplementState, setSupplementState] = useState(initModalState)
  const [courseRow, setcourseRow] = useState(null)

  const showSupplementModal = (row: ICourse) => {
    setcourseRow(row)
    setSupplementState({
      ...supplementState,
      visible: true,
      teacherId: row.teacherId,
    })
  }

  const handleSupplementCancel = () => {
    setSupplementState({
      ...initModalState,
    })
  }

  const handleSupplementSumbit = async (values) => {
    const {
      num,
      desc,
      teacherId,
    } = values
    const {
      _id,
      name,
      
    } = courseRow



    setSupplementState({
      ...supplementState,
      confirmLoading: true,
    })
    try {
      if (type === 'supplement') {
        const params: ISupplement = {
          teacherId,
          desc,
          num,
          course: [
            {
              id: _id,
              name,
              count: num
            }
          ],
          studentId: props.id
        }
        const {data: {data: result}} = await apiPack.supplement(params)
        console.log(result)
        const {studentPackage, templateMsg} = result
        const str = (studentPackage.ok === 1 && studentPackage.n !== 0) ? '补签成功,成功扣除课时' : '补签失败, 扣除课时失败'
        const total: number = templateMsg.reduce((tatal: number, item: {
          errcode: number
        }) => {
          return item.errcode === 0 ? tatal + 1 : tatal
        }, 0)
        message.success(`${str}, 成功推送微信消息${total}条`)
      } else if (type === 'sign') {
        const params: ISign = {
          teacherId,
          desc,
          num,
          course: [
            {
              id: _id,
              name,
              count: num
            }
          ],
          studentId: props.id,
          courseName: name,
        }
        const {data: {data: result}} = await apiPack.sign(params)
        const {studentPackage, templateMsg} = result
        const str = (studentPackage.ok === 1 && studentPackage.n !== 0) ? '签到成功,成功扣除课时' : '签到失败,扣除课时失败'
        const total: number = templateMsg.reduce((tatal: number, item: {
          errcode: number
        }) => {
          return item.errcode === 0 ? tatal + 1 : tatal
        }, 0)
        message.success(`${str}, 成功推送微信消息${total}条`)
      } else {
        message.error('找不到当前的类型')
      }

      props.update()
    } finally {
      handleSupplementCancel();
    }

  }


  const specialColumn = [
    {
      title: "操作",
      render: (val: string, row: ICourse) => {
        return [
          (<Button
              key="1"
              className="mr5"
              type="primary"
              icon="delete"
              size="small"
              onClick={() => {
              onDelCourse(row._id)
            }} >
            取消关联
          </Button>),
          (<Button
            key="2"
            type="primary"
            icon="form"
            className="mr5"
            size="small"
            onClick={() => {
              setType('supplement')
              showSupplementModal(row)
            }} >
            补签
          </Button>),
          (
            <Button
              key="3"
              type="primary"
              icon="edit"
              size="small"
              onClick={() => {
                setType('sign')
                showSupplementModal(row)
              }}>
              签到
            </Button>
          ),
          (
            <Link to={`../comment/${props.id}/${row._id}`} key="4" >       
              <Button
              type="primary"
              icon="edit"
              size="small">
              课程评价
            </Button>
            </Link>
          )
        ]
      }
    }
  ]



  return (
    <React.Fragment>



      {/*补签模块*/}
      <SupplementModal
        title={type === 'supplement' ? '补签' : '签到'}
        onCreate={handleSupplementSumbit}
        onCancel={handleSupplementCancel}
        { ...supplementState}/>

      {/*添加课程模块*/}
      <CourseModal
        title="添加课程"
        id={props.id}
        destroyOnClose={true}
        onSelect={handleOk}
        width={800}
        {...modalState}
        onCancel={handleCancel} />

      <div className="mb10">
        <RangePicker onChange={onDateChange} />

        <Search
          className="ml10"
          placeholder="请输入课程名字"
          onSearch={onSearch}
          style={{ width: 200 }} />

        <Button
          className="fr"
          type="primary"
          icon="plus"
          onClick={showModal}>
          添加课程
        </Button>
      </div>



      <Table<ICourse>
        columns={columns.concat(specialColumn)}
        rowKey="_id"
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange} />
    </React.Fragment>
  );
}

export default withRouter(List as any);
