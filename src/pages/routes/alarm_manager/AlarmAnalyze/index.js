import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Radio } from 'antd';
import style from '@/pages/routes/IndexPage.css';
import PieChart from './PieChart';
import MultiBarChart from './MultiBarChart';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import Loading from '@/pages/components/Loading';

function AlarmAnalysis({ dispatch, alarm }){
    useEffect(()=>{
        dispatch({ type:'alarm/initAlarmAnalysis'});
    },[])
    const { isLoading, chartInfo } = alarm;
    console.log(chartInfo);
    return (
        <div style={{ height:'100%', position:'relative' }}>
            {
                isLoading 
                ?
                <Loading />
                :
                null
            }
            <div style={{ height:'40px' }}>
                <CustomDatePicker onDispatch={()=>{
                    dispatch({ type:'alarm/fetchAlarmAnalysis'});
                }} />
            </div>
            <div style={{ height:'calc( 100% - 40px)'}}>
                <div style={{ height:'44%' }}>
                    <div className={style['card-container-wrapper']} style={{ width:'50%' }}>
                        <div className={style['card-container']}>
                            <PieChart data={chartInfo.typeGroupArr || {}} title='告警类型分析'  />
                        </div>
                    </div>
                    <div className={style['card-container-wrapper']} style={{ width:'50%', paddingRight:'0' }}>
                        <div className={style['card-container']}>
                            <PieChart data={chartInfo.cateCodeArr || {}} title='告警处理进度'  forStatus={true} />
                        </div>
                    </div>
                </div>
                <div className={style['card-container']} style={{ height:'56%' }}>
                    <MultiBarChart data={chartInfo.view || {}} />
                </div>
            </div>
            
        </div>
    )
}

export default connect(({ alarm })=>({ alarm }))(AlarmAnalysis);