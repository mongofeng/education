import { Button, Input, message, Modal, Table } from 'antd'
import { ColumnProps, TableRowSelection } from 'antd/lib/table';
import * as React from "react";
import * as api from '@/api/trial-student'
import fetchApiHook from '@/common/hooks/featchApiList'
import { batchTrialStudentToCourse, delAllCourseStudent, delTrailStudentFromCourse } from '@/api/course'
import { TrialStudent } from '@/const/type/trial-student'
import formatDate from "@/utils/format-date";
const Search = Input.Search;
const confirm = Modal.confirm;
interface IProps {
  update: () => void
  courseId: string
  studentIds: string[]
}
const { useState } = React;


const columns: Array<ColumnProps<TrialStudent>> = [
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "手机号码",
    dataIndex: "phone"
  },
  {
    title: "年龄",
    dataIndex: "age",
  },
  {
    title: "创建时间",
    dataIndex: "createDate",
    sorter: true,
    render: (date: string) => <span>{formatDate(new Date(date))}</span>
  },
];





const initList: TrialStudent[] = [];


/**
 *
 * @param props 选择项
 */
const initSelectedRows: TrialStudent[] = []


function List(props: IProps): JSX.Element {

  const {
    loading,
    data,
    pagination,
    handleTableChange,
    onSearch  } = fetchApiHook(initList, api.gettrialStudentList, {
    limit: 10,
    size: 10,
    page: 1,
    query: {
      status: 1,
    },
    sort: { createDate: -1 }
  } as any)





  const onDel = (id: string) => {
    confirm({
      title: '提示',
      content: '确定删除该课程下试用学生',
      onOk: async () => {
        try {
          await delTrailStudentFromCourse(props.courseId, { ids: [id] })
          props.update()
          message.success('删除成功')
          setTableSelectedRows([])
        } catch (error) {
          message.error('删除失败')
        }
      },
    });

  }


  // 选择项
  const [tableSelectedRows, setTableSelectedRows] = useState(initSelectedRows);


  // rowSelection objects indicates the need for row selection
  const rowSelection: TableRowSelection<TrialStudent> = {
    onSelect: (record, selected, selectedRows) => {
      // 当前项，当前是否选择， 当前所有选择
      console.log(selected, selectedRows);
      setTableSelectedRows(selectedRows as TrialStudent[])
    },
    getCheckboxProps: record => ({
      disabled: props.studentIds.indexOf(record._id) > -1, // Column configuration not to be checked
      ...record
    }),
    onSelectAll: (selected, selectedRows) => {
      // 当前是否选择， 当前所有选择，当前项，
      console.log(selected, selectedRows);
      setTableSelectedRows(selectedRows)
    },
  };


  const operate = [
    {
      title: "操作",
      render: (val: string, row: TrialStudent) => {
        if (props.studentIds.indexOf(row._id) === -1) {
          return []
        }
        return [
          <Button
            key="2"
            className="ml5"
            type="link"
            icon="delete"
            size="small"
            onClick={() => {
              onDel(row._id)
            }} >解除绑定</Button>
        ]
      }
    }
  ]



  const onAdd = async () => {
    console.log(tableSelectedRows)
    const ids = tableSelectedRows.map(i => i._id)
    if (!ids.length) { return message.error('请选择学生') }
    await batchTrialStudentToCourse(props.courseId, { ids })
    props.update()
    setTableSelectedRows([])
    message.success('添加成功')
  }





  return (
    <React.Fragment>

      <div className="mb10">

        <Search

          placeholder="请输入名字"
          onSearch={onSearch}
          style={{ width: 200 }} />

        <Button
          className="ml10"
          type="primary"
          onClick={onAdd}>
          添加
        </Button>


        {/* <Button
          type="primary"
          className="ml10"
          onClick={onDelAll}>
          删除
        </Button> */}
      </div>

      <Table<TrialStudent>
        bordered={true}
        columns={columns.concat(operate)}
        rowKey="_id"
        dataSource={data}
        pagination={pagination}
        loading={loading}
        rowSelection={rowSelection}
        onChange={handleTableChange} />

    </React.Fragment>
  );
}

export default List


