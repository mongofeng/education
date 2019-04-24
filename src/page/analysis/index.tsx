import { Col, Icon, Row, Statistic, Tooltip } from "antd";

import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import StudentBar from "./components/Student";
import StudentStatus from "./components/StudentStatus";
import "./index.css";

const Analysis: React.FC<RouteComponentProps> = props => {
  return (
    <div>
      <div className="main-title clearfix">
        <h2>分析页</h2>
      </div>

      <div className="analysis-body">
        <Row gutter={24}>
          <Col xl={12} lg={12} md={12} sm={24} xs={24}>
            <div className="analysis-card">
              <div className="fr">
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              </div>
              <Statistic title="学员数量" value={112893} />
            </div>
          </Col>

          <Col xl={12} lg={12} md={24} sm={24} xs={24}>
            <StudentStatus />
          </Col>
        </Row>

        <Row gutter={24}>
          <Col md={24} sm={24} xs={24}>
            <StudentBar />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Analysis;
