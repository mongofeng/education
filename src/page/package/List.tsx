import { PackageStatus, PackageStatusLabel } from '@/const/enum';
import { Button, DatePicker, Input, message, Modal, Table } from 'antd'
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Link } from "react-router-dom";
import * as api from "@/api/package";
import fetchApiHook from '@/common/hooks/featchApiList'
import { isDev } from '@/config/index'
import { IPackage } from "@/const/type/package";
import formatDate from "@/utils/format-date";
import QrcodeCom from '@/components/Qrcode'
import dayjs from 'dayjs';
import * as enums from "@/const/enum";
import { getHourrList } from '@/api/hour';
import { downLoad } from '@/utils/excel';
import { connect } from 'react-redux';
const Search = Input.Search;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;

const columns: Array<ColumnProps<IPackage>> = [
  {
    title: "名字",
    dataIndex: "name",
    render: (val: string, row: any) => {
      return <Link to={`edit/${row._id}`}>{val}</Link>;
    }
  },
  {
    title: "课时",
    dataIndex: "count",
  },

  {
    title: "销售价格",
    dataIndex: "priceAmount",
    render: (amount: number) => <span>{amount}元</span>
  },
  {
    title: "原价格",
    dataIndex: "amount",
    render: (amount: number) => <span>{amount}元</span>
  },
  {
    title: "有效期",
    dataIndex: "period",
    render: (period: number) => <span>{period}年</span>
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (s: number) => PackageStatusLabel[s]
  },
  {
    title: "创建时间",
    dataIndex: "createDate",
    sorter: true,
    render: (date: string) => <span>{formatDate(new Date(date))}</span>
  },
];

const initList: IPackage[] = [];

interface IProps extends RouteComponentProps  {
  student: {
    [key in string]: string;
  }
}

function List(props: IProps): JSX.Element {

  const {
    loading,
    data,
    pagination,
    handleTableChange,
    onDateChange,
    onSearch,
    fetchData
  } = fetchApiHook(initList, api.getPackageList)


  const [visible, setVisible] = React.useState<boolean>(false)
  const [url, setUrl] = React.useState<string>("")
  const [name, setName] = React.useState<string>("")



  const showShare = (id: string, name: string) => {
    const {
      REACT_APP_TRIAL_STUDENT_GOOD_SHARE_URL,
    } = process.env
    const path = `${location.origin}${REACT_APP_TRIAL_STUDENT_GOOD_SHARE_URL}`
    const link = path + 'share?id=' + id

    console.log(link)
    setUrl(link)
    setName(name)
  }

  const onOk = () => {
    setVisible(false)
    setName('')
  }



  /**
   * 跳转路由
   */
  const handleOnClick = () => {
    props.history.push("add");
  };


  const onDel = (id: string) => {
    confirm({
      title: '提示',
      content: '确定删除该课程包?',
      onOk: async () => {
        try {
          await api.delPackage(id)
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
      render: (val: string, row: IPackage) => {
        return [
          // (<Button
          // key="1"
          // type="link"
          // icon="delete"
          // size="small"
          // onClick={() => {
          //   onDel(row._id)
          // }} />),
          (<Button
            key="2"
            className="ml5"
            type="link"
            size="small"
            onClick={() => {
              if (row.status !== PackageStatus.UpTrial) {
                message.error('此功能只上架试用学生')
                return
              }
              showShare(row._id, row.name)
              setVisible(true)
            }} >
            微信二维码
          </Button>),
          <Button
            className="fr"
            onClick={() => downLoadXlsx(row._id, row.name)}
            type="primary"
            icon="download">
            下载
          </Button>]
      }
    }
  ]


  const Cols = isDev ? columns.concat(operate) : columns





  const downLoadXlsx = React.useCallback(async (id: string, name: string) => {
    const header = [
      'name',
      'num',
      'type',
      'desc',
      'createDate'
    ];
    const headerDisplay: object = {
      name: '学员',
      num: '课时',
      type: '类型',
      desc: '备注',
      createDate: '创建时间'
    };


    const params: any = {
      page: 1,
      size: 10000,
      query: {
        packageId: id,
        type: {
          $in: [enums.COURSE_HOUR_ACTION_TYPE.buy]
        },
      },
      sort: {
        createDate: -1
      }
    }

    const {
      data: {
        data: { list }
      }
    } = await getHourrList( params);



    const sheetData = list.map(item => {
      const { num, type, desc, studentId } = item
      return {
        name: props.student[studentId],
        num,
        desc,
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
        fileName: name + '购买' + fileName + '.xlsx'
      }
    )
  }, [props.student])


  return (
    <div>
      <div className="main-title clearfix">
        <h2>课程包列表</h2>
        <Button
          className="fr"
          type="primary"
          icon="plus"
          onClick={handleOnClick}
        >
          添加课程包
        </Button>
      </div>


      <Modal
        title="扫描购买"
        visible={visible}
        onOk={onOk}
        onCancel={onOk}>

        <QrcodeCom url={url} width={200} height={200} name={name} />
      </Modal>

      <div className="content-wrap">
        <div className="mb10">
          <RangePicker onChange={onDateChange} />

          <Search
            className="ml10"
            placeholder="请输入课程包名字"
            onSearch={onSearch}
            style={{ width: 200 }} />
        </div>

        <Table<IPackage>
          bordered={true}
          columns={Cols.concat(operate)}
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
    student: state.student.labels,
  }
})(List);
