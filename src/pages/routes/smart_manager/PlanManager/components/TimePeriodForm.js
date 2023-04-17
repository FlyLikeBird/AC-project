import React, { useState, useEffect } from 'react';
import { Popover, Radio, DatePicker, Select, Switch, InputNumber, Tooltip, message, Button } from 'antd';
import { createFromIconfontCN, MinusOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import style from '../PlanManager.css';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import CustomTimePicker from '@/pages/components/CustomTimePicker';

const { Option } = Select;
const MyIcon = createFromIconfontCN({
    scriptUrl:'//at.alicdn.com/t/font_3086161_o5layfhgryf.js'
});
const weekMaps = {
    1:'周一',
    2:'周二',
    3:'周三',
    4:'周四',
    5:'周五',
    6:'周六',
    7:'周日'
};
const weekEnMaps = {
    1:'Monday',
    2:'Tuesday',
    3:'Wednesday',
    4:'Thursday',
    5:'Friday',
    6:'Saturday',
    7:'Sunday'
};

let weekData = [];
for(var i=1;i<=7;i++){
    weekData.push(i);
}

function formatWeeknabelData(str1, str2){
    let data1 = typeof str1 === 'string' ? JSON.parse(str1) : str1;
    let data2 = typeof str2 === 'string' ? JSON.parse(str2) : str2;
    return weekData.map(week=>{
        return { is_running:data1[weekEnMaps[week]], is_auto:data2[weekEnMaps[week]]  }
    })
}

function formatTimeInfo(fromTime, toTime){
    let startDate = new Date( (+fromTime) * 1000); 
    let endDate = new Date( (+toTime) * 1000);    
    return { startTime:`${startDate.getHours()}:${startDate.getMinutes()}`, endTime:`${endDate.getHours()}:${endDate.getMinutes()}`};
}
function TimePeriodForm({ info, params, silent, onClose, onDispatch }){
    const { disctrl_from, disctrl_to, weekenable_interval_enable, weekenable_auto_enable  } = params;
    let timeInfo = disctrl_from && disctrl_to ? formatTimeInfo(disctrl_from, disctrl_to) : null;
    const [unControlTime, setUnControlTime] = useState( timeInfo ? { startTime:timeInfo.startTime, endTime:timeInfo.endTime } : { startTime:'00:00', endTime:'00:00' });
    const [autoEnable, setAutoEnable] = useState(true);
    const [runningList, setRunningList] = useState( weekenable_interval_enable ? formatWeeknabelData(weekenable_interval_enable, weekenable_auto_enable) : weekData.map(item=>({ is_running:true, is_auto:true })));
    const [isSync, setSync] = useState(false);
    const [currentWeek, setCurrentWeek] = useState(1);
    const [weekTimeMaps, setWeekTimeMaps] = useState({});
    useEffect(()=>{
        // 初始化表单的各种状态
        let result = weekData.reduce((sum, cur)=>{
            let temp = params['wwi_' + weekEnMaps[cur].toLowerCase()];
            let timeArr = temp && typeof temp === 'string' ? JSON.parse(temp) : null;
            sum[cur] = [1,2,3,4].map((item, j)=>({ 
                startTime: timeArr && timeArr.length ? timeArr[j].on.hour + ':' + timeArr[j].on.minute : '00:00', 
                endTime: timeArr && timeArr.length ? timeArr[j].off.hour + ':' + timeArr[j].off.minute : '00:00' 
            }));
            return sum;
        }, {});
        setWeekTimeMaps(result);
    },[])

    return (
        <div className={style['form-container']}>
            <div className={style['form-title']}>{ '方案设置' + ' - ' + info.title }</div>
            <div className={style['form-content']}>
                <div style={{ marginBottom:'3rem'}}>
                    <div style={{ fontSize:'1.2rem', marginBottom:'1rem' }}>临时不管控设置</div>
                    <div>
                        <CustomTimePicker opacity={true} startTime={unControlTime.startTime} endTime={unControlTime.endTime} onSelect={(obj)=>setUnControlTime(obj)} />
                    </div>                
                </div>
                <div style={{ marginBottom:'3rem' }}>
                    <div style={{ fontSize:'1.2rem', marginBottom:'1rem' }}>每日开机时段参数</div>
                    <div style={{ display:'flex', alignItems:'center', margin:'1rem 0' }}>
                        <div style={{ fontSize:'0.8rem', color:'rgba(255, 255, 255, 0.65)', marginRight:'0.5rem' }}>工作时段外允许开机</div>
                        <Switch checked={autoEnable} onChange={checked=>setAutoEnable(checked)} checkedChildren='启用' unCheckedChildren='禁用' />
                    </div>
                    <table className={style['custom-table']}>
                        <thead>
                            <tr>
                                <th></th>
                                {
                                    weekData.map((item)=>(
                                        <th key={item}>{ weekMaps[item] }</th>
                                    ))
                                }
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>开机时段是否停用</td>
                                {
                                    runningList.map((item,index)=>(
                                        <td key={index}><Switch  checkedChildren='启用' unCheckedChildren='禁用' checked={item.is_running} onChange={checked=>{
                                            let temp = [...runningList];
                                            temp[index].is_running = checked;
                                            setRunningList(temp);
                                        }}/></td>
                                    ))
                                }
                            </tr>
                            <tr>
                                <td>是否允许自动开机</td>
                                {
                                    runningList.map((item,index)=>(
                                        <td key={index}><Switch  checkedChildren='启用' unCheckedChildren='禁用' checked={item.is_auto} onChange={checked=>{
                                            let temp = [...runningList];
                                            temp[index].is_auto = checked;
                                            setRunningList(temp);
                                            
                                        }} /></td>
                                    ))
                                }
                            </tr>
                        </tbody>
                    </table>              
                </div>
                
                <div>
                    <div style={{ marginBottom:'1rem', fontSize:'1.2rem' }}>每日空调开机时段</div>
                    <div style={{ display:'flex', alignItems:'center', margin:'1rem 0' }}>
                        <div style={{ fontSize:'0.8rem', color:'rgba(255, 255, 255, 0.65)', marginRight:'0.5rem' }}>同步至每日</div>
                        <Switch checked={isSync} onChange={checked=>setSync(checked)} checkedChildren='启用' unCheckedChildren='禁用' />
                    </div>
                    <div style={{ display:'flex', alignItems:'center' }}>
                        <Select className={style['custom-select']} style={{ width:'100px', marginRight:'2rem' }} value={currentWeek} onChange={value=>setCurrentWeek(value)}>
                            {
                                weekData.map((item)=>(
                                    <Option key={item} value={item}>{ weekMaps[item] }</Option>
                                ))
                            }
                        </Select>
                        <div style={{ width:'600px' }}>
                            {
                                weekTimeMaps[currentWeek] && weekTimeMaps[currentWeek].length 
                                ?
                                weekTimeMaps[currentWeek].map((item,index)=>(
                                    <div key={`${currentWeek}-${index}`} className={style['form-item']} style={{ marginBottom:'1rem' }}>
                                        <div className={style['form-item-label']}>{ '工作时段' + ( index + 1 ) }</div>
                                        <div className={style['form-item-control']}>
                                            <CustomTimePicker opacity={true} startTime={item.startTime} endTime={item.endTime} onSelect={({ startTime, endTime })=>{
                                                let newArr = weekTimeMaps[currentWeek].map((item, j)=>{
                                                    if ( j === index ) {
                                                        return { startTime, endTime };
                                                    } else {
                                                        return item;
                                                    }
                                                });
                                                if ( isSync ) {
                                                    // 更新每日的时段信息
                                                    let result = { ...weekTimeMaps };
                                                    Object.keys(result).forEach(week=>{
                                                        result[week] = newArr;
                                                    });
                                                    setWeekTimeMaps(result);
                                                } else {
                                                    // 只更新选择当天的时段信息
                                                    let result = { ...weekTimeMaps, [currentWeek]:newArr };
                                                    console.log(result);
                                                    setWeekTimeMaps(result);
                                                }
                                            }} />
                                        </div>
                                    </div>
                                ))
                                :
                                null
                            }
                           
                        </div>
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
                        let obj = { ...params }, weekenable_interval_enable = {}, weekenable_auto_enable = {};
                        let date = new Date();
                        let dateStr = date.getFullYear() + '-' + ( date.getMonth() + 1 ) + '-' + date.getDate();
                        if ( unControlTime.startTime === '00:00' && unControlTime.endTime === '00:00' ) {
                            obj['disctrl_enable'] = false;
                            
                        } else {
                            let startTime = new Date(dateStr + ' ' + unControlTime.startTime).getTime()/1000;
                            let endTime = new Date(dateStr + ' ' + unControlTime.endTime).getTime()/1000;
                            obj['disctrl_enable'] = true;
                            obj['disctrl_from'] = startTime;
                            obj['disctrl_to'] = endTime;
                        }
                        runningList.forEach((item, index)=>{
                            weekenable_interval_enable[weekEnMaps[index+1]] = item.is_running;
                            weekenable_auto_enable[weekEnMaps[index+1]] = item.is_auto;
                        });
                        obj['weekenable_interval_enable'] = weekenable_interval_enable;
                        obj['weekenable_auto_enable'] = weekenable_auto_enable;
                        // 处理每周开机时段信息
                        console.log(weekTimeMaps);
                    
                        Object.keys(weekTimeMaps).forEach(week=>{
                            obj['wwi_' + weekEnMaps[week].toLowerCase()] = weekTimeMaps[week].map(i=>{
                                let startArr = i.startTime.split(':');
                                let endArr = i.endTime.split(':');
                                return {
                                    on:{ hour:+startArr[0], minute:+startArr[1] },
                                    off:{ hour:+endArr[0], minute:+endArr[1] }
                                }
                            })
                        });
                        onDispatch({ type:'plan/setParams', payload:obj });
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

export default React.memo(TimePeriodForm, areEqual);