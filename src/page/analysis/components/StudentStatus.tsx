import Chart from '../../../components/Chart'
import { Icon, Tooltip } from "antd";
import * as React from "react";
import * as api from "../../../api/statistics";
import * as enums from "../../../const/enum";
import * as type from "../../../const/type/student";
import { find } from "../../../utils/util";
const { useState, useEffect } = React;

const PieData = Object.keys(enums.STUDENT_STATUS_LABEL).map(key => {
  return {
    key: Number(key),
    name: enums.STUDENT_STATUS_LABEL[key],
    value: 0
  };
});

const initList: type.IStuCountByStatus[] = [];

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
      } = await api.stuCountByStatus({});
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

  const echartData = PieData.map(item => {
    const { key } = item
    const val = find(data, {
      props: '_id',
      value: key
    })
    const count = val ? val.count : 0

    total += count

    return {
      ...item,
      value: count
    }
  });






  let bgColor = '#fff';
  let title = '总人数';
  let color = ['#0E7CE2', '#FF8352', '#E271DE', '#F8456B', '#00FFFF', '#4AEAB0'];


let formatNumber = function(num) {
    let reg = /(?=(\B)(\d{3})+$)/g;
    return num.toString().replace(reg, ',');
}


const option = {
    backgroundColor: bgColor,
    color: color,
    // tooltip: {
    //     trigger: 'item'
    // },
    title: [{
        text: '{name|' + title + '}\n{val|' + formatNumber(total) + '}',
        top: 'center',
        left: 'center',
        textStyle: {
            rich: {
                name: {
                    fontSize: 14,
                    fontWeight: 'normal',
                    color: '#666666',
                    padding: [10, 0]
                },
                val: {
                    fontSize: 32,
                    fontWeight: 'bold',
                    color: '#333333',
                }
            }
        }
    }],

    series: [{
        type: 'pie',
        radius: ['45%', '60%'],
        center: ['50%', '50%'],
        data: echartData,
        hoverAnimation: false,
        itemStyle: {
            normal: {
                borderColor: bgColor,
                borderWidth: 2
            }
        },
        labelLine: {
            normal: {
                length: 20,
                length2: 120,
                lineStyle: {
                    color: '#e6e6e6'
                }
            }
        },
        label: {
            normal: {
                formatter: params => {
                    return (
                        '{icon|●}{name|' + params.name + '}{value|' +
                        formatNumber(params.value) + '}'
                    );
                },
                padding: [0 , -100, 25, -100],
                rich: {
                    icon: {
                        fontSize: 16
                    },
                    name: {
                        fontSize: 14,
                        padding: [0, 10, 0, 4],
                        color: '#666666'
                    },
                    value: {
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: '#333333'
                    }
                }
            }
        },
    }]
};


  return (
    <div className="analysis-card">
      <div className="fr">
        <Tooltip title="指标说明">
          <Icon type="info-circle-o" />
        </Tooltip>
      </div>
      <div className="analysis-card-title">学员数量</div>
      <Chart option={option} height="400px" />
    </div>
  );
};

export default BarCharts;
