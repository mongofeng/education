import { Button, DatePicker, Input, Modal, Switch, Table } from "antd";
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
// import { Link } from "react-router-dom";
import * as api from "../../api/student";
import * as enums from "../../const/enum";
import { IStudent } from "../../const/type/student";
import formatDate from "../../utils/format-date";

import fetchApiHook from "../../common/hooks/featchApiList";

const Search = Input.Search;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;


const initList: IStudent[] = [];

function List(props: RouteComponentProps): JSX.Element {
  const {
    loading,
    data,
    pagination,
    handleTableChange,
    onDateChange,
    onSearch,
    fetchData
  } = fetchApiHook(initList, api.getStudentList);


  const columns: Array<ColumnProps<IStudent>> = [
    {
      title: "姓名",
      dataIndex: "name"
    },
    {
      title: "创建时间",
      dataIndex: "createDate",
      sorter: true,
      render: (date: string) => <span>{formatDate(new Date(date))}</span>
    },
    {
      title: "状态",
      dataIndex: "status",
      filterMultiple: false,
      filters: [{ text: "在读", value: "1" }, { text: "毕业", value: "2" }],
      render: (str: enums.STUDENT_STATUS) => (
        <span>{enums.STUDENT_STATUS_LABEL[str]}</span>
      )
    },
    {
      title: "是否推送消息",
      dataIndex: "isSendTemplate",
      render: (val: boolean, row: any) => {
        console.log(val, '---------------')
        return (
          <Switch
            checked={val}
            onChange={(checked: boolean) => {
              onChange(checked, row._id);
            }}
          />
        );
      }
    }
  ];

   // 开启开关
   const onChange = (checked: boolean, id: string) => {
    console.log(`switch to ${checked} ${id}`);
    confirm({
      title: "确定操作?",
      content: `消息将${checked ? '会' : '不会'}推送到学员微信上`,
      onOk: async() => {
        await api.updateStudent(id, {
          isSendTemplate: checked
        })
        
        fetchData(true)
      }
    });
  }

  /**
   * 跳转路由
   */
  const handleOnClick = () => {
    props.history.push("add");
  };


  return (
    <div>
      <div className="main-title clearfix">
        <h2>学生列表</h2>
        <Button
          className="fr"
          type="primary"
          icon="plus"
          onClick={handleOnClick}
        >
          添加老师
        </Button>
      </div>

      <div className="content-wrap">
        <div className="mb10">
          <RangePicker onChange={onDateChange} />

          <Search
            className="ml10"
            placeholder="请输入名字"
            onSearch={onSearch}
            style={{ width: 200 }}
          />
        </div>

        <Table<IStudent>
          bordered={true}
          columns={columns}
          rowKey="_id"
          dataSource={data}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
}

export default List;
