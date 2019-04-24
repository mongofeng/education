import {
    Form, Input, InputNumber, Modal
 } from 'antd';
 import { FormComponentProps } from "antd/lib/form";
 import * as React from "react";

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
 
 
           <Form.Item label="备注">
             {getFieldDecorator('desc')(<Input type="textarea"  style={{width: 300}} />)}
           </Form.Item>
         </Form>
       </Modal>
     );
   }
 }
 
 
 
 export default Form.create({ name: "SiginIn-form" })(ModalForm)