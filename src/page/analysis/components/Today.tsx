import fetchTeacherHook from "@/common/hooks/teacher";
import { COURSE_HOUR_ACTION_TYPE } from "@/const/enum";
import dayjs from "dayjs";
import * as React from "react";
import { useMemo } from "react";
import { commonQuery } from "../../../api/statistics";
import Chart from '../../../components/Chart'
import * as type from "../../../const/type/student";
const { useState, useEffect } = React;




const initList: type.IStuCountByTime[] = [];

interface IProps {
  isTrial?: boolean
}

const Today: React.FC<IProps> = props => {
  const {
    teacherObj,
  } = fetchTeacherHook({
    query: {},
  })



  const params = React.useMemo(() => {
    const today = dayjs().format('YYYY-MM-DD 00:00:00 +0800')
    const teacherMatch = JSON.stringify({
      $match: {
        $expr: { $gte: ['$createDate', { $toDate: today }] }, // 选择时间
        type: {
          $in: [COURSE_HOUR_ACTION_TYPE.supplement, COURSE_HOUR_ACTION_TYPE.sign]
        }
      }
    })

    // 通用的group
    const group = JSON.stringify(
      {
        $group: {
          // _id: { $dateToString: { format: '%Y-%m', date: '$createDate' } },
          _id: '$teacherId',
          count: { $sum: '$num' }
        }
      }
    )

    return {
      collectionName: 'course-hour-flow',
      sql: [
        teacherMatch,
        group
      ]
    }
  }, [])



  const [data, setData] = useState(initList);
  const [loading, setLoading] = useState(false);



  const fetchData = async (reset?: boolean) => {

    try {
      const { data: { data } } = await commonQuery(params)
      const total = data.reduce((c, i) => c + i.count, 0)
      setData(data.concat({
        _id: '合计',
        count: total
      }));
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params]);


  const title = dayjs().format('YYYY-MM-DD') + `学时统计`;


  const option = useMemo(() => {
    // 指定图表的配置项和数据
    return {
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
        data: data.map(i => teacherObj[i._id] || i._id)
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
          show: true,
          position: 'top',
          distance: 15,
          color: '#1890ff',
          fontWeight: 'bolder',
          fontSize: 20,
        },
        data: data.map(item => {


          return item.count || 0
        }
        ),
        type: 'line'
      }]
    };
  }, [data, teacherObj])


  // 指定图表的配置项和数据

  return (
    <div className="analysis-card">

      <Chart option={option} height="500px" />
    </div>
  );
};

export default Today;