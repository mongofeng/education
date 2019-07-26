import { Button, DatePicker, Input, message, Modal, Table, Tag, Tooltip } from 'antd'
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import { useRef, useState } from 'react'
import * as api from "../../../../api/student-operation";
import * as apiPack from '../../../../api/student-package'
import fetchApiHook from '../../../../common/hooks/featchApiList'
import { IStudentPackage } from "../../../../const/type/student-package";
import formatDate from "../../../../utils/format-date";

import BuyCourse from './buy-course-modal'
import ShareStudentPackage from './share-student-package-modal'

const moment = require('moment')

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
      return <Tag color='blue'>否</Tag>
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
  const [formState, setFormState] = useState(initModalState)


  const formRef = useRef(null);

  // 激活模态框
  const [visible, setVisible] = useState(false)
  const [activiteTime, setActiviteTime] = useState(moment())
  const [row, setRow] = useState(null)


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

  /**
   * 激活模态框确认
   */
  const Activite = {
    title: "激活",
    dataIndex: "isActive",
    render: (val: boolean, row: IStudentPackage) => {
      if (val) {
        return <Tag color='blue'>已激活</Tag>
      }

      // 激活按钮
      return (
        <Button
          type="primary"
          size="small"
          onClick={() => {
            setRow(row)
            setVisible(true)
          }}>
          激活
        </Button>
      )
    }
  }


  const handleActivite = async () => {
    if (!row || !row.period) {
      message.error('没有年限不能激活')
      return
    }

    const date = activiteTime.toDate()
    const act = activiteTime.toISOString()
    console.log(date)
    date.setFullYear(date.getFullYear() + row.period)
    const end = date.toISOString()

    const params = {
      activeTime: act,
      isActive: true,
      endTime: end
    }

    try {
      await apiPack.updateStudentPackage(row._id, params)
      fetchData()
      message.success('激活成功')
    } finally {
      setVisible(false)
    }
  }


  const onChange = (val:any) => {
    setActiviteTime(val);
  }

  /**
   * 共享课程包
   */

  const showShareModal = () => {
    setFormState({
      ...formState,
      visible: true
    })
  }

  const handleFormCancel = () => {
    const form = (formRef.current as any).props.form;
    form.resetFields();
    setFormState({
      ...initModalState,
    })
  }

  const handleFormCreate = () => {
    if (formRef.current === null) {
      return
    }
    const form = (formRef.current as any).props.form;
    form.validateFields(async (err: any, values: any) => {
      if (err) {
        return;
      }

      console.log('Received values of form: ', values);


      setFormState({
        ...modalState,
        confirmLoading: true,
      })
      try {


        message.success('success')
      } finally {
        handleCancel();
      }
    });
  }




  return (
    <React.Fragment>
      <BuyCourse
        title="添加课程包"
        width={800}
        id={props.id}
        destroyOnClose={true}
        onSelect={handleOk}
        onCancel={handleCancel}
        {...modalState} />

       <ShareStudentPackage
          wrappedComponentRef={formRef}
          id={props.id}
          onCreate={handleFormCreate}
          onCancel={handleFormCancel}
          { ...formState}/>


      <Modal
        title="选择激活时间"
        visible={visible}
        onOk={handleActivite}
        onCancel={() => setVisible(false)}
        okText="确认"
        cancelText="取消">
        <DatePicker defaultValue={activiteTime} onChange={onChange} />
      </Modal>

      <div className="mb10 clearfix">
        <RangePicker onChange={onDateChange} />

        <Search
          className="ml10"
          placeholder="请输入课程包名字"
          onSearch={onSearch}
          style={{ width: 200 }} />
            <Tooltip placement="top" title="购买课程包,然后主动激活之后可用于课程的使用，没激活的课程包不能用在课时签到和补签等操作">
              <Button
                className="fr"
                type="primary"
                icon="plus"
                onClick={showModal}>
                购买
              </Button>
            </Tooltip>
            <Tooltip placement="top" title="学员不购买课程包，与其他学员一起共享课程包里面的课时，签到，补签等扣课程包里的课时">
              <Button
                className="fr mr5"
                icon="reddit"
                onClick={showShareModal}>
                共享
              </Button>
            </Tooltip>
      </div>

      <Table<IStudentPackage>
        bordered={true}
        columns={columns.concat([Activite])}
        rowKey="_id"
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange} />

    </React.Fragment>
  );
}

export default List;
