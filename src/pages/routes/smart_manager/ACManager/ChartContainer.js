import React, { useState } from 'react';
import { Tabs } from 'antd';
import LineChart from './LineChart';
import style from '@/pages/routes/IndexPage.css';

const { TabPane } = Tabs;

let tabList = [
    { tab:'用电量' , key:'energy' },
    { tab:'温度', key:'cost' },
    { tab:'功率', key:'temp' }
]
function ChartContainer(){
    let [activeKey, setActiveKey] = useState('energy');
    return (
        <Tabs className={style['custom-tabs'] + ' ' + style['flex-tabs']} value={activeKey} onChange={activeKey=>{
                setActiveKey(activeKey);
            }}>
                {
                    tabList.map((item,index)=>(
                        <TabPane tab={item.tab} key={item.key}>
                            { activeKey === item.key && <LineChart /> }
                        </TabPane>
                    ))
                }

        </Tabs>
    )
}

export default ChartContainer;