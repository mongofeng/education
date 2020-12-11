import * as api from "@/api/trial-student";
import fetchApiHook from '@/common/hooks/featchApiList'
import fetchTeacherHook from '@/common/hooks/teacher'
import { TrialStudent } from "@/const/type/trial-student";
import formatDate from "@/utils/format-date";
import { Button, DatePicker, Input, message, Modal, Table } from 'antd'
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import wechatHook from '@/common/hooks/wechatInfo'
import { Link } from "react-router-dom";
const Search = Input.Search;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;



const initList: TrialStudent[] = [];


function List(props: RouteComponentProps): JSX.Element {

  const {
    loading,
    data,
    pagination,
    handleTableChange,
    onDateChange,
    onSearch,
    fetchData
  } = fetchApiHook(initList, api.gettrialStudentList)


  const {wechat, fetchUserInfo} = wechatHook()

  React.useEffect(() => {
    fetchUserInfo(data.filter(i => !!i.openId).map(i => i.openId))
  }, [data])



  const {
    teacherObj,
  } = fetchTeacherHook()


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
      title: "创建时间",
      dataIndex: "createDate",
      sorter: true,
      render: (date: string) => <span>{formatDate(new Date(date))}</span>
    },
  ];



  /**
   * 跳转路由
   */
  const handleOnClick = () => {
    props.history.push("add");
  };




  return (
    <div>
      <div className="main-title clearfix">
        <h2>新学生列表</h2>
        <Button
          className="fr"
          type="primary"
          icon="plus"
          onClick={handleOnClick}
        >
          添加试课记录
        </Button>
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
