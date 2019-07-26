import {  message, Modal, Table } from "antd";
import {ModalProps} from 'antd/lib/modal';
import { PaginationProps } from "antd/lib/pagination";
import { ColumnProps, TableRowSelection } from "antd/lib/table";
import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Dispatch } from "redux";
import * as enums from "../../../../const/enum";
import { ICourse } from "../../../../const/type/course";
import * as action from '../../../../store/actions/course'
import formatDate from "../../../../utils/format-date";

import {IFilter, IParmas} from '../../../../common/hooks/featchApiList'
const { useState, useEffect } = React;

interface IProps extends ModalProps{
  onGetList: (params: any) => void
  loading: boolean
  total: number
  onSelect: (params: object[]) => void
  data: ICourse[]
  id: string
}

const columns: Array<ColumnProps<ICourse>> = [
  {
    title: "课程",
    dataIndex: "name",
    render: (val: string, row: any) => {
      return <Link to={`edit/${row._id}`}>{val}</Link>;
    }
  },
  {
    title: "一周",
    dataIndex: "day",
    filterMultiple: false,
    filters: Object.keys(enums.WEEK_LABEL).map(key => ({text: enums.WEEK_LABEL[key], value: key})),
    render: (str: enums.WEEK) => (
      <span>{enums.WEEK_LABEL[str]}</span>
    )
  },
  {
    title: "一天",
    dataIndex: "time",
    filterMultiple: false,
    filters: Object.keys(enums.DAY_LABEL).map(key => ({text: enums.DAY_LABEL[key], value: key})),
    render: (str: enums.DAY) => (
      <span>{enums.DAY_LABEL[str]}</span>
    )
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
    filterMultiple: false,
    filters: Object.keys(enums.COURSE_STATUS_LABEL).map(key => ({text: enums.COURSE_STATUS_LABEL[key], value: key})),
    render: (str: enums.COURSE_STATUS) => (
      <span>{enums.COURSE_STATUS_LABEL[str]}</span>
    )
  }
];

/**
 * 页码
 */
const initPagination: PaginationProps = {
  total: 0,
  current: 1,
  pageSize: 10
}
/**
 *
 * @param props 选择项
 */
const initSelectedRows: object[] = []



const List: React.FC<IProps> =  (props) => {
  const {
    onSelect,
    onGetList,
    loading,
    total,
    data,
    ...resetProps} = props

  const initCondition: QueryCondition<ICourse> = {
    query: {
      studentIds: {
        $nin: [props.id]
      }
    }
  }

  // 模态框
  const [modalPagination, setModalPagination] = useState(initPagination);

  // 选择项
  const [tableSelectedRows, setTableSelectedRows] = useState(initSelectedRows);


  /**
   * 模态框的condition
   * @param param
   */
  const getcondition = ({
    dateStr,
    keyword,
    filters,
    sorter,
    pager,
  }: Partial<IParmas<ICourse>>):QueryCondition<ICourse> => {
    const query: any = {
      ...(initCondition.query ? initCondition.query : {})
    };
    // 时间
    if (dateStr && dateStr[0] && dateStr[1]) {
      query.createDate = {
        $gte: `${dateStr[0]}T00:00:00.216Z`,
        $lte: `${dateStr[1]}T00:00:00.216Z`
      };
    }

    // 过滤器
    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        if (!value || !Array.isArray(value)) {
          continue;
        }
        const [val] = value;
        if (!val) {
          continue;
        }
        query[key] = val;
      }
    }


    // 名字的搜索
    const like: any = {};
    if (keyword) {
      like.name = keyword;
    }

    // 排序
    const sort: any = { createDate: -1 };
    if (sorter && sorter.columnKey) {
      sort[sorter.columnKey] = sorter.order === "ascend" ? 1 : -1;
    }

    const limit = pager ? pager.pageSize : modalPagination.pageSize
    const page = pager ? pager.current : modalPagination.current

    return {
      limit ,
      page,
      like,
      query,
      sort
    };
  };


  const onModalTableChange = (
    page: PaginationProps,
    filters: IFilter<ICourse>,
    sorter: any
  ) => {
    setModalPagination({
      ...modalPagination,
      ...page
    })

    const condition = getcondition({
      pager: page,
      filters,
      sorter
    })
    onGetList(condition)
  }


  useEffect(() => {
    if (props.visible) {
      // 清空selectRows
      setTableSelectedRows([])
      const condition = getcondition({
        pager: modalPagination
      })
      console.log('init fetch data')
      onGetList(condition)
    }

  }, [props.visible])


  // rowSelection objects indicates the need for row selection
  const rowSelection: TableRowSelection<ICourse> = {
    onSelect: (record, selected, selectedRows) => {
      // 当前项，当前是否选择， 当前所有选择
      console.log(selected, selectedRows);
      setTableSelectedRows(selectedRows)
    },
    onSelectAll: (selected, selectedRows) => {
      // 当前是否选择， 当前所有选择，当前项，
      console.log(selected, selectedRows);
      setTableSelectedRows(selectedRows)
    },
  };



  return (
    <Modal
    onOk={() => {
      if (!tableSelectedRows.length) {
        message.error('请选择课程')
        return
      }
      onSelect(tableSelectedRows)
    }}
    {...resetProps}>
      <Table<ICourse>
      size="small"
      columns={columns}
      rowKey="_id"
      dataSource={data}
      pagination={{
        ...modalPagination,
        total
      }}
      rowSelection={rowSelection}
      loading={loading}
      onChange={onModalTableChange}/>
    </Modal>
  );
}

// 将 reducer 中的状态插入到组件的 props 中,一定要有
const mapStateToProps = (state: any) => ({
  loading: state.course.loading,
  data: state.course.data,
  total: state.course.total
});

// 将对应action 插入到组件的 props 中， 没有的时候把dispatch传进去
const mapDispatchToProps = (dispatch: Dispatch) => ({
  onGetList: (params: any) => dispatch(action.FetchList(params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
