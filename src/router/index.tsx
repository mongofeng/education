import * as React from 'react';
import { Spin } from 'antd';
import { Redirect } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
const { Suspense } = React
const BaseLayout = React.lazy(() => import(/* webpackChunkName: 'BaseLayout'*/ '../layout/BaseLayout'));

const Analysis = React.lazy(() => import(/* webpackChunkName: 'analysis'*/ '../page/analysis'));


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





const TeacherList = React.lazy(() => import(/* webpackChunkName: 'teacher'*/ '../page/teacher/List'));
const TeacherForm = React.lazy(() => import(/* webpackChunkName: 'teacher'*/ '../page/teacher/Form'));
const TeacherDetail = React.lazy(() => import(/* webpackChunkName: 'teacher'*/ '../page/teacher/Detail'));

const Package = React.lazy(() => import(/* webpackChunkName: 'package'*/ '../page/package/List'));
const PackageForm = React.lazy(() => import(/* webpackChunkName: 'package'*/ '../page/package/Form'));



const User = React.lazy(() => import(/* webpackChunkName: 'User'*/ '../layout/UserLayout'));
import LoginPage from "../page/user/Login";
import Register from "../page/user/Register";




const SuspenseComponent = (Component: React.FC | any) => props => {
  return (
    <Suspense fallback={<Spin></Spin>}>
      <Component {...props} > </Component>
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
      
      {
        path: "/base/analysis",
        component: SuspenseComponent(Analysis)
      },
      {
        path: '/base/student-hour',
        component:SuspenseComponent(StudentHour),
      },
      {
        path: "/base/course-list",
        component:SuspenseComponent( CourseList)
      },


  

      ...handlePrefix({routes: studentRoutes, prefix: '/base/student/'}),
      ...handlePrefix({routes: teacherRoutes, prefix: '/base/teacher/'}),
      ...handlePrefix({routes: courseRoutes, prefix: '/base/course/'}),
      ...handlePrefix({routes: packageRoutes, prefix: '/base/package/'}),
      ...handlePrefix({routes: hourRoutes, prefix: '/base/hour/'}),

      
      


      
      
      
    ]
  }
]
