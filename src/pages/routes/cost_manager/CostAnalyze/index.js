import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Tabs, Skeleton, Button, message, Spin } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import BarChart from './BarChart';
import Loading from '@/pages/components/Loading';
import style from '@/pages/routes/IndexPage.css';
import { downloadExcel } from '@/pages/utils/array';
import XLSX from 'xlsx';

const { TabPane } = Tabs;
let infoList = [
    { color:'#04a3fe', child:[{ title:'本月开机时长', value:156, unit:'h' }, { title:'昨日开机时长', value:6, unit:'h' }] },
    { color:'#7318ef', child:[{ title:'本月能耗', value:276, unit:'kwh' }, { title:'昨日能耗', value:6.1, unit:'kwh' }] },
    { color:'#89fa6e', child:[{ title:'本月成本', value:156, unit:'元' }, { title:'昨日成本', value:6, unit:'元' }] },
    { color:'#fdd224', child:[{ title:'室内平均温度', value:31.2, unit:'℃' }, { title:'空调平均温度', value:26, unit:'℃' }] },
]
let tabList = [
    { tab:'成本与开机时长' , key:'cost' },
    { tab:'能耗与开机时长', key:'energy' },
    { tab:'成本与温度', key:'temp'}
]
function CostAnalyze({ dispatch, user, cost }){
    useEffect(()=>{
        dispatch({ type:'cost/initCostAnalysis'});
    },[])
    let { chartInfo, isLoading } = cost;
    let [activeKey, setActiveKey] = useState('cost');

    return (
        <div style={{ height:'100%'}}>
            {
                isLoading 
                ?
                <Loading />
                :
                null
            }
            <div style={{ height:'40px' }}>
                <CustomDatePicker noDay onDispatch={()=>{
                    dispatch({ type:'cost/fetchCostAnalysis'});
                }} />
            </div>
            <div style={{ height:'calc( 100% - 40px)'}}>
                <div style={{ height:'16%' }}>
                    {
                        chartInfo.infoList && chartInfo.infoList.length 
                        ?
                        chartInfo.infoList.map((item,index)=>(
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
                        :
                        <Skeleton active className={style['skeleton']} />
                    }
                </div>
                <div className={style['card-container']} style={{ height:'84%' }}>
                    <Tabs className={style['custom-tabs'] + ' ' + style['flex-tabs']} value={activeKey} onChange={activeKey=>setActiveKey(activeKey)} tabBarExtraContent={{
                        right:(
                            <Button type='primary' style={{ right:'1rem' }} onClick={()=>{
                                if ( Object.keys(chartInfo).length ) {
                                    let dateStr =  
                                    user.timeType === '2' 
                                    ?
                                    `${user.startDate.format('YYYY-MM')}月`
                                    :
                                    user.timeType === '3'
                                    ?
                                    `${user.startDate.format('YYYY')}年`
                                    :
                                    '';
                                    let tabInfo = tabList.filter(i=>i.key === activeKey)[0];
                                    let fileTitle = dateStr + tabInfo.tab;
                                    let aoa = [];
                                    let thead = [];
                                    let colsStyle = [];
                                    thead.push('对比项','单位');
                                    chartInfo.view.date.forEach(date=>{
                                        thead.push(date);
                                    });
                                    thead.forEach(col=>{
                                        colsStyle.push({ wch:18 });
                                    });
                                    aoa.push(thead);
                                    let type1 = activeKey === 'cost' || activeKey === 'temp' ? chartInfo.view.cost : chartInfo.view.work;
                                    let type2 = activeKey === 'temp' ? chartInfo.view.temp : chartInfo.view.work;
                                   
                                    ['1','2'].forEach((item,index)=>{
                                        let temp = [];
                                        if ( index === 0 ){
                                            temp.push(activeKey === 'cost' || activeKey === 'temp' ? '成本' : '能耗' );
                                            temp.push(activeKey === 'cost' || activeKey === 'temp' ? '元' : 'kwh');
                                            type1.forEach((sub,j)=>{
                                                temp.push(sub);
                                            })
                                        } 
                                        if ( index === 1) {
                                            temp.push(activeKey === 'temp' ? '温度' : '开机时长' );
                                            temp.push(activeKey === 'temp' ? '℃' : '小时');
                                            type2.forEach((sub,j)=>{
                                                temp.push(sub);
                                            })
                                        }                                        
                                        aoa.push(temp);                            
                                    });
                                    // console.log(aoa);
                                    var sheet = XLSX.utils.aoa_to_sheet(aoa);
                                    sheet['!cols'] = colsStyle;
                                    downloadExcel(sheet, fileTitle + '.xlsx' );
                                } else {
                                    message.info('数据源为空')
                                }
                            }}><FileExcelOutlined /></Button>
                        )
                    }}>
                        {
                            tabList.map((item,index)=>(
                                <TabPane tab={item.tab} key={item.key}>
                                    { activeKey === item.key && <BarChart data={chartInfo.view || {}} activeKey={activeKey} forTemp={activeKey === 'temp' ? true : false} /> }
                                </TabPane>
                            ))
                        }

                    </Tabs>
                </div>
            
            </div>
            
        </div>
    )
}

export default connect(({ user, cost })=>({ user, cost }))(CostAnalyze);