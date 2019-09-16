import { Button, Col, Drawer, Form, InputNumber, message, Modal, Row, Switch } from 'antd'
import { FormComponentProps } from "antd/lib/form";
import * as React from "react";
import * as api from '../../../api/student-package'
import { IStudentPackage } from '../../../const/type/student-package'
import { useEffect, useState } from 'react'
const confirm = Modal.confirm;

type IProps = FormComponentProps & {
  id: string
  title: string
  visible: boolean;
  onCancel: (value: boolean) => void;
}

const initForm = {} as IStudentPackage
const FormList: React.FC<IProps> = (props) => {
  const {
    form,
    visible,
    title,
    onCancel
  } = props

  const [info, setInfo] = useState(initForm);
  const [loading, setLoading] = useState(false);

  const fetchDetail = async () => {
    if (!props.id) {
      return
    }
    const { data: { data } } = await api.getPackage(props.id);
    setInfo(data)
  }

  useEffect(() => {
    if (visible) {
      fetchDetail();
    }
  }, [visible]);




  const { getFieldDecorator } = form;



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

      if (!props.id) {
        message.error('没有课程包的id，不能更改');
        return
      }

      confirm({
        title: '警告',
        content: '是否更改学时包?',
        onOk: async () => {
          setLoading(true)
          try {
            await api.updateStudentPackage(props.id, values)
            setLoading(false)
            message.success('更新成功');
            handleFormCancel(true)
          } catch (e) {
            message.error('更新失败');
            setLoading(false)
          }
        },
      });




    });
  };


  const handleFormCancel = (value: boolean) => {
    props.form.resetFields();
    setInfo(initForm)
    onCancel(value)
  }

  const onCanceled = () => {
    handleFormCancel(false)
  }


  const modalProps = {
    width: 720,
    visible,
    title,
  }


  return (
    <Drawer
      {...modalProps}
      onClose={onCanceled }>

      <Form layout="vertical">

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="总课时">
              {getFieldDecorator('count', {
                initialValue: (info && typeof info.count === 'number') ? info.count : '',
                rules: [{ required: true, message: '请输入总课时的数量', type: 'number' }],
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  max={100000} />
              )}

            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="剩余课时">
              {getFieldDecorator('surplus', {
                initialValue: (info && typeof info.surplus === 'number') ? info.surplus : '',
                rules: [{ required: true, message: '请输入剩余课时的数量', type: 'number' }],
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={100000} />
              )}

            </Form.Item>
          </Col>
        </Row>


        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="使用课时">
              {getFieldDecorator('used', {
                initialValue: (info && typeof info.used === 'number') ? info.used : '',
                rules: [{ required: true, message: '请输入使用课时的数量', type: 'number' }],
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={100000} />
              )}

            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="价格">
              {getFieldDecorator('amount', {
                initialValue: (info && typeof info.amount === 'number') ? info.amount : '',
                rules: [{ required: true, message: '请输入价格', type: 'number' }],
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={100000} />
              )}

            </Form.Item>
          </Col>
        </Row>


        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="过期推送">
              {getFieldDecorator('isPush', {
                valuePropName: 'checked',
                initialValue: (info && typeof info.isPush !== 'undefined') ? info.isPush : false,
              })(
                <Switch  />
              )}

            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="激活">
              {getFieldDecorator('isActive', {
                valuePropName: 'checked',
                initialValue: (info && typeof info.isActive !== 'undefined') ? info.isActive : true,
              })(
                <Switch  />
              )}

            </Form.Item>
          </Col>
        </Row>


        {/*<Row gutter={16}>*/}
        {/*  <Col span={24}>*/}
        {/*    <Form.Item label="备注">*/}
        {/*      {getFieldDecorator('desc')(*/}
        {/*        <TextArea*/}
        {/*          rows={4}  />)}*/}
        {/*    </Form.Item>*/}
        {/*  </Col>*/}
        {/*</Row>*/}

      </Form>

      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button onClick={onCanceled} style={{ marginRight: 8 }}>
          取消
        </Button>
        <Button onClick={handleSubmit} type="primary">
          确定
        </Button>
      </div>
    </Drawer>
  );
}


export default Form.create<IProps>({ name: "StudentPackageForm" })(FormList);
