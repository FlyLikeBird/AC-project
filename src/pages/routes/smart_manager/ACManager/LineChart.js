import React from 'react';
import ReactEcharts from 'echarts-for-react';
let pattern = /\s/g;


function LineChart({ activeKey, data }){
    let textColor = '#b0b0b0';
    let seriesData = [];
    seriesData.push({
        type:'line',
        symbol:'none',
        name: activeKey === 'energy' ? '能耗' : '温度',
        itemStyle:{ color:'#04a3fe' },
        data:activeKey === 'energy' ? data.energy : data.temp 
    });
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
                yAxis:{
                    type: 'value',
                    name:activeKey === 'energy' ? 'Kwh' : '℃',
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
export default React.memo(LineChart, areEqual);