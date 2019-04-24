import * as React from 'react';
import { connect } from 'react-redux';

// / tslint:disable /——忽略该行以下所有代码出现的错误提示
// / tslint:enable /——当前ts文件重新启用tslint
// tslint:disable-line——忽略当前行代码出现的错误提示
// tslint:disable-next-line——忽略下一行代码出现的错误提示

class Test extends React.PureComponent<any> {
  public componentWillMount () {
    // tslint:disable-next-line
    console.log(this.props) // 这里的prop state就是1 和 传入dispatch，
  }
  
  public render() {
      return (
          <p>
              test
          </p>
      )
  }
}


// 注意state必须要注入，否则没有,只有dispatch,而且必须是一个对象!!!!!!
// 高阶函数返回一个可以注入store的prop的组件，依然可以接受外层的props

export default connect((state: any) => ({state}))(Test)