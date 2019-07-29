import { DatePicker, Input, Table, Tag } from 'antd'
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import * as api from "../../../../api/hour";
import fetchApiHook from '../../../../common/hooks/featchApiList'
import * as enums from "../../../../const/enum";
import { IHour } from "../../../../const/type/hour";
import { ICourse } from '../../../../const/type/student-operation'
import formatDate from "../../../../utils/format-date";
const { RangePicker } = DatePicker;
const Search = Input.Search;
const columns: Array<ColumnProps<IHour>> = [
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
      return (
        <Tag color={enums.COURSE_HOUR_ACTION_TYPE_COLOR[str]}>
          {enums.COURSE_HOUR_ACTION_TYPE_LABEL[str]}
        </Tag>
      )
    }
  },
  {
    title: "课程",
    dataIndex: "course",
    render: (val: ICourse[]) => {
      if (!val || !val.length) {
        return  '-'
      }
      return val.map((item) => {
        return [
          (
            <div key={item.id}>
              {`${item.name}:${item.count}课时`}
            </div>
          )
        ]
      })
    }
  },
  {
    title: "备注",
    dataIndex: "desc",
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
