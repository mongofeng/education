import { Cascader, Form, Input, Modal } from 'antd'
import { FormComponentProps } from "antd/lib/form";
import * as React from "react";
import * as api from '../../../../api/student'
const { useState, useEffect } = React;

type IProps = FormComponentProps & {
  wrappedComponentRef: React.MutableRefObject<any>
  id: string
  visible: boolean;
   confirmLoading: boolean;
   onCancel: () => void;
   onCreate: () => void;
}



const FormList: React.FC<IProps> =  (props) => {
  const {
    onCreate,
    form,
    visible,
    confirmLoading,
    onCancel

  } = props

  const { getFieldDecorator } = form;

  const [list, setList] = useState([])


  const fetchDetail = async () => {
    const { data: { data } } = await api.getStudentList({
      query: {
        _id: {
          $nin: props.id
        }
      },
      limit: 1000,
      page: 1,
      sort: { createDate: -1 }
    })

    setList(data.list.map(item => {
      return {
        value: item._id,
        label: item.name
      }
    }))
    console.log(list)
  }

  const fetchPackage = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    console.log(selectedOptions)
    console.log(targetOption)
  }


  useEffect(() => {
    fetchDetail()

  }, [])





  return (
    <Modal
      visible={visible}
         width={800}
         title="课时操作"
         okText="提交"
         confirmLoading={confirmLoading}
         onCancel={onCancel}
         onOk={onCreate}>

      <Form layout="vertical">
        <Form.Item label="Title">
          {getFieldDecorator('packId', {
            rules: [{ required: true, message: 'Please input the title of collection!' }],
          })(<Cascader
            options={list}
            loadData={fetchPackage}
            changeOnSelect={true} />)}
        </Form.Item>
        <Form.Item label="Description">
          {getFieldDecorator('desc')(<Input type="textarea" />)}
        </Form.Item>
      </Form>
    </Modal>
  );
}


export default Form.create<IProps>({ name: "SiginIn-form" })(FormList);
