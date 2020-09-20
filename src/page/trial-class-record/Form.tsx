import * as api from "@/api/trial-class-record";
import fetchTeacherHook from '@/common/hooks/teacher'
import {
  BackTop,
  Breadcrumb,
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Select
} from "antd";
import { FormComponentProps } from "antd/lib/form";
import * as React from "react";
import { Link, RouteComponentProps } from 'react-router-dom';

import fetchFormHook from '@/common/hooks/fetchForm'

import { TrialClassRecord } from '@/const/type/trial-class-record'

const { TextArea } = Input;
interface IRouteParams {
  id?: string;
}



type IFormProps = FormComponentProps & RouteComponentProps<IRouteParams>
const { Option } = Select;
const initForm = {} as TrialClassRecord


const FormCompent: React.FC<IFormProps> = (props) => {
  const {
    loading,
    form,
    setLoading
  } = fetchFormHook(initForm, api.gettrialClassRecord, props.match.params.id)


  const {
    teacherOptions,
  } = fetchTeacherHook({
    query: { status: 1 },
  })



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
      console.log(values)
      if (err) {
        return;
      }


      try {
        setLoading(true);
        await api.addtrialClassRecord(values);
        message.success("添加成功");

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



  return (
    <div>
      <div className="main-title">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/base/trial-class-record/list">试课记录列表</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>添加试课记录</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="content-wrap">
        <BackTop />
        <Form
          {...formItemLayout}
          onSubmit={handleSubmit}
          style={{ width: "550px", margin: "10px" }} >


          <Form.Item
            label="课程名称">
            {getFieldDecorator("courseName", {
              initialValue: form ? form.courseName : '',
              rules: [
                { required: true, message: "请填写课程名称", whitespace: true }
              ]
            })(<Input />)}
          </Form.Item>


          <Form.Item
            label="学生名称">
            {getFieldDecorator("studentName", {
              initialValue: form ? form.studentName : '',
              rules: [
                { required: true, message: "请填写试课学生名称", whitespace: true }
              ]
            })(<Input />)}
          </Form.Item>




          <Form.Item label="课时数量">
            {getFieldDecorator('num', {
              initialValue: form ? form.num : '',
              rules: [{ required: true, message: '请输入课时的数量', type: 'number' }],
            })(
              <InputNumber min={1} max={100000} />
            )}

          </Form.Item>


          <Form.Item label="所属老师">
            {getFieldDecorator("teacherId", {
              initialValue: form ? form.teacherId : '',
              rules: [{ required: true, message: "请选择所属老师" }]
            })(
              <Select>
                {
                  teacherOptions.map(item => (
                    <Option value={item.value} key={item.value}>{item.label}</Option>
                  ))
                }

              </Select>
            )}
          </Form.Item>








          <Form.Item label="试课备注">
            {getFieldDecorator("desc", {
              initialValue: form ? form.desc : '',
            })(
              <TextArea
                placeholder="请填写备注"
                autosize={{ minRows: 4, maxRows: 8 }}
              />
            )}
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button
              type="primary"
              htmlType="submit"
              block={true}
              loading={loading}>
              提交
              </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Form.create({ name: "FormComp" })(FormCompent)
