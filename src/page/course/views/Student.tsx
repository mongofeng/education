import { DatePicker, Input, Table, Button, message } from "antd";
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import { Link } from "react-router-dom";
import * as api from "../../../api/student";
import ActionModal from '../../student/components/common-sign-modal'
import * as enums from "../../../const/enum";
import { IStudent } from "../../../const/type/student";
import * as apiPack from '../../../api/student-operation'
import { ISign, ISupplement } from '../../../const/type/student-operation'
import fetchApiHook from '../../../common/hooks/featchApiList'
import { ICourse } from "../../../const/type/course";
const Search = Input.Search;
const { RangePicker } = DatePicker;

const { useState } = React;


const columns: Array<ColumnProps<IStudent>> = [
    {
      title: "姓名",
      dataIndex: "name",
      render: (val: string, row: any) => {
        return (
          <Link to={`../../student/detail/${row._id}`}>{val}</Link>
        );
      }
    },
    {
      title: "性别",
      dataIndex: "sex",
      filterMultiple: false,
      filters: [
        { text: '男', value: '1' },
        { text: '女', value: '2' },
      ],
      render: (str: enums.ESEX) => <span>{enums.SEX_LABEL[str]}</span>
    },
    {
      title: "手机号码",
      dataIndex: "phone"
    },

    {
      title: "状态",
      dataIndex: "status",
      filterMultiple: false,
      filters: [
        { text: '在读', value: '1' },
        { text: '毕业', value: '2' },
      ],
      render: (str: enums.STUDENT_STATUS) => <span>{enums.STUDENT_STATUS_LABEL[str]}</span>
    },
  ];

const initList: IStudent[] = [];

type IType = 'sign' | 'supplement'
const initType: IType = 'supplement'


// 模态框的加载
const initModalState = {
  visible: false,
  confirmLoading: false,
}

interface IProps {
  ids: string[],
  course: Partial<ICourse>
}

const List: React.FC<IProps> =  (props) => {

  const {
    loading,
    data,
    pagination,
    handleTableChange,
    onDateChange,
    onSearch,
  } = fetchApiHook(initList, api.getStudentList, {
    page: 1,
    limit: 10,
    size: 10,
    query: {
      _id: {
          $in: props.ids
      }
    },
    sort: {
      createDate: -1
    }
  })


  const [type, setType] = useState<IType>(initType)



  /**
   * 补签
   */
  const [supplementState, setSupplementState] = useState(initModalState)
  const [studentId, setStudentId] = useState<string>('')

  const showSupplementModal = (row: IStudent) => {
    setStudentId(row._id)
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
    const {
      num,
      desc
    } = values
    const {
      _id,
      name
    } = props.course



    setSupplementState({
      ...supplementState,
      confirmLoading: true,
    })
    try {
      if (type === 'supplement') {
        const params: ISupplement = {
          desc,
          num,
          course: [
            {
              id: _id,
              name,
              count: num
            }
          ],
          studentId: studentId
        }
        const {data: {data: result}} = await apiPack.supplement(params)

        const {studentPackage, templateMsg} = result
        const str = (studentPackage.ok === 1 && studentPackage.n !== 0) ? '补签成功,成功扣除课时' : '补签失败, 扣除课时失败'
        const total: number = templateMsg.reduce((tatal: number, item: {
          errcode: number
        }) => {
          return item.errcode === 0 ? tatal + 1 : tatal
        }, 0)
        message.success(`${str}, 成功推送微信消息${total}条`)
      } else if (type === 'sign') {
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
          studentId: studentId,
          courseName: name,
        }
        const {data: {data: result}} = await apiPack.sign(params)
        const {studentPackage, templateMsg} = result
        const str = (studentPackage.ok === 1 && studentPackage.n !== 0) ? '签到成功,成功扣除课时' : '签到失败,扣除课时失败'
        const total: number = templateMsg.reduce((tatal: number, item: {
          errcode: number
        }) => {
          return item.errcode === 0 ? tatal + 1 : tatal
        }, 0)
        message.success(`${str}, 成功推送微信消息${total}条`)
      } else {
        message.error('找不到当前的类型')
      }

    } finally {
      handleSupplementCancel();
    }

  }

  const specialColumn = [
    {
      title: "操作",
      render: (val: string, row: IStudent) => {
        return [
          (<Button
            key="2"
            type="primary"
            icon="form"
            className="mr5"
            size="small"
            onClick={() => {
              setType('supplement')
              showSupplementModal(row)
            }} >
            补签
          </Button>),
          (
            <Button
              key="3"
              type="primary"
              icon="edit"
              size="small"
              onClick={() => {
                setType('sign')
                showSupplementModal(row)
              }}>
              签到
            </Button>
          )
        ]
      }
    }
  ]




  return (
    <React.Fragment>
      <div className="mb10">
          <RangePicker onChange={onDateChange} />

          <Search
          className="ml10"
          placeholder="请输入学员名字"
          onSearch={onSearch}
          style={{ width: 200 }}/>

      </div>


      <Table<IStudent>
          columns={columns.concat(specialColumn)}
          rowKey="_id"
          dataSource={data}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}/>


        {/*补签模块*/}
      <ActionModal
        title={type === 'supplement' ? '补签' : '签到'}
        onCreate={handleSupplementSumbit}
        onCancel={handleSupplementCancel}
        { ...supplementState}/>
    </React.Fragment>
  );
}

export default List;
