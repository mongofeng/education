import { Col, Icon, Row, Statistic, Tooltip } from "antd";
import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { Dispatch } from "redux";
import * as api from "../../api/teacher";
import fetchApiHook from '../../common/hooks/featchApiList'
import * as action from "../../store/actions/student";
import HourBar from './components/Hour'
import StudentBar from "./components/Student";
import StudentStatus from "./components/StudentStatus";
import "./index.css";

const { useEffect } = React;

interface IList extends RouteComponentProps {
  onGetList: (params: any) => void
  total: number,
}

const Analysis: React.FC<IList> = props => {

  const {
    pagination,
  } = fetchApiHook([], api.getteacherList, {
    limit: 1,
    size: 1,
    page: 1,
  })


  return (
    <div>
      <div className="main-title clearfix">
        <h2>分析页</h2>
      </div>

      <div className="analysis-body">
        <Row gutter={24}>
          <Col xl={8} lg={8} md={24} sm={24} xs={24}>
            <div className="analysis-card">
              <div className="fr">
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              </div>
              <Statistic title="学员数量" value={props.total || 0} />
            </div>

            <div className="analysis-card">
              <div className="fr">
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              </div>

              <Statistic title="教师数量" value={pagination.total || 0} />
            </div>
          </Col>

          <Col xl={16} lg={16} md={24} sm={24} xs={24}>
            <StudentStatus />
          </Col>
        </Row>

        <Row gutter={24}>
          <Col md={24} sm={24} xs={24}>
            <StudentBar />
          </Col>


          <Col md={24} sm={24} xs={24}>
            <HourBar />
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
