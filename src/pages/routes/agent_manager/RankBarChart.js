import React, { useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import style from './AgentManager.css';

function RankBarChart({ data }){
    let seriesData = [];
    seriesData.push({
        type:'bar',
        name:'成本',
        symbol:'none',
        itemStyle:{
            color:'#3294d7',
        },
        barWidth:10,
        areaStyle:{
            color:{        
                type:'linear',
                x:0,
                y:0,
                x2:0,
                y2:1,
                colorStops: [{
                    offset: 0, color: '#3294d7' // 0% 处的颜色
                }, {
                    offset: 1, color: 'transparent' // 100% 处的颜色
                }]    
            }
        },
        data:data.map(i=>(+i.totalCost).toFixed(1))
    })
    return (
        <div style={{ height:'100%'}}>
            <ReactEcharts
                notMerge={true}
                style={{ height:'100%' }}
                option={{
                    tooltip:{
                        trigger:'axis'
                    },
                    grid:{
                        top:30,
                        bottom:6,
                        left:10,
                        right:20,
                        containLabel:true
                    },
                    xAxis: {
                        type: 'category',
                        axisTick:{ show:false },
                        axisLabel:{ color:'#b0b0b0' },
                        axisLine:{
                            show:true,
                            lineStyle:{
                                color:'rgba(18, 168, 254, 0.8)'
                            }
                        },
                        data:data.map(i=>i.attr_name)
                    },
                    yAxis: {
                        type: 'value',
                        name:'元',
                        nameTextStyle:{
                            color:'#b0b0b0'
                        },
                        nameGap:10,
                        axisTick:{ show:false },
                        axisLabel:{ color:'#b0b0b0' },
                        axisLine:{ show:false },
                        splitLine:{
                            lineStyle:{
                                type:'dashed',
                                color:'rgba(50, 148, 215, 0.3)'
                            }
                        }
                    },
                    series: seriesData
                }}
            />
        </div>
        
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data  ){
        return false;
    } else {
        return true;
    }
}

export default React.memo(RankBarChart, areEqual);