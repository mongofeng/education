import { commonQuery } from '@/api/statistics'
import fetchTeacherHook from '@/common/hooks/teacher'
import { COURSE_HOUR_ACTION_TYPE } from '@/const/enum'
import { IHour } from '@/const/type/hour'
import { Drawer, Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import dayjs from 'dayjs'
import * as React from 'react'


export default function TimeCount (): JSX.Element {
  const [visible, setVisible] = React.useState(false)
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const {
    teacherObj,
  } = fetchTeacherHook({
    query: {},
  })


  const columns: Array<ColumnProps<IHour>> = [
    {
      title: "学员",
      dataIndex: "date",
    },

    {
      title: "所属老师",
      dataIndex: "teacherId",
      render: (teacherId: string, row) => {
  
        return teacherObj[teacherId]
      }
    },

    {
      title: "课时数量",
      dataIndex: "num",
    },]


  const params = React.useMemo(() => {
    const currentDate  = new Date()
    const  offset = 7
    currentDate.setDate(currentDate.getDate() - offset)
    const today = dayjs(currentDate).format('YYYY-MM-DD 00:00:00 +0800')
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
           _id: { date: {$dateToString: { format: '%Y-%m-%d', date: '$createDate' }}, teacherId: '$teacherId' },
          count: { $sum: '$num' },
          ids: {
            $push: {
              $toString: '$_id'
            }
          },
          week: {
            $first: {
              $dayOfWeek: '$createDate'
            }
          },
          createDate: {
            $first: '$createDate'
          },
          total: {$sum: 1}
        }
      }
    )



    // 通用的group
    const group2 = JSON.stringify(
      {
        $group: {
           _id: '$_id.date',
           createDate: {
            $first: '$createDate'
          },
          list: {
            $push: {
              teacherId: '$_id.teacherId',
              count: '$count',
              week: '$week',
              total: '$total',
              ids: '$ids',
            }
          }
        }
      }
    )


    const sort = JSON.stringify({ $sort: { createDate: -1 } })

    return {
      collectionName: 'course-hour-flow',
      sql: [
        teacherMatch,
        group,
    
        sort
      ]
    }
  }, [])


  const fetchData = async () => {

    try {
      const { data: { data } } = await commonQuery(params)
      console.warn(data)
      setData(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [params]);

  
  return (
    <div>
      <div className="main-title clearfix">
        <h2>课时流水</h2>
      </div>


      <Drawer
        title="详情"
        placement="right"
        closable={false}
        onClose={() => setVisible(false)}
        visible={visible}
      >
    
      </Drawer>

      <div className="content-wrap">




        <Table
          bordered={true}
          columns={columns}
          dataSource={data}
          rowKey="_id"
          loading={loading} ></Table>
      </div>
    </div>
  )
}