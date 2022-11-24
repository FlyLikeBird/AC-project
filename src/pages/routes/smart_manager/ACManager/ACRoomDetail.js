import React, { useEffect } from 'react';
import { Button, Skeleton } from 'antd';
import style from '@/pages/routes/IndexPage.css';
import ACMonitor from './ACMonitor';
import ChartContainer from './ChartContainer';
import Loading from '@/pages/components/Loading';

let infoList = [
    // { isBool:true, title:'防冻状态', key:'status_antifreeze_state', unit:'' },
    // { isBool:true, title:'有无继电器', key:'run_have_relay', unit:''},
    // { isBool:true, title:'继电器是否闭合', key:'run_relay_combine', unit:''},
    // { isBool:true, title:'压缩机是否工作', key:'run_compressor_work', unit:''},
    // { isBool:true, title:'温度读取是否异常', key:'run_read_temp_err', unit:''},
    // { isBool:true, title:'时钟是否错误', key:'run_timer_err', unit:''},
    // { isBool:true, title:'是否执行广播命令', key:'run_broadcast_cmd', unit:''},
    // { isBool:true, title:'房间是否有电', key:'run_have_electric', unit:''},
    // { isBool:true, title:'温度硬件异常', key:'alter_hw_temp', unit:''},
    // { isBool:true, title:'时钟异常', key:'alter_timer', unit:''},
    // { isValue:true, title:'温度', key:'alter_temp', unit:'℃'},
    { isValue:true, title:'当前电压', key:'energy_voltage', unit:'V'},
    { isValue:true, title:'当前电流', key:'energy_current', unit:'A'},
    { isValue:true, title:'当前功率', key:'energy_power', unit:'W' },
    { isValue:true, title:'当日功率最大值', key:'energy_power_day_max', unit:'W'},
    { title:'记录时间', key:'record_time', unit:''}
];

function ACRoomDetail({ dispatch, detailInfo, chartInfo, data, isLoading }){
    useEffect(()=>{
        dispatch({ type:'controller/fetchDetailInfo', payload:data.mach_id });
        dispatch({ type:'controller/fetchCostAnalysis', payload:{ attr_id:data.attr_id }});
    },[data]);
    return (
        <div style={{ position:'relative' }}>
            {
                isLoading 
                ?
                <Loading />
                :
                null
            }
            <div style={{ height:'40px' }}>
                <Button type='primary' onClick={()=>{
                    dispatch({ type:'controller/resetDetail'});
                    dispatch({ type:'controller/fetchRoomList'});
                }}>返回</Button>
            </div>
            <div style={{ height:'calc( 100% - 40px)' }}>
                <div style={{ height:'32%', display:'flex' }}>
                    {
                        Object.keys(detailInfo).length 
                        ?
                        <ACMonitor data={detailInfo} dispatch={dispatch} mach_id={data.mach_id} />
                        :
                        <div style={{ height:'32%', width:'32%' }} ><Skeleton active className={style['skeleton']} /></div>
                    }
                    <div style={{ width:'68%', paddingLeft:'1rem' }}>
                        <div className={style['card-container']}>
                            <div className={style['card-title']}>
                                <span>实时状态</span>
                            </div>
                            <div className={style['card-content']}>
                                <div className={style['flex-container']} style={{ flexWrap:'wrap', padding:'0 2rem' }}>
                                    {
                                        infoList.map((item,index)=>(
                                            <div key={index} className={style['flex-item']} style={{ flex:'none', width:'50%', padding:'0 4rem 0 0', display:'flex', alignItems:'center' }}>
                                                <div className={style['flex-item-symbol']}></div>
                                                <div>{ item.title }</div>
                                                <div style={{ flex:'1', height:'1px', backgroundColor:'rgba(255, 255, 255, 0.3)', margin:'0 1rem'}}></div>
                                                <div style={{ fontSize:'1.2rem', color:'#fff' }}>
                                                    { 
                                                        item.isBool 
                                                        ?
                                                        detailInfo[item.key] 
                                                        ?
                                                        '是'
                                                        :
                                                        '否'
                                                        :
                                                        ( item.isValue ?  detailInfo[item.key] === '-' ? '--' : detailInfo[item.key] ? (+detailInfo[item.key]).toFixed(1) : 0.0 : detailInfo[item.key] ) + ' ' + ( detailInfo[item.key] === '-' ? '' : item.isValue ? item.unit : '' ) 
                                                    }
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ height:'68%', paddingTop:'1rem' }}>
                    <div className={style['card-container']}>
                        <ChartContainer dispatch={dispatch} data={chartInfo} attrId={data.attr_id} />
                    </div>
                </div>
            </div>     
        </div>
    )
}

export default ACRoomDetail;