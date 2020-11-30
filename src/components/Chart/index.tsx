import * as React from 'react';
import echarts from 'echarts'
import { debounce } from '../../utils/util';
const { useState, useEffect, useRef } = React;

interface IProps {
  option: any
  height: string
}

const Chart =  function (props) {

  const containerRef = useRef(null);

  const [echartsInstance, setechartsInstance] = useState(null)

  useEffect(() => {
    console.log('chart重新渲染')
    if (echartsInstance && props.option) {
      echartsInstance.setOption(props.option); 
    }
    
    return () => {

    }
  }, [props.option])


  useEffect(() => {
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
      console.log(echartsInstance)
      window.removeEventListener('resize', func, false)
      myChart.dispose()

    }
  }, [])
  return (
    <div ref={containerRef} style={{width: '100%', height: props.height || '100%'}}></div>
  )
}

export default React.memo(Chart)
