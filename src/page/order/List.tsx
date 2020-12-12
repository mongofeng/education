import * as api from "@/api/order";
import fetchApiHook from '@/common/hooks/featchApiList'
import fetchTeacherHook from '@/common/hooks/teacher'
import { Order } from "@/const/type/order";
import formatDate from "@/utils/format-date";
import { Button, DatePicker, Input, message, Modal, Table, Tag } from 'antd'
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Link } from "react-router-dom";
import * as enums from '../../const/enum'
const Search = Input.Search;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;



const initList: Order[] = [];


function List(props: RouteComponentProps): JSX.Element {

  const {
    loading,
    data,
    pagination,
    handleTableChange,
    onDateChange,
    onSearch,
    fetchData
  } = fetchApiHook(initList, api.getOrderList)






  const columns: Array<ColumnProps<Order>> = [
    {
      title: "学生",
      dataIndex: "studentId",
    },
    

    {
      title: "课程包",
      dataIndex: "packageId",
    },

    {
      title: "微信订单",
      dataIndex: "outTradeNo",
    },


    {
      title: "金额",
      dataIndex: "amount",
    },

    {
      title: "学生类型",
      dataIndex: "stuStatus",
      filterMultiple: false,
      filters: Object.keys(enums.StudnetOrderStatusLabel).map(key => ({ text: enums.StudnetOrderStatusLabel[key], value: key })),
      render: (str: enums.StudnetOrderStatus) => {
        return enums.StudnetOrderStatusLabel[str]
      }
    },

    {
      title: "操作类型",
      dataIndex: "status",
      filterMultiple: false,
      filters: Object.keys(enums.OrderStatusLabel).map(key => ({ text: enums.OrderStatusLabel[key], value: key })),
      render: (str: enums.OrderStatus) => {
        return enums.OrderStatusLabel[str]
      }
    },
   
    {
      title: "创建时间",
      dataIndex: "createDate",
      sorter: true,
      render: (date: string) => <span>{formatDate(new Date(date))}</span>
    },
  ];







  return (
    <div>
      <div className="main-title clearfix">
        <h2>订单列表</h2>
  
      </div>

      <div className="content-wrap">
        <div className="mb10">
          <RangePicker onChange={onDateChange} />

          <Search
            className="ml10"
            placeholder="请输入学生名字"
            onSearch={onSearch}
            style={{ width: 200 }} />
        </div>

        <Table<Order>
          bordered={true}
          columns={columns}
          rowKey="_id"
          dataSource={data}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange} />
      </div>
    </div>
  );
}

export default List;
