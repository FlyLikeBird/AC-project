import React, { useState } from 'react';
import { Tabs } from 'antd';
import LineChart from './LineChart';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import style from '@/pages/routes/IndexPage.css';

const { TabPane } = Tabs;

let tabList = [
    { tab:'用电量' , key:'energy', unit:'Kwh' },
    { tab:'温度', key:'temp', unit:'℃' }
]
function ChartContainer({ dispatch, data, attrId }){
    let [activeKey, setActiveKey] = useState('energy');
    return (
        <Tabs className={style['custom-tabs'] + ' ' + style['flex-tabs']} value={activeKey} onChange={activeKey=>setActiveKey(activeKey)} tabBarExtraContent={{
            right:(
                <div>
                    <CustomDatePicker onDispatch={()=>{
                        dispatch({ type:'controller/fetchCostAnalysis', payload:{ attr_id:attrId }})
                    }} />
                </div>
            )
        }}>
                {
                    tabList.map((item,index)=>(
                        <TabPane tab={item.tab} key={item.key}>
                            { activeKey === item.key && <LineChart activeKey={activeKey} data={data.view || {}} /> }
                        </TabPane>
                    ))
                }

        </Tabs>
    )
}

export default ChartContainer;