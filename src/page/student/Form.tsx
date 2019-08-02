import {
  BackTop,
  Breadcrumb,
  Button,
  DatePicker,
  Form,
  Icon,
  Input,
  message,
  Select,
  Tooltip,
} from 'antd'
import { FormComponentProps } from "antd/lib/form";
import * as React from "react";
import { Link, RouteComponentProps } from 'react-router-dom';
import * as api from "../../api/student";
import * as apiTeacher from '../../api/teacher'
import {IStudent} from '../../const/type/student'
import * as validator from '../../utils/validator'
import Location from '.././../components/Location'
import fetchFormHook from '../../common/hooks/fetchForm'
import { useEffect, useState } from 'react'
const moment = require('moment')
const { TextArea } = Input;
const { Option } = Select;


interface IRouteParams {
  id?: string;
}

type IFormProps = FormComponentProps & RouteComponentProps<IRouteParams>

const initForm = {} as IStudent

const FormCompent: React.FC<IFormProps> = (props)=> {
  const {
    isEdit,
    loading,
    form,
    setLoading
  } = fetchFormHook(initForm, api.getStudent, props.match.params.id)

  const [options, setOptions] = useState([])


  useEffect(() => {
    fetchTeacher()
  }, [])


  const fetchTeacher = async () => {
    const condition = {
      page: 1,
      offset: 1000
    }
    const {
      data: {
        data: { list }
      }
    } = await apiTeacher.getteacherList(condition)
    setOptions(list.map(item => {
      return {
        label: item.name,
        value: item._id
      }
    }))
  }


  /**
   * 提交表单
   * @param e
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    props.form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }

      const { residence, birthday, ...reset } = values;
      const [province, city, region] = residence;
      const params = {
        ...reset,
        province,
        city,
        region,
        birthday: birthday.format('YYYY-MM-DD')
      };

      try {
        setLoading(true);
        if (isEdit && props.match.params.id) {
          await api.updateStudent(props.match.params.id, params);
          message.success("编辑成功");
        } else {
          await api.addStudent(params);
          message.success("添加成功");
        }

        props.history.goBack();
      } finally {
        setLoading(false);
      }
    });
  };

  const { getFieldDecorator } = props.form;

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 }
    }
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0
      },
      sm: {
        span: 20,
        offset: 4
      }
    }
  };

  const areaVal = form ? [form.province, form.city, form.region]: []
  const regex = /(\d{4})[-./](\d{1,2})[-./](\d{1,2})/;
  const result = (form && form.birthday) ? form.birthday.replace(regex, () => {
    return `${RegExp.$1}-${RegExp.$2.padStart(2, '0')}-${RegExp.$3.padStart(2, '0')}`
  }) : '' ;
  const startTime = result ? moment(result, 'YYYY-MM-DD') : null

  return (
    <div>
      <div className="main-title">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/base/student/list">学员列表</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{`${props.match.params.id ? '编辑': '添加'}学员`}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="content-wrap">
        <BackTop />
        <Form
          {...formItemLayout}
          onSubmit={handleSubmit}
          style={{ width: "550px", margin: "10px" }}
        >
          <Form.Item
            label={
              <span>
                  姓名&nbsp;
                <Tooltip title="学生的姓名咯">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
            }
          >
            {getFieldDecorator("name", {
              initialValue: form ? form.name : '',
              rules: [
                { required: true, message: "请填写好姓名", whitespace: true }
              ]
            })(<Input />)}
          </Form.Item>

          <Form.Item label="生日">
            {getFieldDecorator("birthday", {
              initialValue: startTime,
              rules: [
                { required: true, message: "请填写生日" }
              ]
            })(<DatePicker  />)}
          </Form.Item>

          <Form.Item label="性别">
            {getFieldDecorator("sex", {
              initialValue: form ? form.sex : '',
              rules: [{ type: "number", required: true, message: "请选择性别" }]
            })(
              <Select>
                <Option value={1}>男</Option>
                <Option value={2}>女</Option>
              </Select>
            )}
          </Form.Item>


          <Form.Item label="紧急联系人">
            {getFieldDecorator("contacts", {
              initialValue: form ? form.contacts : '',
              rules: [
                {
                  required: true,
                  message: "请填写学生的紧急联系人"
                }
              ]
            })(<Input />)}
          </Form.Item>

          <Form.Item label="手机号码">
            {getFieldDecorator("phone", {
              initialValue: form ? form.phone : '',
              rules: [
                { required: true, message: "请填写手机" },
                { validator: validator.phone}
              ]
            })(<Input style={{ width: "100%" }} />)}
          </Form.Item>

          <Form.Item label="省市区">
            {getFieldDecorator("residence", {
              initialValue: areaVal,
              rules: [{ type: "array", required: true, message: "请选择城市" }]
            })(<Location  />)}
          </Form.Item>


          <Form.Item label="地址">
            {getFieldDecorator("address", {
              initialValue: form ? form.address : '',
              rules: [
                { required: true, message: "请填写地址", whitespace: true }
              ]
            })(
              <TextArea
                placeholder="请填写地址"
                autosize={{ minRows: 2, maxRows: 6 }}
              />
            )}
          </Form.Item>

          <Form.Item label="所属老师">
            {getFieldDecorator("teacherId", {
              initialValue: form ? form.teacherId : '',
              rules: [{ required: true, message: "请选择所属老师" }]
            })(
              <Select>
                {
                  options.map(item => (
                    <Option value={item.value} key={item.value}>{item.label}</Option>
                  ))
                }

              </Select>
            )}
          </Form.Item>

          <Form.Item label="状态">
            {getFieldDecorator("status", {
              initialValue: form ? form.status : '',
              rules: [{ type: "number", required: true, message: "请选择状态" }]
            })(
              <Select>
                <Option value={1}>在读</Option>
                <Option value={2}>毕业</Option>
              </Select>
            )}
          </Form.Item>

          <Form.Item label="备注">
            {getFieldDecorator("desc", {
              initialValue: form ? form.desc : '',
            })(
              <TextArea
                placeholder="请填写备注"
                autosize={{ minRows: 2, maxRows: 6 }}
              />
            )}
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button
              type="primary"
              htmlType="submit"
              block={true}
              loading={loading}
            >
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Form.create({ name: "StudentForm" })(FormCompent);

