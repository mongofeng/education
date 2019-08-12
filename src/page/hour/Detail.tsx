import { Breadcrumb, Col, Divider, Row, Statistic} from "antd";
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import * as api from "../../api/hour";
import FieldInfo, { IField} from '../../components/Fields-info'
import * as enums from '../../const/enum'
import {IHour} from '../../const/type/hour'
import formatDate from "../../utils/format-date";
import { connect } from 'react-redux'
const { useState, useEffect } = React;

interface IProps {
  student: {
    [key in string]: string
  }
}



interface IParams {
  id: string;
}

const initInfo: Partial<IHour> = {}

const  Detail: React.FC<RouteComponentProps<IParams> & IProps>  = (props) => {
  const columns: IField[] = [
    {
      label: "学员名称",
      prop: "studentId",
      render: ({data, field}: {data: IHour, field: string}) => {
        return (
          <div>{props.student[data[field]]}</div>
        )
      }
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
    {
      label: "课程",
      prop: "course",
      render: ({data}: {data: Required<IHour>}) => {
        const {course: val} = data
        if (!val || !val.length) {
          return  '-'
        }
        return val.map((item) => {
          return [
            (
              <div key={item.id}>
                {`${item.name}:${item.count}课时`}
              </div>
            )
          ]
        })
      }
    },
    {
      label: "备注",
      prop: "desc"
    },
  ];

  const [info, setInfo] = useState(initInfo);
  const [courseCount, setCourseCount] = useState(0)

  const id = props.match.params.id


  const fetchDetail = async () => {
    const { data: {data} } = await api.getHour(id);
    const total = data.course.reduce((initVal, item) => {
      return initVal + item.count;
    }, 0)
    setCourseCount(total)
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
              title={<div style={{textAlign: 'center'}}>课时数量</div>}
              value={courseCount}
              suffix="课时"
              valueStyle={
                {fontSize: '42px', color: 'red', textAlign: 'center'}
              }/>
          </Col>
        </Row>
      </div>
    </div>
  );

}


export default connect((state: any) => {
  return {
    student: state.student.labels,
  }
})(Detail);
