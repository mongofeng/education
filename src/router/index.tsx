import { Spin } from 'antd';
import * as React from 'react';
import { renderRoutes } from 'react-router-config';
import { Redirect } from 'react-router-dom';
const { Suspense } = React
const BaseLayout = React.lazy(() => import(/* webpackChunkName: 'BaseLayout'*/ '../layout/BaseLayout'));

const Analysis = React.lazy(() => import(/* webpackChunkName: 'analysis'*/ '../page/analysis'));
const AnalysisTeacher = React.lazy(() => import(/* webpackChunkName: 'analysis'*/ '../page/analysis/teacher'));
const AnalysisTtrialClassHourCount = React.lazy(() => import(/* webpackChunkName: 'analysis'*/ '../page/analysis/trial-class-hour-count'));


const CourseLists = React.lazy(() => import(/* webpackChunkName: 'course'*/ '../page/course/List'));
const CourseForm = React.lazy(() => import(/* webpackChunkName: 'course'*/ '../page/course/Form'));
const CourseDetail = React.lazy(() => import(/* webpackChunkName: 'course'*/ '../page/course/Detail'));

const CourseList = React.lazy(() => import(/* webpackChunkName: 'course-list'*/ '../page/course-list'));

const HourList = React.lazy(() => import(/* webpackChunkName: 'hour'*/ '../page/hour/List'));
const HourDetail = React.lazy(() => import(/* webpackChunkName: 'hour'*/ '../page/hour/Detail'));

const StudentDetail = React.lazy(() => import(/* webpackChunkName: 'student'*/ '../page/student/Detail'));
const StudentForm = React.lazy(() => import(/* webpackChunkName: 'student'*/ '../page/student/Form'));
const StudentList = React.lazy(() => import(/* webpackChunkName: 'student'*/ '../page/student/List'));
const StudentComment = React.lazy(() => import(/* webpackChunkName: 'student'*/ '../page/student/page/comment/comment'));


const StudentHour = React.lazy(() => import(/* webpackChunkName: 'student-hour'*/ '../page/student-hour/List'));

const adminWechat = React.lazy(() => import(/* webpackChunkName: 'admin-wechat'*/ '../page/admin-wechat/List'));





const TeacherList = React.lazy(() => import(/* webpackChunkName: 'teacher'*/ '../page/teacher/List'));
const TeacherForm = React.lazy(() => import(/* webpackChunkName: 'teacher'*/ '../page/teacher/Form'));
const TeacherDetail = React.lazy(() => import(/* webpackChunkName: 'teacher'*/ '../page/teacher/Detail'));

const Package = React.lazy(() => import(/* webpackChunkName: 'package'*/ '../page/package/List'));
const PackageForm = React.lazy(() => import(/* webpackChunkName: 'package'*/ '../page/package/Form'));


const TrialClassRecord = React.lazy(() => import(/* webpackChunkName: 'trial-class-record'*/ '../page/trial-class-record/List'));
const TrialClassRecordForm = React.lazy(() => import(/* webpackChunkName: 'trial-class-record'*/ '../page/trial-class-record/Form'));



const User = React.lazy(() => import(/* webpackChunkName: 'User'*/ '../layout/UserLayout'));
import LoginPage from "../page/user/Login";
import Register from "../page/user/Register";




const SuspenseComponent = (Component: React.FC | any) => props => {
  return (
    <Suspense fallback={<Spin/>}>
      <Component {...props} />
    </Suspense>
  )
}

// renderRoutes 接受的是数组

const Layout = ({ route }) => (<> {renderRoutes(route.routes)} </>)

interface IPath {
  path: string
}

function handlePrefix <T extends IPath> ({routes, prefix}: {routes: T[], prefix: string}): T[]  {
  return routes.map(i => {
    return {
      ...i,
      path: prefix + i.path,
      
    }
  })
}


function RedirectRoute ({path, redirect}: {path: string, redirect: string}) {
  return {
    path,
    exact: true,
    render: () => < Redirect to={`${path}${redirect}`} />,
  };
}





