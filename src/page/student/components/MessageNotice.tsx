import { Button, Input, Switch } from 'antd';
import * as React from "react";

const { TextArea } = Input;

interface IProps {
  id: string
}
const MessageNotice: React.FC<IProps> = (props) => {

  const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
  }
  return (
    <div>
      <div className="p10">
        是否开启课程推送: <Switch defaultChecked={false} onChange={onChange} />
      </div>
      
      <div className="p10">
        是否开启课时推送: <Switch defaultChecked={false} onChange={onChange} />
      </div>

      <div className="p10">
        <TextArea
          placeholder="请输入内容"
          autosize={{ minRows: 2, maxRows: 6 }}
        />
      </div>

      <div className="p10">
        <Button type="primary">Primary</Button>
      </div>

      

      
    </div>
  )
}

export default MessageNotice