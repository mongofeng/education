import { Button, DatePicker, Input, Table } from "antd";
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Link } from "react-router-dom";
import * as api from "../../api/package";
import { IPackage } from "../../const/type/package";
import formatDate from "../../utils/format-date";

import fetchApiHook from '../../common/hooks/featchApiList'

const Search = Input.Search;
const { RangePicker } = DatePicker;


const columns: Array<ColumnProps<IPackage>> = [
  {
    title: "名字",
    dataIndex: "name",
    render: (val: string, row: any) => {
      return <Link to={`edit/${row._id}`}>{val}</Link>;
    }
  },
  {
    title: "课时",
    dataIndex: "count",
  },
  {
    title: "价格",
    dataIndex: "amount",
    render: (amount: number) => <span>{amount}元</span>
  },
  {
    title: "有效期",
    dataIndex: "period",
    render: (period: number) => <span>{period}年</span>
  },
  {
    title: "创建时间",
    dataIndex: "createDate",
    sorter: true,
    render: (date: string) => <span>{formatDate(new Date(date))}</span>
  },
  {
    title: "备注",
    dataIndex: "desc",
  }
];

const initList: IPackage[] = [];


function List(props: RouteComponentProps): JSX.Element {

  const {
    loading, 
    data, 
    pagination, 
    handleTableChange, 
    onDateChange, 
    onSearch
  } = fetchApiHook(initList, api.getPackageList)

  

  /**
   * 跳转路由
   */
  const handleOnClick = () => {
    props.history.push("add");
  };


  return (
    <div>
      <div className="main-title clearfix">
        <h2>课程包列表</h2>
        <Button
          className="fr"
          type="primary"
          icon="plus"
          onClick={handleOnClick}
        >
          添加课程包
        </Button>
      </div>

      <div className="content-wrap">
        <div className="mb10">
          <RangePicker onChange={onDateChange} />

          <Search
            className="ml10"
            placeholder="请输入课程包名字"
            onSearch={onSearch}
            style={{ width: 200 }}/>
        </div>

        <Table<IPackage>
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
