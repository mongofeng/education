import { Breadcrumb, Button, Col, Divider, Icon, message, Modal, Popover, Row, Statistic, Tabs, Tag } from "antd";
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import * as apiStatic from '../../api/statistics'
import * as api from "../../api/student";
import * as apiPack from '../../api/student-package'
import { default as FieldInfo, IField } from '../../components/Fields-info'
import * as enums from '../../const/enum'
import { IStudent } from '../../const/type/student'
import formatDate from "../../utils/format-date";
import Course from './page/course'
import Hours from './page/hour'

import getAge from '../../utils/getAge'
import Schedule from './page/shchedule'
import SignIn from './page/sign'
import StudentPakcage from './page/student-package' // 课程包
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;



interface IParams {
  id: string;
}


const columns: IField[] = [
  {
    label: "姓名",
    prop: "name",
  },
  {
    label: "生日",
    prop: "birthday",
  },
  {
    label: "联系人",
    prop: "contacts",
  },
  {
    label: "性别",
    prop: "sex",
    render: ({ data, field }: { data: IStudent, field: string }) => <span>{enums.SEX_LABEL[data[field]]}</span>
  },
  {
    label: "年龄",
    prop: "age",
    render: ({ data, field }: { data: IStudent, field: string }) => <span>{getAge(data.birthday)}</span>
  },
  {
    label: "手机号码",
    prop: "phone"
  },
  {
    label: "地址",
    prop: "address",
    render: ({ data }: { data: IStudent }) => {
      const { province, city, region, address } = data
      const adress = `${province}${city}${region}${address}`
      return (
        <span>
          {adress}
        </span>
      )
    }
  },
  {
    label: "teacherId",
    prop: "teacherId",
  },
  {
    label: "状态",
    prop: "status",
    render: ({ data, field }: { data: IStudent, field: string }) => (
      <Tag color={data[field] === enums.STUDENT_STATUS.reading ? "blue" : "red"}>
        {enums.STUDENT_STATUS_LABEL[data[field]]}
      </Tag>)
  },
  {
    label: "创建时间",
    prop: "createDate",
    render: ({ data }: { data: Required<IStudent> }) => <span>{formatDate(new Date(data.createDate))}</span>
  },
  {
    label: "创建时间",
    prop: "updateDate",
    render: ({ data }: { data: Required<IStudent> }) => <span>{formatDate(new Date(data.updateDate))}</span>
  },
];


