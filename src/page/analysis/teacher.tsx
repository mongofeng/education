import fetchTeacherHook from '@/common/hooks/teacher'
import { Col, Row,  } from "antd";
import * as React from "react";
import HourBar from './components/Hour'

import "./index.css";

const Analysis: React.FC = props => {

  const {
    teacherOptions,
  } = fetchTeacherHook({
    query: {status: 1},
  })





  return (
    <div>
      <div className="main-title clearfix">
        <h2>分析页</h2>
      </div>

      <div className="analysis-body">
        <Row gutter={24}>
          {teacherOptions.map(i => {
            return (
              <Col md={24} sm={24} xs={24} key={i.value}>
                <HourBar  teacher={i}/>
              </Col>
            )
          })}
          
        </Row>
      </div>
    </div>
  );
};



export default Analysis
