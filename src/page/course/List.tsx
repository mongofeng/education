import fetchTeacherHook from '@/common/hooks/teacher'
import { Button, DatePicker, Icon, Input, message, Modal, Table, Tabs, Tag } from 'antd'
import { ColumnProps, TableRowSelection } from "antd/lib/table";
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Link } from "react-router-dom";
import * as api from "../../api/course";
import * as enums from "../../const/enum";
import { ICourse } from "../../const/type/course";
import formatDate from "../../utils/format-date";

import fetchApiHook from '../../common/hooks/featchApiList'
import { isDev } from '../../config/index'
import { useState } from 'react';
const { TabPane } = Tabs;
const Search = Input.Search;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;



const initList: ICourse[] = [];


function List(props: RouteComponentProps): JSX.Element {

  /**
 *
 * @param props 选择项
 */
  const initSelectedRows: ICourse[] = []

  const columns: Array<ColumnProps<ICourse>> = [
    {
      title: "课程",
      dataIndex: "name",
      render: (val: string, row: any) => {
        return <Link to={`detail/${row._id}`}>{val}</Link>;
      }
    },
    {
      title: "老师",
      dataIndex: "teacherId",
      render: (teacherId: string) => {
        if (teacherId && teacherObj[teacherId]) {
          return teacherObj[teacherId]
        }
        return '-'
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
      title: "上课时间",
      dataIndex: "startTime"
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
      sorter: true,
      render: (date: string) => <span>{formatDate(new Date(date))}</span>
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (val: string) => {
        return enums.COURSE_STATUS_LABEL[val]
      }
    },
  ];

  const {
    loading,
    data,
    pagination,
    handleTableChange,
    onDateChange,
    onSearch,
    setQuery,
    setPagination,
    fetchData
  } = fetchApiHook(initList, api.getCourserList, {
    limit: 10,
    page: 1,
    size: 10,
    query: {
      status: enums.COURSE_STATUS.open
    },
    sort: { createDate: -1 }
  })


  const {
    teacherObj,
  } = fetchTeacherHook()



  /**
   * 跳转路由
   */
  const handleOnClick = () => {
    props.history.push("add");
  };



  const handleStatusOnClick = async (key: string) => {
    console.log(tableSelectedRows)
    const ids = tableSelectedRows.map(i => i._id)
    if (!ids.length) { return message.error('请选择课程') }

    await api.batchStatusByCourse({
      status: Number(key),
      ids
    })

    const coureseName = tableSelectedRows.map(i => i.name).join(',')


    message.success(`${coureseName}更改${enums.COURSE_STATUS_LABEL[key]}成功`)

    fetchData()

  };

  const onTabChange = (status: string) => {
    const page = {
      ...pagination,
      current: 1
    }
    setPagination(page)

    console.log('set 页数')
    console.log(pagination)
    setQuery({
      status: Number(status)
    }, page)

    setTableSelectedRows([]);
  }


  const onDel = (id: string) => {
    confirm({
      title: '提示',
      content: '确定删除该课程,请确保没有对应课时操作记录,如果有请先去清空对应课时操作记录?',
      onOk: async () => {
        try {
          await api.delCourse(id)
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
      render: (val: string, row: ICourse) => {
        if (isDev) {
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
              }} />)
          ]
        }
        return (<Link to={`edit/${row._id}`} key='1'>
          <Icon type="edit" />
        </Link>)
      }
    }
  ]




  // 选择项
  const [tableSelectedRows, setTableSelectedRows] = useState(initSelectedRows);


  // rowSelection objects indicates the need for row selection
  const rowSelection: TableRowSelection<ICourse> = {
    onSelect: (record, selected, selectedRows) => {
      // 当前项，当前是否选择， 当前所有选择
      console.log(selected, selectedRows);
      setTableSelectedRows(selectedRows as ICourse[])
    },

    onSelectAll: (selected, selectedRows) => {
      // 当前是否选择， 当前所有选择，当前项，
      console.log(selected, selectedRows);
      setTableSelectedRows(selectedRows)
    },
  };


  return (
    <div>
      <div className="main-title clearfix">
        <h2>课程列表</h2>
        <Button
          className="fr"
          type="primary"
          icon="plus"
          onClick={handleOnClick}
        >
          添加课程
        </Button>



      </div>

      <div className="content-wrap">
        <Tabs defaultActiveKey="1" onChange={onTabChange}>
          {Object.keys(enums.COURSE_STATUS_LABEL).map(key => (
            <TabPane tab={enums.COURSE_STATUS_LABEL[key]} key={key} />
          )
          )}
        </Tabs>
        <div className="mb10 clearfix">
          <RangePicker onChange={onDateChange} />

          <Search
            className="ml10"
            placeholder="请输入课程名字"
            onSearch={onSearch}
            style={{ width: 200 }}
          />


          {Object.keys(enums.COURSE_STATUS_LABEL).map(key => (
            <Button
              className="fr ml10"
              key={key}
              onClick={() => handleStatusOnClick(key)}
            >
              {enums.COURSE_STATUS_LABEL[key]}
            </Button>
          )
          )}
        </div>

        <Table<ICourse>
          bordered={true}
          columns={columns.concat(operate)}
          rowKey="_id"
          dataSource={data}
          pagination={pagination}
          loading={loading}
          rowSelection={rowSelection}
          onChange={handleTableChange} />
      </div>
    </div>
  );
}

export default List;
