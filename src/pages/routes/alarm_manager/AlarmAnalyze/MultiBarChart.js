import React from 'react';
import ReactEcharts from 'echarts-for-react';

let typeMaps = {
    'fault':{ text:'故障告警', color:'#4fdff8'},
    'link':{ text:'通讯告警', color:'#ff6b6c'}
}
function MultiBarChart({ data }){
    let textColor = '#b0b0b0';
    let seriesData = [];
    
    if ( data.date ) {
        Object.keys(data).forEach(key=>{
            if ( key === 'date') return;
            seriesData.push({
                type:'bar',
                barWidth:10,
                name: typeMaps[key].text,
                itemStyle:{ color:typeMaps[key].color },
                data:data[key]
            });
        })
        
    }   
   
    return (
        <ReactEcharts 
            style={{ height:'100%' }}
            notMerge={true}
            option={{
                tooltip:{
                    trigger:'axis'
                },
                legend:{
                    show:true,
                    left:'center',
                    textStyle:{
                        color:textColor
                    },
                    top:10,
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
                    name:'次',
                    nameTextStyle:{ color:textColor },
                    axisLabel:{ color:textColor },
                    axisLine:{ show:false },
                    axisTick:{ show:false },
                    minInterval:1,
                    splitLine:{
                        show:true,
                        lineStyle:{
                            color:'#22264b'
                        }
                    }
                },
                // {
                //     type: 'value',
                //     name:'h',
                //     nameTextStyle:{ color:textColor },
                //     axisLabel:{ color:textColor },
                //     axisLine:{ show:false },
                //     axisTick:{ show:false },
                //     splitNumber:8,
                //     splitLine:{
                //         show:true,
                //         lineStyle:{
                //             color:'#22264b'
                //         }
                //     }
                // }
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
export default React.memo(MultiBarChart, areEqual);