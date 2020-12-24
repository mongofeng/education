import fetchTeacherHook from '@/common/hooks/teacher'
import { Breadcrumb, Button, Col, Divider, Popover, Row, Statistic, Tabs, Tag } from "antd";
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import * as api from "../../api/course";
import FieldInfo, { IField } from '../../components/Fields-info'
import * as enums from '../../const/enum'
import { ICourse } from '../../const/type/course'
import formatDate from "../../utils/format-date";
import Hour from './views/Hour'
import Student from './views/Student'
import StudentList from './views/StudentList'

import TrialStudent from './views/trial-student'
import TrialStudentList from './views/trial-student-list'
import TrialStudentCourse from './views/trial-student-course'
const { useState, useEffect } = React;
const TabPane = Tabs.TabPane;




interface IParams {
  id: string;
}

const initInfo: Partial<ICourse> = {}

const Detail: React.FC<RouteComponentProps<IParams>> = (props) => {
  const columns: IField[] = [
    {
      label: "课程名称",
      prop: "name"
    },
    {
      label: "所属老师",
      prop: "teacherId",
      render: ({ data }: { data: Required<ICourse> }) => {
        if (data.teacherId && teacherObj[data.teacherId]) {
          return teacherObj[data.teacherId]
        }
        return '-'
      }
    },
    {
      label: "上课时间",
      prop: "startTime"
    },
    {
      label: "下课时间",
      prop: "endTime"
    },
    {
      label: "一天",
      prop: "time",
      render: ({ data, field }: { data: ICourse, field: string }) => {
        return (
          <div>{enums.DAY_LABEL[data[field]]}</div>
        )
      }
    },
    {
      label: "状态",
      prop: "status",
      render: ({ data, field }: { data: ICourse, field: string }) => (
        <Tag color={data[field] === enums.COURSE_STATUS.open ? "blue" : "red"}>
          {enums.COURSE_STATUS_LABEL[data[field]]}
        </Tag>)
    },
    {
      label: "开课时间",
      prop: "startDate",
      render: ({ data }: { data: Required<ICourse> }) => (
        <span>{formatDate(data.startDate)}</span>)
    },
    {
      label: "结课时间",
      prop: "endDate",
      render: ({ data }: { data: Required<ICourse> }) => (
        <span>{formatDate(data.endDate)}</span>)
    },
    {
      label: "创建时间",
      prop: "createDate",
      render: ({ data }: { data: Required<ICourse> }) => (
        <span>{formatDate(new Date(data.createDate))}</span>)
    },
    {
      label: "更新时间",
      prop: "updateDate",
      render: ({ data }: { data: Required<ICourse> }) => (
        <span>{formatDate(new Date(data.updateDate))}</span>)
    },
    {
      label: "一周",
      prop: "day",
      render: ({ data, field }: { data: ICourse, field: string }) => {
        return (data[field] || []).map((key) => {
          return (
            <Tag color="blue" key={key}>
              {enums.WEEK_LABEL[key]}
            </Tag>
          )
        })
      }
    },
    {
      label: "备注",
      prop: "desc"
    },
  ];


  const [info, setInfo] = useState(initInfo);

  const id = props.match.params.id


  const {
    teacherObj,
  } = fetchTeacherHook()


  const fetchDetail = async () => {
    const { data: { data } } = await api.getCourse(id);
    setInfo(data)
  };



  const handleClick = () => {
    props.history.push(`../edit/${id}`)
  }


  useEffect(() => {
    fetchDetail();
  }, []);


  const [activite, setActivite] = useState('1')




  return (
    <div>
      <div className="main-title">
        <Breadcrumb className="fl">
          <Breadcrumb.Item>
            <span onClick={() => { props.history.goBack() }} style={{ cursor: 'pointer' }}>
              课程列表
            </span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            课程详情
          </Breadcrumb.Item>
        </Breadcrumb>
        <Popover content="点击编辑课程信息" trigger="hover" placement="left">
          <Button icon="edit" className="fr" onClick={handleClick} />
        </Popover>

      </div>
      <div className="content-wrap">
        <Divider orientation="left">基本信息</Divider>
        <Row>
          <Col span={16} >
            <FieldInfo fields={columns} data={info || {}} />
          </Col>
          <Col span={8} >
            <Statistic
              title={<div style={{ textAlign: 'center' }}>当前学生数量</div>}
              value={(info && info.studentIds) ? info.studentIds.length : 0}
              suffix="人"
              valueStyle={
                { fontSize: '42px', color: 'red', textAlign: 'center' }
              } />
            <Statistic
              title={<div style={{ textAlign: 'center' }}>当前试课学生数量</div>}
              value={(info && info.trialStudentIds) ? info.trialStudentIds.length : 0}
              suffix="人"
              valueStyle={
                { fontSize: '42px', color: 'green', textAlign: 'center' }
              } />
          </Col>
        </Row>



        <Tabs  className="mt10" activeKey={activite} onChange={setActivite}>
          {info && info.studentIds &&

            [(<TabPane tab="学员列表" key="1">
              <Student
                teacherId={info.teacherId}
                ids={info.studentIds}
                course={info} />
            </TabPane>),


            (<TabPane tab="添加学生" key="2">
              <StudentList courseId={id} studentIds={info.studentIds} update={fetchDetail} />
            </TabPane>)

            ]
          }


          {info && info.trialStudentIds &&

            [(<TabPane tab="试课学员列表" key="3">
              <TrialStudent
                teacherId={info.teacherId}
                ids={info.trialStudentIds}
                course={info} />
            </TabPane>),


            (<TabPane tab="添加试课学生" key="4">
              <TrialStudentList courseId={id} studentIds={info.trialStudentIds} update={fetchDetail} />
            </TabPane>)

            ]
          }

          <TabPane tab="签到记录" key="5">
            <Hour id={id} />
          </TabPane>


          <TabPane tab="试课记录" key="6">
            <TrialStudentCourse id={id} />
          </TabPane>

        </Tabs>

      </div>
    </div>
  );

}

export default Detail
