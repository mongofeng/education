import { Button, DatePicker, Input, message, Table } from "antd";
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import * as api from "@/api/trial-student";
import fetchApiHook from '@/common/hooks/featchApiList'

import { ICourse } from "@/const/type/course";
import { TrialStudent } from "@/const/type/trial-student";

import ActionModal from '../../student/components/common-sign-modal'
import { TrialCourseSignVo } from "@/const/type/trial-course-record";
import { sign, supplement } from "@/api/trial-course-record";
const Search = Input.Search;
const { RangePicker } = DatePicker;

const { useState, useEffect } = React;


const columns: Array<ColumnProps<TrialStudent>> = [
    {
      title: "姓名",
      dataIndex: "name",
    },
    {
      title: "手机号码",
      dataIndex: "phone"
    },

    {
      title: "年龄",
      dataIndex: "age",
    },
  ];

const initList: TrialStudent[] = [];

type IType = 'sign' | 'supplement'
const initType: IType = 'supplement'


// 模态框的加载
const initModalState = {
  teacherId: '',
  visible: false,
  confirmLoading: false,
}

interface IProps {
  ids: string[],
  teacherId: string
  course: Partial<ICourse>
}

const List: React.FC<IProps> =  (props) => {

  const {
    loading,
    data,
    pagination,
    fetchData,
    handleTableChange,
    onDateChange,
    onSearch,
  } = fetchApiHook(initList, api.gettrialStudentList, {
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


  useEffect(() => {
    fetchData(true)
  }, [props.ids])



  /**
   * 补签
   */
  const [supplementState, setSupplementState] = useState(initModalState)
  const [studentId, setStudentId] = useState<string>('')

  const showSupplementModal = (row: TrialStudent) => {
    setStudentId(row._id)
    setSupplementState({
      ...supplementState,
      visible: true,
      teacherId: props.teacherId
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
      desc,
      teacherId
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
        const params: TrialCourseSignVo = {
          courseId:   _id,
          courseName: name,
          desc:       desc,
          num:        num,
          studentId:  studentId,
          teacherId: teacherId
        }
        const {data: {data: result}} = await supplement(params)

        const {isMotify, record, wechatInfo} = result
        if (isMotify) {
          const total: number = wechatInfo.errcode === 0 ? 1 :0
          message.success(`补签成功,成功扣除课时, 成功推送微信消息${total}条, 课时记录：${record._id}`)
        } else {
          message.error('补签失败, 扣除课时失败')
        }
        
      } else if (type === 'sign') {
        const params: TrialCourseSignVo = {
          courseId:   _id,
          courseName: name,
          desc:       desc,
          num:        num,
          studentId:  studentId,
          teacherId: teacherId
        }
        const {data: {data: result}} = await sign(params)
        const {isMotify, record, wechatInfo} = result
        if (isMotify) {
          const total: number = wechatInfo.errcode === 0 ? 1 :0
          message.success(`签到成功,成功扣除课时, 成功推送微信消息${total}条, 课时记录：${record._id}`)
        } else {
          message.error('签到失败, 扣除课时失败')
        }
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
      render: (val: string, row: TrialStudent) => {
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


      <Table<TrialStudent>
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
