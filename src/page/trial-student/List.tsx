import * as api from "@/api/trial-student";
import fetchApiHook from '@/common/hooks/featchApiList'
import fetchTrialStudentPackageHook from "@/common/hooks/trial-student-package";
import wechatHook from '@/common/hooks/wechatInfo'
import { TrialStudent } from "@/const/type/trial-student";
import formatDate from "@/utils/format-date";
import { DatePicker, Input, Table } from 'antd'
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
const Search = Input.Search;
const { RangePicker } = DatePicker;



const initList: TrialStudent[] = [];


function List(): JSX.Element {

  const {
    loading,
    data,
    pagination,
    handleTableChange,
    onDateChange,
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
  ];







  return (
    <div>
      <div className="main-title clearfix">
        <h2>新学生列表</h2>
   
      </div>

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
