import React, { useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import style from '@/pages/routes/IndexPage.css';

function BarChart({ data }){
    let [dataType, setDataType] = useState('cost');    
    return (
        <div style={{ height:'100%', position:'relative'}}>
        <div style={{ position:'absolute', right:'1rem', top:'0.5rem', zIndex:'2' }}>
            <span className={style['btn'] + ' ' + style['opacity'] + ' ' + ( dataType === 'cost' ? style['selected'] : '')} onClick={()=>setDataType('cost')}>成本</span>
            <span className={style['btn'] + ' ' + style['opacity'] + ' ' + ( dataType === 'energy' ? style['selected'] : '')} onClick={()=>setDataType('energy')}>能耗</span>
        </div>
        <ReactEcharts
            style={{ height:'100%' }}
            notMerge={true}
            option={{
                tooltip: {
                    trigger: 'axis'
                },
                title:{
                    text:'区域排名',
                    left:20,
                    top:20,
                    textStyle:{
                        color:'#fff', fontSize:14
                    }
                }, 
                grid:{
                    top:80,
                    bottom:20,
                    left:30,
                    right:20,
                    containLabel:true
                },
                xAxis: {
                    type: 'category',
                    axisTick:{ show:false },
                    axisLabel:{ color:'#b0b0b0' },
                    axisLine:{ show:false },
                    data:data.map(i=>i.attr_name)
                },
                yAxis: {
                    type: 'value',
                    name:dataType === 'cost' ? '元' : 'kwh',
                    nameTextStyle:{
                        color:'#b0b0b0'
                    },
                    nameGap:10,
                    axisTick:{ show:false },
                    axisLabel:{ color:'#b0b0b0' },
                    axisLine:{ show:false },
                    splitLine:{
                        lineStyle:{
                            color:'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                series:[{
                    type:'bar',
                    name:dataType === 'cost' ? '成本' : '能耗',
                    barWidth:14,
                    itemStyle:{ color:'#04a3fe' },
                    data:data.map((item,index)=>{
                        return (+item[dataType === 'cost' ? 'totalCost' : 'totalEnergy']).toFixed(1);
                    })
                }]
            }}
        />
        </div>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data ){
        return false;
    } else {
        return true;
    }
}
export default React.memo(BarChart, areEqual);
