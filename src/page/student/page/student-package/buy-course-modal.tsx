import {  message, Modal, Table } from "antd";
import {ModalProps} from 'antd/lib/modal';
import { ColumnProps, TableRowSelection } from "antd/lib/table";
import * as React from "react";
import * as api from '../../../../api/package'
import fetchApiHook from '../../../../common/hooks/featchApiList'
import { IPackage } from '../../../../const/type/package'
import formatDate from "../../../../utils/format-date";
const { useState, useEffect } = React;

interface IProps extends ModalProps{
  onSelect: (params: object[]) => void
  id: string
}

const columns: Array<ColumnProps<IPackage>> = [
  {
    title: "名字",
    dataIndex: "name",
  },
  {
    title: "课时",
    dataIndex: "count",
  },
  {
    title: "价格",
    dataIndex: "amount",
    render: (amount: number) => <span>{amount}元</span>
  },
  {
    title: "有效期",
    dataIndex: "period",
    render: (period: number) => <span>{period}年</span>
  },
  {
    title: "创建时间",
    dataIndex: "createDate",
    sorter: true,
    render: (date: string) => <span>{formatDate(new Date(date))}</span>
  },
  {
    title: "备注",
    dataIndex: "desc",
  }
];

/**
 *
 * @param props 初始化选择项
 */
const initSelectedRows: object[] = []


const List: React.FC<IProps> =  (props) => {
  const {
    onSelect,
    ...resetProps
  } = props

  const {
    loading,
    data,
    pagination,
    handleTableChange,
  } = fetchApiHook([], api.getPackageList)


  // 选择项,选择多少个
  const [selectRows, setSelectRows] = useState(initSelectedRows);



  useEffect(() => {
    if (props.visible) {
      // 清空selectRows
      setSelectRows([])

    }

  }, [props.visible])


  // rowSelection objects indicates the need for row selection
  const rowSelection: TableRowSelection<IPackage> = {
    type: 'radio',
    onSelect: (record, selected, selectedRows) => {
      // 当前项，当前是否选择， 当前所有选择
      console.log(selected, selectedRows);
      setSelectRows(selectedRows)
    },
  };



  return (
    <Modal
      onOk={() => {
        if (!selectRows.length) {
          message.error('请选择课程包')
          return
        }
        onSelect(selectRows)
      }}
      {...resetProps}>

      <Table<IPackage>
        size="small"
        bordered={true}
        columns={columns}
        rowKey="_id"
        dataSource={data}
        pagination={pagination}
        loading={loading}
        rowSelection={rowSelection}
        onChange={handleTableChange}/>
    </Modal>
  );
}


export default List;
