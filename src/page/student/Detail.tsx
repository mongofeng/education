import { Breadcrumb, Button, Col, Divider, Icon, message, Modal, Popover, Row, Statistic, Tabs, Tag } from "antd";
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import * as api from "../../api/student";
import * as apiHour from "../../api/student-hour";
import { default as FieldInfo, IField} from '../../components/Fields-info'
import * as enums from '../../const/enum'
import {IStudent} from '../../const/type/student'
import {IStudentHour} from '../../const/type/student-hour'
import formatDate from "../../utils/format-date";
import Course from './page/course'
import Hours from './components/hour'

import getAge from '../../utils/getAge'
import Schedule from './components/Schedule'
import SignIn from './components/SignIn'

import StudentPakcage from './page/student-package' // 课程包
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;


interface IState {
  info: IStudent | null
  totalInfo: IStudentHour | null
}

interface IParams {
  id: string;
}

class Detail extends React.PureComponent<RouteComponentProps<IParams>> {
  state: IState = {
    info: null,
    totalInfo: null
  };

  fetchDetail = async () => {
    const { data: {data} } = await api.getStudent(this.props.match.params.id);
    this.setState({
      info: data
    });
  };


  fetchTotalHours = async () => {
    const {data: {data}} = await apiHour.getStudentHour(this.props.match.params.id)
    this.setState({
      totalInfo: data
    })
  }


  resetOpenId = async (id: string) => {
    confirm({
      title: "确定操作?",
      content: `重置后需要重新绑定微信`,
      onOk: async() => {
        await api.updateStudent(id, {
          openId: ''
        });
        message.success("重置微信号成功");
        this.fetchDetail();
      }
    });

  }



  handleClick = () => {
    this.props.history.push(`../edit/${this.props.match.params.id}`)
  }

  componentDidMount() {
    this.fetchDetail();
    this.fetchTotalHours()
  }

  render() {
    const {id} = this.props.match.params
    const {totalInfo} = this.state
    const hourProps = {
      update: this.fetchTotalHours,
      id,
      name: this.state.info ? this.state.info.name : ''
    }

    const info = {
      num: totalInfo ? totalInfo.num : 0,
      used: totalInfo ? totalInfo.used : 0,
    }

    const columns: IField[] = [
      {
        label: "姓名",
        prop: "name",
        render: ({data, field}: {data: IStudent, field: string}) => <a href="javascript:;">{data[field]}</a>
      },
      {
        label: "生日",
        prop: "birthday",
      },
      {
        label: "联系人",
        prop: "contacts",
      },
      {
        label: "性别",
        prop: "sex",
        render: ({data, field}: {data: IStudent, field: string}) => <span>{enums.SEX_LABEL[data[field]]}</span>
      },
      {
        label: "年龄",
        prop: "age",
        render: ({data, field}: {data: IStudent, field: string}) => <span>{getAge(data.birthday)}</span>
      },
      {
        label: "手机号码",
        prop: "phone"
      },
      {
        label: "地址",
        prop: "address",
        render: ({data}: {data: IStudent}) => {
          const {province, city, region, address} = data
          const adress = `${province}${city}${region}${address}`
          return (
            <span>
             {adress}
            </span>
          )
        }
      },
      {
        label: "微信openId",
        prop: "openId",
        render: ({data, field}: {data: IStudent, field: string}) => {
          if (data[field]) {
            return [
              <span key="1">{data[field].slice(0, 20)}</span>,
              <Button
                onClick={() => {this.resetOpenId(data._id)}}
                key="2"
                className="ml10"
                type="link"
                icon="delete"
                size="small"/>
            ]
          }

          return <div>暂无绑定</div>

        }
      },
      {
        label: "teacherId",
        prop: "teacherId",
      },
      {
        label: "状态",
        prop: "status",
        render: ({data, field}: {data: IStudent, field: string}) => (
        <Tag color={data[field] === enums.STUDENT_STATUS.reading ? "blue" : "red"}>
          {enums.STUDENT_STATUS_LABEL[data[field]]}
        </Tag>)
      },
      {
        label: "创建时间",
        prop: "createDate",
        render: ({data}: {data: Required<IStudent>}) => <span>{formatDate(new Date(data.createDate))}</span>
      },
      {
        label: "创建时间",
        prop: "updateDate",
        render: ({data}: {data: Required<IStudent>}) => <span>{formatDate(new Date(data.updateDate))}</span>
      },
    ];

    return (
      <div>
        <div className="main-title">
          <Breadcrumb className="fl">
            <Breadcrumb.Item><span onClick={() => { this.props.history.goBack() }} style={{ cursor: 'pointer' }}>学员列表</span></Breadcrumb.Item>
            <Breadcrumb.Item>学员详情</Breadcrumb.Item>
          </Breadcrumb>
          <Popover content="点击编辑学员信息"  trigger="hover" placement="left">
            <Button icon="edit" className="fr" onClick={this.handleClick}/>
          </Popover>

        </div>
        <div className="content-wrap">
          <Divider orientation="left">基本信息</Divider>
          <Row style={{display: 'flex', alignItems: 'center'}}>
            <Col span={16} >
              <FieldInfo fields={columns} data={this.state.info || {}}/>
            </Col>
            <Col span={8} >
            <Row gutter={16}>

              <Col span={8}>
                <Statistic title="使用" value={info.used} suffix="课时" valueStyle={{color: 'red'}}/>
              </Col>
              <Col span={8}>
                <Statistic title="总学时" value={info.num} prefix={<Icon type="like" />}  valueStyle={{color: 'blue'}} suffix="课时"/>
              </Col>
              <Col span={8}>
                <Statistic title="剩余" value={info.num - info.used} suffix="课时" valueStyle={{color: 'red'}}/>
              </Col>
            </Row>
            </Col>
          </Row>

          <Tabs defaultActiveKey="1" className="mt10">
            <TabPane tab="课程" key="1">
              <Course id={id}/>
            </TabPane>

            <TabPane tab="课程包" key="6">
              <StudentPakcage id={id}/>
            </TabPane>

            <TabPane tab="课时" key="2">
              <Hours {...hourProps}/>
            </TabPane>
            <TabPane tab="课程表" key="4">
              <Schedule id={id}/>
            </TabPane>

            <TabPane tab="当天课程签到表" key="5">
              <SignIn {...hourProps}/>
            </TabPane>

          </Tabs>
        </div>
      </div>
    );
  }
}

export default Detail;
