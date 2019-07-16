import { Button, message, Table } from "antd";
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import { Link } from "react-router-dom";
import * as api from "../../../api/course";
import * as apiHour from '../../../api/hour'
import fetchApiHook from '../../../common/hooks/featchApiList'
import * as enums from "../../../const/enum";
import { ICourse } from "../../../const/type/course";
import formatDate from "../../../utils/format-date";
import { getWeek } from '../../../utils/time'
import { find } from '../../../utils/util'
import ModalSignin from './Modal-Signin-Form'
const { useState, useRef } = React;

const {
    mondayTimeStarmp,
    sundayTimeStarmp,
} = getWeek()



const initList: ICourse[] = [];

// 模态框的加载
const initModalState = {
    visible: false,
    confirmLoading: false,
    id: ''
}

interface IProps {
    id: string
    name: string
    update: () => Promise<void>
}

const List: React.FC<IProps> = (props) => {

    const {
        loading,
        data,
        pagination,
        handleTableChange,
    } = fetchApiHook(initList, api.getCourserList, {
        page: 1,
        limit: 10,
        query: {
            studentIds: {
                $in: [props.id]
            },
            startDate: {
                $lte: sundayTimeStarmp
            },
            endDate: {
                $gte: mondayTimeStarmp,
            },
            day: new Date().getDay()
        },
        sort: {
            createDate: -1
        }
    })


    const formRef = useRef(null);

    // 模态框
    const [modalState, setModalState] = useState(initModalState)

    /**
     * 打开模态框
     */
    const showModal = (id: string) => {
        setModalState({
            ...modalState,
            visible: true,
            id
        })
    }


    const handleCancel = () => {
        const form = (formRef.current as any).props.form;
        form.resetFields();
        setModalState({
            ...initModalState,
        })
    }

    const handleCreate = () => {
        if (formRef.current === null) {
            return
        }
        const form = (formRef.current as any).props.form;
        form.validateFields(async (err: any, values: any) => {
            if (err) {
                return;
            }

            console.log('Received values of form: ', values);

            console.log(modalState.id)

            setModalState({
                ...modalState,
                confirmLoading: true,
            })
            try {
                const res = find(data, {
                    props: '_id',
                    value: modalState.id
                })
                if (!res) {
                    message.error('找不到课程的信息')
                    return
                }
                const { num, desc } = values
                const { id, name } = props
                const condition = {
                    name,
                    num,
                    courseId: res._id,
                    course: res.name,
                    teacherId: res.teacherId,
                    studentId: id,
                    type: enums.COURSE_HOUR_ACTION_TYPE.del,
                    classTypes: enums.COURSE_HOUR_TYPE.sign,
                    amount: 0,
                    desc: desc || '',
                }
                await apiHour.addHour(condition)
                message.success('提交成功')
                props.update()
            } finally {
                handleCancel();
            }
        });
    }


    const columns: Array<ColumnProps<ICourse>> = [
        {
            title: "课程",
            dataIndex: "name",
            render: (val: string, row: any) => {
                return <Link to={`../../course/detail/${row._id}`}>{val}</Link>;
            }
        },
        {
            title: "一周",
            dataIndex: "day",
            render: (str: enums.WEEK) => (
                <span>{enums.WEEK_LABEL[str]}</span>
            )
        },
        {
            title: "一天",
            dataIndex: "time",
            render: (str: enums.DAY) => (
                <span>{enums.DAY_LABEL[str]}</span>
            )
        },
        {
            title: "开课时间",
            dataIndex: "startDate",
            render: (date: number) => <span>{formatDate(new Date(date), {
                format: 'yyyy-MM-dd',
            })}</span>
        },
        {
            title: "结课时间",
            dataIndex: "endDate",
            render: (date: number) => <span>{formatDate(new Date(date), {
                format: 'yyyy-MM-dd',
            })}</span>
        },
        {
            title: "创建时间",
            dataIndex: "createDate",
            render: (date: string) => <span>{formatDate(new Date(date))}</span>
        },
        {
            title: "操作",
            render: (val: string, row: any) => {
                return (
                    <Button
                        type="primary"
                        icon="edit"
                        size="small"
                        onClick={() => {
                            showModal(row._id)
                        }}>
                        签到
                    </Button>
                );
            }
        },

    ];




    return (
        <React.Fragment>

            <ModalSignin
                wrappedComponentRef={formRef}
                visible={modalState.visible}
                confirmLoading={modalState.confirmLoading}
                onCancel={handleCancel}
                onCreate={handleCreate} />

            <Table<ICourse>
                columns={columns}
                rowKey="_id"
                dataSource={data}
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange} />
        </React.Fragment>
    );
}

export default List;
