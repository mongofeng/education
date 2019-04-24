import {
  BackTop,
  Breadcrumb,
  Button,
  DatePicker,
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
import * as api from "../../api/course";
import * as apiTeacher from '../../api/teacher'
import fetchFormHook from '../../common/hooks/fetchForm'
import * as enums from "../../const/enum";
import {ICourse} from '../../const/type/course'
import formatDate from "../../utils/format-date";
const moment = require('moment');
const { useState, useEffect } = React;
const { TextArea } = Input;
const { Option } = Select;
const {  RangePicker } = DatePicker;

interface IRouteParams {
  id?: string;
}



type IFormProps = FormComponentProps & RouteComponentProps<IRouteParams> 

const initForm = {} as ICourse

const initOptions: Array<ILabelVal<string>> = []

function FormCompent (props: IFormProps) {
    const {
        isEdit,
        loading,
        form,
        setLoading
    } = fetchFormHook(initForm, api.getCourse, props.match.params.id)


    const [options, setOptions] = useState(initOptions)


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
        const {rangeValue, ...reset} = values
        const [startDate, endDate] =  [
          rangeValue[0].format('YYYY-MM-DD 00:00:00'), 
          rangeValue[1].format('YYYY-MM-DD 23:59:59')
        ]
        const params = {
          startDate: new Date(startDate).getTime(),
          endDate: new Date(endDate).getTime(),
          ...reset
        }
        try {
          setLoading(true);
          if (isEdit && props.match.params.id) {
            await api.updateCourse(props.match.params.id, params);
            message.success("编辑成功");
          } else {
            await api.addCourse(params);
            message.success("添加成功");
          }
          
          props.history.goBack();
        } finally {
          setLoading(false);
        }
      });
    };


   /**
    * 获取老师
    */
  const fetchTeacher = async () => {
    const condition = {
      page: 1,
      offset: 1000
    }
    const {
      data: {
        data: { list }
      }
    } = await apiTeacher.getteacherList(condition)
    const result = list.map(item => ({
      label: item.name,
      value: item._id
    }))

    setOptions(result)
  }


  useEffect(() => {
    fetchTeacher()
    console.log('fetch teacher')
  }, []);

    const { getFieldDecorator } = props.form;

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


    const rangeVal = (form && form.startDate && form.endDate) ? [
      moment(formatDate(new Date(form.startDate), {
        format: 'yyyy-MM-dd',
      }), 'YYYY-MM-DD'),
      moment(formatDate(new Date(form.endDate), {
        format: 'yyyy-MM-dd',
      }), 'YYYY-MM-DD')
    ] : []

    return (
      <div>
        <div className="main-title">
          <Breadcrumb>
            <Breadcrumb.Item>
            <Link to="/base/student/list">课程列表</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{`${isEdit ? '编辑': '添加'}课程`}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="content-wrap">
          <BackTop />
          <Form
            {...formItemLayout}
            onSubmit={handleSubmit}
            style={{ width: "550px", margin: "10px" }} >
            <Form.Item
              label={
                <span>
                  课程名称&nbsp;
                  <Tooltip title="课程的名称咯">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator("name", {
                initialValue: form ? form.name : '',
                rules: [
                  { required: true, message: "请填写课程名称", whitespace: true }
                ]
              })(<Input />)}
            </Form.Item>

            <Form.Item label="所属老师">
              {getFieldDecorator("teacherId", {
                initialValue: form ? form.teacherId : '',
                rules: [{ required: true, message: "请选择所属老师" }]
              })(
                <Select>
                  {
                    options.map(item => (
                      <Option value={item.value} key={item.value}>{item.label}</Option>
                    ))
                  }
                  
                </Select>
              )}
            </Form.Item>

            <Form.Item label="一周">
              {getFieldDecorator("day", {
                initialValue: form ? form.day : '',
                rules: [{ type: "number", required: true, message: "请选择上课的时间" }]
              })(
                <Select>
                    {Object.keys(enums.WEEK_LABEL).map(key => (
                      <Option value={Number(key)} key={key}>
                        {enums.WEEK_LABEL[key]}
                      </Option>
                    ))}
                </Select>
              )}
            </Form.Item>


            <Form.Item label="一天">
              {getFieldDecorator("time", {
                initialValue: form ? form.day : '',
                rules: [{ type: "number", required: true, message: "请选择上课的时间段" }]
              })(
                  <Select>
                    {Object.keys(enums.DAY_LABEL).map(key => (
                      <Option value={Number(key)} key={key}>
                        {enums.DAY_LABEL[key]}
                      </Option>
                    ))}
                </Select>
              )}
            </Form.Item>


            <Form.Item
            label="开课/结课">
            {getFieldDecorator('rangeValue', {
              initialValue: rangeVal,
              rules: [{ type: 'array', required: true, message: '请选择开始和结束的时间!' }],
            })(
              <RangePicker />
            )}
          </Form.Item>


            <Form.Item label="状态">
              {getFieldDecorator("status", {
                initialValue: form ? form.status : '',
                rules: [{ type: "number", required: true, message: "请选择状态" }]
              })(
                <Select>
                  {Object.keys(enums.COURSE_STATUS_LABEL).map(key => (
                    <Option value={Number(key)} key={key}>
                      {enums.COURSE_STATUS_LABEL[key]}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>

            <Form.Item label="备注">
              {getFieldDecorator("desc", {
                initialValue: form ? form.desc : '',
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
                loading={loading}>
                提交
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
}

export default Form.create({ name: "FormComp" })(FormCompent)