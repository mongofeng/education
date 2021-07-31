import { DatePicker } from "antd";
import * as React from "react";
import * as apiStatics from "../../../api/statistics"
import Chart from '../../../components/Chart'
import * as type from "../../../const/type/student";
import { find } from "../../../utils/util";
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

interface IProps {
  teacher?: {
    label: string,
    value: string
  },
  isTrial?: boolean
}

const BarCharts: React.FC<IProps> = props => {
  console.log(">>>>>", props.teacher)
  const initCondition: any = {
    createDate: new Date().getFullYear()
  };
  let prefix = ''
  if (props.teacher && props.teacher.value) {
    initCondition.teacherId = props.teacher.value
    prefix = props.teacher.label + ":"
  }

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
      const func = props.isTrial ? apiStatics.trialClassHourCount : apiStatics.hourCountByTime
      const {
        data: { data: apiData }
      } = await func(params);
      setData(apiData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params]);


  const title = `${prefix}${params.createDate}年学时统计`;

  // console.log(YearData)

  // 指定图表的配置项和数据
  const option = {
    title: {
      show: true,
      text: title,
    },

    grid: {
      left: 50,
      top: 50,
      right: 20,
      bottom: 60,
    },
    xAxis: {
      type: 'category',
      data: oneYear.map(i => i.x)
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
      label: {
        normal: {
          show: true,
          position: 'top',
          formatter: '{c}',
        },
      },
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

      <Chart option={option} height="500px" />

    </div>
  );
};

export default BarCharts;
