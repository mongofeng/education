import * as api from "@/api/admin-wechat";
import fetchApiHook from '@/common/hooks/featchApiList'
import { IAdminWechat } from "@/const/type/admin-wechat";

import formatDate from "@/utils/format-date";
import { Button, message, Modal, Table } from 'antd'
import { ColumnProps } from "antd/lib/table";
import QrcodeCom from '@/components/Qrcode'
import * as React from "react";
import { RedirectUrl } from "@/utils/redirct";

const confirm = Modal.confirm;

const initList: IAdminWechat[] = [];


function List(): JSX.Element {

  const {
    loading,
    data,
    pagination,
    fetchData,
    handleTableChange,
  } = fetchApiHook(initList, api.getAdminWechatList)

  const host = encodeURIComponent(`${location.origin}/wechat/admin.html`)

  const url = RedirectUrl(host)



  const [visible, setVisible] = React.useState<boolean>(false)





  const columns: Array<ColumnProps<IAdminWechat>> = [
    {
      title: "微信昵称",
      dataIndex: "name",
    },

    {
      title: "openId",
      dataIndex: "openId",
    },
    {
      title: "创建时间",
      dataIndex: "createDate",
      sorter: true,
      render: (date: string) => <span>{formatDate(new Date(date))}</span>
    },
    {
      title: "操作",
      render: (val: string, row: IAdminWechat) => {

        return (<Button
          key="2"
          className="ml5"
          type="link"
          icon="delete"
          size="small"
          onClick={() => {
            onDel(row._id)
          }} />)
      }
    }
  ];


  const onDel= (id: string) => {
    confirm({
      title: '提示',
      content: '确定删除该管理员微信号?',
      onOk: async () => {
        try {
          await api.delAdminWechat(id)
          message.success('删除成功')
          fetchData(true)
        } catch (error) {
          message.error('删除失败')
        }
      },
    });

  }






  return (
    <div>
      <div className="main-title clearfix">
        <h2 className="fl">管理员微信列表</h2>
        <Button  className="fr" loading={loading} onClick={() => fetchData(true)}>
          {loading ? '刷新中' : '刷新'}
        </Button>


        <Button type="primary" className="fr mr10" onClick={() => setVisible(true)}>
          绑定微信
        </Button>

      </div>

      


      <div className="content-wrap">

        <Table<IAdminWechat>
          bordered={true}
          columns={columns}
          rowKey="_id"
          dataSource={data}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange} />
      </div>

      
        <Modal
          title="微信扫描"
          visible={visible}
          onOk={() => setVisible(false)}
          onCancel={() => setVisible(false)}>
          
          <QrcodeCom url={url} width={200} height={200}/>
        </Modal>
    </div>
  );
}

export default List;