function Detail(props: RouteComponentProps<IParams>): JSX.Element {
  const [info, setInfo] = React.useState({} as IStudent);
  const [staticTotal, setStaticTotal] = React.useState({
    count: 0,
    surplus: 0,
    used: 0,
    amount: 0,
    unActiviteCount: 0,
    activiteCount: 0,
    overdueCount: 0,
  })

  const fetchDetail = async () => {
    const { data: { data } } = await api.getStudent(props.match.params.id);
    setInfo(data)
  };


  /**
   *
   * @param id 用户id
   * 重置微信
   */
  const resetOpenId = async ({id, openId}: {id: string; openId: string}) => {
    confirm({
      title: "确定操作?",
      content: `重置后需要重新绑定微信`,
      onOk: async () => {
        const params: string[] = info.openId.filter(key => key !== openId)
        await api.updateStudent(id, {
          openId: params
        });
        message.success("重置微信号成功");
        fetchDetail();
      }
    });
  }


  const special = [
    {
      label: "微信",
      prop: "openId",
      render: ({ data, field }: { data: IStudent, field: string }) => {
        if (data[field] && data[field].length) {
          console.log(data[field])
          return  data[field].map(id => {
            return (
              <div key={id}>
                <span key="1">{id.slice(0, 20)}</span>
                <Button
                  onClick={() => { resetOpenId({
                    id: data._id,
                    openId: id
                  }) }}
                  key="2"
                  className="ml10"
                  type="link"
                  icon="delete"
                  size="small" />
              </div>
            )
          })
        }
        return <div>暂无绑定</div>
      }
    },
  ]


  const handleClick = () => {
    props.history.push(`../edit/${props.match.params.id}`)
  }


  const fetchTotalHours = async () => {
    const params = {
      studentIds: props.match.params.id,
    }
    const { data: { data } } = await apiStatic.caculatePackage(params as any)
    const [target] = data

    if (!target) {
      return;
    }

    const {
      amount,
      count,
      used,
      surplus,
      overdueCount,
      activiteCount,
      unActiviteCount,
    } = target

    setStaticTotal({
      amount,
      count,
      used,
      surplus,
      overdueCount,
      activiteCount,
      unActiviteCount,
    })
  }


  React.useEffect(() => {
    fetchDetail();
    fetchTotalHours()
  }, [])


  const { id } = props.match.params
  const hourProps = {
    update: fetchTotalHours,
    id,
    name: (info as any).name || ''
  }

  return (
    <React.Fragment>
      <div className="main-title">
        <Breadcrumb className="fl">
          <Breadcrumb.Item>
            <span
              onClick={() => { props.history.goBack() }}
              style={{ cursor: 'pointer' }}>
              学员列表
            </span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            学员详情
          </Breadcrumb.Item>
        </Breadcrumb>
        <Popover content="点击编辑学员信息" trigger="hover" placement="left">
          <Button icon="edit" className="fr" onClick={handleClick} />
        </Popover>

      </div>
      <div className="content-wrap">
        <Divider orientation="left">基本信息</Divider>
        <Row style={{ display: 'flex', alignItems: 'center' }}>
          <Col span={16} >
            <FieldInfo
              fields={columns.concat(special)}
              data={info} />
          </Col>
          <Col span={8} >

            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="使用"
                  value={staticTotal.used}
                  suffix="课时"
                  valueStyle={{ color: 'red' }} />
              </Col>

              <Col span={12}>
                <Statistic
                  title="激活"
                  value={staticTotal.activiteCount}
                  suffix="课时"
                  valueStyle={{ color: 'red' }} />
              </Col>
            </Row>


            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="剩余"
                  value={staticTotal.surplus}
                  suffix="课时"
                  valueStyle={{ color: 'red' }} />
              </Col>
              <Col span={12}>
                <Statistic
                  title="未激活"
                  value={staticTotal.unActiviteCount}
                  valueStyle={{ color: 'red' }}
                  suffix="课时" />
              </Col>
            </Row>





            <Row gutter={16} className="mt20">
              <Col span={12}>
                <Statistic
                  title="金额"
                  value={staticTotal.amount}
                  prefix={<Icon type="fund" />}
                  suffix="元"
                  valueStyle={{ color: 'green' }} />
              </Col>

              <Col span={12}>
                <Statistic
                  title="总学时"
                  value={staticTotal.count}
                  prefix={<Icon type="like" />}
                  valueStyle={{ color: 'blue' }}
                  suffix="课时" />

              </Col>
            </Row>


            <Row gutter={16} className="mt20">
              <Col span={12}>
                <Statistic
                  title="已过期"
                  value={staticTotal.overdueCount}
                  suffix="课时"
                  valueStyle={{ color: 'red' }} />
              </Col>
            </Row>

          </Col>
        </Row>

        <Tabs defaultActiveKey="1" className="mt10">
          <TabPane tab="课程" key="1">
            <Course {...hourProps} />
          </TabPane>

          <TabPane tab="课程包" key="6">
            <StudentPakcage {...hourProps} />
          </TabPane>

          <TabPane tab="课时" key="2">
            <Hours {...hourProps} />
          </TabPane>
          <TabPane tab="课程表" key="4">
            <Schedule id={id} />
          </TabPane>

          <TabPane tab="当天课程签到表" key="5">
            <SignIn {...hourProps} />
          </TabPane>

        </Tabs>
      </div>
    </React.Fragment>
  )
}



export default Detail;
