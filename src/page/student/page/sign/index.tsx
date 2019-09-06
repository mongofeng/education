import { Button, message, Table, Tag } from "antd";
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import { Link } from "react-router-dom";
import * as api from "../../../../api/course";
import * as apiPack from '../../../../api/student-operation'
import fetchApiHook from '../../../../common/hooks/featchApiList'
import * as enums from "../../../../const/enum";
import { ICourse } from "../../../../const/type/course";
import { ISign} from '../../../../const/type/student-operation'
import formatDate from "../../../../utils/format-date";
import SupplementModal from '../../components/common-sign-modal'
const { useState} = React;

const nowDate = new Date();


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
        render: (days: enums.WEEK[]) => {
            return days.map((key) => {
                return (
                  <Tag color="blue" key={key}>
                      {enums.WEEK_LABEL[key]}
                  </Tag>
                )
            })
        },
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
];



const initList: ICourse[] = [];

// 模态框的加载
const initModalState = {
    visible: false,
    confirmLoading: false,
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
                $lte: nowDate.toISOString()
            },
            endDate: {
                $gte: nowDate.toISOString(),
            },
            day: new Date().getDay()
        },
        sort: {
            createDate: -1
        }
    })


    /**
     * 补签
     */
    const [supplementState, setSupplementState] = useState(initModalState)
    const [courseRow, setcourseRow] = useState(null)

    const showSupplementModal = (row: ICourse) => {
        setcourseRow(row)
        setSupplementState({
            ...supplementState,
            visible: true
        })
    }

    const handleSupplementCancel = () => {
        setSupplementState({
            ...initModalState,
        })
    }

    const handleSupplementSumbit = async (values) => {
        console.log('Received values of form: ', values);
        const {
            num,
            desc
        } = values
        const {
            _id,
            name
        } = courseRow

        const params: ISign = {
            desc,
            num,
            course: [
                {
                    id: _id,
                    name,
                    count: num
                }
            ],
            studentId: props.id,
            courseName: name,
        }

        setSupplementState({
            ...supplementState,
            confirmLoading: true,
        })
        try {
            const {data: {data: result}} = await apiPack.sign(params)
            const {studentPackage, templateMsg} = result
            const str = (studentPackage.ok === 1 && studentPackage.n !== 0) ? '签到成功,成功扣除课时' : '签到失败,扣除课时失败'
            const total: number = templateMsg.reduce((tatal: number, item: {
                errcode: number
            }) => {
                return item.errcode === 0 ? tatal + 1 : tatal
            }, 0)
            message.success(`${str}, 成功推送微信消息${total}条`)
            props.update()
        } finally {
            handleSupplementCancel();
        }

    }

    const  specialClomn = [
        {
            title: "操作",
            render: (val: string, row: any) => {
                return (
                  <Button
                    type="primary"
                    icon="edit"
                    size="small"
                    onClick={() => {
                        showSupplementModal(row)
                    }}>
                      签到
                  </Button>
                );
            }
        },
    ]



    return (
        <React.Fragment>

            {/*补签模块*/}
            <SupplementModal
              title="签到"
              onCreate={handleSupplementSumbit}
              onCancel={handleSupplementCancel}
              { ...supplementState}/>

            <Table<ICourse>
                columns={columns.concat(specialClomn)}
                rowKey="_id"
                dataSource={data}
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange} />
        </React.Fragment>
    );
}

export default List;
