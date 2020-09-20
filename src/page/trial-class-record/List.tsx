import * as api from "@/api/trial-class-record";
import fetchApiHook from '@/common/hooks/featchApiList'
import fetchTeacherHook from '@/common/hooks/teacher'
import { TrialClassRecord } from "@/const/type/trial-class-record";
import formatDate from "@/utils/format-date";
import { Button, DatePicker, Input, message, Modal, Table } from 'antd'
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Link } from "react-router-dom";
const Search = Input.Search;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;



const initList: TrialClassRecord[] = [];


function List(props: RouteComponentProps): JSX.Element {

  const {
    loading,
    data,
    pagination,
    handleTableChange,
    onDateChange,
    onSearch,
    fetchData
  } = fetchApiHook(initList, api.gettrialCclassRecordList)



  const {
    teacherObj,
  } = fetchTeacherHook()


  const columns: Array<ColumnProps<TrialClassRecord>> = [
    {
      title: "学生",
      dataIndex: "studentName",
    },
    {
      title: "老师",
      dataIndex: "teacherId",
      render: (teacherId: string) => {
        if (teacherId && teacherObj[teacherId]) {
          return teacherObj[teacherId] || '-'
        }
        return '-'
      }
    },


    {
      title: "课程",
      dataIndex: "courseName",
    },
    {
      title: "课时",
      dataIndex: "num",
    },
    {
      title: "创建时间",
      dataIndex: "createDate",
      sorter: true,
      render: (date: string) => <span>{formatDate(new Date(date))}</span>
    },
  ];



  /**
   * 跳转路由
   */
  const handleOnClick = () => {
    props.history.push("add");
  };




  return (
    <div>
      <div className="main-title clearfix">
        <h2>试课记录列表</h2>
        <Button
          className="fr"
          type="primary"
          icon="plus"
          onClick={handleOnClick}
        >
          添加试课记录
        </Button>
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

        <Table<TrialClassRecord>
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
