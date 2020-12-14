import { Button, Input, message, Modal, Table } from 'antd'
import { ColumnProps } from 'antd/lib/table';
import * as React from "react";
import * as api from '@/api/trial-student'
import fetchApiHook from '@/common/hooks/featchApiList'
import { batchTrialStudentToCourse, delTrailStudentFromCourse } from '@/api/course'
import { TrialStudent } from '@/const/type/trial-student'
import formatDate from "@/utils/format-date";
const Search = Input.Search;
const confirm = Modal.confirm;
interface IProps {
  update: () => void
  courseId: string
  studentIds: string[]
}


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




function List(props: IProps): JSX.Element {

  const {
    loading,
    data,
    pagination,
    handleTableChange,
    onSearch } = fetchApiHook(initList, api.gettrialStudentList, {
      limit: 10,
      size: 10,
      page: 1,
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
        } catch (error) {
          message.error('删除失败')
        }
      },
    });

  }





  const operate = [
    {
      title: "操作",
      render: (val: string, row: TrialStudent) => {
        if (props.studentIds.indexOf(row._id) === -1) {
          return [
            <Button
              key="1"
              className="ml5"
              icon="plus"
              size="small"
              onClick={() => {
                onAdd([row._id])
              }} >绑定</Button>
          ]
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
            }} >解绑</Button>
        ]
      }
    }
  ]



  const onAdd = async (ids: string[]) => {
    if (!ids.length) { return message.error('请选择学生') }
    await batchTrialStudentToCourse(props.courseId, { ids })
    props.update()
    message.success('添加成功')
  }





  return (
    <React.Fragment>

      <div className="mb10">

        <Search

          placeholder="请输入名字"
          onSearch={onSearch}
          style={{ width: 200 }} />


      </div>

      <Table<TrialStudent>
        bordered={true}
        columns={columns.concat(operate)}
        rowKey="_id"
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange} />

    </React.Fragment>
  );
}

export default List


