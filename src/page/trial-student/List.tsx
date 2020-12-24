import * as api from "@/api/trial-student";
import fetchApiHook from '@/common/hooks/featchApiList'
import fetchTrialStudentPackageHook from "@/common/hooks/trial-student-package";
import wechatHook from '@/common/hooks/wechatInfo'
import { TrialStudent } from "@/const/type/trial-student";
import formatDate from "@/utils/format-date";
import { Button, DatePicker, Input, message, Table } from 'antd'
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import { useState } from "react";
import BuyCourse from '@/components/Course/buy-course-modal'
import { IStudentPackage } from "@/const/type/student-package";
import { addPackage } from "@/api/trial-student-package";
const Search = Input.Search;
const { RangePicker } = DatePicker;


// 模态框的加载
const initModalState = {
  visible: false,
  confirmLoading: false,
}
const initList: TrialStudent[] = [];


function List(): JSX.Element {

  const {
    loading,
    data,
    pagination,
    handleTableChange,
    onDateChange,
    fetchData,
    onSearch  } = fetchApiHook(initList, api.gettrialStudentList)


  const {wechat, fetchUserInfo} = wechatHook()

  const {
    TrialStudentPakageObj,
    fetchTrialStudentPakage
  } = fetchTrialStudentPackageHook()

  React.useEffect(() => {
    fetchUserInfo(data.filter(i => !!i.openId).map(i => i.openId))
    fetchTrialStudentPakage(data.filter(i => !!i._id).map(i => i.id))
  }, [data])




  const columns: Array<ColumnProps<TrialStudent>> = [
    {
      title: "学生",
      dataIndex: "name",
    },
    

    {
      title: "年龄",
      dataIndex: "age",
    },


    {
      title: "手机",
      dataIndex: "phone",
    },

    {
      title: "微信",
      dataIndex: "openId",
      render: (str: string) => wechat[str] || str
    },

    {
      title: "总课时",
      dataIndex: "count",
      render: (str: string, data: TrialStudent) => TrialStudentPakageObj[data.id] && TrialStudentPakageObj[data.id].count 
    },

    {
      title: "使用课时",
      dataIndex: "used",
      render: (str: string, data: TrialStudent) => TrialStudentPakageObj[data.id] && TrialStudentPakageObj[data.id].used 
    },



   
    {
      title: "创建时间",
      dataIndex: "createDate",
      sorter: true,
      render: (date: string) => <span>{formatDate(new Date(date))}</span>
    },
    {
      title: '操作',
      dataIndex: "operate",
      render: (str: string, data: TrialStudent) => {
        return <Button
        className="fr"
        type="primary"
        icon="plus"
        onClick={() => {
          setCurrentId(data.id)
          showModal()
        }}>
        购买
      </Button>
      } 
    }
  ];

  // 模态框
  const [modalState, setModalState] = useState(initModalState)
  const [currentId, setCurrentId] = useState('')

   /**
   * 添加课程包
   */
  const showModal = () => {
    setModalState({
      ...modalState,
      visible: true
    })
  }


  /**
   * 取消模态框
   */
  const handleCancel = () => {
    setModalState({
      ...modalState,
      visible: false
    })
  }

  /**
   * 确定模态框
   */
  const handleOk = async (selectRows: IStudentPackage[]) => {
    // 打开loading
    if (!selectRows.length) { return }
    setModalState({
      ...modalState,
      confirmLoading: true,
    })
    try {
      const [res] = selectRows
      const params = {
        packageId: res._id,
        studentId: currentId
      }
      await addPackage(params)
      message.success('关联成功')
      fetchData(true)
    } finally {
      setModalState({
        ...initModalState,
      })
    }
  }







  return (
    <div>
      <div className="main-title clearfix">
        <h2>新学生列表</h2>
   
      </div>

      <BuyCourse
        title="添加课程包"
        width={800}
        destroyOnClose={true}
        onSelect={handleOk}
        onCancel={handleCancel}
        {...modalState} />

      <div className="content-wrap">
        <div className="mb10">
          <RangePicker onChange={onDateChange} />

          <Search
            className="ml10"
            placeholder="请输入学生名字"
            onSearch={onSearch}
            style={{ width: 200 }} />
        </div>

        <Table<TrialStudent>
          bordered={true}
          columns={columns}
          rowKey="_id"
          dataSource={data}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange} />
      </div>
    </div>
  );
}

export default List;
