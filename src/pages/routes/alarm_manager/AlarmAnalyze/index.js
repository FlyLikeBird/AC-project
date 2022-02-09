import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Radio } from 'antd';
import style from '@/pages/routes/IndexPage.css';
import PieChart from './PieChart';

function CostTrend(){
    return (
        <div style={{ height:'100%' }}>
            <div style={{ height:'40%' }}>
                <div className={style['card-container-wrapper']} style={{ width:'50%' }}>
                    <div className={style['card-container']}>
                        <PieChart />
                    </div>
                </div>
                <div className={style['card-container-wrapper']} style={{ width:'50%', paddingRight:'0' }}>
                    <div className={style['card-container']}>
                        <PieChart />
                    </div>
                </div>
            </div>
            <div className={style['card-container']} style={{ height:'60%' }}>
            </div>
        </div>
    )
}

export default CostTrend;