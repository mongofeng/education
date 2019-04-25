import * as React from 'react'
import { Component, ComponentType } from 'react'

// https://juejin.im/post/5b07caf16fb9a07aa83f2977#heading-9

// tslint:disable-next-line:interface-over-type-literal
type ExternalProps = {}
// tslint:disable-next-line:interface-name
interface InjectedProps {
  isLoading: boolean
}

const withLoading = <OriginalProps extends object>(
  Cmp: ComponentType<OriginalProps & InjectedProps>
) => {
  // type InternalProps = Omit<OriginalProps, keyof InternalState> & ExternalProps
  type InternalProps = OriginalProps & ExternalProps
  // tslint:disable-next-line:interface-name
  interface InternalState { isLoading: boolean }
  class WithLoading extends Component<InternalProps, InternalState> {
    static displayName = `WithLoadinng(${Cmp.displayName})`
    state = {
      isLoading: true,
    }

    render() {
      const { isLoading } = this.state
      const {} = this.props
      const ownProps = { isLoading }
      return isLoading ? <>Loading...</> : <Cmp {...this.props} {...ownProps} />
    }
  }

  return WithLoading
}

// class User extends Component<{ name: string; age: number } & InjectedProps> {
//   render() {
//     const { age, name } = this.props
//     return (
//       <>
//         - name: {name}
//         - age: {age}
//       </>
//     )
//   }
// }

function User (props: { name: string; age: number }) {
  const { age, name } = props 
  return (
    <div>
      - name: {name}         - age: {age}
    </div>
  )
}

const EnhancedUser = withLoading(User)

////

export default () => (
  <div>
    <EnhancedUser name="sd" age={21} />
    <User name="Martin" age={31}  />
  </div>
)