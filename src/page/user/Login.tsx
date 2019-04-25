
import {
  Button, Checkbox, Form, Icon, Input,
} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from "react-router-dom";
import { compose, Dispatch } from "redux";
import * as action from '../../store/actions/auth'
import './Login.css'

interface ILoginProps extends FormComponentProps, RouteComponentProps {
  dispatch: Dispatch
  loading: boolean
  isSuccess: boolean
}


class LoginPage extends React.PureComponent<ILoginProps> {

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err: Error, values: any) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.dispatch(action.Loginrequest(values))
      }
    });
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('account', {
            rules: [{ required: true, message: '请输入账号' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" size="large" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" size="large" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>记住密码</Checkbox>
          )}
          <Button type="primary" htmlType="submit" className="login-form-button" size="large" loading={this.props.loading}>
            登录
          </Button>
          <Link to={`register`}>注册</Link>
        </Form.Item>
      </Form>
    );
  }
}


export default compose(connect((state: any) => ({
  loading: state.auth.loginModel.loading,
  isSuccess: state.auth.loginModel.isSuccess
})),
Form.create({ name: 'normal_login' })
)(LoginPage) as any

