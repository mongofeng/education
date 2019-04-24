import {  Button, message, Table, Tag } from "antd";
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import * as api from "../../../api/hour";
import fetchApiHook from '../../../common/hooks/featchApiList'
import * as enums from "../../../const/enum";
import { IHour } from "../../../const/type/hour";
import formatDate from "../../../utils/format-date";
import CollectionCreateForm from './Modal-Form'

const { useState, useRef } = React;

const columns: Array<ColumnProps<IHour>> = [
  {
    title: "学员名字",
    dataIndex: "name",
  },
  {
    title: "金额",
    dataIndex: "amount",
  },
  {
    title: "课时数量",
    dataIndex: "num",
  },
  {
    title: "操作类型",
    dataIndex: "type",
    filterMultiple: false,
    filters: Object.keys(enums.COURSE_HOUR_ACTION_TYPE_LABEL).map(key => ({text: enums.COURSE_HOUR_ACTION_TYPE_LABEL[key], value: key})),
    render: (str: enums.COURSE_HOUR_ACTION_TYPE) => {
      const color = str === enums.COURSE_HOUR_ACTION_TYPE.add ? 'green' : 'red';
      return (
        <Tag color={color}>{enums.COURSE_HOUR_ACTION_TYPE_LABEL[str]}</Tag>
      )
    }
  },
  {
    title: "类型",
    dataIndex: "classTypes",
    filterMultiple: false,
    filters: Object.keys(enums.COURSE_HOUR_TYPE_LABEL).map(key => ({text: enums.COURSE_HOUR_TYPE_LABEL[key], value: key})),
    render: (str: enums.COURSE_HOUR_TYPE) => (
      <span>{enums.COURSE_HOUR_TYPE_LABEL[str]}</span>
    )
  },
  {
    title: "状态",
    dataIndex: "status",
    filterMultiple: false,
    filters: Object.keys(enums.COURSE_HOUR_STATUS_LABEL).map(key => ({text: enums.COURSE_HOUR_STATUS_LABEL[key], value: key})),
    render: (str: enums.COURSE_HOUR_STATUS) => (
      <span>{enums.COURSE_HOUR_STATUS_LABEL[str]}</span>
    )
  },
  {
    title: "创建时间",
    dataIndex: "createDate",
    sorter: true,
    render: (date: string) => <span>{formatDate(new Date(date))}</span>
  }
];

const initList: IHour[] = [];

interface IProps {
  id: string
  name: string
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
    fetchData,
    handleTableChange, 
  } = fetchApiHook(initList, api.getHourrList, {
    page: 1,
    limit: 10,
    query: {
      studentId: props.id
    },
    sort: {
      createDate: -1
    }
  })

  const formRef = useRef(null);

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


  const handleCancel = () => {
    const form = (formRef.current as any).props.form;
    form.resetFields();
    setModalState({
      ...initModalState,
  })
  }

  const handleCreate = () => {
    if (formRef.current === null) {
      return
    }
    const form = (formRef.current as any).props.form;
    form.validateFields(async (err: any, values: any) => {
      if (err) {
        return;
      }

      console.log('Received values of form: ', values);

      setModalState({
          ...modalState,
          confirmLoading: true,
      })
      try {
        const {num, amount, type, classTypes, desc} = values
        const {id, name} = props
        const condition = {
          num, 
          amount, 
          type, 
          classTypes, 
          desc: desc || '',
          name,
          studentId: id,
        }
        await api.addHour(condition)
        message.success('提交成功')
        fetchData(true)
        props.update()
      } finally {
        setModalState({
            ...initModalState,
        })
        handleCancel();
      }
    });
  }



  return (
    <div>
      <div className="mb10 clearfix">
        <Button
          className="fr"
          type="primary"
          icon="plus"
          onClick={showModal}>
          添加学时
        </Button>
      </div>

      <CollectionCreateForm
          wrappedComponentRef={formRef} 
          visible={modalState.visible}
          confirmLoading={modalState.confirmLoading}
          onCancel={handleCancel}
          onCreate={handleCreate}/>
      
      <Table<IHour>
          bordered={true}
          columns={columns}
          rowKey="_id"
          dataSource={data}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}/>
    </div>
  );
}

export default List;
