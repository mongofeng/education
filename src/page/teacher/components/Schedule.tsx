import { DatePicker, Table, Tag } from 'antd';
import * as React from "react";
import * as api from "../../../api/course";
import * as enums from '../../../const/enum'
import { ICourse } from "../../../const/type/course";
import { getWeek } from '../../../utils/time'
const { WeekPicker } = DatePicker;
const { useState, useEffect } = React;


const cols = Reflect.ownKeys(enums.WEEK_LABEL).map(key => {
    const title = Reflect.get(enums.WEEK_LABEL, key)
    const dataIndex = enums.WEEK[key]
    return {
        title,
        dataIndex,
        render: (tags: string[]) => {
            return (
                <div>
                    {tags && tags.map(tag => {
                        const color = tag.length > 5 ? 'geekblue' : 'green';
                        return <Tag color={color} key={tag}>{tag}</Tag>;
                    })}
                </div>
            )
        },
    }
})


const columns = [{
    title: '时间',
    dataIndex: 'day',
}, ...cols];



function HandleDate(List: ICourse[]) {
    const morning: any = { key: 1, day: '上午' }
    const afternoon: any = { key: 2, day: '下午' }
    const evening: any = { key: 3, day: '晚上' }
    for (const item of List) {
        if (item.time === enums.DAY.monrning) {
            if (morning[enums.WEEK[item.day]]) {
                morning[enums.WEEK[item.day]].push(item.name)
            } else {
                morning[enums.WEEK[item.day]] = [item.name]
            }
        } else if (item.time === enums.DAY.afternoon) {
            if (afternoon[enums.WEEK[item.day]]) {
                afternoon[enums.WEEK[item.day]].push(item.name)
            } else {
                afternoon[enums.WEEK[item.day]] = [item.name]
            }
        } else if (item.time === enums.DAY.evening) {
            if (evening[enums.WEEK[item.day]]) {
                evening[enums.WEEK[item.day]].push(item.name)
            } else {
                evening[enums.WEEK[item.day]] = [item.name]
            }
        }
    }

    return [
        morning,
        afternoon,
        evening
    ]
}


interface IProps {
    id: string
}
const initList: ICourse[] = [];

const {
    mondayTimeStarmp,
    sundayTimeStarmp,
} = getWeek()

export default function (props: IProps) {
    const initCondition: any = {
        limit: 1000,
        page: 1,
        query: {
            teacherId: props.id,
            startDate: {
                $lte: sundayTimeStarmp
            },
            endDate: {
                $gte: mondayTimeStarmp,
            }
        },
        sort: { createDate: -1 }
    }

    const [data, setData] = useState(initList);
    const [loading, setLoading] = useState(false);

    const [params, setParams] = useState(initCondition)




    const onChange = (date: any, dateString: string) => {
        console.log(dateString)
        const res = getWeek(dateString)
        console.log('res:', res)

        setParams({
            ...initCondition,
            query: {
                ...initCondition.query,
                startDate: {
                    $lte: res.sundayTimeStarmp
                },
                endDate: {
                    $gte: res.mondayTimeStarmp,
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
            setData(list);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, [params]);


    const tableData = HandleDate(data)
    return (
        <React.Fragment>
            <div className="mb10">
                <WeekPicker onChange={onChange} format="YYYY-MM-DD" />

            </div>
            <Table columns={columns} dataSource={tableData} bordered={true} loading={loading} />
        </React.Fragment>
    )
}
