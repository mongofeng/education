import * as React from 'react';
import echarts from 'echarts'
import { debounce } from '../../utils/util';
const { useEffect, useRef } = React;

interface IProps {
  option: any;
  height: string;
}

const Chart =  function (props: IProps) {

  const containerRef = useRef(null);
  const echartsInstance = useRef<any>(null)



  useEffect(() => {
    console.log('初始化渲染图表')
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(containerRef.current);
    echartsInstance.current = myChart

    const func = debounce(() => {
      console.log('resize')
      myChart.resize()
    }, 300)


    window.addEventListener('resize', func, false)
    return () => {
      console.log('图标卸载，取消时间')
      window.removeEventListener('resize', func, false)
      myChart.dispose()
    }
  }, [])


  
  useEffect(() => {
    console.log('第二个钩子渲染')
    if (echartsInstance.current && props.option) {
      echartsInstance.current.setOption(props.option); 
    } 
  }, [props.option])


  
  return (
    <div ref={containerRef} style={{width: '100%', height: props.height || '100%'}}></div>
  )
}

export default React.memo(Chart, (prev, next) => JSON.stringify(prev) === JSON.stringify(next))
