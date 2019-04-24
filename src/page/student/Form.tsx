import {
  BackTop,
  Breadcrumb,
  Button,
  Form,
  Icon,
  Input,
  message,
  Select,
  Tooltip
} from "antd";
import { FormComponentProps } from "antd/lib/form";
import * as React from "react";
import { Link, RouteComponentProps } from 'react-router-dom';
import * as api from "../../api/student";
import * as apiTeacher from '../../api/teacher'
import {getAgeOptions} from '../../common/effect-utils'
import {IStudent} from '../../const/type/student'
import * as validator from '../../utils/validator'
import Location from '.././../components/Location'
const { TextArea } = Input;
const { Option } = Select;

interface IRouteParams {
  id?: string;
}

type IFormProps = FormComponentProps & RouteComponentProps<IRouteParams> 

interface IState {
  loading: boolean
  isEdit: boolean
  form: Required<IStudent> | null
  options: Array<ILabelVal<string>>
}


class FormComp extends React.PureComponent<IFormProps> {
  state: IState = {
    loading: false,
    form: null,
    isEdit: false,
    options: []
  };

  /**
   * 获取详情
   */
  fetchDetail = async () => {
    if (!this.props.match.params.id) { return }
    const { data: {data} } = await api.getStudent(this.props.match.params.id);
    this.setState({
      form: data,
      isEdit: true
    });
  };
  

  /**
   * 提交表单
   */
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (this.state.loading) {
      return;
    }


    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }

      console.log(values)

      const { residence, ...reset } = values;
      const [province, city, region] = residence;
      const params = {
        ...reset,
        province,
        city,
        region
      };

      try {
        this.setState({ loading: true });
        if (this.state.isEdit && this.props.match.params.id) {
          await api.updateStudent(this.props.match.params.id, params);
          message.success("编辑成功");
        } else {
          await api.addStudent(params);
          message.success("添加成功");
        }
        
        this.props.history.goBack();
      } finally {
        this.setState({ loading: false });
      }
    });
  };

  /**
   * 获取老师
   */
  fetchTeacher = async () => {
    const condition = {
      page: 1,
      offset: 1000
    }
    const {
      data: {
        data: { list }
      }
    } = await apiTeacher.getteacherList(condition)
    this.setState({
      options: list.map(item => ({
        label: item.name,
        value: item._id
      }))
    })
  }


  componentDidMount() {
    this.fetchDetail()
    this.fetchTeacher()
  }

  render() {
    const { getFieldDecorator } = this.props.form;

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

    const areaVal = this.state.form ? [this.state.form.province, this.state.form.city, this.state.form.region]: []

    return (
      <div>
        <div className="main-title">
          <Breadcrumb>
            <Breadcrumb.Item>
            <Link to="/base/student/list">学员列表</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{`${this.state.isEdit ? '编辑': '添加'}学员`}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="content-wrap">
          <BackTop />
          <Form
            {...formItemLayout}
            onSubmit={this.handleSubmit}
            style={{ width: "550px", margin: "10px" }}
          >
            <Form.Item
              label={
                <span>
                  姓名&nbsp;
                  <Tooltip title="学生的姓名咯">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator("name", {
                initialValue: this.state.form ? this.state.form.name : '',
                rules: [
                  { required: true, message: "请填写好姓名", whitespace: true }
                ]
              })(<Input />)}
            </Form.Item>

            <Form.Item label="生日">
              {getFieldDecorator("birthday", {
                initialValue: this.state.form ? this.state.form.birthday : '',
                rules: [
                  { required: true, message: "请填写生日", whitespace: true }
                ]
              })(<Input />)}
            </Form.Item>

            <Form.Item label="性别">
              {getFieldDecorator("sex", {
                initialValue: this.state.form ? this.state.form.sex : '',
                rules: [{ type: "number", required: true, message: "请选择性别" }]
              })(
                <Select>
                  <Option value={1}>男</Option>
                  <Option value={2}>女</Option>
                </Select>
              )}
            </Form.Item>

            <Form.Item label="年龄">
              {getFieldDecorator("age", {
                initialValue: this.state.form ? this.state.form.age : '',
                rules: [{ type: "number", required: true, message: "请选择年龄" }]
              })(
                <Select>
                  {getAgeOptions().map(item => (
                    <Option value={item.value} key={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>

            <Form.Item label="紧急联系人">
              {getFieldDecorator("contacts", {
                initialValue: this.state.form ? this.state.form.contacts : '',
                rules: [
                  {
                    required: true,
                    message: "请填写学生的紧急联系人"
                  }
                ]
              })(<Input />)}
            </Form.Item>

            <Form.Item label="手机号码">
              {getFieldDecorator("phone", {
                initialValue: this.state.form ? this.state.form.phone : '',
                rules: [
                  { required: true, message: "请填写手机" },
                  { validator: validator.phone}
                ]
              })(<Input style={{ width: "100%" }} />)}
            </Form.Item>

            <Form.Item label="省市区">
              {getFieldDecorator("residence", {
                initialValue: areaVal,
                rules: [{ type: "array", required: true, message: "请选择城市" }]
              })(<Location  />)}
            </Form.Item>


            <Form.Item label="地址">
              {getFieldDecorator("address", {
                initialValue: this.state.form ? this.state.form.address : '',
                rules: [
                  { required: true, message: "请填写地址", whitespace: true }
                ]
              })(
                <TextArea
                  placeholder="请填写地址"
                  autosize={{ minRows: 2, maxRows: 6 }}
                />
              )}
            </Form.Item>

            <Form.Item label="所属老师">
              {getFieldDecorator("teacherId", {
                initialValue: this.state.form ? this.state.form.teacherId : '',
                rules: [{ required: true, message: "请选择所属老师" }]
              })(
                <Select>
                  {
                    this.state.options.map(item => (
                      <Option value={item.value} key={item.value}>{item.label}</Option>
                    ))
                  }
                  
                </Select>
              )}
            </Form.Item>

            <Form.Item label="状态">
              {getFieldDecorator("status", {
                initialValue: this.state.form ? this.state.form.status : '',
                rules: [{ type: "number", required: true, message: "请选择状态" }]
              })(
                <Select>
                  <Option value={1}>在读</Option>
                  <Option value={2}>毕业</Option>
                </Select>
              )}
            </Form.Item>

            <Form.Item label="备注">
              {getFieldDecorator("desc", {
                initialValue: this.state.form ? this.state.form.desc : '',
              })(
                <TextArea
                  placeholder="请填写备注"
                  autosize={{ minRows: 2, maxRows: 6 }}
                />
              )}
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
              <Button
                type="primary"
                htmlType="submit"
                block={true}
                loading={this.state.loading}
              >
                提交
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

const FormComponent = Form.create({ name: "FormComp" })(FormComp);


export default FormComponent
