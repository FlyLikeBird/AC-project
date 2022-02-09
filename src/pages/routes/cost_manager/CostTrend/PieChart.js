import React from 'react';
import ReactEcharts from 'echarts-for-react';

let stylesMap = {
    '1':{
        type:'linear',
        x:0,
        y:0,
        x2:1,
        y2:0,
        colorStops: [{
            offset: 0, color: '#4cbaf7' // 0% 处的颜色
        }, {
            offset: 1, color: '#4ce6e6' // 100% 处的颜色
        }],
        
    },
    '2':{
        type:'linear',
        x:0,
        y:0,
        x2:1,
        y2:0,
        colorStops: [{
            offset: 0, color: '#851af9' // 0% 处的颜色
        }, {
            offset: 1, color: '#a91dfb' // 100% 处的颜色
        }],
    },
    '3':{
        type:'linear',
        x:0,
        y:0,
        x2:1,
        y2:0,
        colorStops: [{
            offset: 0, color: '#ff9f48' // 0% 处的颜色
        }, {
            offset: 1, color: '#ffb455' // 100% 处的颜色
        }],
    },
    '4':{
        type:'linear',
        x:0,
        y:0,
        x2:1,
        y2:0,
        colorStops: [{
            offset: 0, color: '#525286' // 0% 处的颜色
        }, {
            offset: 1, color: '#7a7ab3' // 100% 处的颜色
        }],
    },
} 

function PieChart({ data, title }){
    data = {
        'TCL':1646,
        '格力':1235,
        '奥克斯':955,
        '美的':321,
        '松下':56
    };
    let seriesData = [];
    let num = 0;
    Object.keys(data).forEach(key=>{
        num += data[key];
        seriesData.push({ value:data[key], name:key });
    });
    return (
        <ReactEcharts
            style={{ height:'100%' }}
            notMerge={true}
            option={{
                tooltip: {
                    trigger: 'item'
                },
                title:{
                    text:'品牌类型分析',
                    left:20,
                    top:20,
                    textStyle:{
                        color:'#fff', fontSize:14
                    }
                }, 
                legend: {
                    show:true,
                    left:'54%',
                    top:'center',
                    orient:'vertical',
                    data:seriesData.map(i=>i.name),
                    icon:'circle',
                    itemWidth:10,
                    itemHeight:10,
                    formatter:(name)=>{
                        let temp = seriesData.filter(i=>i.name === name)[0];
                        // let temp = findData(name, seriesData);
                        let ratio = num ? (temp.value / num * 100).toFixed(1) : 0.0;
                        return `{title|${name}}{line|}{value|${temp.value}}{unit|kwh}`
                    },
                    textStyle:{
                        rich: {
                            title: {
                                width:60,
                                fontSize: 12,
                                lineHeight: 24,
                                color: '#9a9a9a',
                                align:'left'
                            },
                            line:{
                                width:100,
                                align:'left',
                                height:0.5,
                                backgroundColor:'#9a9a9a'
                            },
                            value: {
                                width:80,
                                fontSize: 16,
                                fontWeight:'bold',
                                align:'right',
                                lineHeight: 24,
                                color:'#fff',
                            },
                            unit:{
                                align:'right',
                                fontSize:12,
                                color:'#9a9a9a',
                                padding:[0,0,0,6]
                            }
                        }
                    }
                },
                series:[{
                    type:'pie',
                    name:title,
                    center:['30%','50%'],
                    radius: ['56%', '72%'],
                    avoidLabelOverlap: false,
                    label:{
                        show:false
                    },
                    labelLine:{
                        show:false
                    },
                    data:seriesData.map((item,index)=>{
                        return { 
                            value:item.value, 
                            name:item.name,
                            itemStyle:{
                                borderWidth:6,
                                borderColor:'#191a2f',
                                color:stylesMap[index+1]
                            }
                        }
                    })
                }]
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
export default React.memo(PieChart, areEqual);
