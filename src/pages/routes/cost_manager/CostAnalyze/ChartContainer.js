import React, { useState } from 'react';
import { Tabs } from 'antd';
import BarChart from './BarChart';
import style from '@/pages/routes/IndexPage.css';

const { TabPane } = Tabs;

let tabList = [
    { tab:'能耗与开机时长' , key:'energy' },
    { tab:'成本与开机时长', key:'cost' },
    { tab:'成本与温度', key:'temp' }
]
function ChartContainer(){
    let [activeKey, setActiveKey] = useState('energy');
    return (
        <div className={style['card-container']} style={{ height:'84%' }}>
            <Tabs className={style['custom-tabs'] + ' ' + style['flex-tabs']} value={activeKey} onChange={activeKey=>{
                setActiveKey(activeKey);
            }}>
                {
                    tabList.map((item,index)=>(
                        <TabPane tab={item.tab} key={item.key}>
                            { activeKey === item.key && <BarChart /> }
                        </TabPane>
                    ))
                }

            </Tabs>
        </div>
    )
}

export default ChartContainer;