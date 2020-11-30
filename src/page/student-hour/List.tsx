import { Button, DatePicker, Input, Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import * as React from 'react'
import * as apiStatic from '../../api/statistics'
import * as api from '../../api/student'
import fetchApiHook from '../../common/hooks/featchApiList'
import { IStudent } from '../../const/type/student'
import { downLoad } from '@/utils/excel';


const Search = Input.Search;
const { RangePicker } = DatePicker;


const { useState, useEffect } = React;

const initList: IStudent[] = [];




function List(): JSX.Element {
  const [tableData, setTableData] = useState(initList);

  const columns: Array<ColumnProps<IStudent>> = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: '总课时',
      dataIndex: 'count',
    },
    {
      title: '金额',
      dataIndex: 'amount',
    },
    {
      title: "激活课时",
      dataIndex: "activiteCount",
    },
    {
      title: "未激活课时",
      dataIndex: "unActiviteCount"
    },

    {
      title: "剩余课时",
      dataIndex: "surplus",
    },


    {
      title: "使用",
      dataIndex: "used",

    },

    {
      title: "已过期",
      dataIndex: "overdueCount",

    },
  ];

  const {
    loading,
    data,
    pagination,
    handleTableChange,
    onDateChange,
    onSearch  } = fetchApiHook(initList, api.getStudentList, {
    limit: 10,
    size: 10,
    page: 1,
    query: {
      status: 1
    },
    sort: { createDate: -1 }
  })



  useEffect(() => {
    if (data.length) {
      fetchTotalHours(data.map(item => item._id));
    }

  }, [data]);






  const fetchTotalHours = async (ids: string[]) => {
    const params = {
      studentIds: {
        $in: ids
      },
    }
    const { data: { data: packages } } = await apiStatic.caculatePackage(params as any)

    const hasMap = new Map<string, any>(packages.map((item) => {
      return [
        item._id,
        item
      ]
    }))
    setTableData(data.map((item) => {
      const total = hasMap.get(item._id) || {}
      return {
        ...item,
        ...total
      }
    }))
  }



  const downLoadXlsx = async () => {
    const header = [];
    const headerDisplay: object = { };
    columns.forEach(item => {
      header.push(item.dataIndex)
      headerDisplay[item.dataIndex] = item.title
    })
    // 获取学生列表
    const {data: {data}} = await api.getStudentList({
      limit: 10000,
      size: 10000,
      page: 1,
      query: {
        status: 1
      },
      sort: { createDate: -1 }
    })


    const params = {
      studentIds: {
        $in: data.list.map(i => i._id)
      },
    }
    // 获取数据
    const { data: { data: packages } } = await apiStatic.caculatePackage(params as any)

    const hasMap = new Map<string, any>(packages.map((item) => {
      return [
        item._id,
        item
      ]
    }))




    let sheetData = data.list.map(item => {
      const {n, _id, ...reset} = hasMap.get(item._id) || {}
      return {
        name: item.name,
        ...reset
      }
    })

    const newData = [headerDisplay, ...sheetData];

    const fileName = new Date().toLocaleDateString()
    return downLoad(
      {
        data: newData,
        opts: {header:header, skipHeader:true},
        sheetName: '统计',
        fileName: '学生课时统计'+fileName+'.xlsx'
      }
    )
  }





  return (
    <div>
      <div className="main-title clearfix">
        <h2>课时统计</h2>
      </div>

      <div className="content-wrap">
        <div className="mb10">
          <RangePicker onChange={onDateChange} />

          <Search
            className="ml10"
            placeholder="请输入学员名字"
            onSearch={onSearch}
            style={{ width: 200 }}
          />

        </div>





        <Button
          onClick={downLoadXlsx}
          className="mb10"
          type="primary"
          icon="download">
          导出
          </Button>

        <Table<IStudent>
          bordered={true}
          columns={columns}
          rowKey="_id"
          dataSource={tableData}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange} />
      </div>
    </div>
  );
}

export default List;
