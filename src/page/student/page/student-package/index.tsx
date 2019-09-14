import { Button, Col, DatePicker, Input, message, Modal, Row, Switch, Table, Tag, Tooltip } from 'antd'
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import { useEffect, useState } from 'react'
import * as api from "../../../../api/student-operation";
import * as apiPack from '../../../../api/student-package'
import fetchApiHook from '../../../../common/hooks/featchApiList'
import { IStudentPackage } from "../../../../const/type/student-package";
import formatDate from "../../../../utils/format-date";
import {isDev} from '../../../../config/index'
import BuyCourse from './buy-course-modal'
import ShareStudentPackage from './share-student-package-modal'
import  DrawForm from './form'
import { connect } from 'react-redux'
const confirm = Modal.confirm;

const moment = require('moment')

const Search = Input.Search;
const { RangePicker } = DatePicker;




interface IProps {
  id: string
  package: {
    [key in string]: string
  },
  update: () => Promise<void>
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

  const [activeState, setActiveState] = useState(initModalState)



  // 激活模态框
  const [activiteTime, setActiviteTime] = useState(moment())
  const [isPuseMsg, setIsPuseMsg] = useState(true)
  const [row, setRow] = useState(null)

  // 更改课程包
  const [id, setId] = useState('')
  const [visible, setVisible] = useState(false)


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
      props.update()
    } finally {
      setModalState({
        ...initModalState,
      })
    }
  }


  const columns: Array<ColumnProps<IStudentPackage>> = [
    {
      title: "课程包",
      dataIndex: "packageId",
      render: (val: string) => {
        return props.package[val]
      }
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
          return <Tag color='blue'>是</Tag>
        }
        return <Tag color='blue'>否</Tag>
      }
    },
    {
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
              setActiveState({
                ...activeState,
                visible: true
              })
            }}>
            激活
          </Button>
        )
      }
    },
    {
      title: "操作",
      render: (val: string, row: IStudentPackage) => {
        return [(<Button
          key="1"
          type="link"
          icon="delete"
          size="small"
          onClick={() => {
            onDel(row._id)
          }} >
        </Button>),
          (<Button
            key="2"
            className="ml5"
            type="link"
            icon="edit"
            size="small"
            onClick={() => {
              setId(row._id)
              setVisible(true)
            }} >
          </Button>)]
      }
    }
  ];





  const handleActivite = async () => {
    if (!row || !row.period) {
      message.error('没有年限不能激活')
      return
    }

    const date = activiteTime.toDate()
    const act = activiteTime.toISOString()
    console.log(date)
    const {packageId, _id: id} = row
    date.setFullYear(date.getFullYear() + row.period)
    const end = date.toISOString()

    const params = {
      activeTime: act,
      packageId,
      studentId: props.id,
      wechat: isPuseMsg,
      id,
      endTime: end
    }

    try {
      setActiveState({
        ...activeState,
        confirmLoading: true,
      })
      await api.activatePackage(params)
      fetchData()
      props.update()
      message.success('激活成功')
    } finally {
      setActiveState({
        ...initModalState,
      })
    }
  }


  const onChange = (val:any) => {
    setActiviteTime(val);
  }

  const onPushMsg = (val: boolean) => {
    setIsPuseMsg(val)
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
    setFormState({
      ...initModalState,
    })
  }

  const handleFormCreate = async (values) => {
    const {
      packId,
      desc
    } = values

    const params = {
      desc,
      packId: packId[packId.length - 1],
      studentId: props.id
    }

    setFormState({
      ...modalState,
      confirmLoading: true,
    })
    try {
      await api.iSharePackage(params)
      message.success('关联成功')
      fetchData()
    } finally {
      handleFormCancel();
    }

  }

  useEffect(() => {
    console.log('package')
    console.log(props.package)
  }, [])


  // 删除课程包
  const onDel= (id: string) => {
    confirm({
      title: '警告',
      content: '确定删除该课程包,请确保没有课时操作记录,如果有请先去对应课时流水,以免引起数据的错乱?',
      onOk: async () => {
        try {
          await apiPack.delStudentPackage(id)
          message.success('删除成功')
          fetchData(true)
        } catch (error) {
          message.error('删除失败')
        }
      },
    });
  }


  const onFormCancel = () => {
    setVisible(false)
    setId('')
  }


  const Cols = isDev ? columns : columns.slice(0, columns.length - 1)




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
          id={props.id}
          onCreate={handleFormCreate}
          onCancel={handleFormCancel}
          { ...formState}/>


      <DrawForm
        id={id}
        title="编辑课程包"
        visible={visible}
        onCancel= {onFormCancel} />

      <Modal
        title="选择激活时间"
        {...activeState}
        onOk={handleActivite}
        onCancel={() => setActiveState({
          ...activeState,
          visible: false
        })}
        okText="确认"
        cancelText="取消">
        <Row gutter={16}>
          <Col  span={6}>
            激活时间
          </Col>
          <Col  span={18}>
            <DatePicker defaultValue={activiteTime} onChange={onChange} />
          </Col>
          <Col  span={6} className="mt10">
            是否推送微信
          </Col>
          <Col  span={18} className="mt10">
            <Switch defaultChecked={isPuseMsg} onChange={onPushMsg} />
          </Col>
        </Row>


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
        columns={Cols}
        rowKey="_id"
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange} />

    </React.Fragment>
  );
}

export default connect((state: any) => {
  // console.log(state)
  return {
    package: state.package.labels,
  }
})(List);
