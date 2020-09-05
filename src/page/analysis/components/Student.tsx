import Chart from '../../../components/Chart'
import { DatePicker } from "antd";
import * as React from "react";
import * as apiStatics from "../../../api/statistics"
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
      } = await apiStatics.stuCountByTime(params);
      setData(apiData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params]);


  const title = `${params.createDate}年学员增长趋势`;





  const option = {
    title: {
      show: true,
      text: title,
    },

    tooltip:{
      show:true,
      formatter: '{b0}: {c0}人' 
    },

    grid: {
      left: 50,
      top: 50,
      right: 20,
      bottom: 60,
    },
    xAxis: {
      data: oneYear.map(i => i.x),
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 129, 109, 0.1)',
          width: 1 //这里是为了突出显示加上的
        }
      },
      axisLabel: {
        textStyle: {
          color: '#999',
          fontSize: 12
        }
      }
    },
    yAxis: [{
      splitNumber: 2,
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 129, 109, 0.1)',
          width: 1 //这里是为了突出显示加上的
        }
      },
      axisLabel: {
        textStyle: {
          color: '#999'
        }
      },
      splitArea: {
        areaStyle: {
          color: 'rgba(255,255,255,.5)'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255, 129, 109, 0.1)',
          width: 0.5,
          type: 'dashed'
        }
      }
    }
    ],
    series: [{
      name: 'hill',
      type: 'pictorialBar',
      barCategoryGap: '0%',
      symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
      label: {
        show: true,
        position: 'top',
        distance: 15,
        color: '#DB5E6A',
        fontWeight: 'bolder',
        fontSize: 20,
      },
      itemStyle: {
        normal: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(232, 94, 106, .8)' //  0%  处的颜色
            },
            {
              offset: 1,
              color: 'rgba(232, 94, 106, .1)' //  100%  处的颜色
            }
            ],
            global: false //  缺省为  false
          }
        },
        emphasis: {
          opacity: 1
        }
      },
      data: oneYear.map(item => {
        const { key } = item;
        const val = find(data, {
          props: "key",
          value: key
        });

        return val ? val.count : 0
      }),
      z: 10
    }]
  };




  return (
    <div className="analysis-card">
      <div className="mb10">
        <MonthPicker onChange={onDateChange} format="YYYY" />
      </div>
      <Chart option={option} height="400px" />
    </div>
  );
};

export default BarCharts;
