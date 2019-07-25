import { Button, DatePicker, Input, message, Table, Tag } from 'antd'
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import { useState } from 'react'
import * as api from "../../../../api/student-operation";
import * as apiPack from '../../../../api/student-package'
import fetchApiHook from '../../../../common/hooks/featchApiList'
import { IStudentPackage } from "../../../../const/type/student-package";
import formatDate from "../../../../utils/format-date";
import BuyCourse from './buy-course-modal'

const Search = Input.Search;
const { RangePicker } = DatePicker;


const columns: Array<ColumnProps<IStudentPackage>> = [
  {
    title: "课程包",
    dataIndex: "packageId",
  },
  {
    title: "总课时",
    dataIndex: "count",
  },
  {
    title: "剩余课时",
    dataIndex: "surplus",
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
      if (!date) { return '-' }
      return formatDate(new Date(date))
    }
  },
  {
    title: "结束时间",
    dataIndex: "endTime",
    render: (date: string) => {
      if (!date) { return '-' }
      return formatDate(new Date(date))
    }
  },
  {
    title: "过时",
    dataIndex: "beOverdue",
    render: (val: boolean) => {
      return val ? '是' : '否'
    }
  },
  {
    title: "过期推送",
    dataIndex: "isPush",
    render: (val: boolean) => {
      if (val) { // 如果已经推送了可以再开启
        return '1'
      }
      return  <Tag color='blue'>否</Tag>
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
  } = fetchApiHook([], apiPack.getStudentPackageList, {
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
  const handleOk = async (selectRows: IStudentPackage[]) => {
    // 打开loading
    console.log(selectRows)
    if (!selectRows.length) { return }
    setModalState({
      ...modalState,
      confirmLoading: true,
    })
    try {
      const [res] = selectRows
      const params = {
        packageId: res._id,
        studentId: props.id 
      }
      await api.buyStudentPackage(params)
      message.success('关联成功')
      fetchData(true)
    } finally {
      setModalState({
        ...initModalState,
      })
    }
  }


  const Activite =  {
    title: "激活",
    dataIndex: "isActive",
    render: (val: boolean, row: IStudentPackage) => {
      if (val) {
        return <Tag color='blue'>已激活</Tag>
      }


      const handleActivite = async () => {
        if (!row.period) {
          message.error('没有年限不能激活')
          return
        }
        const today = new Date()
        today.setDate(today.getFullYear() + row.period)
        const params = {
          activeTime: new Date().toISOString(),
          isActive: true,
          endTime: today.toISOString()
        }
        try {
          await apiPack.updateStudentPackage(row._id, params)
          message.success('激活成功')
        } finally {
          fetchData()
        }
      }

      // 激活按钮
      return (
        <Button
          type="primary"
          size="small"
          onClick={handleActivite}>
          激活
        </Button>
      )
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
          columns={columns.concat([Activite])}
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
