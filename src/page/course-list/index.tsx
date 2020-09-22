import { DatePicker, Table, Tag } from 'antd';
import * as React from "react";
import { Link } from "react-router-dom";
import * as api from "../../api/course";
import * as enums from '../../const/enum'
import { ICourse } from "../../const/type/course";
import { getWeek } from '../../utils/time'
const { WeekPicker } = DatePicker;
const { useState, useEffect } = React;


const cols = Reflect.ownKeys(enums.WEEK_LABEL).map(key => {
    const title = Reflect.get(enums.WEEK_LABEL, key)
    const dataIndex = enums.WEEK[key]
    return {
        title,
        dataIndex,
        render: (tags: Array<{id: string; name: string}>) => {
            return (
                <div className="point">
                    {tags && tags.map(tag => {
                        const color = tag.name.length > 5 ? 'geekblue' : 'green';
                        return (
                        <div key={tag.id} className="mb10">
                          <Link to={`/base/course/detail/${tag.id}`}  >
                            <Tag color={color} >{tag.name}</Tag>
                          </Link>
                        </div>
                        )
                    })}
                </div>
            )
        },
    }
})



const columns = [{
    title: '时间',
    dataIndex: 'day',
}, ...cols.slice(1), cols[0]];



function HandleDate(List: ICourse[], monday?: Date) {
    const morning: any = { key: 1, day: '上午' }
    const afternoon: any = { key: 2, day: '下午' }
    const evening: any = { key: 3, day: '晚上' }
    for (const item of List) {
        const endDate = new Date(item.endDate)
        for (const dayItem of item.day) {
            if (monday) {
                const currentDate  = new Date(monday.getTime())
                const  offset = (dayItem -  1) >=  0 ? (dayItem -  1) : 6
                currentDate.setDate(currentDate.getDate() + offset)

                if (endDate.getTime() < currentDate.getTime()) {
                    continue
                }
            }

            const result = {
              name: item.name,
              id: item._id
            }
            
            if (item.time === enums.DAY.monrning) {
                if (morning[enums.WEEK[dayItem]]) {
                    morning[enums.WEEK[dayItem]].push(result)
                } else {
                    morning[enums.WEEK[dayItem]] = [result]
                }
            } else if (item.time === enums.DAY.afternoon) {
                if (afternoon[enums.WEEK[dayItem]]) {
                    afternoon[enums.WEEK[dayItem]].push(result)
                } else {
                    afternoon[enums.WEEK[dayItem]] = [result]
                }
            } else if (item.time === enums.DAY.evening) {
                if (evening[enums.WEEK[dayItem]]) {
                    evening[enums.WEEK[dayItem]].push(result)
                } else {
                    evening[enums.WEEK[dayItem]] = [result]
                }
            }
        }
    }

    return [
        morning,
        afternoon,
        evening
    ]
}


const {
    monday,
    sunday,
} = getWeek()

export default function () {
    const initCondition: any = {
        limit: 1000,
        size: 1000,
        page: 1,
        query: {
            startDate: {
                $lte: sunday
            },
            endDate: {
                $gte: monday,
            },
            status: 1
        },
        sort: { createDate: -1 }
    }

    const [data, setData] = useState(HandleDate([]));
    const [loading, setLoading] = useState(false);

    const [params, setParams] = useState(initCondition)




    const onChange = (date: any, dateString: string) => {
        console.log(dateString)
        const res = getWeek(dateString)

        setParams({
            ...initCondition,
            query: {
                ...initCondition.query,
                startDate: {
                    $lte: res.sunday
                },
                endDate: {
                    $gte: res.monday,
                }
            }
        })
    }

    const fetchData = async (reset?: boolean) => {
        try {
            if (reset) {
                setParams(initCondition)
            }
            setLoading(true);
            const {
                data: {
                    data: { list }
                }
            } = await api.getCourserList(params);
            setData(HandleDate(list, params.query.endDate.$gte));
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, [params]);


    console.log(data)



    return (
      <div>
      <div className="main-title clearfix">
        <h2>本周课程列表</h2>
      </div>

      <div className="content-wrap">
      <div className="mb10">
                <WeekPicker onChange={onChange} format="YYYY-MM-DD" />

            </div>

            <Table columns={columns} dataSource={data} bordered={true} loading={loading} />
      </div>
    </div>
    )
}
