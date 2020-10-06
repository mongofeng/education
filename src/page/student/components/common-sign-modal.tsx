
import fetchTeacherHook from '@/common/hooks/teacher'
import { Form, Input, InputNumber, Modal, Select } from 'antd'
import { FormComponentProps } from "antd/lib/form";
import * as React from "react";
const { TextArea } = Input;
const { Option } = Select;


type IProps = FormComponentProps & {
  title: string
  teacherId: string
  desc?: string
  visible: boolean;
  confirmLoading: boolean;
  isHideNum?: boolean
  onCancel: () => void;
  onCreate: (val: any) => void;
}


const FormList: React.FC<IProps> = (props) => {
  const {
    onCreate,
    form,
    visible,
    title,
    confirmLoading,
    onCancel
  } = props



  const { getFieldDecorator } = form;


  const {
    teacherOptions,
  } = fetchTeacherHook({
    query: {status: 1},
  })







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


      console.log(values);

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

  console.log(props, 'model 的值改变重新渲染')

  return (
    <Modal
      {...modalProps}
      onCancel={handleFormCancel}
      onOk={handleSubmit}>

      <Form layout="vertical">
        {props.isHideNum ? '' : <Form.Item label="课时数量">
          {getFieldDecorator('num', {
            rules: [{ required: true, message: '请输入课时的数量', type: 'number' }],
          })(
            <InputNumber min={1} max={100000} />
          )}

        </Form.Item> }
        


        <Form.Item label="所属老师">
            {getFieldDecorator("teacherId", {
              initialValue: props.teacherId  ||  '',
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


        <Form.Item label="备注">
          {getFieldDecorator('desc', {
            initialValue: props.desc  ||  '',
          })(
            
            <TextArea
              style={{ width: 300 }}
              autosize={{ minRows: 5, maxRows: 16 }} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
}




export default Form.create<IProps>({ name: "SiginIn-form" })(React.memo(FormList));
