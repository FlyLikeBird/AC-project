import React from 'react';
import ChartContainer from './ChartContainer';
import style from '@/pages/routes/IndexPage.css';

let infoList = [
    { color:'#04a3fe', child:[{ title:'本月开机时长', value:156, unit:'h' }, { title:'昨日开机时长', value:6, unit:'h' }] },
    { color:'#7318ef', child:[{ title:'本月能耗', value:276, unit:'kwh' }, { title:'昨日能耗', value:6.1, unit:'kwh' }] },
    { color:'#89fa6e', child:[{ title:'本月成本', value:156, unit:'元' }, { title:'昨日成本', value:6, unit:'元' }] },
    { color:'#fdd224', child:[{ title:'室内平均温度', value:31.2, unit:'℃' }, { title:'空调平均温度', value:26, unit:'℃' }] },
]

function CostAnalyze(){
    return (
        <div style={{ height:'100%'}}>
            <div style={{ height:'16%' }}>
                {
                    infoList.map((item,index)=>(
                        <div className={style['card-container-wrapper']} key={index} style={{ width:'25%', paddingRight:index === infoList.length - 1 ? '0' : '1rem' }}>
                            <div className={style['card-container']} style={{ display:'flex', justifyContent:'space-around', alignItems:'center' }}>
                                <div style={{ width:'20px', height:'60%', backgroundColor:item.color, position:'absolute', left:'-10px', borderRadius:'10px' }}></div>
                                {
                                    item.child && item.child.length 
                                    ?
                                    item.child.map((sub,j)=>(
                                        <div key={sub.title}>
                                            <div>{ sub.title }</div>
                                            <div>
                                                <span className={style['data']}>{ sub.value }</span>
                                                <span className={style['sub-text']} style={{ margin:'0 4px'}}>{ sub.unit }</span>
                                            </div>
                                        </div>
                                    ))
                                    :
                                    null
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
            <ChartContainer />
        </div>
    )
}

export default CostAnalyze;