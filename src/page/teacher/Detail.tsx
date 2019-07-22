import { Breadcrumb, Button, Col, Divider, Popover, Row, Statistic, Tabs, Tag } from "antd";
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import * as api from "../../api/teacher";
import FieldInfo, { IField} from '../../components/Fields-info'
import * as enums from '../../const/enum'
import {ITeacher} from '../../const/type/teacher'
import formatDate from "../../utils/format-date";
import getAge from '../../utils/getAge'
import BarCharts from './components/BarCharts'
import Course from './components/Course'
import Schedule from './components/Schedule'
import Student from './components/Student'
const { useState, useEffect } = React;
const TabPane = Tabs.TabPane;


const columns: IField[] = [
  {
    label: "姓名",
    prop: "name",
    render: ({data, field}: {data: ITeacher, field: string}) => <a href="javascript:;">{data[field]}</a>
  },
  {
    label: "生日",
    prop: "birthday",
  },
  {
    label: "性别",
    prop: "sex",
    render: ({data, field}: {data: ITeacher, field: string}) => <span>{enums.SEX_LABEL[data[field]]}</span>
  },
  {
    label: "年龄",
    prop: "age",
    render: ({data, field}: {data: ITeacher, field: string}) => <span>{getAge(data.birthday)}</span>
  },
  {
    label: "手机号码",
    prop: "phone"
  },
  {
    label: "地址",
    prop: "address",
    render: ({data}: {data: ITeacher}) => {
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
    label: "状态",
    prop: "status",
    render: ({data, field}: {data: ITeacher, field: string}) => (
    <Tag color={data[field] === enums.TEACHER_STATUS.InService ? "blue" : "red"}>
      {enums.TEACHER_STATUS_LABEL[data[field]]}
    </Tag>)
  },
  {
    label: "创建时间",
    prop: "createDate",
    render: ({data}: {data: Required<ITeacher>}) => <span>{formatDate(new Date(data.createDate))}</span>
  },
  {
    label: "创建时间",
    prop: "updateDate",
    render: ({data}: {data: Required<ITeacher>}) => <span>{formatDate(new Date(data.updateDate))}</span>
  },
];

interface IParams {
  id: string;
}

const initInfo: Partial<ITeacher> = {}

const  Detail: React.FC<RouteComponentProps<IParams>>  = (props) => {
  const [info, setInfo] = useState(initInfo);

  const id = props.match.params.id


  const fetchDetail = async () => {
    const { data: {data} } = await api.getteacher(id);
    setInfo(data)
  };


  const handleClick = () => {
    props.history.push(`../edit/${id}`)
  }


  useEffect(() => {
    fetchDetail();
  }, []);


  return (
    <div>
      <div className="main-title">
        <Breadcrumb className="fl">
          <Breadcrumb.Item>
            <span onClick={() => { props.history.goBack() }} style={{ cursor: 'pointer' }}>
            老师列表
            </span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            老师详情
          </Breadcrumb.Item>
        </Breadcrumb>
        <Popover content="点击编辑老师信息"  trigger="hover" placement="left">
          <Button icon="edit" className="fr" onClick={handleClick}/>
        </Popover>

      </div>
      <div className="content-wrap">
        <Divider orientation="left">基本信息</Divider>
        <Row>
          <Col span={16} >
            <FieldInfo fields={columns} data={info || {}}/>
          </Col>
          <Col span={8} >
            <Statistic
              title={<div style={{textAlign: 'center'}}>课时</div>}
              value={568}
              suffix="h"
              valueStyle={{fontSize: '42px', color: 'red', textAlign: 'center'}}/>
          </Col>
        </Row>

        <Tabs defaultActiveKey="1"  className="mt10">
          <TabPane tab="学生列表" key="1">
            <Student id={id}/>
          </TabPane>
          <TabPane tab="课程列表" key="2">
            <Course id={id}/>
          </TabPane>
          <TabPane tab="课程表" key="4">
            <Schedule id={id}/>
          </TabPane>
          <TabPane tab="学员增长图" key="3">
            <BarCharts id={id}/>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );

}

export default Detail
