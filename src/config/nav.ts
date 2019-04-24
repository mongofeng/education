

interface INavs {
  label: string
  value: string
  icon?: string
  children?: INavs[]
}


export function hasChildren (navs: INavs[], key: string) {
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
    value: 'analysis'
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
    label: '老师',
    value: 'teacher'
  },
  {
    label: '项目的技巧',
    value: 'project',
    icon: 'project',
    children: [{
      label: '路由配置',
      value: 'router-config'
    }, {
      label: '单组件过渡',
      value: 'css-transition'
    }, {
      label: '列表过渡',
      value: 'transition-group'
    }]
  }
]