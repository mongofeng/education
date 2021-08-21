import { downLoad } from '@/utils/excel';
import { Button, DatePicker, Input, Table, Tag } from 'antd'
import { ColumnProps } from "antd/lib/table";
import dayjs from 'dayjs';
import * as React from "react";
import * as api from "../../../../api/hour";
import fetchApiHook from '../../../../common/hooks/featchApiList'
import * as enums from "../../../../const/enum";
import { IHour } from "../../../../const/type/hour";
import { ICourse } from '../../../../const/type/student-operation'
import formatDate from "../../../../utils/format-date";
const { RangePicker } = DatePicker;
const Search = Input.Search;
const columns: Array<ColumnProps<IHour>> = [
  {
    title: "课时数量",
    dataIndex: "num",
  },
  {
    title: "操作类型",
    dataIndex: "type",
    filterMultiple: false,
    filters: Object.keys(enums.COURSE_HOUR_ACTION_TYPE_LABEL).map(key => ({ text: enums.COURSE_HOUR_ACTION_TYPE_LABEL[key], value: key })),
    render: (str: enums.COURSE_HOUR_ACTION_TYPE) => {
      return (
        <Tag color={enums.COURSE_HOUR_ACTION_TYPE_COLOR[str]}>
          {enums.COURSE_HOUR_ACTION_TYPE_LABEL[str]}
        </Tag>
      )
    }
  },
  {
    title: "课程",
    dataIndex: "course",
    render: (val: ICourse[]) => {
      if (!val || !val.length) {
        return '-'
      }
      return val.map((item) => {
        return [
          (
            <div key={item.id}>
              {`${item.name}:${item.count}课时`}
            </div>
          )
        ]
      })
    }
  },
  {
    title: "备注",
    dataIndex: "desc",
  },
  {
    title: "创建时间",
    dataIndex: "createDate",
    sorter: true,
    render: (date: string) => <span>{formatDate(new Date(date))}</span>
  }
];

const initList: IHour[] = [];

interface IProps {
  id: string
  name: string
  update: () => Promise<void>
}


function List(props: IProps): JSX.Element {

  const {
    loading,
    data,
    pagination,
    onDateChange,
    onSearch,
    handleTableChange,
  } = fetchApiHook(initList, api.getHourrList, {
    page: 1,
    limit: 10,
    size: 10,
    query: {
      studentId: props.id
    },
    sort: {
      createDate: -1
    }
  })


  const downLoadXlsx = React.useCallback(async () => {
    const header = [
      'name',
      'num',
      'type',
      'course',
      'desc',
      'createDate'
    ];
    const headerDisplay: object = {
      name: '学员',
      num: '课时',
      type: '类型',
      course: '课程',
      desc: '备注',
      createDate: '创建时间'
    };




    const {
      data: {
        data: { list }
      }
    } = await api.getHourrList({
      page: 1,
      size: pagination.total,
      query: {
        type: {
          $in: [enums.COURSE_HOUR_ACTION_TYPE.supplement, enums.COURSE_HOUR_ACTION_TYPE.sign]
        },
        studentId: props.id
      },
      sort: {
        createDate: -1
      }
    });



    const sheetData = list.map(item => {
      const { num, type, course, desc } = item
      return {
        name: props.name,
        num,
        desc,
        course: course.map(i => {
          return `${i.name}:${i.count}课时`
        }).join(','),
        type: enums.COURSE_HOUR_ACTION_TYPE_LABEL[type],
        createDate: dayjs(item.createDate).format('YYYY-MM-DD HH:mm:ss')
      }
    })

    const newData = [headerDisplay, ...sheetData];

    const fileName = new Date().toLocaleDateString()
    return downLoad(
      {
        data: newData,
        opts: { header, skipHeader: true },
        sheetName: '统计',
        fileName: props.name + '课时统计' + fileName + '.xlsx'
      }
    )
  }, [pagination.total, props.id])



  return (
    <React.Fragment>
      <div className="mb10 clearfix">
        <RangePicker onChange={onDateChange} />

        <Search
          className="ml10"
          placeholder="请输入课程名字"
          onSearch={onSearch}
          style={{ width: 200 }} />

        <Button
          className="fr"
          onClick={downLoadXlsx}
          type="primary"
          icon="download">
          下载
        </Button>
      </div>

      <Table<IHour>
        bordered={true}
        columns={columns}
        rowKey="_id"
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange} />
    </React.Fragment>
  );
}

export default List;
