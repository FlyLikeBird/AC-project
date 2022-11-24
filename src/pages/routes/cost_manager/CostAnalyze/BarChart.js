import React from 'react';
import ReactEcharts from 'echarts-for-react';

function BarChart({ activeKey, data }){
    let textColor = '#b0b0b0';
    let seriesData = [];
    seriesData.push({
        type:'bar',
        barWidth:10,
        name: activeKey === 'cost' || activeKey === 'temp' ? '成本' : '能耗',
        itemStyle:{ color:'#04a3fe' },
        data: activeKey === 'cost' || activeKey === 'temp' ? data.cost : data.energy
    });
    seriesData.push({
        type:'line',
        symbol:'none',
        smooth:true,
        name: activeKey === 'temp' ? '温度' : '开机时长',
        itemStyle:{ color:'#af2aff' },
        lineStyle:{ width:3 },
        areaStyle:{
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: 'rgba(175, 42, 255, 0.3)' // 0% 处的颜色
                }, {
                    offset: 1, color: 'transparent' // 100% 处的颜色
                }],
            }
        },
        data: activeKey === 'temp' ? data.temp : data.work,
        yAxisIndex:1
    })
    return (
        <ReactEcharts 
            style={{ height:'100%' }}
            notMerge={true}
            option={{
                tooltip:{
                    trigger:'axis'
                },
                legend:{
                    left:'center',
                    top:'20px',
                    textStyle:{ color:textColor },
                    data:seriesData.map(i=>i.name)
                },
                xAxis: {
                    type: 'category',
                    axisTick:{ show:false },
                    data:data.date,
                    axisLabel:{
                        color:textColor,
                    }
                },
                grid:{
                    top:50,
                    bottom:20,
                    left:40,
                    right:30,
                    containLabel:true
                },
                yAxis:[
                {
                    type: 'value',
                    name:'kwh',
                    nameTextStyle:{ color:textColor },
                    axisLabel:{ color:textColor },
                    axisLine:{ show:false },
                    axisTick:{ show:false },
                    splitLine:{
                        show:true,
                        lineStyle:{
                            color:'#22264b'
                        }
                    }
                },
                {
                    type: 'value',
                    name: activeKey === 'temp' ? '℃' : 'h',
                    nameTextStyle:{ color:textColor },
                    axisLabel:{ color:textColor },
                    axisLine:{ show:false },
                    axisTick:{ show:false },
                    minInterval:1,
                    splitLine:{
                        show:false,
                        lineStyle:{
                            color:'#22264b'
                        }
                    }
                }
                ],
                series:seriesData
            }}
        />
    )
}
function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data || prevProps.activeKey !== nextProps.activeKey ){
        return false;
    } else {
        return true;
    }
}
export default React.memo(BarChart, areEqual);