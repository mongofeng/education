import { Button, DatePicker, Input, message, Table, Tabs } from 'antd'
import { ColumnProps } from 'antd/lib/table';
import * as React from "react";
import CsvDownloader from 'react-csv-downloader';
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import { RouteComponentProps } from 'react-router-dom';
import * as api from '../../api/student'
import fetchApiHook from '../../common/hooks/featchApiList'
import * as enums from '../../const/enum'
import {IStudent} from '../../const/type/student'
import formatDate from "../../utils/format-date";
import getAge from "../../utils/getAge";

const Search = Input.Search;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

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
    title: "年龄",
    dataIndex: "age",
    render: (text: string, row: IStudent) => {
      return getAge(row.birthday)
    }

  },
  {
    title: "手机号码",
    dataIndex: "phone"
  },
  {
    title: "地址",
    dataIndex: "address",
    render: (text: string, row: IStudent) => {
      const {province, city, region} = row
      const adress = `${province}${city}${region}${text}`
      return (
        <span>
         {adress}
        </span>
      )
    }
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
  {
    title: "操作",
    render: (val: string, row: any) => {
      return (
        <Link to={`edit/${row._id}`}>编辑</Link>

      );
    }
  }
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
    pagination,
    handleTableChange,
    onDateChange,
    onSearch,
    setQuery
  } = fetchApiHook(initList, api.getStudentList, {
    limit: 10,
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
  }

  const csvData = props.allStudent.map(item => {
    return {
      ...item,
      sex: enums.SEX_LABEL[item.sex],
      address: `${item.province}${item.city}${item.region}${item.address}`,
      createDate: formatDate(new Date(item.createDate)),
      status: enums.STUDENT_STATUS_LABEL[item.status],
    }
  })

  // const resetOpenId = async () => {
  //   const PromiseApi = data.map(item => {
  //     return  api.updateStudent(item._id, {
  //       openId: item.openId.filter(id => !!id)
  //     });
  //   })

  //   await Promise.all(PromiseApi)
  //   message.success("重置微信号成功");
  // }

  const footer = () => {
    return (<CsvDownloader
      filename="学生列表"
      columns={LastCsvColumns}
      suffix={true}
      datas={csvData}>
      <Button
        type="primary"
        icon="download">
        导出
      </Button>
    </CsvDownloader>)
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
          columns={columns}
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


