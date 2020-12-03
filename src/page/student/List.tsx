import { downLoad } from '@/utils/excel';
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
const Search = Input.Search;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const confirm = Modal.confirm;
interface IProps {
  allStudent: IStudent[]
}


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
    render: (str: enums.STUDENT_STATUS) => <span>{enums.STUDENT_STATUS_LABEL[str]}</span>
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



const initList: IStudent[] = [];


function List(props: RouteComponentProps & IProps): JSX.Element {

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



  /**
   * 跳转路由
   */
  const handleOnClick = () => {
    props.history.push("add");
  };


  const onTabChange = (status: string) => {
    setQuery({
      status: Number(status)
    })
    setPagination({
      ...pagination,
      current: 1
    })
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
      </div>

      <div className="content-wrap">
        <Tabs defaultActiveKey="1" onChange={onTabChange}>
          <TabPane tab="在读" key="1"/>
          <TabPane tab="毕业" key="2"/>
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


