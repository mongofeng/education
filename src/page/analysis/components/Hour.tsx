import { TimelineChart } from "ant-design-pro/lib/Charts";
import { DatePicker } from "antd";
import * as React from "react";
import * as apiStatics from "../../../api/statistics"
import * as type from "../../../const/type/student";
import { find } from "../../../utils/util";
import Chart from '../../../components/Chart'
const { useState, useEffect } = React;

const { MonthPicker } = DatePicker;

const oneYear: any[] = [];
for (let i = 0; i < 12; i += 1) {
  oneYear.push({
    key: i + 1,
    x: `${i + 1}月`,
    y: 0
  });
}

const initList: type.IStuCountByTime[] = [];

const BarCharts: React.FC = props => {
  const initCondition: any = {
    createDate: new Date().getFullYear()
  };

  const [data, setData] = useState(initList);
  const [loading, setLoading] = useState(false);

  const [params, setParams] = useState(initCondition);

  const onDateChange = (date: any, dateString: string) => {
    setParams({
      ...initCondition,
      createDate: Number(dateString)
    });
  };

  const fetchData = async (reset?: boolean) => {
    if (loading) {
      return;
    }
    try {
      if (reset) {
        setParams(initCondition);
      }
      setLoading(true);
      const {
        data: { data: apiData }
      } = await apiStatics.hourCountByTime(params);
      setData(apiData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params]);


  const title = `${params.createDate}年学时统计`;

  // console.log(YearData)

  // 指定图表的配置项和数据
  var option = {
    grid: {
      left: 20,
      right: 20,
      top: 50,
      bottom: 60,
    },
    xAxis: {
      type: 'category',
      data: oneYear.map(i =>i.x)
    },
    tooltip: {
      show: true,
      triggerOn: 'mousemove',
      formatter: '{b}: {c}个课时'
  },
    yAxis: {
      type: 'value'
    },
    series: [{
      color: '#1890ff',
      data: oneYear.map(item => {
        const { key } = item;
        const val = find(data, {
          props: "key",
          value: key
        });

        return val ? val.count : 0
      }
      ),
      type: 'line'
    }]
  };

  return (
    <div className="analysis-card">
      <div className="mb10">
        <MonthPicker onChange={onDateChange} format="YYYY" />
      </div>

      <div>{title}</div>

      <Chart option={option} height="400px" />

    </div>
  );
};

export default BarCharts;
