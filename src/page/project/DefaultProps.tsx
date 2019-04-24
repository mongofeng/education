
import * as React from 'react'
import {withDefaultProps} from '../../utils/withDefaultProps'
// 组件

const defaultProps = {
  color: 'red',
};

type DefaultProps = typeof defaultProps;
type Props = { onClick(e: React.MouseEvent<HTMLElement>): void } & DefaultProps;

const Button: React.SFC<Props> = ({ onClick: handleClick, color, children }) => {
  console.log(children)
  return (
    <button style={{ color }} onClick={handleClick}>
      {children}
    </button>
  )
};

const ButtonWithDefaultProps = withDefaultProps(defaultProps, Button);


export default () => <ButtonWithDefaultProps onClick={() => console.log('click')}>1111</ButtonWithDefaultProps>

                                      
   
