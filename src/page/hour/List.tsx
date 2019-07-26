import { DatePicker, Input, Table, Tag } from "antd";
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import { Link } from "react-router-dom";
import * as api from "../../api/hour";
import * as enums from "../../const/enum";
import { IHour } from "../../const/type/hour";
import formatDate from "../../utils/format-date";
import fetchApiHook from '../../common/hooks/featchApiList'
import { ICourse } from '../../const/type/student-operation'

const Search = Input.Search;
const { RangePicker } = DatePicker;


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
    render: (date: string) => formatDate(new Date(date))
  },
  {
    title: "操作",
    render: (val: string, row: any) => {
      return <Link to={`detail/${row._id}`}>查看</Link>;
    }
  }
];

const initList: IHour[] = [];


function List(): JSX.Element {

  const {
    loading,
    data,
    pagination,
    handleTableChange,
    onDateChange,
    onSearch
  } = fetchApiHook(initList, api.getHourrList)



  return (
    <div>
      <div className="main-title clearfix">
        <h2>课时流水</h2>
      </div>

      <div className="content-wrap">
        <div className="mb10">
          <RangePicker onChange={onDateChange} />

          <Search
            className="ml10"
            placeholder="请输入学员名字"
            onSearch={onSearch}
            style={{ width: 200 }}
          />
        </div>

        <Table<IHour>
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
