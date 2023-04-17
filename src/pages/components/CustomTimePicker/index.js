import React, { useState, useEffect } from 'react';
import { Tooltip, Dropdown, message } from 'antd';
import { SwapRightOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import style from './CustomTimePicker.css';
let hourList = [], minutesList = [];
for ( let i = 0; i < 24 ; i++){
    hourList.push(i);
}
for ( let i = 0; i < 60; i++){
    minutesList.push(i);
}
function CustomTimePicker({ opacity, startTime, endTime, onSelect }){
    const [startHour, setStartHour] = useState(0);
    const [startMinutes, setStartMinutes] = useState(0);
    const [endHour, setEndHour] = useState(0);
    const [endMinutes, setEndMinutes] = useState(0);
    const [isEnd, setIsEnd] = useState(false);
    const [visible, setVisible] = useState(false);
    useEffect(()=>{
        function handleClick(){
            setVisible(false);
        }
        document.addEventListener('click', handleClick);
        return ()=>{
            document.removeEventListener('click', handleClick);
        }
    },[])
    useEffect(()=>{
        let startTimeArr = startTime.split(':');
        let endTimeArr = endTime.split(':');
        setStartHour(+startTimeArr[0]);
        setStartMinutes(+startTimeArr[1]);
        setEndHour(+endTimeArr[0]);
        setEndMinutes(+endTimeArr[1]);
    },[startTime]);
    useEffect(()=>{
        if ( !visible ) {
            setIsEnd(false);
        }
    },[visible])
    const dropMenu = (
        <div className={style['time-container']} style={{
            left:isEnd ? '70%' : '0',
            display:visible ? 'flex' : 'none'
        }}>
            <div className={style['arrow']}></div>
            <div className={style['time-list']}>
                <div className={style['time-list-title']}>小时</div>
                <div className={style['time-list-content']}>
                    {
                        hourList.map((item)=>(
                            <div 
                                className={style['time-item'] + ' ' + ( item === ( isEnd ? endHour : startHour ) ? style['selected'] : '' )} 
                                key={item} 
                                onClick={(e)=>{
                                    e.stopPropagation();                                 
                                    if ( isEnd ){
                                        // 判断结束时间和开始时间的逻辑
                                        setEndHour(item);                                 
                                    } else {
                                        setStartHour(item);
                                    }
                                }
                            }>{ item < 10 ? '0' + item : item + '' }</div>
                        ))
                    }
                </div>
                
            </div>
            <div className={style['time-list']}>
                <div className={style['time-list-title']}>分钟</div>
                <div className={style['time-list-content']}>
                    {
                        minutesList.map((item)=>(
                            <div className={style['time-item'] + ' ' + ( item === ( isEnd ? endMinutes : startMinutes) ? style['selected'] : '' )} key={item} onClick={(e)=>{
                                e.stopPropagation();
                                if ( isEnd ) {
                                    setEndMinutes(item);
                                    setVisible(false); 
                                    // 判断开始时间和截止时间的逻辑
                                    console.log(startHour, startMinutes);
                                    console.log(endHour, endMinutes);
                                    if ( endHour > startHour || ( endHour === startHour && item > startMinutes )) {
                                        if ( onSelect ) onSelect({ startTime:`${startHour}:${startMinutes}`, endTime:`${endHour}:${item}` });
                                    } else {
                                        message.info('结束时间不得小于开始时间');
                                        setStartHour(0);
                                        setStartMinutes(0);
                                        setEndHour(0);
                                        setEndMinutes(0);
                                    }                                                          
                                } else {
                                    setStartMinutes(item); 
                                    setIsEnd(true);
                                }
                            }}>{ item < 10 ? '0' + item : item + '' }</div>
                        ))
                    }
                </div>    
            </div>        
        </div>
    )
    
    return (  
        <div className={style['container'] + ' ' + ( opacity ? style['opacity'] : '')}>
            <div className={style['input-container']} onClick={(e)=>{ e.stopPropagation();setVisible(true) }}>
                <div>{ `${ startHour < 10 ? '0' + startHour : startHour}:${startMinutes < 10 ? '0' + startMinutes : startMinutes }`}</div>
                <SwapRightOutlined />
                <div>{ `${ endHour < 10 ? '0' + endHour : endHour}:${endMinutes < 10 ? '0' + endMinutes : endMinutes }`}</div>
                
                <ClockCircleOutlined className={style['clock-btn']} />
                <CloseCircleOutlined className={style['close-btn']} onClick={(e)=>{
                    e.stopPropagation();
                    if ( onSelect ) onSelect({ startTime:'00:00', endTime:'00:00' });
                }} />
            </div>
            { dropMenu }
        </div>            
    )
}

export default CustomTimePicker;