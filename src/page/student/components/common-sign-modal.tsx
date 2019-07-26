import { Form, Input, InputNumber, Modal } from 'antd'
import { FormComponentProps } from "antd/lib/form";
import * as React from "react";


type IProps = FormComponentProps & {
  title: string
  visible: boolean;
  confirmLoading: boolean;
  onCancel: () => void;
  onCreate: (val: any) => void;
}


const FormList: React.FC<IProps> =  (props) => {
  const {
    onCreate,
    form,
    visible,
    title,
    confirmLoading,
    onCancel
  } = props



  const { getFieldDecorator } = form;



  /**
   * 提交表单
   * @param e
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (confirmLoading) {
      return;
    }

    props.form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }

      onCreate(values)

    });
  };


  const handleFormCancel = () => {
    props.form.resetFields();
    onCancel()
  }


  const modalProps = {
    width: 400,
    okText: '提交',
    visible,
    title,
    confirmLoading,
  }

  return (
    <Modal
      {...modalProps}
      onCancel={handleFormCancel}
      onOk={handleSubmit}>

      <Form layout="vertical">
        <Form.Item label="课时数量">
          {getFieldDecorator('num' , {
            rules: [{ required: true, message: '请输入课时的数量', type: 'number' }],
          })(
            <InputNumber min={1} max={100000}  />
          )}

        </Form.Item>


        <Form.Item label="备注">
          {getFieldDecorator('desc')(<Input type="textarea"  style={{width: 300}} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
}


export default Form.create<IProps>({ name: "SiginIn-form" })(FormList);
