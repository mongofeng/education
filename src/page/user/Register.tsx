import {
   Button, Form, Icon, Input, notification, Select,Tooltip 
} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from "react-router-dom";
import { compose, Dispatch } from "redux";
import * as action from '../../store/actions/auth'
import * as validator from '../../utils/validator'
import style from './Register.module.scss'

interface IRegisterProps extends FormComponentProps,RouteComponentProps  {
  dispatch: Dispatch
  loading: boolean
  isSuccess: boolean
}

const { Option } = Select;


class RegistrationForm extends React.PureComponent<IRegisterProps> {
  state = {
    confirmDirty: false,
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values)
      if (err) {
        return
      }
      this.props.dispatch(action.RegisterRequest(values))
    });
  }

  handleConfirmBlur = (e: any) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule: any, value: string, callback: (str?: string) => void) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('您需要先输入密码!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule: any, value: string, callback: (str?: string) => void) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }


  componentWillReceiveProps (nextProps: IRegisterProps) {
    console.log('props发生改变', nextProps)
    if (nextProps.isSuccess !== this.props.isSuccess && nextProps.isSuccess) { 
      notification.success({
        message: '系统消息',
        description: '注册成功,请前往登录吧',
      });
     }
  }


  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };



    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit} className={style.form}>
        <Form.Item
          label="账号邮箱"
        >
          {getFieldDecorator('account', {
            rules: [{
              type: 'email', message: '账号不合法，请填写邮箱',
            }, {
              required: true, message: '请填写账号',
            }],
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          label="密码"
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: '请填写密码',
            }, {
              validator: this.validateToNextPassword,
            }],
          })(
            <Input type="password" />
          )}
        </Form.Item>
        <Form.Item
          label="确认密码"
        >
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: '请填写密码',
            }, {
              validator: this.compareToFirstPassword,
            }],
          })(
            <Input type="password" onBlur={this.handleConfirmBlur} />
          )}
        </Form.Item>
        <Form.Item
          label={(
            <span>
              昵称&nbsp;
              <Tooltip title="您的称呼咯">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          )}
        >
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请填写好昵称', whitespace: true }],
          })(
            <Input />
          )}
        </Form.Item>


        <Form.Item
          label="角色"
        >
          {getFieldDecorator('status', {
            initialValue: 1,
            rules: [{ type: 'number', required: true, message: '请选择城市' }],
          })(
            <Select >
              <Option value={1}>管理员</Option>
              <Option value={2}>非管理员</Option>
            </Select>
          )}
        </Form.Item>

        <Form.Item
          label="手机号码"
        >
          {getFieldDecorator('mobile', {
            rules: [
              { required: true, message: '请填写您的手机' },
              { validator: validator.phone}
            ],
          })(
            <Input style={{ width: '100%' }} />
          )}
        </Form.Item>
        
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" block={true} loading={this.props.loading}>注册</Button>
          <Link to="login">登录</Link>
        </Form.Item>
      </Form>
    );
  }
}


// 不要这样做……
// const EnhancedComponent = withRouter(connect(commentSelector)(WrappedComponent))

// ……你可以使用一个函数组合工具
// compose(f, g, h) 和 (...args) => f(g(h(...args)))是一样的
const enhance = compose(
  // 这些都是单独一个参数的高阶组件
  Form.create({ name: 'register' }),
  connect((state: any) => ({
    loading: state.auth.registerModel.loading,
    isSuccess: state.auth.registerModel.isSuccess
  }))
)
const RegisterComponent: any =  enhance(RegistrationForm);
export default RegisterComponent
