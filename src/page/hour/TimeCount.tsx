import { getHourrList } from '@/api/hour'
import { commonQuery } from '@/api/statistics'
import fetchTeacherHook from '@/common/hooks/teacher'
import { COURSE_HOUR_ACTION_TYPE, WEEK_LABEL } from '@/const/enum'
import * as enums from '../../const/enum'
import { IHour } from '@/const/type/hour'
import formatDate from '@/utils/format-date'
import { Button, Drawer, Radio, Table, Tag } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import dayjs from 'dayjs'
import * as React from 'react'
import { connect } from 'react-redux'
import { ICourse } from '@/const/type/student-operation'

interface IProps {
  package: {
    [key in string]: string;
  };
  student: {
    [key in string]: string;
  }
  openIds: Map<string, string[]>
}

function TimeCount(props: IProps): JSX.Element {
  const [visible, setVisible] = React.useState(false)
  const [data, setData] = React.useState([]);
  const [hd, setHD] = React.useState([]);
  const [offset, setOffset] = React.useState(7);
  const [loading, setLoading] = React.useState(false);
  const offsetList = React.useMemo(() => [7, 30, 60], [])



  const {
    teacherObj,
  } = fetchTeacherHook({
    query: {},
  })


  const cols: Array<ColumnProps<IHour>> =  [
      {
        title: "学员",
        dataIndex: "studentId",
        render: (val: string) => {
          return props.student[val]
        }
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
      },
      {
        title: "操作类型",
        dataIndex: "type",
        render: (str: enums.COURSE_HOUR_ACTION_TYPE) => {
          return (
            <Tag color={enums.COURSE_HOUR_ACTION_TYPE_COLOR[str]}>
              {enums.COURSE_HOUR_ACTION_TYPE_LABEL[str]}
            </Tag>
          )
        }
      },
      {
        title: "课程",
        dataIndex: "course",
        render: (val: ICourse[]) => {
          if (!val || !val.length) {
            return '-'
          }
          return val.map((item) => {
            return [
              (
                <div key={item.id}>
                  {`${item.name}:${item.count}课时`}
                </div>
              )
            ]
          })
        }
      },
      {
        title: "创建时间",
        dataIndex: "createDate",
        render: (date: string) => formatDate(new Date(date))
      },]



  const columns: Array<ColumnProps<IHour>> = [
      {
        title: "时间",
        dataIndex: "date",
        render: (value, row: any) => {
          const obj = {
            children: value,
            props: {
              rowSpan: row.rowSpan
            },
          };
          return obj;
        },
      },

      {
        title: "周",
        dataIndex: "week",
        render: (v) => WEEK_LABEL[v - 1]
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
      },




      {
        title: "学生",
        dataIndex: "count",
        render: (value, row) => {
          return (
            <Button type="link" onClick={() => onShowDetail(row)}>{value}</Button>
          )
        }
      },

      {
        title: "合计",
        dataIndex: "total",
        render: (value, row: any) => {
          const obj = {
            children: value,
            props: {
              rowSpan: row.rowSpan
            },
          };
          return obj;
        },
      },


    ]



  const params = React.useMemo(() => {
    const currentDate = new Date()
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

    // 通用的group，Returns the day of the week for a date as a number between 1 (Sunday) and 7 (Saturday).
    const group = JSON.stringify(
      {
        $group: {
          _id: { date: { $dateToString: { format: '%Y-%m-%d', date: '$createDate' } }, teacherId: '$teacherId' },
          num: { $sum: '$num' },
          id: {
            $first: {
              $toString: '$_id'
            }
          },
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
          count: { $sum: 1 }
        }
      }
    )




    /* const group2 = JSON.stringify(
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
    ) */


    const sort = JSON.stringify({ $sort: { createDate: -1 } })

    return {
      collectionName: 'course-hour-flow',
      sql: [
        teacherMatch,
        group,

        sort
      ]
    }
  }, [offset])


  const onChange = React.useCallback((e) => {
    setOffset(e.target.value)
  }, [])


  const onShowDetail = React.useCallback((e) => {
    setVisible(true)
    fetchHourrList(e.ids)
  }, [])


  const fetchData = async () => {

    try {
      setLoading(true);
      const { data: { data } } = await commonQuery(params)

      const map = new Map()
      let v
      data.forEach(i => {
        v = map.get(i.date)
        if (v) {
          v.rowSpan += 1
          v.total += i.num

          i.rowSpan = 0
        } else {
          i.rowSpan = 1
          i.total = i.num
          map.set(i.date, i)
        }
      })

      setData(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };


  const fetchHourrList = async (ids) => {
    const params: any = {
      "size": ids.length, "limit": ids.length, "page": 1, "query": {
        _id: {
          $in: ids
        }
      }, "sort": { "createDate": -1 }
    }
    try {
      const { data: { data: { list } } } = await getHourrList(params)
      setHD(list);
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
        width={800}
        closable={true}
        onClose={() => setVisible(false)}
        visible={visible}>

        <Table
          bordered={true}
          columns={cols}
          dataSource={hd}
          rowKey="id" ></Table>

      </Drawer>

      <div className="content-wrap">

        <div style={{ marginBottom: 10 }}>
          <Radio.Group defaultValue={offset} onChange={onChange}>
            {React.useMemo(() => offsetList.map(i => {
              return <Radio.Button value={i} key={i}>{i + '天'}</Radio.Button>
            }), [offsetList])}
          </Radio.Group>
        </div>


        <Table
          bordered={true}
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading} ></Table>
      </div>
    </div>
  )
}


export default connect((state: any) => {
  return {
    student: state.student.labels,
    openIds: state.student.openIds,
    package: state.package.labels,
  }
})(TimeCount);