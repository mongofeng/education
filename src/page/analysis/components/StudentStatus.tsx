import { Pie } from "ant-design-pro/lib/Charts";
import { Icon, Tooltip } from "antd";
import * as React from "react";
import * as api from "../../../api/student";
import * as enums from "../../../const/enum";
import * as type from "../../../const/type/student";
import { find } from "../../../utils/util";
const { useState, useEffect } = React;

const PieData = Object.keys(enums.STUDENT_STATUS_LABEL).map(key => {
  return {
    key: Number(key),
    x: enums.STUDENT_STATUS_LABEL[key],
    y: 0
  };
});

const initList: type.IStudentStaticsStatus[] = [];

const BarCharts: React.FC = props => {
  const [data, setData] = useState(initList);
  const [loading, setLoading] = useState(false);

  const fetchData = async (reset?: boolean) => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      const {
        data: { data: apiData }
      } = await api.getStaticsStatus();
      setData(apiData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  let total = 0

  const result = PieData.map(item => {
    const { key } = item
    const val = find(data, {
      props: '_id',
      value: key
    })
    const count = val ? val.count : 0

    total += count

    return {
      ...item,
      y: count
    }
  });


  return (
    <div className="analysis-card">
      <div className="fr">
        <Tooltip title="指标说明">
          <Icon type="info-circle-o" />
        </Tooltip>
      </div>
      <div className="analysis-card-title">学员数量</div>
      <Pie
        total={() => <span>{total}人</span>}
        hasLegend={true}
        data={result}
        height={200}
      />
    </div>
  );
};

export default BarCharts;
