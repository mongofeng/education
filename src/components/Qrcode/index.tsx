import * as React from 'react';
import QRCode from 'qrcode'
const { useEffect, useRef } = React;

interface IProps {
  width: number
  height: number
  url: string
}

const QrcodeFunc = function (props: IProps) {

  const containerRef = useRef(null);



  useEffect(() => {
    // 基于准备好的dom，初始化eQrcodes实例
    QRCode.toCanvas(containerRef.current, props.url, {
      width: props.width
    }, function (error) {
      if (error) console.error(error)
      console.log('success!');
    })
    return () => {

    }
  }, [])
  return (
    <canvas ref={containerRef} ></canvas>
  )
}

export default React.memo(QrcodeFunc)
