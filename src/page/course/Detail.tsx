import { Breadcrumb, Button, Col, Divider, Popover, Row, Statistic, Tabs, Tag } from "antd";
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import * as api from "../../api/course";
import FieldInfo, { IField} from '../../components/Fields-info'
import * as enums from '../../const/enum'
import {ICourse} from '../../const/type/course'
import formatDate from "../../utils/format-date";
import Hour from './components/Hour'
import Student from './components/Student'
const { useState, useEffect } = React;
const TabPane = Tabs.TabPane;


const columns: IField[] = [
  {
    label: "课程名称",
    prop: "name"
  },
  {
    label: "所属老师",
    prop: "teacherId"
  },
  {
    label: "一周",
    prop: "day",
    render: ({data, field}: {data: ICourse, field: string}) => {
      return (
        <div>{enums.WEEK_LABEL[data[field]]}</div>
      )
    }
  },
  {
    label: "一天",
    prop: "time",
    render: ({data, field}: {data: ICourse, field: string}) => {
      return (
        <div>{enums.DAY_LABEL[data[field]]}</div>
      )
    }
  },
  {
    label: "状态",
    prop: "status",
    render: ({data, field}: {data: ICourse, field: string}) => (
    <Tag color={data[field] === enums.COURSE_STATUS.open ? "blue" : "red"}>
      {enums.COURSE_STATUS_LABEL[data[field]]}
    </Tag>)
  },
  {
    label: "开课时间",
    prop: "startDate",
    render: ({data}: {data: Required<ICourse>}) => (
      <span>{formatDate(data.startDate)}</span>)
  },
  {
    label: "结课时间",
    prop: "endDate",
    render: ({data}: {data: Required<ICourse>}) => (
      <span>{formatDate(data.endDate)}</span>)
  },
  {
    label: "创建时间",
    prop: "createDate",
    render: ({data}: {data: Required<ICourse>}) => (
      <span>{formatDate(new Date(data.createDate))}</span>)
  },
  {
    label: "更新时间",
    prop: "updateDate",
    render: ({data}: {data: Required<ICourse>}) => (
      <span>{formatDate(new Date(data.updateDate))}</span>)
  },
];

interface IParams {
  id: string;
}

const initInfo: Partial<ICourse> = {}

const  Detail: React.FC<RouteComponentProps<IParams>>  = (props) => {
  const [info, setInfo] = useState(initInfo);

  const id = props.match.params.id


  const fetchDetail = async () => {
    const { data: {data} } = await api.getCourse(id);
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
            课程列表
            </span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            课程详情
          </Breadcrumb.Item>
        </Breadcrumb>
        <Popover content="点击编辑课程信息"  trigger="hover" placement="left">
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
              title={<div style={{textAlign: 'center'}}>当前学生数量</div>} 
              value={(info && info.studentIds) ? info.studentIds.length : 0}
              suffix="人" 
              valueStyle={
                {fontSize: '42px', color: 'red', textAlign: 'center'}
              }/>
          </Col>
        </Row>

        <Tabs defaultActiveKey="1"  className="mt10">
          <TabPane tab="签到流水" key="1">
              <Hour id={id} />
          </TabPane>
          {info && info.studentIds && info.studentIds && <TabPane tab="课程的学员列表" key="2"><Student ids={info.studentIds}/></TabPane> }
        </Tabs>
      </div>
    </div>
  );

}

export default Detail