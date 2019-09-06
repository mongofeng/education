import { Button, DatePicker, Icon, Input, message, Modal, Table, Tabs } from 'antd'
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Link } from "react-router-dom";
import * as api from "../../api/teacher";
import fetchApiHook from '../../common/hooks/featchApiList'
import * as enums from "../../const/enum";
import { ITeacher } from "../../const/type/teacher";
import getAge from '../../utils/getAge'

const Search = Input.Search;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const columns: Array<ColumnProps<ITeacher>> = [
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
    render: (text: string, row: ITeacher) => (
      <Link to={`detail/${row._id}`}>{text}</Link>
    )
  },
  {
    title: "性别",
    dataIndex: "sex",
    filterMultiple: false,
    filters: [{ text: "男", value: "1" }, { text: "女", value: "2" }],
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
    filters: [{ text: "在职", value: "1" }, { text: "离职", value: "2" }],
    render: (str: enums.TEACHER_STATUS) => (
      <span>{enums.TEACHER_STATUS_LABEL[str]}</span>
    )
  },
];

const initList: ITeacher[] = [];
const confirm = Modal.confirm;

function List(props: RouteComponentProps): JSX.Element {

  const {
    loading,
    fetchData,
    data,
    pagination,
    handleTableChange,
    onDateChange,
    onSearch,
    setQuery
  } = fetchApiHook(initList, api.getteacherList, {
    limit: 10,
    page: 1,
    query: {
      status: 1
    },
    sort: { createDate: -1 }
  })



  /**
   * 跳转路由
   */
  const handleOnClick = () => {
    props.history.push("add");
  };


  const onTabChange = (status: string) => {
    setQuery({
      status: Number(status)
    })
  }


  const onDel= (id: string) => {
    confirm({
      title: '提示',
      content: '确定删除该老师,请确保没有学生,或者课程绑定该老师,如果有请先去解绑学生和课程?',
      onOk: async () => {
        try {
          await api.delteacher(id)
          message.success('删除成功')
          fetchData(true)
        } catch (error) {
          message.error('删除失败')
        }
      },
    });

  }


  const operate = [
    {
      title: "操作",
      render: (val: string, row: ITeacher) => {
        return [
          (<Link to={`edit/${row._id}`} key='1'>
            <Icon type="edit" />
          </Link>),
          (<Button
            key="2"
            className="ml5"
            type="link"
            icon="delete"
            size="small"
            onClick={() => {
              onDel(row._id)
            }} >
          </Button>)
        ]
      }
    }
  ]


  return (
    <div>
      <div className="main-title clearfix">
        <h2>老师列表</h2>
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

          <Tabs defaultActiveKey="1" onChange={onTabChange}>
            <TabPane tab="在职" key="1"/>
            <TabPane tab="离职" key="2"/>
          </Tabs>

          <RangePicker onChange={onDateChange} />

          <Search
            className="ml10"
            placeholder="请输入名字"
            onSearch={onSearch}
            style={{ width: 200 }}
          />
        </div>

        <Table<ITeacher>
          bordered={true}
          columns={columns.concat(operate)}
          rowKey="_id"
          dataSource={data}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}/>
      </div>
    </div>
  );
}

export default List;
