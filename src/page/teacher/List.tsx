import { Button, DatePicker, Input, Table, Tabs } from "antd";
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Link } from "react-router-dom";
import * as api from "../../api/teacher";
import fetchApiHook from '../../common/hooks/featchApiList'
import * as enums from "../../const/enum";
import { ITeacher } from "../../const/type/teacher";
import formatDate from "../../utils/format-date";
import getAge from '../../utils/getAge'

const Search = Input.Search;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const columns: Array<ColumnProps<ITeacher>> = [
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
    render: (text: string, row: ITeacher) => (
      <Link to={`detail/${row._id}`}>{text}</Link>
    )
  },
  {
    title: "性别",
    dataIndex: "sex",
    filterMultiple: false,
    filters: [{ text: "男", value: "1" }, { text: "女", value: "2" }],
    render: (str: enums.ESEX) => <span>{enums.SEX_LABEL[str]}</span>
  },
  {
    title: "年龄",
    dataIndex: "age",
    render: (text: string, row: ITeacher) => {
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
    render: (text: string, row: ITeacher) => {
      const { province, city, region } = row;
      const adress = `${province}${city}${region}${text}`;
      return <span>{adress}</span>;
    }
  },
  {
    title: "创建时间",
    dataIndex: "createDate",
    sorter: true,
    render: (date: string) => <span>{formatDate(new Date(date))}</span>
  },
  {
    title: "状态",
    dataIndex: "status",
    filterMultiple: false,
    filters: [{ text: "在职", value: "1" }, { text: "离职", value: "2" }],
    render: (str: enums.TEACHER_STATUS) => (
      <span>{enums.TEACHER_STATUS_LABEL[str]}</span>
    )
  },
  {
    title: "操作",
    render: (val: string, row: any) => {
      return <Link to={`edit/${row._id}`}>编辑</Link>;
    }
  }
];

const initList: ITeacher[] = [];


function List(props: RouteComponentProps): JSX.Element {

  const {
    loading,
    data,
    pagination,
    handleTableChange,
    onDateChange,
    onSearch,
    setQuery
  } = fetchApiHook(initList, api.getteacherList, {
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


  return (
    <div>
      <div className="main-title clearfix">
        <h2>老师列表</h2>
        <Button
          className="fr"
          type="primary"
          icon="plus"
          onClick={handleOnClick}
        >
          添加老师
        </Button>
      </div>

      <div className="content-wrap">
        <div className="mb10">

          <Tabs defaultActiveKey="1" onChange={onTabChange}>
            <TabPane tab="在职" key="1"/>
            <TabPane tab="离职" key="2"/>
          </Tabs>

          <RangePicker onChange={onDateChange} />

          <Search
            className="ml10"
            placeholder="请输入名字"
            onSearch={onSearch}
            style={{ width: 200 }}
          />
        </div>

        <Table<ITeacher>
          bordered={true}
          columns={columns}
          rowKey="_id"
          dataSource={data}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}/>
      </div>
    </div>
  );
}

export default List;
