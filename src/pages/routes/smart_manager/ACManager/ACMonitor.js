import React, { useState, useEffect } from 'react';
import { Button, Menu, message, Dropdown } from 'antd';
import { MinusOutlined, PlusOutlined, createFromIconfontCN, PoweroffOutlined } from '@ant-design/icons';
import style from '../SmartManager.css';
import monitorBg from '../../../../../public/ac-model-bg.png';

const MyIcon = createFromIconfontCN({
    scriptUrl:'//at.alicdn.com/t/font_3086161_dv63nyecczn.js'
});
let timer = null;
let locked = false;
let modeMaps = {
    1:'icon-kongdiao',
    3:'icon-wind',
    4:'icon-taiyang-copy'
};
let modeList = [ { title:'制冷', key:1 }, { title:'制热', key:4 }, { title:'送风', key:3 }];
let windSpeedList = [{ title:'自动', key:0 }, { title:'1级', key:1}, { title:'2级', key:2}, { title:'3级', key:3 }];
function ACMonitor({ dispatch, data }){
    let [num, setNum] = useState(data.temp);
    let modeMenu = (
        <Menu onClick={(item)=>{
            if ( locked ){
                message.info('接口请求中，请稍后操作');
                return ;
            }
            new Promise((resolve, reject)=>{
                locked = true;
                dispatch({ type:'controller/setACSync', payload:{ values:{ ...data, mode:item.key }, resolve, reject }})
            })
            .then(()=>{
                message.success('设定模式成功');
                locked = false;
            })
            .catch(msg=>{ message.error(msg); locked = false });
        }}>
            {
                modeList.map((item)=>(
                    <Menu.Item key={item.key}>{ item.title }</Menu.Item>
                ))
            }
        </Menu>
    );
    let windMenu = (
        <Menu onClick={(item)=>{
            if ( locked ){
                message.info('接口请求中，请稍后操作');
                return ;
            }
            new Promise((resolve, reject)=>{
                locked = true;
                dispatch({ type:'controller/setACSync', payload:{ values:{ ...data, wind_speed:item.key }, resolve, reject }})
            })
            .then(()=>{
                message.success('设定风速成功');
                locked = false;
            })
            .catch(msg=>{ message.error(msg); locked = false });
        }}>
            {
                windSpeedList.map((item)=>(
                    <Menu.Item key={item.key}>{ item.title }</Menu.Item>
                ))
            }
        </Menu>
    )
    useEffect(()=>{
        
    },[data]);
    useEffect(()=>{
        return ()=>{
            clearTimeout(timer);
            timer = null;
            locked = false;
        }
    },[])
    return (
        <div className={style['monitor-container']} style={{ backgroundImage:`url(${monitorBg})`}}>
            
            <div className={style['monitor-head']}>
                <div className={style['mode-icon-container']}>
                    <span>模式</span><MyIcon type={modeMaps[data.mode]} style={{ fontSize:'30px', margin:'0 20px 0 4px' }} />
                    <span>风速</span><MyIcon type='icon-wind-speed-high' style={{ fontSize:'30px', margin:'0 4px 0 4px' }} className={style['rotate'] + ' ' + `${style['speed_' + data.wind_speed]}` } />
                    <span className={style['tag']} style={{ fontSize:'0.8rem' }}>{ data.wind_speed === 0 ? '自动' : `${data.wind_speed}级` }</span>
                </div>
                <div className={style['mode-icon-container']}><span style={{ fontSize:'24px', marginRight:'6px' }}>1739</span><span className={style['tag']}>用时HOUR</span></div>
            </div>
            <div className={style['monitor-content']}>
                <div className={style['text-container'] + ' ' + style['normal']}>
                    <MyIcon type='icon-wendu' style={{ fontSize:'40px', position:'absolute', left:'-40px', bottom:'10px' }} />
                    <span className={style['data']}>{ num }</span>
                    <span className={style['unit']} style={{ fontSize:'28px', marginLeft:'10px' }}>℃</span>
                    <span className={style['tag']} style={{ right:'0' }}>设定</span>
                </div>
                <div className={style['text-container'] + ' ' + style['small']}>
                    <span className={style['data']} style={{ fontSize:'40px', lineHeight:'40px' }}>24</span>
                    <span className={style['unit']}>℃</span>
                    <span className={style['tag']} style={{ left:'0', top:'-10px' }}>室内温度</span>
                </div>   
            </div>
            <div className={style['monitor-footer']}>
                <div style={{ display:'inline-flex', alignItems:'center' }}>
                    <span>运行状态 : </span>
                    <span className={style['light-container']}><span className={style['light-dot'] + ' ' + ( data.on_off ? style['on'] : style['off'] )}></span></span>
                </div>
                <div className={style['btn-container']}>
                    <Button onClick={()=>{
                        if ( locked ){
                            message.info('接口请求中，请稍后操作');
                            return ;
                        }
                        setNum((num)=>{
                            clearTimeout(timer);
                            timer = setTimeout(()=>{
                                new Promise((resolve, reject)=>{
                                    locked = true;
                                    dispatch({ type:'controller/setACSync', payload:{ values:{ ...data, temp:num -1 }, resolve, reject }})
                                })
                                .then(()=>{
                                    message.success('设定温度成功');
                                    locked = false;
                                })
                                .catch(msg=>{ message.error(msg); locked = false });
                            },500);
                            return num - 1;
                        })
                        
                    }}><MinusOutlined /></Button>
                    <Button onClick={()=>{
                        if ( locked ){
                            message.info('接口请求中，请稍后操作');
                            return ;
                        }
                        setNum((num)=>{
                            clearTimeout(timer);
                            timer = setTimeout(()=>{
                                new Promise((resolve, reject)=>{
                                    locked = true;
                                    dispatch({ type:'controller/setACSync', payload:{ values:{ ...data, temp:num + 1 }, resolve, reject }})
                                })
                                .then(()=>{
                                    message.success('设定温度成功');
                                    locked = false;
                                })
                                .catch(msg=>{ message.error(msg); locked = false });
                            },500);
                            return num + 1;
                        })
                        
                    }}><PlusOutlined /></Button>
                    <Dropdown overlay={modeMenu}><Button><MyIcon type={modeMaps[data.mode]} style={{ fontSize:'20px' }} /></Button></Dropdown>
                    <Dropdown overlay={windMenu}><Button><MyIcon type='icon-wind-speed-high' style={{ fontSize:'20px' }} /></Button></Dropdown>
                    <Button onClick={()=>{
                        if ( locked ){
                            message.info('接口请求中，请稍后操作');
                            return ;
                        }
                        new Promise((resolve, reject)=>{
                            locked = true;
                            dispatch({ type:'controller/setACSync', payload:{ values:{ ...data, on_off:data.on_off ? 0 : 1 }, resolve, reject }})
                        })
                        .then(()=>{
                            locked = false;
                        })
                        .catch(msg=>{ message.error(msg); locked = false });
                    }}><PoweroffOutlined /></Button>
                </div>
            </div>
        </div>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data ){
        return false;
    } else {
        return true;
    }
}
export default React.memo(ACMonitor, areEqual);

