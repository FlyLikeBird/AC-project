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
import RankBarChart from './RankBarChart';
import LineChart from './LineChart';
import switchImg from '../../../../public/switch.webp';
import borderVertical from '../../../../public/index-border-vertical.png';
import borderHorizon from '../../../../public/index-border-horizon.png';
import titleIconImg from '../../../../public/index-title-icon.png';
import icon1 from '../../../../public/ac-index-icon.png';

function AgentManager({ dispatch, user, gateway }){
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
            <div style={{ display:'flex', justifyContent:'space-around', position:'absolute', left:'50%', top:'14px', padding:'1rem 2rem', transform:'translateX(-50%)' }}>
                <div style={{ display:'flex', flexDirection:'column', marginRight:'2rem', justifyContent:'center', alignItems:'center', width:'180px', height:'65px', backgroundRepeat:'no-repeat', backgroundSize:'contain', backgroundImage:`url(${icon1})`}}>
                    <div style={{ color:'rgb(13 235 240)'}}>本月总成本</div>
                    <div>
                        <span className={IndexStyle['data']}>{ monitorInfo.totalCost || 0}</span>
                        <span className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)', margin:'0 10px'}}>元</span>
                    </div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', marginRight:'2rem', justifyContent:'center', alignItems:'center', width:'180px', height:'65px', backgroundRepeat:'no-repeat', backgroundSize:'contain', backgroundImage:`url(${icon1})`}}>
                    <div style={{ color:'rgb(13 235 240)'}}>本月总能耗</div>
                    <div>
                        <span className={IndexStyle['data']}>{ monitorInfo.totalEnergy || 0}</span>
                        <span className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)', margin:'0 10px'}}>kwh</span>
                    </div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', marginRight:'2rem', justifyContent:'center', alignItems:'center', width:'180px', height:'65px', backgroundRepeat:'no-repeat', backgroundSize:'contain', backgroundImage:`url(${icon1})`}}>
                    <div style={{ color:'rgb(13 235 240)'}}>告警总数</div>
                    <div>
                        <span className={IndexStyle['data']}>{ monitorInfo.warningCnt || 0}</span>
                        <span className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)', margin:'0 10px'}}>件</span>
                    </div>
                </div>
                {/* <div>
                    <div style={{ color:'rgb(13 235 240)'}}>项目数</div>
                    <div>
                        <span className={IndexStyle['data']}>25</span>
                        <span className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)', margin:'0 10px'}}>个</span>
                    </div>
                </div> */}
                <div style={{ display:'flex', flexDirection:'column', marginRight:'2rem', justifyContent:'center', alignItems:'center', width:'180px', height:'65px', backgroundRepeat:'no-repeat', backgroundSize:'contain', backgroundImage:`url(${icon1})`}}>
                    <div style={{ color:'rgb(13 235 240)'}}>安全告警数</div>
                    <div>
                        <span className={IndexStyle['data']} style={{ color:'red' }}>{ monitorInfo.safeCnt || 0}</span>
                        <span className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)', margin:'0 10px'}}>件</span>
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
                            <div style={{ display:'flex', height:'100%', alignItems:'center', padding:'0 2rem' }}>
                                <div style={{ width:'60%', height:'100%', backgroundImage:`url(${switchImg})`, backgroundRepeat:'no-repeat', backgroundPosition:'50% 50%' }}></div>
                                <div style={{ width:'40%', padding:'0 1rem' }}>
                                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative' }}>
                                        <span className={style['symbol']} style={{ backgroundColor:'#4df8ff'}}></span>
                                        <div className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)'}}>空调总数</div>
                                        <div><span className={IndexStyle['data']} style={{ color:'#4df8ff'}}>{ monitorInfo.onCnt + monitorInfo.offCnt + monitorInfo.outLinkCnt || 0 }</span></div>
                                    </div>
                                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative' }}>
                                        <span className={style['symbol']} style={{ backgroundColor:'#fff'}}></span>
                                        <div className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)'}}>开机数</div>
                                        <div><span className={IndexStyle['data']} style={{ color:'#fff'}}>{ monitorInfo.onCnt || 0}</span></div>
                                    </div>
                                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative' }}>
                                        <span className={style['symbol']} style={{ backgroundColor:'#ffe339'}}></span>
                                        <div className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)'}}>关机数</div>
                                        <div><span className={IndexStyle['data']} style={{ color:'#ffe339'}}>{ monitorInfo.offCnt || 0}</span></div>
                                    </div>
                                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative' }}>
                                        <span className={style['symbol']} style={{ backgroundColor:'#fc1a4c'}}></span>
                                        <div className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)'}}>掉线数</div>
                                        <div><span className={IndexStyle['data']} style={{ color:'#fc1a4c'}}>{ monitorInfo.outLinkCnt || 0}</span></div>
                                    </div>
                                </div>
                            </div>
                            :
                            <Spin size='large' className={style['spin']} />
                        }
                    </div>
                </div>
                {/* 区域排名  */}
                <div className={style['float-item']} >
                    <div className={style['float-item-title']}>
                        <span className={style['float-item-icon']} style={{ backgroundImage:`url(${titleIconImg})`, backgroundPosition:'-25px 0'}}></span>
                        <span className={style['title']}>本月区域排名</span>
                    </div>
                    <div className={style['float-item-content']}>
                        {
                            loaded
                            ?
                            <RankBarChart data={monitorInfo.areaInfoList} />
                            :
                            <Spin size='large' className={style['spin']} />
                        } 
                    </div>
                </div>
               {/* 近7日能耗趋势 */}
                <div className={style['float-item']}>
                    <div className={style['float-item-title']}>
                        <span className={style['float-item-icon']} style={{ backgroundImage:`url(${titleIconImg})`, backgroundPosition:'-50px 0'}}></span>
                        <span className={style['title']}>近7日能耗/成本趋势</span>
                    </div>
                    <div className={style['float-item-content']}>
                        {
                            loaded 
                            ?
                            <LineChart data={monitorInfo.costView} />
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