import { Button, DatePicker, Input, Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import * as React from 'react'
import CsvDownloader from 'react-csv-downloader';
import * as apiStatic from '../../api/statistics'
import * as api from '../../api/student'

import fetchApiHook from '../../common/hooks/featchApiList'
import { IStudent } from '../../const/type/student'


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
    fetchData,
    pagination,
    handleTableChange,
    onDateChange,
    onSearch,
    setQuery
  } = fetchApiHook(initList, api.getStudentList, {
    limit: 10,
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



  const csvColumns = columns.map(item => {
    return {
      id: item.dataIndex,
      displayName: item.title,
    }
  })


  // const fetchAllCsvData = async () => {
  //   const {data: {data}} = await api.getStudentList({
  //     limit: 10,
  //     page: 1,
  //     query: {
  //       status: 1
  //     },
  //     sort: { createDate: -1 }
  //   })
  // }




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


        <CsvDownloader
          className="mb10"
          filename="学生列表"
          columns={csvColumns}
          suffix={true}
          datas={tableData}>
          <Button
            type="primary"
            icon="download">
            导出
            </Button>
        </CsvDownloader>

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
