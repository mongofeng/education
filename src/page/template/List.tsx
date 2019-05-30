import { Button, DatePicker, Input, Table } from "antd";
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Link } from "react-router-dom";
import * as api from "../../api/student";
import * as enums from "../../const/enum";
import {IStudent} from '../../const/type/student'
import formatDate from "../../utils/format-date";

import fetchApiHook from '../../common/hooks/featchApiList'

const Search = Input.Search;
const { RangePicker } = DatePicker;


const columns: Array<ColumnProps<IStudent>> = [
  {
    title: "姓名",
    dataIndex: "name",
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
  },
  {
    title: "手机号码",
    dataIndex: "phone"
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
    filters: [
      { text: '在读', value: '1' },
      { text: '毕业', value: '2' },
    ],
    render: (str: enums.STUDENT_STATUS) => <span>{enums.STUDENT_STATUS_LABEL[str]}</span>
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

const initList: IStudent[] = [];


function List(props: RouteComponentProps): JSX.Element {

  const {
    loading, 
    data, 
    pagination, 
    handleTableChange, 
    onDateChange, 
    onSearch
  } = fetchApiHook(initList, api.getStudentList)

  

  /**
   * 跳转路由
   */
  const handleOnClick = () => {
    props.history.push("add");
  };


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
          <RangePicker onChange={onDateChange} />

          <Search
            className="ml10"
            placeholder="请输入名字"
            onSearch={onSearch}
            style={{ width: 200 }}
          />
        </div>

        <Table<IStudent>
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
