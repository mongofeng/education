import { Col, Icon, Row, Statistic, Tooltip } from "antd";
import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { Dispatch } from "redux";
import * as action from "../../store/actions/student";
import StudentBar from "./components/Student";
import StudentStatus from "./components/StudentStatus";
import "./index.css";

const { useEffect } = React;

interface IList extends RouteComponentProps {
  onGetList: (params: any) => void
  total: number,
}

const Analysis: React.FC<IList> = props => {
  useEffect(() => {
    props.onGetList({
      limit: 1,
      page: 1,
    });
  }, []);

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
              <Statistic title="学员数量" value={props.total || 0} />
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


// 将 reducer 中的状态插入到组件的 props 中,一定要有
const mapStateToProps = (state: any) => ({
  total: state.student.total
});

// 将对应action 插入到组件的 props 中， 没有的时候把dispatch传进去
const mapDispatchToProps = (dispatch: Dispatch) => ({
  onGetList: (params: any) => dispatch(action.FetchList(params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Analysis);
