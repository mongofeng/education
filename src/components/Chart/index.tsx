import * as React from 'react';
import echarts from 'echarts'
import { debounce } from '../../utils/util';
const { useState, useEffect, useRef } = React;

interface IProps {
  option: any
  height: string
}


export default function Chart(props) {

  const containerRef = useRef(null);

  const [echartsInstance, setechartsInstance] = useState(null)

  useEffect(() => {
    console.log('init2')
    console.log(containerRef.current)
    if (echartsInstance && props.option) {
      echartsInstance.setOption(props.option); 
    }
    
    return () => {

    }
  }, [props.option])


  useEffect(() => {
    console.log('init1')
    console.log(containerRef.current)

    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(containerRef.current);
    // // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(props.option);


    setechartsInstance(myChart)

    const func = debounce(() => {
      console.log('resize')
      myChart.resize()
    }, 300)

    window.addEventListener('resize', func, false)
    return () => {
      window.removeEventListener('resize', func, false)
      echartsInstance.dispose()

    }
  }, [])
  return (
    <div ref={containerRef} style={{width: '100%', height: props.height || '100%'}}></div>
  )
}