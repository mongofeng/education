import { Button, DatePicker, Input, Table   } from "antd";
import {PaginationProps} from 'antd/lib/pagination'
import { ColumnProps } from 'antd/lib/table';
import * as React from "react";
import { connect } from "react-redux";
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { Link } from "react-router-dom";
import { Dispatch } from "redux";
import * as enums from '../../const/enum'
import {IStudent} from '../../const/type/student'
import * as action from "../../store/actions/student";
import formatDate from "../../utils/format-date";
const Search = Input.Search;
const { RangePicker } = DatePicker;

interface IList extends RouteComponentProps {
  onGetList: (params: any) => void
  loading: boolean
  total: number,
  data: IStudent[]
}

type ITableFilter = Partial<Record<keyof IStudent, string[]>>
interface IState {
  redirect: boolean
  dateString: string[]
  filters: ITableFilter
  sorter: any
  keyword: string
  pagination: PaginationProps
}

const columns: Array<ColumnProps<IStudent>> = [
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
    render: (text: string, row: IStudent) => (
      <Link to={`detail/${row._id}`}>{text}</Link>
    )
  },
  {
    title: "性别",
    dataIndex: "sex",
    filterMultiple: false,
    filters: [
      { text: '男', value: '1' },
      { text: '女', value: '2' },
    ],
    render: (str: enums.ESEX) => <span>{enums.SEX_LABEL[str]}</span>
  },
  {
    title: "年龄",
    dataIndex: "age",
    
  },
  {
    title: "手机号码",
    dataIndex: "phone"
  },
  {
    title: "地址",
    dataIndex: "address",
    render: (text: string, row: IStudent) => {
      const {province, city, region} = row
      const adress = `${province}${city}${region}${text}`
      return (
        <span>
         {adress}
        </span>
      )
    }
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
    filters: [
      { text: '在读', value: '1' },
      { text: '毕业', value: '2' },
    ],
    render: (str: enums.STUDENT_STATUS) => <span>{enums.STUDENT_STATUS_LABEL[str]}</span>
  },
  {
    title: "操作",
    render: (val: string, row: any) => {
      return (
        <Link to={`edit/${row._id}`}>编辑</Link>
        
      );
    }
  }
];

class List extends React.PureComponent<IList> {
  state: IState = {
    redirect: false,
    dateString: [],
    filters: {},
    sorter: {},
    keyword: '',
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: ['5', '10', '20', '100']
    }
  };


  condition = () => {
    const query: any = {}
    // 时间
    if (this.state.dateString[0] && this.state.dateString[1]) {
      query.createDate = {
        $gte: `${this.state.dateString[0]}T00:00:00.216Z`,
        $lte: `${this.state.dateString[1]}T00:00:00.216Z`
      }
    }

    // 过滤器
    for (const [key, value] of Object.entries(this.state.filters)) {
      if (!value || !Array.isArray(value)) { continue }
        const [val] = value
        if (!val) { continue }
        query[key] = val
    }

    // 名字的搜索
    const like: any = {}
    if (this.state.keyword) {
      like.name = this.state.keyword
    }

    // 排序
    const sort = { createDate: -1 }
    const sorter = this.state.sorter
    if (this.state.sorter && this.state.sorter.columnKey) {
      sort[sorter.columnKey] = sorter.order === 'ascend' ? 1 : -1
    }

    return {
      limit: this.state.pagination.pageSize,
      page: this.state.pagination.current,
      like,
      query, 
      sort
    }
  }

  fetch = () => {
    this.props.onGetList(this.condition());
  };

  handleTableChange = (pagination: PaginationProps, filters: ITableFilter, sorter: any) => {
    const pager = { ...this.state.pagination, ...pagination };
    this.setState({
      pagination: pager,
      filters,
      sorter
    }, this.fetch);
  };

  /**
   * 跳转路由
   */
  handleOnClick = () => {
    this.setState({redirect: true});
  }

  onSearch = (keyword: string) => {
    this.setState({
      pagination: {
        ...this.state.pagination,
        current: 1,
      },
      keyword
    }, this.fetch);
  }


  onDateChange = (date: any, dateString: string[]) => {
    if (dateString[0] && dateString[1]) {
      this.setState({
        dateString,
        pagination: {
          ...this.state.pagination,
          current: 1,
        },
      }, this.fetch)
    } else {
      this.setState({
        dateString: [],
        pagination: {
          ...this.state.pagination,
          current: 1,
        },
      }, this.fetch)
    }

  }

  componentWillReceiveProps(nexProps: IList) {
    if (nexProps.total !== this.state.pagination.total) {
      this.setState({
        pagination: {
          ...this.state.pagination,
          total: nexProps.total
        }
      });
    }
  }

  componentDidMount() {
    this.fetch();
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push={true} to='add' />; 
    }
    return (
      <div>
        <div className="main-title clearfix">
          <h2>学生列表</h2>
          <Button 
            className="fr"
            type="primary"
            icon="plus"
            onClick={this.handleOnClick}>
            添加学员
          </Button>
        </div>

        <div className="content-wrap">
          <div className="mb10">
            <RangePicker onChange={this.onDateChange} />

            <Search
            className="ml10"
              placeholder="请输入名字"
              onSearch={this.onSearch}
              style={{ width: 200 }}
            />
          </div>

          <Table<IStudent>
            bordered={true}
            columns={columns}
            rowKey="_id"
            dataSource={this.props.data}
            pagination={this.state.pagination}
            loading={this.props.loading}
            onChange={this.handleTableChange}
          />
        </div>
      </div>
    );
  }
}

// 将 reducer 中的状态插入到组件的 props 中,一定要有
const mapStateToProps = (state: any) => ({
  loading: state.student.loading,
  data: state.student.data,
  total: state.student.total
});

// 将对应action 插入到组件的 props 中， 没有的时候把dispatch传进去
const mapDispatchToProps = (dispatch: Dispatch) => ({
  onGetList: (params: any) => dispatch(action.FetchList(params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
