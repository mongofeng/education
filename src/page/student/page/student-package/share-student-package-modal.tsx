import { Cascader, Form, Input, Modal } from 'antd'
import { FormComponentProps } from "antd/lib/form";
import * as React from "react";
import * as api from '../../../../api/student'
import * as apiPack from '../../../../api/student-package'
import formatDate from '../../../../utils/format-date'
const { useState, useEffect } = React;

type IProps = FormComponentProps & {
  id: string
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
    confirmLoading,
    onCancel

  } = props

  const { getFieldDecorator } = form;

  const [list, setList] = useState([])


  const fetchDetail = async () => {
    const { data: { data } } = await api.getStudentList({
      query: {
        _id: {
          $nin: [props.id]
        }
      },
      limit: 1000,
      page: 1,
      sort: { createDate: -1 }
    })

    setList(data.list.map(item => {
      return {
        value: item._id,
        label: item.name,
        isLeaf: false,
      }
    }))
    console.log(list)
  }

  const fetchPackage = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    const {value} = targetOption
    if (!value) {
      return
    }
    const params = {
      query: {
        studentIds: value,
        isActive: true
      },
      limit: 1000,
      page: 1,
      sort: { activeTime: 1 }
    }
    try {
      targetOption.loading = true;
      const {data: {data}} =await apiPack.getStudentPackageList(params)
      targetOption.loading = false
      if (!data.list.length) {
        setList([...list])
        return
      }
      targetOption.children = data.list.map(item => {
        return {
          label: `激活时间:${formatDate(new Date(item.activeTime))},总计${item.count}课时`,
          value: item._id
        }
      })

      setList([...list])
    } finally {
      targetOption.loading = false
      console.log(2)
    }

  }


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


  useEffect(() => {
    fetchDetail()

  }, [])





  return (
    <Modal
      visible={visible}
       width={400}
       title="课时操作"
       okText="提交"
       confirmLoading={confirmLoading}
       onCancel={handleFormCancel}
       onOk={handleSubmit}>

      <Form layout="vertical">
        <Form.Item label="课程包">
          {getFieldDecorator('packId', {
            rules: [
              { required: true, message: '请选择需要共享的同学的课程包', len: 2, type: 'array' },
            ],
          })(<Cascader
            placeholder="请选择"
            options={list}
            loadData={fetchPackage}
            changeOnSelect={true} />)}
        </Form.Item>
        <Form.Item label="备注">
          {getFieldDecorator('desc')(<Input type="textarea" />)}
        </Form.Item>
      </Form>
    </Modal>
  );
}


export default Form.create<IProps>({ name: "SiginIn-form" })(FormList);
