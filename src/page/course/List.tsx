import { Button, DatePicker, Input, Table, Tag } from "antd";
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Link } from "react-router-dom";
import * as api from "../../api/course";
import * as enums from "../../const/enum";
import { ICourse } from "../../const/type/course";
import formatDate from "../../utils/format-date";

import fetchApiHook from '../../common/hooks/featchApiList'

const Search = Input.Search;
const { RangePicker } = DatePicker;


const columns: Array<ColumnProps<ICourse>> = [
  {
    title: "课程",
    dataIndex: "name",
    render: (val: string, row: any) => {
      return <Link to={`detail/${row._id}`}>{val}</Link>;
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
  {
    title: "一天",
    dataIndex: "time",
    filterMultiple: false,
    filters: Object.keys(enums.DAY_LABEL).map(key => ({text: enums.DAY_LABEL[key], value: key})),
    render: (str: enums.DAY) => (
      <span>{enums.DAY_LABEL[str]}</span>
    )
  },
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
    title: "创建时间",
    dataIndex: "createDate",
    sorter: true,
    render: (date: string) => <span>{formatDate(new Date(date))}</span>
  },
  {
    title: "状态",
    dataIndex: "status",
    filterMultiple: false,
    filters: Object.keys(enums.COURSE_STATUS_LABEL).map(key => ({text: enums.COURSE_STATUS_LABEL[key], value: key})),
    render: (str: enums.COURSE_STATUS) => (
      <span>{enums.COURSE_STATUS_LABEL[str]}</span>
    )
  },
  {
    title: "操作",
    render: (val: string, row: any) => {
      return <Link to={`edit/${row._id}`}>编辑</Link>;
    }
  }
];

const initList: ICourse[] = [];


function List(props: RouteComponentProps): JSX.Element {

  const {
    loading, 
    data, 
    pagination, 
    handleTableChange, 
    onDateChange, 
    onSearch
  } = fetchApiHook(initList, api.getCourserList)

  

  /**
   * 跳转路由
   */
  const handleOnClick = () => {
    props.history.push("add");
  };


  return (
    <div>
      <div className="main-title clearfix">
        <h2>课程列表</h2>
        <Button
          className="fr"
          type="primary"
          icon="plus"
          onClick={handleOnClick}
        >
          添加课程
        </Button>
      </div>

      <div className="content-wrap">
        <div className="mb10">
          <RangePicker onChange={onDateChange} />

          <Search
            className="ml10"
            placeholder="请输入课程名字"
            onSearch={onSearch}
            style={{ width: 200 }}
          />
        </div>

        <Table<ICourse>
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
