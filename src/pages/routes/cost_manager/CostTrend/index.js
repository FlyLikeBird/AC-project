import React from 'react';
import { Radio } from 'antd';
import style from '@/pages/routes/IndexPage.css';
import PieChart from './PieChart';

function CostTrend(){
    return (
        <div style={{ height:'100%' }}>
            <div style={{ height:'40px' }}>
                <Radio.Group className={style['custom-radio']}>
                    <Radio.Button value='energy' key='energy'>能耗</Radio.Button>
                    <Radio.Button value='cost' key='cost'>成本</Radio.Button>
                </Radio.Group>
            </div>
            <div style={{ height:'calc( 100% - 40px)'}}>
                <div style={{ height:'40%' }}>
                    <div className={style['card-container-wrapper']} style={{ width:'50%' }}>
                        <div className={style['card-container']}>
                            <PieChart />
                        </div>
                    </div>
                    <div className={style['card-container-wrapper']} style={{ width:'50%', paddingRight:'0' }}>
                        <div className={style['card-container']}>
                            
                        </div>
                    </div>
                </div>
                <div className={style['card-container']} style={{ height:'60%' }}>

                </div>
            </div>
        </div>
    )
}

export default CostTrend;