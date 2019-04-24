import {
  Cascader,
} from "antd";
import * as React from "react";
import { connect } from "react-redux";
import { compose, Dispatch } from "redux";
import * as action from "../../store/actions/lbs";


// tslint:disable-next-line:interface-over-type-literal
type ExternalProps = {
  lbs: any[]
  onGetList: () => void
}
// tslint:disable-next-line:no-empty-interface
interface InjectedProps {
  // placeholder?: string
}


const widthLoaction = <OriginalProps extends object>(
  Cmp: React.ComponentType<OriginalProps & InjectedProps>
) => {
  // type InternalProps = Omit<OriginalProps, keyof InternalState> & ExternalProps
  type InternalProps = OriginalProps & ExternalProps
  class Location extends React.PureComponent<InternalProps> {
    static displayName = `WithLoadinng(${Cmp.displayName})`

    componentDidMount () {
      this.props.onGetList()
    }

    render() {
      // 把剩余的props传到子组件：https://reactjs.org/warnings/unknown-prop.html
      // 过滤掉专用于这个阶组件的props属性，
      // 不应该被贯穿传递
      const {lbs, onGetList, ...resetProps} = this.props
      const props = resetProps as OriginalProps
      return <Cmp {...props} options={lbs} placeholder="请选择城市"/>
    }
  }

  return Location
}

// 将 reducer 中的状态插入到组件的 props 中,一定要有
const mapStateToProps = (state: any) => ({
  lbs: state.lbs,
});

// 将对应action 插入到组件的 props 中， 没有的时候把dispatch传进去
const mapDispatchToProps = (dispatch: Dispatch) => ({
  onGetList: () => dispatch(action.FetchList())
});

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  widthLoaction
)

export default enhance(Cascader);