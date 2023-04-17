import React, { useState } from 'react';
import { Popover, Radio, InputNumber, Tooltip, Switch, DatePicker, message, Button } from 'antd';
import { createFromIconfontCN, MinusOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import CustomTimePicker from '@/pages/components/CustomTimePicker';
import moment from 'moment';
import style from '../PlanManager.css';
import zhCN from 'antd/es/date-picker/locale/zh_CN';

const MyIcon = createFromIconfontCN({
    scriptUrl:'//at.alicdn.com/t/font_3086161_o5layfhgryf.js'
});
let tempData = [];
for(let i = 16; i <= 32; i++ ){
    tempData.push(i);
}
function getTimeInfo(str) {
    let timeInfo = typeof str === 'string' ? JSON.parse(str) : str;
    let startDate = new Date(timeInfo.from * 1000); 
    let endDate = new Date(timeInfo.to * 1000);
    return { startDate, startTime:`${startDate.getHours()}:${startDate.getMinutes()}`, endTime:`${endDate.getHours()}:${endDate.getMinutes()}`};
}

function OrderSetterForm({ info, params, silent, onClose, onDispatch }){
    const { subscribe_interval, subscribe_mode, subscribe_wind_speed, subscribe_temp, subscribe_prePoweron, subscribe_preMin, subscribe_preEndNotify, subscribe_preEndMin  } = params;
    let timeData  = subscribe_interval ? getTimeInfo(subscribe_interval) : null;
    const [currentDate, setDate] = useState( timeData ? moment(timeData.startDate) : null );
    const [timeInfo, setTimeInfo] = useState( timeData ? { startTime:timeData.startTime, endTime:timeData.endTime }: { startTime:'00:00', endTime:'00:00' });
    const [mode, setMode] = useState(subscribe_mode ? +subscribe_mode : null);
    const [wind, setWind] = useState(subscribe_wind_speed ? +subscribe_wind_speed : null);
    const [temp, setTemp] = useState(subscribe_temp ? +subscribe_temp : 26);
    const [preTime, setPreTime] = useState( subscribe_preMin ? +subscribe_preMin : 0);
    const [preEnable, setPreEnable] = useState( subscribe_prePoweron ? Boolean(subscribe_prePoweron) : true);
    const [noticeTime, setNoticeTime] = useState( subscribe_preEndMin ? +subscribe_preEndMin : 0);
    const [noticeEnable, setNoticeEnable] = useState( subscribe_preEndNotify ? Boolean(subscribe_preEndNotify) : true);
    return (
        <div className={style['form-container']}>
            <div className={style['form-title']}>{ '方案设置' + ' - ' + info.title }</div>
            <div className={style['form-content']}>
                <div className={style['form-item']} style={{ width:'100%', marginBottom:'3rem' }}>
                    <div className={style['form-item-label']}>预约时间</div>
                    <div className={style['form-item-control']}>
                        <DatePicker style={{ marginRight:'1rem' }} value={currentDate} className={style['custom-datepicker']} locale={zhCN} onChange={value=>setDate(value)} />
                        <CustomTimePicker opacity={true} startTime={timeInfo.startTime} endTime={timeInfo.endTime} onSelect={(obj)=>setTimeInfo(obj)} />
                    </div>                
                </div>
                <div className={style['form-item']} style={{ width:'100%', marginBottom:'3rem' }}>
                    <div className={style['form-item-label']}>模式</div>
                    <div className={style['form-item-control']}>
                        <Radio.Group value={mode} className={style['custom-radio']} onChange={e=>setMode(e.target.value)}>
                            <Radio value={1}>制冷</Radio>
                            <Radio value={3}>送风</Radio>
                            <Radio value={4}>制热</Radio>
                        </Radio.Group>
                    </div>                
                </div>
                <div className={style['form-item']} style={{ width:'100%', marginBottom:'3rem' }}>
                    <div className={style['form-item-label']}>风速</div>
                    <div className={style['form-item-control']}>
                        <Radio.Group value={wind} className={style['custom-radio']} onChange={e=>setWind(e.target.value)}>
                            <Radio value={0}>自动</Radio>
                            <Radio value={1}>1级</Radio>
                            <Radio value={2}>2级</Radio>
                            <Radio value={3}>3级</Radio>
                        </Radio.Group>
                    </div>               
                </div>
                <div className={style['form-item']} style={{ width:'100%', marginBottom:'3rem' }}>
                    <div className={style['form-item-label']}>温度设定</div>
                    <div className={style['form-item-control']}>
                        <div className={style['temp-container']}>
                            <span onClick={()=>{
                                let value = temp - 1;
                                if ( value < 16 ) {
                                    value = 16;
                                } 
                                setTemp(value);
                            }}><MinusOutlined /></span>
                            <Popover overlayClassName={style['custom-popover']} placement='top' content={
                                <div className={style['list-container']}>
                                    {
                                        tempData.map((item,index)=>(
                                            <div key={item} className={ item === temp ? style['selected'] : '' } onClick={()=>{
                                                setTemp(item);
                                            }}>{ item + ' ' + '℃' }</div>
                                        ))
                                    }
                                </div>
                            }><span>{ temp + '℃' }</span></Popover>
                            <span onClick={()=>{
                                let value = temp + 1;
                                if ( value > 32 ) {
                                    value = 32;
                                }
                                setTemp(value);
                            }}><PlusOutlined /></span>
                        </div>
                    </div>
                </div>
                
                <div className={style['form-item']} style={{ width:'100%', marginBottom:'3rem' }}>
                    <div className={style['form-item-label']}>提前开启</div>
                    <div className={style['form-item-control']} style={{ display:'flex', alignItems:'center' }}>
                        <Switch checked={preEnable} style={{ marginRight:'2rem' }} onChange={checked=>setPreEnable(checked)} checkedChildren='启用' unCheckedChildren='禁用' />
                        <InputNumber className={style['custom-inputnumber']} style={{ width:'200px' }} value={preTime} min={0} addonBefore='提前' addonAfter="分钟" onChange={value=>setPreTime(value)} />
                    </div>               
                </div>
                
                <div className={style['form-item']} style={{ width:'100%', marginBottom:'3rem' }}>
                    <div className={style['form-item-label']}>结束前通知</div>
                    <div className={style['form-item-control']} style={{ display:'flex', alignItems:'center' }}>
                        <Switch checked={noticeEnable} style={{ marginRight:'2rem' }} onChange={checked=>setNoticeEnable(checked)} checkedChildren='启用' unCheckedChildren='禁用' />
                        <InputNumber className={style['custom-inputnumber']} style={{ width:'200px' }} value={noticeTime} min={0} addonBefore='结束前' addonAfter="分钟" onChange={value=>setNoticeTime(value)} />
                    </div>               
                </div>
                {
                    silent 
                    ?
                    null
                    :
                    <div style={{ position:'absolute', left:'50%', transform:'translateX(-50%)', bottom:'4rem' }}>
                        <Button size='large' type='primary' style={{ marginRight:'1rem' }} onClick={()=>{
                            let obj = { ...params, subscribe_mode:mode, subscribe_wind_speed:wind, subscribe_temp:temp, subscribe_prePoweron:preEnable, subscribe_preMin:preTime, subscribe_preEndNotify:noticeEnable, subscribe_preEndMin:noticeTime };
                            if ( currentDate ) {
                                // if ( timeInfo.startTime === '')
                                let date = currentDate.format('YYYY-MM-DD');
                                let startTime = new Date(date + ' ' + timeInfo.startTime).getTime()/1000;
                                let endTime = new Date(date + ' ' + timeInfo.endTime).getTime()/1000;
                                console.log(startTime, endTime);
                                obj['subscribe_interval'] = { from:startTime, to:endTime };
                            } 
                            onDispatch({ type:'plan/setParams', payload:obj });
                            onClose();
                        }}>确认</Button>
                        <Button size='large' type='primary' ghost onClick={()=>onClose()}>取消</Button>
                    </div>
                }
                
                
            </div>
        </div>        
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.params !== nextProps.params ) {
        return false;
    } else {
        return true;
    }
}
export default React.memo(OrderSetterForm, areEqual);