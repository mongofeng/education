import { Button, DatePicker, Form, Input, message, Modal, Switch, Table } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { ColumnProps, TableRowSelection } from "antd/lib/table";
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import * as api from "../../api/student";
import * as apiTem from '../../api/template';
import * as enums from "../../const/enum";
import { IStudent } from "../../const/type/student";
import {ITemplate} from '../../const/type/template'
import formatDate from "../../utils/format-date";

import fetchApiHook from "../../common/hooks/featchApiList";

const Search = Input.Search;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;
const { useState, useEffect } = React

enum eStep {
  first,
  second
}


// 模板的表格配置
const templateColumns: Array<ColumnProps<ITemplate>> = [
  {
    title: "标题",
    dataIndex: "title"
  },
];

const initList: IStudent[] = [];

function List(props: RouteComponentProps & FormComponentProps): JSX.Element {
  const columns: Array<ColumnProps<IStudent>> = [
    {
      title: "姓名",
      dataIndex: "name"
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
      filters: [{ text: "在读", value: "1" }, { text: "毕业", value: "2" }],
      render: (str: enums.STUDENT_STATUS) => (
        <span>{enums.STUDENT_STATUS_LABEL[str]}</span>
      )
    },
    {
      title: "是否推送消息",
      dataIndex: "isSendTemplate",
      render: (val: boolean, row: any) => {
        return (
          <Switch
            checked={val}
            onChange={(checked: boolean) => {
              onChange(checked, row._id);
            }}
          />
        );
      }
    },
    {
      title: '推送',
      dataIndex: 'send',
      render: (val: any, row: any) => {
        return (
          <Button
            type="default"
            size="small"
            disabled={!row.openId}
            onClick={() => {handleOnClick(row.openId)}}>
            推送
        </Button>
        )
      }
    }
  ];

  const {
    loading,
    data,
    pagination,
    handleTableChange,
    onDateChange,
    onSearch,
    fetchData
  } = fetchApiHook(initList, api.getStudentList);


  const [visible, setVisible] = useState(false)
  const [template, setTemplate] = useState([])
  const [step, setStep] = useState(eStep.first)
  const [selectRow, setRow] = useState([])
  const [formItem, setFormItem] = useState([])
  const [openId, setOpenId] = useState('')
  const [modalLoading, setModalLoading] = useState(false)


  useEffect(() => {
    fetchTemplateList()
  }, [])


  /**
   * 跳转路由
   */
  const handleOnClick = (id: string) => {
    setOpenId(id)
    setVisible(true)
  };


  const fetchTemplateList = async () => {
    const {data: {template_list}} = await apiTem.getTemplateList()
    setTemplate(template_list)
  }


  const rowSelection: TableRowSelection<ITemplate> = {
    type: 'radio',
    onSelect: (record, selected, selectedRows) => {
      // // 当前项，当前是否选择， 当前所有选择
      // console.log(selected, selectedRows);
      setRow(selectedRows)
    },
  };

  
   // 开启开关
   const onChange = (checked: boolean, id: string) => {
    confirm({
      title: "确定操作?",
      content: `消息将${checked ? '会' : '不会'}推送到学员微信上`,
      onOk: async() => {
        await api.updateStudent(id, {
          isSendTemplate: checked
        })
        
        fetchData(true)
      }
    });
  }


  const onCancel = () => {
    setVisible(false)
    setStep(eStep.first)
  };


  const onNext = () => {
    setStep(eStep.second)
    const [row] = selectRow
    const content = row.content.replace(/\s+/g, ',').replace(/{{/g, '').replace(/\.DATA}}/g, '');
    const arr = content.split(',')
    const result = []
    for (const item of arr) {
      // g没有index这些
      /([\u4e00-\u9fa5]+)[^\w]?(\w+)/.test(item)
      const label = RegExp.$1
      const value = RegExp.$2
      if (!label || !value) { continue }
      result.push({
        label,
        value
      })
    }
    console.log(result)
    setFormItem(result)
  }
  
  const onPrev = () => {
    setStep(eStep.first)
  }

  const onCreate = () => {
    props.form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }
      const [row] = selectRow

      const res = Object.keys(values).reduce((prev, key) => {
        return {
          ...prev,
          [key]: {
            value: values[key],
            color: '#173177',
          }
        }
      }, {})
      

      const params = {
        touser: openId,
        template_id: row.template_id,
        // url: 'http://47.107.144.222/platform',
        data: res
      }

      console.log(params)
      try {
        setModalLoading(true)
        await apiTem.sendTemplate(params)
        message.success("发送成功");
      } finally {
        setModalLoading(false)
        onCancel()
      }
     
    });
    
  };



  const { getFieldDecorator } = props.form;


  return (
    <div>
      <div className="main-title clearfix">
        <h2>学生列表</h2>
      </div>

      <div className="content-wrap">
        <div className="mb10">
          <RangePicker onChange={onDateChange} />

          <Search
            className="ml10"
            placeholder="请输入名字"
            onSearch={onSearch}
            style={{ width: 200 }}
          />
        </div>

        <Table<IStudent>
          bordered={true}
          columns={columns}
          rowKey="_id"
          dataSource={data}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}/>
      </div>

      <Modal
          visible={visible}
          title="发送模板消息"
          okText="确定"
          style={{overflow: 'hidden'}}
          onCancel={onCancel}
          footer={step === eStep.first ? [
            <Button key="back" onClick={onCancel}>
              取消
            </Button>,
            <Button key="next" type="primary"  onClick={onNext} disabled={selectRow.length === 0}>
              下一步
            </Button>,
          ]: [
            <Button key="back" onClick={onCancel}>
              取消
            </Button>,
            <Button key="next" type="primary"  onClick={onPrev}>
              上一步
            </Button>,
            <Button key="sumbit" type="primary"  onClick={onCreate} loading={modalLoading}>
              确认
            </Button>,
          ]}>

          {/* 1.表格 */}
          <CSSTransition
            in={step === eStep.first}
            classNames="slideRight"
            exit={false}
            unmountOnExit={true}
            timeout={300}>
              
            <Table<ITemplate>
              bordered={true}
              rowSelection={rowSelection}
              columns={templateColumns}
              rowKey="template_id"
              dataSource={template}/>
          </CSSTransition>
           
           {/* 2.表单 */}
          <CSSTransition
            in={step === eStep.second}
            classNames="slideLeft"
            exit={false}
            unmountOnExit={true}
            timeout={300}>
            <Form layout="vertical">
              {formItem.length > 0 && formItem.map((item) => {
                return (
                  <Form.Item label={item.label} key={item.value}>
                  {getFieldDecorator(item.value as never, {
                    rules: [{ required: true, message: 'Please input the title of collection!' }],
                  })(<Input />)}
                </Form.Item>
                )
              })}
            </Form>
          </CSSTransition>
        </Modal>
    </div>
  );
}

export default  Form.create({ name: 'TemplateList' })(List);
