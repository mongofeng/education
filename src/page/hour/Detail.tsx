import { Breadcrumb, Col, Divider, Row, Statistic, Tag } from "antd";
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import * as api from "../../api/hour";
import FieldInfo, { IField} from '../../components/Fields-info'
import * as enums from '../../const/enum'
import {IHour} from '../../const/type/hour'
import formatDate from "../../utils/format-date";
const { useState, useEffect } = React;



const columns: IField[] = [
  {
    label: "学员名称",
    prop: "name"
  },
  {
    label: "所属老师",
    prop: "teacherId"
  },
  {
    label: "课时数量",
    prop: "num"
  },
  {
    label: "操作类型",
    prop: "type",
    render: ({data, field}: {data: IHour, field: string}) => {
      return (
        <div>{enums.COURSE_HOUR_ACTION_TYPE_LABEL[data[field]]}</div>
      )
    }
  },
  {
    label: "类型",
    prop: "classTypes",
    render: ({data, field}: {data: IHour, field: string}) => {
      return (
        <div>{enums.COURSE_HOUR_TYPE_LABEL[data[field]]}</div>
      )
    }
  },
  {
    label: "状态",
    prop: "status",
    render: ({data, field}: {data: IHour, field: string}) => (
    <Tag color={data[field] === enums.COURSE_HOUR_STATUS.pass ? "blue" : "red"}>
      {enums.COURSE_HOUR_STATUS_LABEL[data[field]]}
    </Tag>)
  },
  {
    label: "创建时间",
    prop: "createDate",
    render: ({data}: {data: Required<IHour>}) => (
      <span>{formatDate(new Date(data.createDate))}</span>)
  },
  {
    label: "更新时间",
    prop: "updateDate",
    render: ({data}: {data: Required<IHour>}) => (
      <span>{formatDate(new Date(data.updateDate))}</span>)
  },
];

interface IParams {
  id: string;
}

const initInfo: Partial<IHour> = {}

const  Detail: React.FC<RouteComponentProps<IParams>>  = (props) => {
  const [info, setInfo] = useState(initInfo);

  const id = props.match.params.id


  const fetchDetail = async () => {
    const { data: {data} } = await api.getHour(id);
    setInfo(data)
  };


  useEffect(() => {
    fetchDetail();
  }, []);


  return (
    <div>
      <div className="main-title">
        <Breadcrumb className="fl">
          <Breadcrumb.Item>
            <span onClick={() => { props.history.goBack() }} style={{ cursor: 'pointer' }}>
            课时流水
            </span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            课时详情
          </Breadcrumb.Item>
        </Breadcrumb>

      </div>
      <div className="content-wrap">
        <Divider orientation="left">基本信息</Divider>
        <Row>
          <Col span={16} >
            <FieldInfo fields={columns} data={info || {}}/>
          </Col>
          <Col span={8} >
            <Statistic 
              title={<div style={{textAlign: 'center'}}>课时金额</div>} 
              value={(info && info.amount) ? info.amount : 0}
              suffix="元" 
              valueStyle={
                {fontSize: '42px', color: 'red', textAlign: 'center'}
              }/>
          </Col>
        </Row>
      </div>
    </div>
  );

}

export default Detail