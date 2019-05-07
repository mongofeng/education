import { Button, DatePicker, Input, message, Modal, Table } from "antd";
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import { Link } from "react-router-dom";
import * as api from "../../../api/course";
import * as enums from "../../../const/enum";
import { ICourse } from "../../../const/type/course";
import formatDate from "../../../utils/format-date";
import IModal from './Modal'

import fetchApiHook from '../../../common/hooks/featchApiList'
const { useState } = React;
const Search = Input.Search;
const { RangePicker } = DatePicker;

const confirm = Modal.confirm;


const initList: ICourse[] = [];

// 模态框的加载
const initModalState = {
  visible: false,
  confirmLoading: false,
}


interface IProps {
  id: string
}

const List: React.FC<IProps> = (props) => {

  const {
    loading,
    data,
    pagination,
    handleTableChange,
    onDateChange,
    onSearch,
    fetchData
  } = fetchApiHook(initList, api.getCourserList, {
    page: 1,
    limit: 10,
    query: {
      studentIds: {
        $in: [props.id]
      }
    },
    sort: {
      createDate: -1
    }
  })

  // 模态框
  const [modalState, setModalState] = useState(initModalState)

  /**
   * 打开模态框
   */
  const showModal = () => {
    setModalState({
      ...modalState,
      visible: true
    })
  }

  /**
   * 确定模态框
   */
  const handleOk = async (selectRows: object[]) => {
    // 打开loading
    console.log(selectRows)
    if (!selectRows.length) { return }
    setModalState({
      ...modalState,
      confirmLoading: true,
    })
    try {
      await api.batchCourse({
        id: props.id,
        courseIds: (selectRows as Array<Required<ICourse>>).map(item => item._id)
      })
      message.success('关联成功')
      fetchData(true)
    } finally {
      setModalState({
        ...initModalState,
      })
    }
  }


  const onDelCourse = (courseId: string) => {
    confirm({
      title: '提示',
      content: '确定取消改课程的关联?',
      onOk: async () => {
        try {
          await api.delCourseByStudent({
            id: props.id,
            courseIds: [courseId]
          })
          message.success('取消关联成功')
          fetchData(true)
        } catch (error) {
          message.error('取消关联失败')
        }

      },
    });

  }

  /**
   * 取消模态框
   */
  const handleCancel = () => {
    console.log('Clicked cancel button');
    setModalState({
      ...modalState,
      visible: false
    })
  }


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
      filterMultiple: false,
      filters: Object.keys(enums.WEEK_LABEL).map(key => ({ text: enums.WEEK_LABEL[key], value: key })),
      render: (str: enums.WEEK) => (
        <span>{enums.WEEK_LABEL[str]}</span>
      )
    },
    {
      title: "一天",
      dataIndex: "time",
      filterMultiple: false,
      filters: Object.keys(enums.DAY_LABEL).map(key => ({ text: enums.DAY_LABEL[key], value: key })),
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
    {
      title: "状态",
      dataIndex: "status",
      filterMultiple: false,
      filters: Object.keys(enums.COURSE_STATUS_LABEL).map(key => ({ text: enums.COURSE_STATUS_LABEL[key], value: key })),
      render: (str: enums.COURSE_STATUS) => (
        <span>{enums.COURSE_STATUS_LABEL[str]}</span>
      )
    },
    {
      title: "操作",
      render: (val: string, row: any) => {
        return <Button type="primary" onClick={() => {
          onDelCourse(row._id)
        }} >取消关联</Button>;
      }
    }
  ];



  return (
    <React.Fragment>
      <div className="mb10">
        <RangePicker onChange={onDateChange} />

        <Search
          className="ml10"
          placeholder="请输入课程名字"
          onSearch={onSearch}
          style={{ width: 200 }} />

        <Button
          className="fr"
          type="primary"
          icon="plus"
          onClick={showModal}>
          添加课程
        </Button>
      </div>

      <IModal
        id={props.id}
        destroyOnClose={true}
        onSelect={handleOk}
        title="添加课程"
        width={800}
        visible={modalState.visible}
        confirmLoading={modalState.confirmLoading}
        onCancel={handleCancel} />

      <Table<ICourse>
        columns={columns}
        rowKey="_id"
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange} />
    </React.Fragment>
  );
}

export default List;
