import React, { useState } from 'react';
import { Popover, Radio, InputNumber, Tooltip, message, Button } from 'antd';
import { createFromIconfontCN, MinusOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import style from '../PlanManager.css';

const MyIcon = createFromIconfontCN({
    scriptUrl:'//at.alicdn.com/t/font_3086161_o5layfhgryf.js'
});
let tempData = [];
for(let i = 16; i <= 32; i++ ){
    tempData.push(i);
}
function TempSetterForm({ info, params, silent, onClose, onDispatch }){
    const { ctrl_mode, ctrl_wind_speed, ctrl_temp } = params;
    const [mode, setMode] = useState( ctrl_mode ? +ctrl_mode : 1);
    const [wind, setWind] = useState( ctrl_wind_speed ? +ctrl_wind_speed : 0);
    const [temp, setTemp] = useState( ctrl_temp ? +ctrl_temp : 26);
    const [value, setValue] = useState(15);
    
    return (
        <div className={style['form-container']}>
            <div className={style['form-title']}>{ '方案设置' + ' - ' + info.title }</div>
            <div className={style['form-content']}>
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
                    <div className={style['form-item-label']}>模式</div>
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
                {/* <div className={style['form-item']}>
                    <div className={style['form-item-label']}>刷新周期</div>
                    <div className={style['form-item-control']}>
                        <InputNumber style={{ width:'160px', marginRight:'0.5rem' }} value={value} addonAfter="分钟"/>
                        <Tooltip title='刷新周期最短为15分钟'>
                            <QuestionCircleOutlined style={{ marginTop:'10px', color:'rgba(255, 255, 255, 0.65)' }} />
                        </Tooltip>
                    </div>
                </div>    */}
            </div>
            {
                silent 
                ?
                null
                :
                <div style={{ position:'absolute', left:'50%', transform:'translateX(-50%)', bottom:'4rem' }}>
                    <Button size='large' type='primary' style={{ marginRight:'1rem' }} onClick={()=>{
                        onDispatch({ type:'plan/setParams', payload:{ ...params, ctrl_mode:mode, ctrl_wind_speed:wind, ctrl_temp:temp }});
                        onClose();
                    }}>确认</Button>
                    <Button size='large' type='primary' ghost onClick={()=>onClose()}>取消</Button>
                </div>
            }
            
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
export default React.memo(TempSetterForm, areEqual);