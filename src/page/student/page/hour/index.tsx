import { DatePicker, Input, Table, Tag } from 'antd'
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import * as api from "../../../../api/hour";
import fetchApiHook from '../../../../common/hooks/featchApiList'
import * as enums from "../../../../const/enum";
import { IHour } from "../../../../const/type/hour";
import formatDate from "../../../../utils/format-date";
const { RangePicker } = DatePicker;
const Search = Input.Search;
const columns: Array<ColumnProps<IHour>> = [
  {
    title: "学员名字",
    dataIndex: "name",
  },
  {
    title: "金额",
    dataIndex: "amount",
  },
  {
    title: "课时数量",
    dataIndex: "num",
  },
  {
    title: "操作类型",
    dataIndex: "type",
    filterMultiple: false,
    filters: Object.keys(enums.COURSE_HOUR_ACTION_TYPE_LABEL).map(key => ({text: enums.COURSE_HOUR_ACTION_TYPE_LABEL[key], value: key})),
    render: (str: enums.COURSE_HOUR_ACTION_TYPE) => {
      const color = str === enums.COURSE_HOUR_ACTION_TYPE.add ? 'green' : 'red';
      return (
        <Tag color={color}>{enums.COURSE_HOUR_ACTION_TYPE_LABEL[str]}</Tag>
      )
    }
  },
  {
    title: "类型",
    dataIndex: "classTypes",
    filterMultiple: false,
    filters: Object.keys(enums.COURSE_HOUR_TYPE_LABEL).map(key => ({text: enums.COURSE_HOUR_TYPE_LABEL[key], value: key})),
    render: (str: enums.COURSE_HOUR_TYPE) => (
      <span>{enums.COURSE_HOUR_TYPE_LABEL[str]}</span>
    )
  },
  {
    title: "状态",
    dataIndex: "status",
    filterMultiple: false,
    filters: Object.keys(enums.COURSE_HOUR_STATUS_LABEL).map(key => ({text: enums.COURSE_HOUR_STATUS_LABEL[key], value: key})),
    render: (str: enums.COURSE_HOUR_STATUS) => (
      <span>{enums.COURSE_HOUR_STATUS_LABEL[str]}</span>
    )
  },
  {
    title: "创建时间",
    dataIndex: "createDate",
    sorter: true,
    render: (date: string) => <span>{formatDate(new Date(date))}</span>
  }
];

const initList: IHour[] = [];

interface IProps {
  id: string
  name: string
  update: () => Promise<void>
}


function List(props: IProps): JSX.Element {

  const {
    loading,
    data,
    pagination,
    onDateChange,
    onSearch,
    handleTableChange,
  } = fetchApiHook(initList, api.getHourrList, {
    page: 1,
    limit: 10,
    query: {
      studentId: props.id
    },
    sort: {
      createDate: -1
    }
  })



  return (
    <React.Fragment>
      <div className="mb10 clearfix">
        <RangePicker onChange={onDateChange} />

        <Search
          className="ml10"
          placeholder="请输入课程名字"
          onSearch={onSearch}
          style={{ width: 200 }} />
      </div>

      <Table<IHour>
          bordered={true}
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
