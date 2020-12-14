import * as React from 'react';
import QRCode from 'qrcode'
import Button from 'antd/lib/button';
import { base64ToBlob, downLoad } from '@/utils/download';
const { useEffect, useRef } = React;

interface IProps {
  width: number
  height: number
  name?: string
  url: string
}

const QrcodeFunc = function (props: IProps) {

  const containerRef = useRef(null);



  useEffect(() => {
    // 基于准备好的dom，初始化eQrcodes实例
    QRCode.toCanvas(containerRef.current, props.url, {
      width: props.width
    })
    return () => {

    }
  }, [])


  const handleOnClick = () => {
    QRCode.toDataURL(props.url, (err, ret) => {
      if (err) {
        return
      }
      
      return downLoad(base64ToBlob(ret), `${props.name || '二维码'}.png`)
    })
  }
  return (
    <div className="clearfix">
      <canvas ref={containerRef} className="fl"></canvas>
      <Button
          className="fl ml10"
          type="primary"
          icon="vertical-align-bottom"
          onClick={handleOnClick}
        >
          下载
        </Button>
    </div>
  )
}

export default React.memo(QrcodeFunc)
