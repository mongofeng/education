import { downLoad } from '@/utils/excel';
import { RedirectUrl } from '@/utils/redirct';
import { Button, DatePicker, Icon, Input, message, Modal, Table, Tabs } from 'antd'
import { ColumnProps } from 'antd/lib/table';
import * as React from "react";
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import { RouteComponentProps } from 'react-router-dom';
import * as api from '../../api/student'
import fetchApiHook from '../../common/hooks/featchApiList'
import {isDev} from '../../config/index'
import * as enums from '../../const/enum'
import {IStudent} from '../../const/type/student'
import formatDate from "../../utils/format-date";
import QrcodeCom from '@/components/Qrcode'
import ActionModal from '@/page/student/components/common-sign-modal'
import { useState } from 'react';
import fetchTeacherHook from '@/common/hooks/teacher';
const Search = Input.Search;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const confirm = Modal.confirm;
interface IProps {
  allStudent: IStudent[]
}


// 模态框的加载
const initModalState = {
  desc: '',
  teacherId: '',
  visible: false,
  confirmLoading: false,
}






const initList: IStudent[] = [];


function List(props: RouteComponentProps & IProps): JSX.Element {

  /**
   * 通过选择老师
   */
  const [TeacherState, setTeacherState] = useState(initModalState)
  const [studentId, setStudent] = useState<string>('')

  const host = encodeURIComponent(`${location.origin}/student`)

  const url = RedirectUrl(host)
  const [visible, setVisible] = React.useState<boolean>(false)


  const {
    teacherObj,
  } = fetchTeacherHook()

  const {
    loading,
    data,
    fetchData,
    pagination,
    handleTableChange,
    onDateChange,
    onSearch,
    setQuery,
    setPagination
  } = fetchApiHook(initList, api.getStudentList, {
    limit: 10,
    size: 10,
    page: 1,
    query: {
      status: 1
    },
    sort: { createDate: -1 }
  })

  const columns: Array<ColumnProps<IStudent>> = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      render: (text: string, row: IStudent) => (
        <Link to={`detail/${row._id}`}>{text}</Link>
      )
    },
    {
      title: "性别",
      dataIndex: "sex",
      filterMultiple: false,
      filters: [
        { text: '男', value: '1' },
        { text: '女', value: '2' },
      ],
      render: (str: enums.ESEX) => <span>{enums.SEX_LABEL[str]}</span>
    },
    {
      title: "手机号码",
      dataIndex: "phone"
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (str: enums.STUDENT_STATUS, row: IStudent) => {
        if (str === enums.STUDENT_STATUS.Review) {
          return [
            (<Button
              className="mr5"
              key="2"
              size="small"
              onClick={() => {
                showTeacherModal(row)
              }} >通过</Button>)
          ]
        }
        return [
          (<span key='1'>{enums.STUDENT_STATUS_LABEL[str]}</span>)
        ]
      }
    },
    {
      title: "老师",
      dataIndex: "teacherId",
      render: (teacherId: string) => {
        if (teacherId && teacherObj[teacherId]) {
          return teacherObj[teacherId] || '-'
        }
        return '-'
      }
    },
    {
      title: "创建时间",
      dataIndex: "createDate",
      sorter: true,
      render: (date: string) => <span>{formatDate(new Date(date))}</span>
    },
  ];
  
  const initCsvCols = [
    {
      id: 'birthday',
      displayName: '生日'
    },
    {
      id: 'contacts',
      displayName: '联系人'
    },
    // {
    //   id: 'hasopenId',
    //   displayName: '绑定微信'
    // },
    // {
    //   id: 'teacherName',
    //   displayName: '所属老师'
    // }
  ]
  
  const csvColumns = columns.reduce((initVal: Array<{id: string; displayName: string}>, item: any) => {
    return item.dataIndex ? initVal.concat({
      id: item.dataIndex,
      displayName: item.title,
    }) : initVal;
  }, [])
  
  const LastCsvColumns = csvColumns.slice(0,3).concat(initCsvCols, csvColumns.slice(3))



  /**
   * 跳转路由
   */
  const handleOnClick = () => {
    props.history.push("add");
  };


  const onTabChange = (status: string) => {
    const page = {
      ...pagination,
      current: 1
    }
    setPagination(page)
    setQuery({
      status: Number(status)
    }, page)
    
  }

  const downLoadXlsx =  () => {
    const header = [];
    const headerDisplay: object = { };
    LastCsvColumns.forEach(item => {
      header.push(item.id)
      headerDisplay[item.id] = item.displayName
    })
    // 获取学生列表
    const sheetData = props.allStudent.map(item => {
      const obj = {
        ...item,
        sex: enums.SEX_LABEL[item.sex],
        address: `${item.province}${item.city}${item.region}${item.address}`,
        createDate: formatDate(new Date(item.createDate)),
        status: enums.STUDENT_STATUS_LABEL[item.status],
      }
      return header.reduce((initVal, key) => {
        initVal[key] = obj[key]
        return initVal
      }, {})
    })

    const newData = [headerDisplay, ...sheetData];

    const fileName = new Date().toLocaleDateString()
    return downLoad(
      {
        data: newData,
        opts: {header:header, skipHeader:true},
        sheetName: '统计',
        fileName: '学生统计'+fileName+'.xlsx'
      }
    )
  }

  

  // const resetOpenId = async () => {
  //   const PromiseApi = data.map(item => {
  //     return  api.updateStudent(item._id, {
  //       openId: item.openId.filter(id => !!id)
  //     });
  //   })

  //   await Promise.all(PromiseApi)
  //   message.success("重置微信号成功");
  // }

  const onDel= (id: string) => {
    confirm({
      title: '提示',
      content: '确定删除该学生,请确保没有课程包,或者课时操作记录,如果有请先去对应学员清空课程包和课时流水?',
      onOk: async () => {
        try {
          await api.delStudent(id)
          message.success('删除成功')
          fetchData(true)
        } catch (error) {
          message.error('删除失败')
        }
      },
    });

  }


  
  

  const showTeacherModal = (row: IStudent) => {
    setStudent(row._id)
    setTeacherState({
      ...TeacherState,
      desc: row.desc || '',
      visible: true,
      teacherId: row.teacherId
    })
  }

  const handleTeacherCancel = () => {
    setTeacherState({
      ...initModalState,
    })
  }

  const handleTeacherSumbit = async (values) => {
    const {
      desc,
      teacherId
    } = values



    setTeacherState({
      ...TeacherState,
      confirmLoading: true,
    })
    try {
      await api.updateStudent(studentId, {status: enums.STUDENT_STATUS.reading, teacherId, desc})
      message.success('审核通过')
      fetchData()

    } finally {
      handleTeacherCancel();
    }

  }




  const operate = [
    {
      title: "操作",
      render: (val: string, row: IStudent) => {
        if (isDev) {
          return [
            (<Link to={`edit/${row._id}`} key='1'>
              <Icon type="edit" />
            </Link>),
            (<Button
              key="2"
              className="ml5"
              type="link"
              icon="delete"
              size="small"
              onClick={() => {
                onDel(row._id)
              }} />)
          ]
        }
        return [
          (<Link to={`edit/${row._id}`} key='1'>
            <Icon type="edit" />
          </Link>),
        ]
      }
    }
  ]

  const footer = () => {
    return (<Button
      onClick={downLoadXlsx}
      type="primary"
      icon="download">
      导出
    </Button>)
  }


  return (
    <div>
      <div className="main-title clearfix">
        <h2>学生列表</h2>
        <Button
          className="fr"
          type="primary"
          icon="plus"
          onClick={handleOnClick}>
          添加学员
        </Button>


        <Button  className="fr mr10" loading={loading} onClick={() => fetchData(true)}>
          {loading ? '刷新中' : '刷新'}
        </Button>

        <Button  className="fr mr10" onClick={() => setVisible(true)}>
          扫码
        </Button>
      </div>

      <div className="content-wrap">
        <Tabs defaultActiveKey="1" onChange={onTabChange}>
          {Object.keys(enums.STUDENT_STATUS_LABEL).map(i => {
            return <TabPane tab={enums.STUDENT_STATUS_LABEL[i]} key={i}/>
          })}
        </Tabs>
        <div className="mb10">
          <RangePicker onChange={onDateChange} />

          <Search
            className="ml10"
            placeholder="请输入名字"
            onSearch={onSearch}
            style={{ width: 200 }}/>
{/*
          <Button
            className="fr"
            type="primary"
            onClick={resetOpenId}>
            重置学员微信
          </Button> */}
        </div>

        <Modal
          title="微信扫码登记信息"
          visible={visible}
          onOk={() => setVisible(false)}
          onCancel={() => setVisible(false)}>
          
          <QrcodeCom url={url} width={200} height={200}/>
        </Modal>

        {/*补签模块*/}
        <ActionModal
          title="修改"
          isHideNum={true}
          onCreate={handleTeacherSumbit}
          onCancel={handleTeacherCancel}
          {...TeacherState} />


        <Table<IStudent>
          bordered={true}
          columns={columns.concat(operate)}
          rowKey="_id"
          dataSource={data}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          footer={footer}/>
      </div>
    </div>
  );
}

export default connect((state: any) => {
  return {
    allStudent: state.student.data,
  }
})(List);


