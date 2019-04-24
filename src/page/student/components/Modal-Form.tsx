import {
   Form, Input, InputNumber, Modal, Radio
} from 'antd';
import { FormComponentProps } from "antd/lib/form";
import * as React from "react";
import * as enums from "../../../const/enum";
type IFormProps = FormComponentProps & {
  visible: boolean;
  confirmLoading: boolean;
  onCancel: () => void;
  onCreate: () => void;
} 

class ModalForm extends React.Component<IFormProps> {
  render() {
    const {
      visible, onCancel, onCreate, form, confirmLoading
    } = this.props;
    const { getFieldDecorator } = form;


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

    return (
      <Modal
        visible={visible}
        width={800}
        title="课时操作"
        okText="提交"
        confirmLoading={confirmLoading}
        onCancel={onCancel}
        onOk={onCreate}>
        <Form  {...formItemLayout}>

          <Form.Item label="课时数量">
            {getFieldDecorator('num' , {
              rules: [{ required: true, message: '请输入课时的数量', type: 'number' }],
            })(
              <InputNumber min={1} max={100000}  />
            )}
            
          </Form.Item>

          <Form.Item label="金额">
            {getFieldDecorator('amount', {
              rules: [{ required: true, message: '请输入课时的金额', type: 'number' }],
            })(
              <InputNumber min={1} max={100000}  />
            )}
            
          </Form.Item>


          <Form.Item label="操作类型">
            {getFieldDecorator('type', {
              initialValue: 1,
              rules: [{ required: true, message: '请选择操作类型', type: 'number' }],
            })(
              <Radio.Group>
                { Object.keys(enums.COURSE_HOUR_ACTION_TYPE_LABEL).map(key => (
                  <Radio value={Number(key)} key={key}>{enums.COURSE_HOUR_ACTION_TYPE_LABEL[key]}</Radio>
                ))}
              </Radio.Group>
            )}
          </Form.Item>


          <Form.Item label="类型">
            {getFieldDecorator('classTypes', {
              initialValue: 1,
              rules: [{ required: true, message: '请输入课时的类型', type: 'number' }],
            })(
              <Radio.Group>
                { Object.keys(enums.COURSE_HOUR_TYPE_LABEL).map(key => (
                  <Radio value={Number(key)} key={key}>{enums.COURSE_HOUR_TYPE_LABEL[key]}</Radio>
                ))}
              </Radio.Group>
            )}
          </Form.Item>

          <Form.Item label="备注">
            {getFieldDecorator('desc')(<Input type="textarea"  style={{width: 300}} />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}



export default Form.create({ name: "form_in_modal" })(ModalForm)