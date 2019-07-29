import { DatePicker, Input , Table, Tag } from "antd";
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import { Link } from "react-router-dom";
import * as api from "../../../api/course";
import * as enums from "../../../const/enum";
import { ICourse } from "../../../const/type/course";
import formatDate from "../../../utils/format-date";

import fetchApiHook from '../../../common/hooks/featchApiList'

const Search = Input.Search;
const { RangePicker } = DatePicker;




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

];

const initList: ICourse[] = [];


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
  } = fetchApiHook(initList, api.getCourserList, {
    page: 1,
    limit: 10,
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
        placeholder="请输入课程名字"
        onSearch={onSearch}
        style={{ width: 200 }}/>

    </div>


    <Table<ICourse>
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
