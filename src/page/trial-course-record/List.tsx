import * as api from "@/api/trial-course-record";
import fetchApiHook from '@/common/hooks/featchApiList'
import fetchTeacherHook from '@/common/hooks/teacher'
import fetchTrialStudentHook from '@/common/hooks/trial-student'
import { TrialCourseRecord } from "@/const/type/trial-course-record";
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



const initList: TrialCourseRecord[] = [];


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

  const {TrialStudentObj,
    fetchTrialStudent} =
  fetchTrialStudentHook()


  const columns: Array<ColumnProps<TrialCourseRecord>> = [
    {
      title: "学生",
      dataIndex: "studentId",
      render: (studentId: string) => {
        if (studentId && TrialStudentObj[studentId]) {
          return TrialStudentObj[studentId] || '-'
        }
        return '-'
      }
      
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
      dataIndex: "courseId",
    },
    {
      title: "课时",
      dataIndex: "num",
    },
    {
      title: "操作类型",
      dataIndex: "type",
      filterMultiple: false,
      filters: Object.keys(enums.COURSE_HOUR_ACTION_TYPE_LABEL).map(key => ({ text: enums.COURSE_HOUR_ACTION_TYPE_LABEL[key], value: key })),
      render: (str: enums.COURSE_HOUR_ACTION_TYPE) => {
        return (
          <Tag color={enums.COURSE_HOUR_ACTION_TYPE_COLOR[str]}>
            {enums.COURSE_HOUR_ACTION_TYPE_LABEL[str]}
          </Tag>
        )
      }
    },
    {
      title: "描述",
      dataIndex: "desc",
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


  React.useEffect(() => {
    fetchTrialStudent(data.filter(i => !!i.studentId).map(i => i.studentId))
  }, [data])





  return (
    <div>
      <div className="main-title clearfix">
        <h2>试课记录列表</h2>
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

        <Table<TrialCourseRecord>
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
