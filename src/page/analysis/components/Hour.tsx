import { TimelineChart  } from "ant-design-pro/lib/Charts";
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

  const YearData: any[] = oneYear.map(item => {
    const { key } = item;
    const val = find(data, {
      props: "key",
      value: key
    });

    return {
      x: item.x,
      y1: val ? val.count : 0
    };
  });

  const title = `${params.createDate}年学时统计`;

  // console.log(YearData)

  // 指定图表的配置项和数据
  var option = {
    title: {
        text: 'ECharts 入门示例'
    },
    tooltip: {},
    legend: {
        data:['销量']
    },
    xAxis: {
        data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
    },
    yAxis: {},
    series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
    }]
};

  return (
    <div className="analysis-card">
      <div className="mb10">
        <MonthPicker onChange={onDateChange} format="YYYY" />
      </div>

      <div>{title}</div>

      {/* <TimelineChart  height={200} titleMap={{ y1: '学时数量'}} data={YearData} /> */}

      <Chart option={option} height="500px"/>

    </div>
  );
};

export default BarCharts;
