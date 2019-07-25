import { Button, DatePicker, Input, Table, Tag, message } from 'antd'
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import * as api from "../../../../api/student-package";
import { IStudentPackage } from "../../../../const/type/student-package";
import formatDate from "../../../../utils/format-date";
import fetchApiHook from '../../../../common/hooks/featchApiList'
import { useState } from 'react'
import BuyCourse from './buy-course-modal'

const Search = Input.Search;
const { RangePicker } = DatePicker;


const columns: Array<ColumnProps<IStudentPackage>> = [
  {
    title: "课程包id",
    dataIndex: "packageId",
  },
  {
    title: "课时",
    dataIndex: "count",
  },
  {
    title: "剩余课时",
    dataIndex: "count",
  },
  {
    title: "使用课时",
    dataIndex: "used",
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
    title: "激活时间",
    dataIndex: "activeTime",
    render: (date: string) => {
      return (<span>{formatDate(new Date(date))}</span>)
    }
  },
  {
    title: "结束时间",
    dataIndex: "endTime",
    render: (date: string) => {
      return (<span>{formatDate(new Date(date))}</span>)
    }
  },
  {
    title: "是否过时",
    dataIndex: "beOverdue",
  },
  {
    title: "是否推送过期的通知",
    dataIndex: "isPush",
    render: (val: boolean) => {
      if (val) { // 如果已经推送了可以再开启
        return '1'
      }
      return  <Tag color='blue'>否</Tag>
    }
  },
  {
    title: "是否激活",
    dataIndex: "isActive",
    render: (val: boolean) => {
      if (val) {
        return <Tag color='blue'>已激活</Tag>
      }

      // 激活按钮
      return (
        <Button
          type="primary"
          icon="plus">
          激活
        </Button>
      )
    }
  },
];

interface IProps {
  id: string
}


// 模态框的加载
const initModalState = {
  visible: false,
  confirmLoading: false,
}


function List(props: IProps): JSX.Element {

  const {
    loading,
    data,
    pagination,
    handleTableChange,
    onDateChange,
    onSearch,
    fetchData
  } = fetchApiHook([], api.getStudentPackageList, {
    query: {
      studentIds: props.id
    },
    sort: { activeTime: 1 }
  })


  // 模态框
  const [modalState, setModalState] = useState(initModalState)


  /**
   * 添加课程包
   */
  const showModal = () => {
    setModalState({
      ...modalState,
      visible: true
    })
  }

  /**
   * 取消模态框
   */
  const handleCancel = () => {
    setModalState({
      ...modalState,
      visible: false
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

      message.success('关联成功')
      fetchData(true)
    } finally {
      setModalState({
        ...initModalState,
      })
    }
  }



  return (
    <React.Fragment>
      <div className="main-title clearfix">
        <h2>课程包列表</h2>
        <Button
          className="fr"
          type="primary"
          icon="plus"
          onClick={showModal}>
          添加课程包
        </Button>
      </div>

      <BuyCourse
        id={props.id}
        destroyOnClose={true}
        onSelect={handleOk}
        title="添加课程包"
        width={800}
        onCancel={handleCancel}
        {...modalState} />

      <div className="content-wrap">
        <div className="mb10">
          <RangePicker onChange={onDateChange} />

          <Search
            className="ml10"
            placeholder="请输入课程包名字"
            onSearch={onSearch}
            style={{ width: 200 }}/>
        </div>

        <Table<IStudentPackage>
          bordered={true}
          columns={columns}
          rowKey="_id"
          dataSource={data}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}/>
      </div>
    </React.Fragment>
  );
}

export default List;
