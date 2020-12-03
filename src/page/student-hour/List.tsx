import { Button, Input, Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import * as React from 'react'
import fetchApiHook from '@/common/hooks/commomStatics'
import { IStudent } from '../../const/type/student'
import { downLoad } from '@/utils/excel';
import { PaginationProps } from 'antd/lib/pagination'
import { commonQuery } from '../../api/statistics'
import { connect } from 'react-redux'
import * as enums from '../../const/enum'

const Search = Input.Search;

interface IProps {
  total: number
}



function List(props: IProps): JSX.Element {

  const columns: Array<ColumnProps<any>> = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
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
      title: '总课时',
      dataIndex: 'count',
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
      title: "已过期",
      dataIndex: "overdueCount",

    },
    {
      title: '金额',
      dataIndex: 'amount',
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (str: enums.STUDENT_STATUS, data: {student: IStudent}) => <span>{enums.STUDENT_STATUS_LABEL[data.student.status]}</span>
    },
  ];



  const initPagination: PaginationProps = React.useMemo(() => {
    console.log('use memo, page')
    return {
      total: props.total,
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: ["5", "10", "20", "100", "200", "500", "2000"]
    }
  }, [props.total])

  
   // 1为正序， -1为倒序
   const params = (params: {pager?: PaginationProps, keyword?: string}) => {
     // 起始页
    const {pager, keyword} = params
    
    const sql: string[] = [
      "{$unwind:'$studentIds'}",
      "{$group:{_id:'$studentIds', n: {$sum: 1 },amount:{$sum:'$amount'},count:{$sum:'$count'},used:{$sum:'$used'},surplus:{$sum:'$surplus'},overdueCount:{$sum:{$cond:['$beOverdue','$surplus',0]}},activiteCount:{$sum:{$cond:['$isActive','$count',0]}},unActiviteCount:{$sum:{$cond:['$isActive',0,'$count']}}}}",
      "{$lookup:{from:'student',let:{stuId:{$toObjectId:'$_id'}},pipeline:[{$match:{$expr:{$eq:['$_id','$$stuId']}}}],as:'student'}}",
      "{$project:{id:{$toString: '$_id'},student:{$arrayElemAt:['$student',0]},amount:1,count:1,used:1,surplus:1,overdueCount:1,activiteCount:1,unActiviteCount:1, n:1}}",
      JSON.stringify({
        $match : { 'student.status' : 1 }
      }),
      "{ $sort : { surplus : 1, count: -1 } }",
      
    ]

    if (keyword) {
      const match = { $match : { 'student.name' : keyword } }
      sql.push(JSON.stringify(match))
    }

    // 分页
    if (pager) {
      const skip = (pager.current - 1) * pager.pageSize
      const limit = pager.pageSize
      sql.push(JSON.stringify({$skip : skip }))
      sql.push(JSON.stringify({$limit : limit }))
    }

    

    return {
      collectionName: "student-package",
      sql
    }
  }

  

  const {loading, data, pagination, setParams, setPagination} = fetchApiHook({
    params: params({pager: initPagination}),
    page: initPagination
  })


 


  const handleTableChange = (
    page: PaginationProps,
  ) => {
    const pager = { ...pagination, ...page };
    setPagination(pager);
    setParams(params({pager: pager}))
  };


  const onSearch = (key: string) => {
    setParams(params({pager: initPagination, keyword: key}))
  }; 








  const downLoadXlsx = async () => {
    const header = [];
    const headerDisplay: object = { };
    columns.forEach(item => {
      header.push(item.dataIndex)
      headerDisplay[item.dataIndex] = item.title
    })

    const {
      data: {
        data
      }
    } = await commonQuery(params({}));

 

    let sheetData = data.map(item => {
      const {n, _id, id, student,  ...reset} = item
      return {
        name: student.name,
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
          {/* <RangePicker onChange={onDateChange} /> */}

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

        <Table<any>
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

export default connect((state: any) => {
  return {
    total: state.student.total,
  }
})(List);