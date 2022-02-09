import React from 'react';
import { Button } from 'antd';
import style from '@/pages/routes/IndexPage.css';
import ACMonitor from './ACMonitor';
import ChartContainer from './ChartContainer';

let infoList = [
    { title:'当日总电能', value:6654, unit:'kwh' },
    { title:'时钟状态', value:'正常'},
    { title:'当日最大功率', value:4587, unit:'w' },
    { title:'温度读取', value:'正常'},
    { title:'当日总电能', value:6654, unit:'kwh' },
    { title:'时钟状态', value:'正常'},
    { title:'当日最大功率', value:4587, unit:'w' },
    { title:'温度读取', value:'正常'}
]
function ACRoomDetail({ dispatch, currentMach }){
    console.log(currentMach);
    return (
        <div>
            <div style={{ height:'40px' }}>
                <Button type='primary' onClick={()=>{
                    dispatch({ type:'controller/resetDetail'});
                }}>返回</Button>
            </div>
            <div style={{ height:'260px', display:'flex' }}>
                <ACMonitor />
                <div style={{ flex:'1', paddingLeft:'1rem' }}>
                    <div className={style['card-container']}>
                        <div className={style['card-title']}>
                            <span>实时状态</span>
                            <span>参数详情</span>
                        </div>
                        <div className={style['card-content']}>
                            <div className={style['flex-container']} style={{ flexWrap:'wrap', padding:'0 2rem' }}>
                                {
                                    infoList.map((item,index)=>(
                                        <div className={style['flex-item']} style={{ flex:'none', width:'50%', padding:'0 4rem 0 0', display:'flex', alignItems:'center' }}>
                                            <div className={style['flex-item-symbol']}></div>
                                            <div>{ item.title }</div>
                                            <div style={{ flex:'1', height:'1px', backgroundColor:'rgba(255, 255, 255, 0.3)', margin:'0 1rem'}}></div>
                                            <div style={{ fontSize:'1.2rem', color:'#fff' }}>{ item.value + ( item.unit || '' ) }</div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ height:'calc( 100% - 300px)', paddingTop:'1rem' }}>
                <div className={style['card-container']}>
                    <ChartContainer />
                </div>
            </div>
        </div>
    )
}

export default ACRoomDetail;