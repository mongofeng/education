

interface INavs {
  label: string
  value: string
  icon?: string
  children?: INavs[]
}


export function hasChildren(navs: INavs[], key: string) {
  for (const item of navs) {
    if (item.value === key && item.children && item.children.length) {
      return true
    }
  }
  return false
}

export const Navs: INavs[] = [
  {
    label: '分析页',
    value: 'analysis',
    children: [
      {
        label: '总分析',
        value: 'total',
      },
      {
        label: '教师分析',
        value: 'v-teacher',
      },
      {
        label: '试课分析',
        value: 'trial-class-teacher'
      }
    ],
  },
  {
    label: '课时',
    value: 'hour'
  },
  {
    label: '课程',
    value: 'course'
  },
  {
    label: '学员',
    value: 'student'
  },
  {
    label: '课时统计',
    value: 'v-student-hour',
  },
  {
    label: '老师',
    value: 'teacher'
  },
  {
    label: '本周课程表',
    value: 'v-course-list'
  },
  {
    label: '课程包',
    value: 'package'
  },
  {
    label: '试课课时',
    value: 'trial-class-record'
  }
]