import { DatePicker, Input, Table } from "antd";
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import { Link } from "react-router-dom";
import * as api from "../../../api/student";

import * as enums from "../../../const/enum";
import { IStudent } from "../../../const/type/student";
import formatDate from "../../../utils/format-date";

import fetchApiHook from '../../../common/hooks/featchApiList'

const Search = Input.Search;
const { RangePicker } = DatePicker;




const columns: Array<ColumnProps<IStudent>> = [
    {
      title: "姓名",
      dataIndex: "name",
      render: (val: string, row: any) => {
        return (
          <Link to={`../../student/detail/${row._id}`}>{val}</Link>
        );
      }
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
  ];

const initList: IStudent[] = [];



interface IProps {
  id: string
}

const List: React.FC<IProps> =  (props) => {

  const {
    loading, 
    data, 
    pagination, 
    handleTableChange, 
    onDateChange, 
    onSearch,
  } = fetchApiHook(initList, api.getStudentList, {
    page: 1,
    limit: 10,
    size: 10,
    query: {
      teacherId: props.id
    },
    sort: {
      createDate: -1
    }
  })





  return (
    <React.Fragment>
    <div className="mb10">
        <RangePicker onChange={onDateChange} />

        <Search
        className="ml10"
        placeholder="请输入学员名字"
        onSearch={onSearch}
        style={{ width: 200 }}/>

    </div>


    <Table<IStudent>
        columns={columns}
        rowKey="_id"
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}/>
    </React.Fragment>
  );
}

export default List;
