import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Radio, Skeleton } from 'antd';
import style from '@/pages/routes/IndexPage.css';
import PieChart from './PieChart';
import BarChart from './BarChart';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import Loading from '@/pages/components/Loading';

function CostTrend({ dispatch, cost }){
    useEffect(()=>{
        dispatch({ type:'cost/initCostTrend'});
    },[]);
    const { isLoading, trendInfo } = cost;
    return (
        <div style={{ height:'100%' }}>
            {
                isLoading 
                ?
                <Loading />
                :
                null
            }
            <div style={{ height:'40px' }}>
                <CustomDatePicker onDispatch={()=>{
                    dispatch({ type:'cost/fetchCostTrend'});
                }} />
            </div>
            <div style={{ height:'calc( 100% - 40px)'}}>
                <div style={{ height:'16%' }}>
                    {
                        trendInfo.infoList && trendInfo.infoList.length 
                        ?
                        trendInfo.infoList.map((item,index)=>(
                            <div className={style['card-container-wrapper']} key={index} style={{ width:'25%', paddingRight:index === trendInfo.infoList.length - 1 ? '0' : '1rem' }}>
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
                        :
                        <Skeleton active className={style['skeleton']} />
                    }
                </div>
                <div className={style['card-container']} style={{ height:'84%' }}>
                    <BarChart data={trendInfo.areaInfoList || []} />
                </div>
            </div>
        </div>
    )
}

export default connect(({ cost })=>({ cost }))(CostTrend);