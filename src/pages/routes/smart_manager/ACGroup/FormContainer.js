import React, { useState, useEffect } from 'react';
import { Form, Select, Tabs, Input, Radio, Slider, Tooltip, Button, message, Modal } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import style from '../SmartManager.css';

const { Option } = Select;
const { Search } = Input;
const { TabPane } = Tabs;

function validator(a,value){
    if ( !value || (typeof +value === 'number' && +value === +value && +value >=0  )) {
        return Promise.resolve();
    } else {
        return Promise.reject('请填入合适的阈值');
    }
}

function AddForm({ dispatch, info }){
   
    let [status, setStatus] = useState(1);
    let [mode, setMode] = useState(1);
    let [num ,setNum] = useState(24);
    let [wind, setWind] = useState(0);
    let [isFrozon, setFrozon] = useState(1);
    
    let [ctrlTemp, setCtrlTemp] = useState(null);
    let [limit, setLimit] = useState(true);
    useEffect(()=>{
        let { temp, is_limit } = info;
        setCtrlTemp( is_limit ? Number(temp) : 26 );
        setLimit(is_limit ? true : false );
    },[info])

    return (
        <Tabs
            className={style['custom-tabs']}
        >
            <TabPane tab='组控制' key='group'>
                <div className={style['form-container']}>
                    <div className={style['form-item']}>
                        <div className={style['form-item-title']}>控制</div>
                        <div className={style['form-item-content']}>
                            <Radio.Group value={status} onChange={e=>setStatus(e.target.value)}>
                                <Radio value={1}>开机</Radio>
                                <Radio value={0}>关机</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                    <div className={style['form-item']}>
                        <div className={style['form-item-title']}>模式</div>
                        <div className={style['form-item-content']}>
                            <Radio.Group value={mode} onChange={e=>setMode(e.target.value)}>
                                <Radio value={1}>制冷</Radio>
                                <Radio value={4}>制热</Radio>
                                <Radio value={3}>送风</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                    <div className={style['form-item']}>
                        <div className={style['form-item-title']}>温度设定</div>
                        <div className={style['form-item-content']}>
                            <div style={{ fontSize:'1.2rem' , textAlign:'center' }}>{ num + '℃' }</div>
                            <div style={{ display:'flex', alignItems:'center' }}>
                                <MinusCircleOutlined style={{ fontSize:'1.3rem', color:'#449fff', marginTop:'6px' }} onClick={()=>{
                                    if ( num <= 16 ){
                                        message.info('已经是最低温度');
                                    } else {
                                        setNum(num-1);
                                    }
                                }} />
                                <Slider className={style['custom-slider']} min={16} max={32} step={1} value={num} onChange={value=>setNum(value)} />
                                <PlusCircleOutlined style={{ fontSize:'1.3rem', color:'#449fff', marginTop:'6px' }} onClick={()=>{
                                    if ( num >= 32 ) {
                                        message.info('已经是最高温度');
                                    } else {
                                        setNum(num+1);
                                    }
                                }} />
                            </div>
                        </div>
                    </div>
                    <div className={style['form-item']}>
                        <div className={style['form-item-title']}>风速</div>
                        <div className={style['form-item-content']}>
                            <Radio.Group value={wind} onChange={e=>setWind(e.target.value)}>
                                <Radio value={0}>自动</Radio>
                                <Radio value={1}>1级</Radio>
                                <Radio value={2}>2级</Radio>
                                <Radio value={3}>3级</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                    <div className={style['form-item']}>
                        <div className={style['form-item-title']}>防冻状态</div>
                        <div className={style['form-item-content']}>
                            <Radio.Group value={isFrozon} onChange={e=>setFrozon(e.target.value)}>
                                <Radio value={1}>是</Radio>
                                <Radio value={0}>否</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                    <div style={{ whiteSpace:'nowrap', position:'absolute', bottom:'4rem', left:'50%', transform:'translateX(-50%)' }}>
                        <Button type='primary' style={{ marginRight:'0.5rem' }} onClick={()=>{
                            new Promise((resolve, reject)=>{
                                dispatch({ type:'controller/setGroupAsync', payload:{ resolve, reject, values:{ mode, on_off:status, wind_speed:wind, temp:num, antifreeze_state:isFrozon }}})
                            })
                            .then(()=>{
                                message.success('批量控制成功')
                            })
                            .catch(msg=>message.error(msg))
                        }}>组控制</Button>
                        <Button type='primary' ghost >取消</Button>
                    </div>
                </div>
            </TabPane>
            <TabPane tab='室温预控' key='temp'>
                <div className={style['form-container']}>
                    <div className={style['form-item']}>
                        <div className={style['form-item-title']}>是否开启预控</div>
                        <div className={style['form-item-content']}>                       
                            <Radio.Group value={limit} onChange={e=>{
                                // if ( e.target.value === true ) {
                                //     dispatch({ type:'controller/fetchTempCtrl'});      
                                // }
                                setLimit(e.target.value)}
                            }>
                                <Radio value={true}>是</Radio>
                                <Radio value={false}>否</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                {
                    limit 
                    ?
                    <div className={style['form-item']}>
                        <div className={style['form-item-title']}>室温设定<Tooltip title='该室温以下禁止开机'><QuestionCircleOutlined style={{ marginLeft:'0.5rem', fontSize:'1rem' }} /></Tooltip></div>
                        <div className={style['form-item-content']}>
                            <div style={{ fontSize:'1.2rem' , textAlign:'center' }}>{ ctrlTemp + '℃' }</div>
                            <div style={{ display:'flex', alignItems:'center' }}>
                                <MinusCircleOutlined style={{ fontSize:'1.3rem', color:'#449fff', marginTop:'6px' }} onClick={()=>{
                                    if ( ctrlTemp <= 16 ){
                                        message.info('已经是最低温度');
                                    } else {
                                        setCtrlTemp(ctrlTemp-1);
                                    }
                                }} />
                                <Slider className={style['custom-slider']} min={16} max={32} step={1} value={ctrlTemp} onChange={value=>setCtrlTemp(value)} />
                                <PlusCircleOutlined style={{ fontSize:'1.3rem', color:'#449fff', marginTop:'6px' }} onClick={()=>{
                                    if ( ctrlTemp >= 32 ) {
                                        message.info('已经是最高温度');
                                    } else {
                                        setCtrlTemp(ctrlTemp+1);
                                    }
                                }} />
                            </div>
                        </div>
                    </div>
                    :
                    null
                }
                    <div style={{ whiteSpace:'nowrap', position:'absolute', bottom:'4rem', left:'50%', transform:'translateX(-50%)' }}>
                        <Button type='primary' style={{ marginRight:'0.5rem' }} onClick={()=>{
                            new Promise((resolve, reject)=>{
                                limit 
                                ?
                                dispatch({ type:'controller/setTempCtrlAsync', payload:{ resolve, reject, temp:ctrlTemp }})
                                :
                                dispatch({ type:'controller/cancelTempCtrlAsync', payload:{ resolve, reject }})
                            })
                            .then(()=>{
                                message.success('室温预控设置成功')
                            })
                            .catch(msg=>message.error(msg))
                        }}>保存</Button>
                    </div>
                </div>

            </TabPane>
        </Tabs>
        
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.info !== nextProps.info ) {
        return false;
    } else {
        return true;
    }
}

export default React.memo(AddForm, areEqual);