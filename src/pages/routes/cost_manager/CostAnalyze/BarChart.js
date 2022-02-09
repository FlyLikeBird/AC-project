import React from 'react';
import ReactEcharts from 'echarts-for-react';
let pattern = /\s/g;
// console.log(data);
let category = [], data1 = [], data2 = [];
for ( var i=0;i<24;i++){
    category.push(i);
    data1.push(Math.round(Math.random() * 4000) );
    data2.push(Math.round(Math.random() * 23));
}

function BarChart({ activeKey }){
    let textColor = '#b0b0b0';
    let seriesData = [];
    seriesData.push({
        type:'bar',
        barWidth:10,
        name:'能耗',
        itemStyle:{ color:'#04a3fe' },
        data:data1,
        yAxisIndex:0,
        z:4
    });
    seriesData.push({
        type:'line',
        symbol:'none',
        smooth:true,
        name:'开机时长',
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
        data:data2,
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
                xAxis: {
                    type: 'category',
                    axisTick:{ show:false },
                    data:category,
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
                    splitNumber:8,
                    splitLine:{
                        show:true,
                        lineStyle:{
                            color:'#22264b'
                        }
                    }
                },
                {
                    type: 'value',
                    name:'h',
                    nameTextStyle:{ color:textColor },
                    axisLabel:{ color:textColor },
                    axisLine:{ show:false },
                    axisTick:{ show:false },
                    splitNumber:8,
                    splitLine:{
                        show:true,
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
    if ( prevProps.data !== nextProps.data ){
        return false;
    } else {
        return true;
    }
}
export default React.memo(BarChart, areEqual);