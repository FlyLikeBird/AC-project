import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { connect } from 'dva';
import { Spin } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import style from './AgentManager.css';
import IndexStyle from '@/pages/routes/IndexPage.css';
import AgentMap from './AgentMap';
import ScrollTable from '@/pages/components/ScrollTable';
import TypeBarChart from '../alarm_manager/AlarmSum/TypeBarChart';
import LineChart from './LineChart';
import MultiLineChart from './MultiLineChart';
import RegionBarChart from '../alarm_manager/AlarmSum/RegionBarChart';
import switchImg from '../../../../public/switch.webp';
import borderVertical from '../../../../public/index-border-vertical.png';
import borderHorizon from '../../../../public/index-border-horizon.png';
import titleIconImg from '../../../../public/index-title-icon.png';

function AgentManager({ dispatch, user, gateway }){
    let [dataType, setDataType] = useState('energy');
    let { userInfo, companyList, msg, AMap, authorized } = user;
    let { monitorInfo } = gateway;
    let loaded = Object.keys(monitorInfo).length ? true : false; 
    let thead = [{ title:'位置', dataIndex:'region_name', width:'14%', collapse:true }, { title:'设备', dataIndex:'mach_name', width:'26%', collapse:true   }, { title:'分类', dataIndex:'type_name', width:'30%', border:true }, { title:'发生时间', dataIndex:'record_date', key:'time', width:'30%' }];
    return (
        
        <div className={style['container']}>
            {
                authorized
                ?
                <AgentMap companyList={companyList} msg={msg} AMap={AMap} dispatch={dispatch} />
                :
                null
            }
            <div className={style['border-container-vertical']} style={{ borderImage:`url(${borderVertical}) 30 0 30 30`}}></div>
            <div className={style['border-container-horizon']} style={{ borderImage:`url(${borderHorizon}) 30 30 0 30`}}></div>
            {/* 汇总信息 */}
            <div style={{ display:'flex', justifyContent:'space-around', position:'absolute', left:'50%', top:'14px', width:'440px', padding:'1rem 2rem', transform:'translateX(-50%)', backgroundColor:'rgba(0, 0, 0, 0.7)' }}>
                <div>
                    <div style={{ color:'#4a8fd0'}}>终端数量</div>
                    <div>
                        <span className={IndexStyle['data']}>{ monitorInfo.total_cnt || 0}</span>
                        <span className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)', margin:'0 10px'}}>个</span>
                    </div>
                </div>
                {/* <div>
                    <div style={{ color:'#4a8fd0'}}>项目数</div>
                    <div>
                        <span className={IndexStyle['data']}>25</span>
                        <span className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)', margin:'0 10px'}}>个</span>
                    </div>
                </div> */}
                <div>
                    <div style={{ color:'#4a8fd0'}}>当前安全告警</div>
                    <div>
                        <span className={IndexStyle['data']} style={{ color:'red' }}>{ monitorInfo.safe_warning_cnt || 0}</span>
                        <span className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)', margin:'0 10px'}}>个</span>
                    </div>
                </div>
                <div>
                    <div style={{ color:'#4a8fd0'}}>当前通讯告警</div>
                    <div>
                        <span className={IndexStyle['data']} style={{ color:'red' }}>{ monitorInfo.link_warning_cnt || 0}</span>
                        <span className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)', margin:'0 10px'}}>个</span>
                    </div>
                </div>
            </div>
            {/* 空开概述 */}
            <div className={style['float-container']}>
                <div className={style['float-item']} >
                    <div className={style['float-item-title']}>
                        <span className={style['float-item-icon']} style={{ backgroundImage:`url(${titleIconImg})`, backgroundPosition:'0 0'}}></span>
                        <span className={style['title']}>空调概况</span>
                    </div>
                    <div className={style['float-item-content']}>
                        {
                            loaded 
                            ?
                            <div style={{ display:'flex', height:'100%' }}>
                                <div style={{ width:'44%', backgroundImage:`url(${switchImg})`, backgroundRepeat:'no-repeat', backgroundPosition:'50% 50%' }}></div>
                                <div style={{ width:'56%', display:'flex', flexWrap:'wrap', alignItems:'center' }}>
                                    <div style={{ width:'50%' }}>
                                        <div className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)'}}>在线数量</div>
                                        <div><span className={IndexStyle['data']}>{ monitorInfo.online_cnt || 0 }</span><span className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)', margin:'0 10px'}}>个</span></div>
                                    </div>
                                    <div style={{ width:'50%' }}>
                                        <div className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)'}}>合闸</div>
                                        <div><span className={IndexStyle['data']}>{ monitorInfo.combine_cnt || 0}</span><span className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)', margin:'0 10px' }}>个</span></div>
                                    </div>
                                    <div style={{ width:'50%' }}>
                                        <div className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)'}}>离线数量</div>
                                        <div><span className={IndexStyle['data']} style={{ color:'red' }}>{ monitorInfo.outline_cnt || 0}</span><span className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)', margin:'0 10px'}}>个</span></div>
                                    </div>
                                    <div style={{ width:'50%' }}>
                                        <div className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)'}}>分断</div>
                                        <div><span className={IndexStyle['data']}>{ monitorInfo.trip_cnt || 0}</span><span className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)', margin:'0 10px'}}>个</span></div>
                                    </div>
                                </div>
                            </div>
                            :
                            <Spin size='large' className={style['spin']} />
                        }
                    </div>
                </div>
                {/* 节能率 */}
                <div className={style['float-item']} >
                    <div className={style['float-item-title']}>
                        <span className={style['float-item-icon']} style={{ backgroundImage:`url(${titleIconImg})`, backgroundPosition:'-25px 0'}}></span>
                        <span className={style['title']}>节能率</span>
                    </div>
                    <div className={style['float-item-content']}>
                        {
                            loaded
                            ?
                            <LineChart data={monitorInfo.view} />
                            :
                            <Spin size='large' className={style['spin']} />
                        }
                    </div>
                </div>
               {/* 近7日能耗趋势 */}
               <div className={style['float-item']}>
                    <div className={style['float-item-title']}>
                        <span className={style['title']}>近7日能耗/成本趋势</span>
                    </div>
                    <div className={style['float-item-content']}>
                        {
                            loaded 
                            ?
                            <LineChart data={monitorInfo.view} />
                            :
                            <Spin size='large' className={style['spin']} />
                        }
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default connect(({ user, gateway })=>({ user, gateway }))(AgentManager);