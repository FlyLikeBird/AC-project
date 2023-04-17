import React, { useState } from 'react';
import { Popover, message, Button } from 'antd';
import { createFromIconfontCN, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import style from '../PlanManager.css';

const MyIcon = createFromIconfontCN({
    scriptUrl:'//at.alicdn.com/t/font_3086161_o5layfhgryf.js'
});
let tempData = [];
for(let i = 16; i <= 32; i++ ){
    tempData.push(i);
}
function LimitTempForm({ info, params, silent, onClose, onDispatch }){
    const { templimit_low, templimit_high } = params;
    const [highTemp, setHighTemp] = useState(templimit_high ? +templimit_high : 26);
    const [lowTemp, setLowTemp] = useState(templimit_low ? +templimit_low : 24);
    return (
        <div className={style['form-container']}>
            <div className={style['form-title']}>{ '方案设置' + ' - ' + info.title }</div>
            <div className={style['form-content']}>
                <div style={{ display:'flex', alignItems:'center', margin:'2rem 0' }}>
                    <MyIcon type='icon-taiyang-copy' style={{ fontSize:'1.4rem', color:'#f9a526', marginRight:'0.5rem' }} />
                    <span className={style['label-text']} style={{ marginRight:'0.5rem' }}>制热模式高于此室温值不允许开启</span>
                    <div className={style['temp-container']}>
                        <span onClick={()=>{
                            let value = highTemp - 1;
                            if ( value < 16 ) {
                                value = 16;
                            } 
                            setHighTemp(value);
                        }}><MinusOutlined /></span>
                        <Popover overlayClassName={style['custom-popover']} placement='top' content={
                            <div className={style['list-container']}>
                                {
                                    tempData.map((item,index)=>(
                                        <div key={item} className={ item === highTemp ? style['selected'] : '' } onClick={()=>{
                                            setHighTemp(item);
                                        }}>{ item + ' ' + '℃' }</div>
                                    ))
                                }
                            </div>
                        }><span>{ highTemp + '℃' }</span></Popover>
                        <span onClick={()=>{
                            let value = highTemp + 1;
                            if ( value > 32 ) {
                                value = 32;
                            }
                            setHighTemp(value);
                        }}><PlusOutlined /></span>
                    </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', margin:'2rem 0' }}>
                    <MyIcon type='icon-kongdiao' style={{ fontSize:'1.4rem', color:'#5cc2e4', marginRight:'0.5rem' }} />
                    <span className={style['label-text']} style={{ marginRight:'0.5rem' }}>制冷模式低于此室温值不允许开启</span>
                    <div className={style['temp-container']}>
                        <span onClick={()=>{
                            let value = lowTemp - 1;
                            if ( value < 16 ) {
                                value = 16;
                            } 
                            setLowTemp(value);
                        }}><MinusOutlined /></span>
                        <Popover overlayClassName={style['custom-popover']} placement='top' content={
                            <div className={style['list-container']}>
                                {
                                    tempData.map((item,index)=>(
                                        <div key={item} className={ item === lowTemp ? style['selected'] : '' } onClick={()=>{
                                            setLowTemp(item);
                                        }}>{ item + ' ' + '℃' }</div>
                                    ))
                                }
                            </div>
                        }><span>{ lowTemp + '℃' }</span></Popover>
                        <span onClick={()=>{
                            let value = lowTemp + 1;
                            if ( value > 32 ) {
                                value = 32;
                            }
                            setLowTemp(value);
                        }}><PlusOutlined /></span>
                    </div>
                </div>
            </div>
            {
                silent 
                ?
                null
                :
                <div style={{ position:'absolute', left:'50%', transform:'translateX(-50%)', bottom:'4rem' }}>
                    <Button size='large' type='primary' style={{ marginRight:'1rem' }} onClick={()=>{
                        if ( highTemp > lowTemp ) {
                            onDispatch({ type:'plan/setParams', payload:{ ...params, templimit_low:lowTemp, templimit_high:highTemp }});
                            onClose();
                        } else {
                            message.info('制热模式的设定温度要高于制冷模式的设定温度');
                        }
                        
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
export default React.memo(LimitTempForm, areEqual);