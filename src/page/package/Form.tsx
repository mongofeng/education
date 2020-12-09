import { PackageStatusLabel } from "@/const/enum";
import {
  BackTop,
  Breadcrumb,
  Button,
  Form,
  Icon,
  Input,
  message,
  InputNumber,
  Tooltip,
  Select,
} from "antd";
import { FormComponentProps } from "antd/lib/form";
import * as React from "react";
import { Link, RouteComponentProps } from 'react-router-dom';
import * as api from "../../api/package";

import fetchFormHook from '../../common/hooks/fetchForm'

import {IPackage} from '../../const/type/package'

const { TextArea } = Input;

const { Option } = Select;
interface IRouteParams {
  id?: string;
}



type IFormProps = FormComponentProps & RouteComponentProps<IRouteParams>

const initForm = {} as IPackage


const FormCompent: React.FC<IFormProps> = (props)=> {
    const {
        isEdit,
        loading,
        form,
        setLoading
    } = fetchFormHook(initForm, api.getPackage, props.match.params.id)



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
          if (isEdit && props.match.params.id) {
            await api.updatePackage(props.match.params.id, values);
            message.success("编辑成功");
          } else {
            await api.addPackage(values);
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



    return (
      <div>
        <div className="main-title">
          <Breadcrumb>
            <Breadcrumb.Item>
            <Link to="/base/package/list">课程包列表</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{`${isEdit ? '编辑': '添加'}课程包`}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="content-wrap">
          <BackTop />
          <Form
            {...formItemLayout}
            onSubmit={handleSubmit}
            style={{ width: "550px", margin: "10px" }} >


            <Form.Item
              label="名称">
              {getFieldDecorator("name", {
                initialValue: form ? form.name : '',
                rules: [
                  { required: true, message: "请填写课程包名称", whitespace: true }
                ]
              })(<Input />)}
            </Form.Item>

            <Form.Item label="课时数量">
             {getFieldDecorator('count' , {
               initialValue: form ? form.count : '',
               rules: [{ required: true, message: '请输入课时的数量', type: 'number' }],
             })(
               <InputNumber min={1} max={100000}  />
             )}
             
           </Form.Item>


           <Form.Item label="价格">
             {getFieldDecorator('amount' , {
               initialValue: form ? form.amount : '',
               rules: [{ required: true, message: '请输入课程包的价格', type: 'number' }],
             })(
               <InputNumber min={0} max={100000}  />
             )}
             
           </Form.Item>


           <Form.Item label="有效期">
             {getFieldDecorator('period' , {
               initialValue: form ? form.period : '',
               rules: [{ required: true, message: '请输入课程包的有效期', type: 'number' }],
             })(
               <InputNumber min={1} max={100000}  />
             )}
             
           </Form.Item>

           <Form.Item label="状态">
              {getFieldDecorator("status", {
                initialValue: form ? form.status : '',
                rules: [{ type: "number", required: true, message: "请选择状态" }]
              })(
                <Select>
                  {Object.keys(PackageStatusLabel).map(
                    (key) => {
                    return <Option value={Number(key)}>{PackageStatusLabel[key]}</Option>
                    }
                  )}
     
                </Select>
              )}
            </Form.Item>

    

            <Form.Item label="课程包备注">
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