const studentRoutes = [
  {
    path: "list",
    component: SuspenseComponent(StudentList)
  },
  {
    path: "add",
    component: SuspenseComponent(StudentForm)
  },
  
  {
    path: "edit/:id",
    component: SuspenseComponent(StudentForm)
  },
  {
    path: "detail/:id",
    component: SuspenseComponent( StudentDetail)
  },
  {
    path: "comment/:id/:courseId",
    component: SuspenseComponent(StudentComment)
  },
]

const teacherRoutes = [
  {
    path: "list",
    component: SuspenseComponent(TeacherList)
  },
  {
    path: "add",
    component: SuspenseComponent(TeacherForm)
  },
  {
    path: "edit/:id",
    component: SuspenseComponent(TeacherForm)
  },
  {
    
    path: "detail/:id",
    component: SuspenseComponent(TeacherDetail)
  },
]


const courseRoutes = [
  {
    path: "list",
    component: SuspenseComponent(CourseLists)
  },
  {
    path: "add",
    component: SuspenseComponent(CourseForm)
  },
  {
    path: "edit/:id",
    component: SuspenseComponent(CourseForm)
  },
  {
    
    path: "detail/:id",
    component: SuspenseComponent( CourseDetail)
  },
]



const packageRoutes = [
  {
    path: "list",
    component:SuspenseComponent( Package)
  },
  {
    path: "add",
    component:SuspenseComponent( PackageForm)
  },
  {
    path: "edit/:id",
    component:SuspenseComponent(PackageForm)
  },

]



const hourRoutes = [
  {
    path: "list",
    component:SuspenseComponent( HourList)
  },
  {
    path: "detail/:id",
    component:SuspenseComponent( HourDetail)
  },
]


const TrialClassRecordRoutes = [
  // trial-class-record
  {
    path: "list",
    component:SuspenseComponent( TrialClassRecord)
  },
  {
    path: "add",
    component:SuspenseComponent( TrialClassRecordForm)
  },
]


const analysisRoutes = [
  {
    path: "total",
    component: SuspenseComponent(Analysis)
  },
  {
    path: 'v-teacher',
    component: SuspenseComponent(AnalysisTeacher)
  },
  {
    path: 'trial-class-teacher',
    component: SuspenseComponent(AnalysisTtrialClassHourCount)
  },
]






export default [
  {
    path: '/',
    exact: true,
    render: () => < Redirect to={"/auth/login"} />,
  },
  {
    path: '/auth',
    component: SuspenseComponent(User),
    routes: [
      {
        path: "/auth/register",
        component: SuspenseComponent(Register),
      },
      {
        path: "/auth/login",
        component: SuspenseComponent(LoginPage),
      }
    ]
  },
  {
    path: '/base',
    component: SuspenseComponent(BaseLayout),
    routes: [
      {
        path: '/base',
        exact: true,
        render: () => < Redirect to={"/base/student"} />,
      },

      ...handlePrefix({routes: analysisRoutes, prefix: '/base/analysis/'}),
      
      
      {
        path: '/base/v-student-hour',
        component:SuspenseComponent(StudentHour),
      },
      {
        path: "/base/v-course-list",
        component:SuspenseComponent( CourseList)
      },
      {
        path: "/base/v-course-list",
        component:SuspenseComponent( CourseList)
      },
      {
        path: "/base/admin-wechat",
        component:SuspenseComponent( adminWechat)
      },

      


  

      ...handlePrefix({routes: studentRoutes, prefix: '/base/student/'}),
      RedirectRoute({path: '/base/student', redirect: '/list'}),
      ...handlePrefix({routes: teacherRoutes, prefix: '/base/teacher/'}),
      RedirectRoute({path: '/base/teacher', redirect: '/list'}),
      ...handlePrefix({routes: courseRoutes, prefix: '/base/course/'}),
      RedirectRoute({path: '/base/course', redirect: '/list'}),
      ...handlePrefix({routes: packageRoutes, prefix: '/base/package/'}),
      RedirectRoute({path: '/base/package', redirect: '/list'}),
      ...handlePrefix({routes: hourRoutes, prefix: '/base/hour/'}),
      RedirectRoute({path: '/base/hour', redirect: '/list'}),

      ...handlePrefix({routes: TrialClassRecordRoutes, prefix: '/base/trial-class-record/'}),
      RedirectRoute({path: '/base/trial-class-record', redirect: '/list'}),
      


      
      
      
    ]
  }
]
