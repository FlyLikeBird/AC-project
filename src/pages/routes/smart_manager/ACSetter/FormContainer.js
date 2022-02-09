import React, { useState, useEffect } from 'react';
import { Form, Radio, Select, Button, Table, Modal, Checkbox, Switch, Popover, Input, InputNumber, DatePicker, TimePicker, message } from 'antd';
import { createFromIconfontCN, MinusOutlined, PlusOutlined, CloseCircleOutlined } from '@ant-design/icons';
import style from './FormContainer.css';
import IndexStyle from '@/pages/routes/IndexPage.css';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';

const { RangePicker } = DatePicker;
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
let tempData = [];
for(var i=-10;i<=30;i++){
    tempData.push(i);
}
function getWeekTimeObj(obj){
    let result = {};
    for(var i=1;i<=7;i++){
        let weekArr = [1,2,3,4].map((item,j)=>{
            if ( obj && obj[i] && obj[i][j] ){
                let startTime = obj[i][j].on;
                let endTime = obj[i][j].off;
                return { 'on':moment(`${startTime.hour}:${startTime.minute}`,'HH:mm'), 'off':moment(`${endTime.hour}:${endTime.minute}`, 'HH:mm') };
            } else {
                return { 'on':null, 'off':null };
            }
        });
        result[i] = weekArr;
    }
    return result;
}

function momentToStr(momentValue, formatter, divider){
    let result;
    if ( momentValue && momentValue._isAMomentObject ){
        result = momentValue.format(formatter).split(divider);
    } else {
        result = [];
    }
    return result;
}
function FormContainer({ dispatch, machList, tplList, info, onChangeTpl, onClose, }){
    let [tplId, setTplId] = useState(null);
    let [sumEnable, setSumEnable] = useState(true);
    let [title, setTitle] = useState('');
    let [seasonSummer, setSeasonSummer] = useState({ work_mode:1, start:moment('6-1','MM-DD'), end:moment('8-1','MM-DD')});
    let [seasonWinter, setSeasonWinter] = useState({ work_mode:1, start:moment('1-1','MM-DD'), end:moment('2-1','MM-DD')});
    let [seasonOther, setSeasonOther] = useState(1);
    let [tempInfo, setTempInfo] = useState({ temp_enable:true, temp_low:24, temp_high:26, highVisible:false, lowVisible:false });
    let [ctrlInfo, setCtrlInfo] = useState({ disctrl_enable:true, disctrl_from:moment('08:00','HH:mm'), disctrl_to:moment('18:00','HH:mm')});
    let [currentWeek, setCurrentWeek] = useState(1);
    let [weekTimeObj, setWeekTimeObj] = useState(getWeekTimeObj());
    let [runningInfo, setRunningInfo] = useState({ pom_mode:true, temp_low:24, temp_high:26, highVisible:false, lowVisible:false });
    let [exceptInfo, setExceptInfo] = useState({ except_enable:true, except_time:30 });
    let [autoInfo, setAutoInfo] = useState(weekData.map(item=>({ is_running:true, is_auto:true })));
    let [selected, setSelected] = useState([]);
    useEffect(()=>{
        if ( info.forEdit || info.forTpl ){
            let { plan_name, tempelate_name, season_summer, season_winter, season_other_work_mode, 
                temp_enable, temp_high, temp_low,
                disctrl_enable, disctrl_from, disctrl_to,
                wwi_monday, wwi_tuesday, wwi_wednesday, wwi_thursday, wwi_friday, wwi_saturday, wwi_sunday,
                pom_mode, pom_temp_heating, pom_temp_refrigeration,
                weekenable_except_enable, weekenable_except_mins,
                weekenable_interval_enable, weekenable_auto_enable,
                details
            } = info.currentPlan;
            setTitle( info.forTpl ? tempelate_name : plan_name);
            let summerInfo = JSON.parse(season_summer);
            let winterInfo = JSON.parse(season_winter);
            let ctrlStartTime = JSON.parse(disctrl_from);
            let ctrlEndTime = JSON.parse(disctrl_to);           
            setSeasonSummer({ work_mode:summerInfo.work_mode, start:moment(`${summerInfo.start.month}-${summerInfo.start.day}`, 'MM-DD'), end:moment(`${summerInfo.end.month}-${summerInfo.end.day}`, 'MM-DD')});
            setSeasonWinter({ work_mode:winterInfo.work_mode, start:moment(`${winterInfo.start.month}-${winterInfo.start.day}`, 'MM-DD'), end:moment(`${winterInfo.end.month}-${winterInfo.end.day}`, 'MM-DD')});
            setSeasonOther(Number(season_other_work_mode));
            setTempInfo({ temp_enable:Boolean(Number(temp_enable)), temp_high:Number(temp_high), temp_low:Number(temp_low), highVisible:false, lowVisible:false });
            setCtrlInfo({ disctrl_enable:Boolean(Number(disctrl_enable)), disctrl_from:moment(`${ctrlStartTime.hour}:${ctrlStartTime.minute}`, 'HH:mm'), disctrl_to:moment(`${ctrlEndTime.hour}:${ctrlEndTime.minute}`, 'HH:mm') })
            let weekSumInfo = {};
            weekSumInfo['1'] = JSON.parse(wwi_monday);
            weekSumInfo['2'] = JSON.parse(wwi_tuesday);
            weekSumInfo['3'] = JSON.parse(wwi_wednesday);
            weekSumInfo['4'] = JSON.parse(wwi_thursday);
            weekSumInfo['5'] = JSON.parse(wwi_friday);
            weekSumInfo['6'] = JSON.parse(wwi_saturday);
            weekSumInfo['7'] = JSON.parse(wwi_sunday);
            setWeekTimeObj(getWeekTimeObj(weekSumInfo));
            setRunningInfo({ pom_mode:Boolean(pom_mode), temp_low:Number(pom_temp_refrigeration), temp_high:Number(pom_temp_heating), highVisible:false, lowVisible:false });
            setExceptInfo({ except_enable:Boolean(weekenable_except_enable), except_time:Number(weekenable_except_mins) });
            var isRunningObj = JSON.parse(weekenable_interval_enable), isAutoObj = JSON.parse(weekenable_auto_enable);
            let autoArr = weekData.map(item=>({ is_running:isRunningObj[weekEnMaps[item]], is_auto:isAutoObj[weekEnMaps[item]]}));
            setAutoInfo(autoArr);
            // 编辑方案模式下才填入绑定设备，自动填入模板不填入设备
            if ( info.forEdit ){
                setSelected(details.map(i=>i.mach_id));
            }
        } else {
            // 重置状态
            setSumEnable(true);
            setTitle('');
            setSeasonSummer({ work_mode:1, start:moment('6-1','MM-DD'), end:moment('8-1','MM-DD')});
            setSeasonWinter({ work_mode:1, start:moment('1-1','MM-DD'), end:moment('2-1','MM-DD')});
            setSeasonOther(1);
            setTempInfo({ temp_enable:true, temp_low:24, temp_high:26, highVisible:false, lowVisible:false });
            setCtrlInfo({ disctrl_enable:true, disctrl_from:moment('08:00','HH:mm'), disctrl_to:moment('18:00','HH:mm')});
            setCurrentWeek(1);
            setWeekTimeObj(getWeekTimeObj());
            setRunningInfo({ pom_mode:true, temp_low:24, temp_high:26, highVisible:false, lowVisible:false });
            setExceptInfo({ except_enable:true, except_time:30 });
            setAutoInfo(weekData.map(item=>({ is_running:true, is_auto:true })));
            setSelected([]);
            setTplId(null);
        }
    },[info]);
    
    return (
        <Modal
            width='1000px'
            className={IndexStyle['custom-modal']}
            title='方案详情'
            footer={null}
            visible={info.visible}
            onCancel={()=>onClose()}
        >
            <div className={style['form-container']}>
                {
                    !info.forEdit && tplList && tplList.length 
                    ?
                    <div style={{ display:'flex', alignItems:'center', margin:'10px 0' }} >
                        <span>选择模板 : </span>
                        <Select className={style['custom-select']} placeholder='选择要应用的模板' style={{ width:'360px', marginLeft:'10px' }} value={tplId} onSelect={value=>{
                            setTplId(value);
                            let obj = tplList.filter(i=>i.tempelate_id === value)[0];
                            onChangeTpl({ visible:true, forTpl:true, currentPlan:obj });
                        }}>
                            {
                                tplList.map((item,index)=>(
                                    <Option key={item.tempelate_id} value={item.tempelate_id}>
                                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                                            <span>{ item.tempelate_name }</span>
                                            <CloseCircleOutlined onClick={(e)=>{
                                                e.stopPropagation();
                                                new Promise((resolve, reject)=>{
                                                    dispatch({ type:'controller/delTplSync', payload:{ resolve, reject, tempelate_id:item.tempelate_id }})
                                                })
                                                .then(()=>{
                                                    message.success('删除模板成功');
                                                })
                                                .catch(msg=>message.error(msg));
                                            }} />
                                        </div>
                                    </Option>
                                ))
                            }
                        </Select>
                    </div>
                    :
                    null
                }
                
                <div style={{ display:'flex', alignItems:'center' }}>
                    <span>方案名称 :</span>
                    <Input className={style['custom-input']} style={{ width:'360px', marginLeft:'10px' }} value={title} onChange={e=>setTitle(e.target.value)} />
                </div>
                {/* 自动控制总开关 */}
                <div className={style['form-item']}>
                    <div className={style['form-item-title']}>自动控制总开关</div>
                    <div className={style['form-item-content']}>
                        <div className={style['inline-flex']} style={{ margin:'0' }}>
                            <span className={style['label-text']}>开关启用/禁用</span>
                            <Switch  checkedChildren='启用' unCheckedChildren='禁用' checked={sumEnable} onChange={checked=>setSumEnable(checked)} />
                        </div>
                    </div>
                </div>
                {/* 季节运行模式 */}
                <div className={style['form-item']}>
                    <div className={style['form-item-title']}>季节运行模式</div>
                    <div className={style['form-item-content']}>
                        <table className={style['custom-table']}>
                            <thead>
                                <tr>
                                    <th>季节</th>
                                    <th>模式</th>
                                    <th>设定时间</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>夏季</td>
                                    <td>
                                        <Radio.Group className={style['custom-radio']} value={seasonSummer.work_mode} onChange={e=>{
                                            setSeasonSummer({ ...seasonSummer, work_mode:e.target.value });
                                        }}>
                                            <Radio value={4}>制热</Radio>
                                            <Radio value={1}>制冷</Radio>
                                            <Radio value={3}>送风</Radio>
                                        </Radio.Group>
                                    </td>
                                    <td><RangePicker className={style['custom-date-picker']} allowClear={false} locale={zhCN} format='MM-DD' value={[seasonSummer.start, seasonSummer.end]}  onChange={dates=>{
                                        setSeasonSummer({ ...seasonSummer, start:dates[0], end:dates[1] });
                                    }} /></td>
                                </tr>
                                <tr>
                                    <td>冬季</td>
                                    <td>
                                        <Radio.Group className={style['custom-radio']} value={seasonWinter.work_mode} onChange={e=>{
                                            setSeasonWinter({ ...seasonWinter, work_mode:e.target.value });
                                        }}>
                                            <Radio value={4}>制热</Radio>
                                            <Radio value={1}>制冷</Radio>
                                            <Radio value={3}>送风</Radio>
                                        </Radio.Group>
                                    </td>
                                    <td><RangePicker className={style['custom-date-picker']} allowClear={false} locale={zhCN}  format='MM-DD' value={[seasonWinter.start, seasonWinter.end]} onChange={dates=>{
                                        setSeasonWinter({ ...seasonWinter, start:dates[0], end:dates[1] });
                                    }} /></td>
                                </tr>
                                <tr>
                                    <td>其他时段</td>
                                    <td colSpan={2}>
                                        <Radio.Group className={style['custom-radio']} value={seasonOther} onChange={e=>{
                                            setSeasonOther(e.target.value);
                                        }}>
                                            <Radio value={4}>制热</Radio>
                                            <Radio value={1}>制冷</Radio>
                                            <Radio value={3}>送风</Radio>
                                        </Radio.Group>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                    </div>
                </div>
                {/* 温度限值 */}
                <div className={style['form-item']}>
                    <div className={style['form-item-title']}>温度限值</div>
                    <div className={style['form-item-content']}>
                        <div className={style['inline-flex']}><span className={style['label-text']}>临时不受控</span><Switch  checkedChildren='启用' unCheckedChildren='禁用' checked={tempInfo.temp_enable} onChange={checked=>{
                            setTempInfo({ ...tempInfo, temp_enable:checked });
                        }} /></div>
                        <div>
                            <div className={style['inline-flex']} style={{ marginRight:'2rem' }}>
                                <MyIcon type='icon-taiyang-copy' style={{ fontSize:'2rem', color:'#f9a526', marginRight:'6px' }} />
                                <span className={style['label-text']}>制热最高温度</span>
                                <div className={style['temp-container']}>
                                    <span onClick={()=>{setTempInfo({ ...tempInfo, temp_high:tempInfo.temp_high - 1 })}}><MinusOutlined /></span>
                                    <Popover visible={tempInfo.highVisible} onVisibleChange={visible=>{
                                        setTempInfo({ ...tempInfo, highVisible:visible });                                   
                                    }} overlayClassName={style['custom-popover']} placement='top' content={
                                        <div className={style['list-container']}>
                                            {
                                                tempData.map((item,index)=>(
                                                    <div key={item} className={ item === tempInfo.temp_high ? style['selected'] : '' } onClick={()=>{
                                                        setTempInfo({ ...tempInfo, temp_high:item, highVisible:false });
                                                    }}>{ item + ' ' + '℃' }</div>
                                                ))
                                            }
                                        </div>
                                    }><span>{ tempInfo.temp_high + '℃' }</span></Popover>
                                    <span onClick={()=>{ setTempInfo({ ...tempInfo, temp_high:tempInfo.temp_high + 1 })}}><PlusOutlined /></span>
                                </div>
                            </div>
                            <div className={style['inline-flex']}>
                                <MyIcon type='icon-kongdiao' style={{ fontSize:'2rem', color:'#5cc2e4', marginRight:'6px' }} />
                                <span className={style['label-text']}>制冷最低温度</span>
                                <div className={style['temp-container']}>
                                    <span onClick={()=>{setTempInfo({ ...tempInfo, temp_low:tempInfo.temp_low - 1 })}}><MinusOutlined /></span>
                                    <Popover visible={tempInfo.lowVisible} onVisibleChange={visible=>{
                                        setTempInfo({ ...tempInfo, lowVisible:visible });                                   
                                    }} overlayClassName={style['custom-popover']} placement='top' content={
                                        <div className={style['list-container']}>
                                            {
                                                tempData.map((item,index)=>(
                                                    <div key={item} className={ item === tempInfo.temp_low ? style['selected'] : '' } onClick={()=>{
                                                        setTempInfo({ ...tempInfo, temp_low:item, lowVisible:false });
                                                    }}>{ item + ' ' + '℃' }</div>
                                                ))
                                            }
                                        </div>
                                    }><span>{ tempInfo.temp_low + '℃' }</span></Popover>
                                    <span onClick={()=>{ setTempInfo({ ...tempInfo, temp_low:tempInfo.temp_low + 1 })}}><PlusOutlined /></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 临时不管控设置 */}
                <div className={style['form-item']}>
                    <div className={style['form-item-title']}>临时不管控设置</div>
                    <div className={style['form-item-content']}>
                        <div className={style['inline-flex']}><span className={style['label-text']}>临时不受控</span><Switch  checkedChildren='启用' unCheckedChildren='禁用' checked={ctrlInfo.disctrl_enable} onChange={checked=>{
                            setCtrlInfo({ ...ctrlInfo, disctrl_enable:checked });
                        }} /></div>
                        <div>
                            <span className={style['label-text']}>开始时间-结束时间 : </span>
                            <TimePicker.RangePicker locale={zhCN} className={style['custom-date-picker']} allowClear={false} format='HH:mm' value={[ctrlInfo.disctrl_from, ctrlInfo.disctrl_to]} onChange={dates=>{
                                setCtrlInfo({ ...ctrlInfo, disctrl_from:dates[0], disctrl_to:dates[1] });
                            }} />
                        </div>
                    </div>
                </div>
                {/* 每日空调开机时段 */}
                <div className={style['form-item']}>
                    <div className={style['form-item-title']}>每日空调开机时段</div>
                    <div className={style['form-item-content']}>
                        <div className={style['inline-flex']}>
                            <Select className={style['custom-select']} style={{ width:'140px', marginRight:'20px' }} value={currentWeek} onChange={value=>{
                                setCurrentWeek(value);
                            }}>
                                {
                                    weekData.map((item,index)=>(
                                        <Option key={item} value={item}>{ weekMaps[item] }</Option>
                                    ))
                                }
                            </Select>
                            <div className={style['inline-flex']} style={{ flexWrap:'wrap' }}>
                                {
                                    weekTimeObj[currentWeek] && weekTimeObj[currentWeek].length 
                                    ?
                                    weekTimeObj[currentWeek].map((item,index)=>(
                                        <div key={`${currentWeek}-${index}`} style={{ marginRight:'14px', marginBottom:'6px'}}>
                                            <span className={style['label-text']}>{ '工作时段' + (index + 1) }</span>
                                            <TimePicker.RangePicker locale={zhCN} className={style['custom-date-picker']} format='HH:mm' value={[item.on, item.off]} onChange={dates=>{
                                                let temp = { ...weekTimeObj };
                                                temp[currentWeek] = temp[currentWeek].map((item, j)=>{
                                                    if ( j === index ) {
                                                        item.on = dates ? dates[0] : null;
                                                        item.off = dates ? dates[1] : null;
                                                        return item;
                                                    } else {
                                                        return item;
                                                    }
                                                });                                            
                                                setWeekTimeObj(temp);
                                            }} />
                                        </div>
                                    ))
                                    :
                                    null
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {/* 开机工作模式 */}
                <div className={style['form-item']}>
                    <div className={style['form-item-title']}>开机工作模式</div>
                    <div className={style['form-item-content']}>
                        <div className={style['inline-flex']}><span className={style['label-text']}>按季节预设模式</span><Switch  checkedChildren='启用' unCheckedChildren='禁用' checked={runningInfo.pom_mode} onChange={checked=>{
                            setRunningInfo({ ...runningInfo, pom_mode:checked });
                        }} /></div>
                        <div>
                            <div className={style['inline-flex']} style={{ marginRight:'2rem' }}>
                                <MyIcon type='icon-taiyang-copy' style={{ fontSize:'2rem', color:'#f9a526', marginRight:'6px' }} />
                                <span className={style['label-text']}>制热预设温度</span>
                                <div className={style['temp-container']}>
                                    <span onClick={()=>setRunningInfo({ ...runningInfo, temp_high:runningInfo.temp_high - 1})}><MinusOutlined /></span>
                                    <Popover visible={runningInfo.highVisible} onVisibleChange={visible=>{
                                            setRunningInfo({ ...runningInfo, highVisible:visible });                                   
                                        }} overlayClassName={style['custom-popover']} placement='top' content={
                                            <div className={style['list-container']}>
                                                {
                                                    tempData.map((item,index)=>(
                                                        <div key={item} className={ item === runningInfo.temp_high ? style['selected'] : '' } onClick={()=>{
                                                            setRunningInfo({ ...runningInfo, temp_high:item, highVisible:false });
                                                        }}>{ item + ' ' + '℃' }</div>
                                                    ))
                                                }
                                            </div>
                                        }><span>{ runningInfo.temp_high + '℃' }</span></Popover>
                                    <span onClick={()=>setRunningInfo({ ...runningInfo, temp_high:runningInfo.temp_high + 1})}><PlusOutlined /></span>
                                </div>
                            </div>
                            <div className={style['inline-flex']}>
                                <MyIcon type='icon-kongdiao' style={{ fontSize:'2rem', color:'#5cc2e4', marginRight:'6px'  }} />
                                <span className={style['label-text']}>制冷预设温度</span>
                                <div className={style['temp-container']}>
                                    <span onClick={()=>setRunningInfo({ ...runningInfo, temp_low:runningInfo.temp_low - 1})}><MinusOutlined /></span>
                                    <Popover visible={runningInfo.lowVisible} onVisibleChange={visible=>{
                                            setRunningInfo({ ...runningInfo, lowVisible:visible });                                   
                                        }} overlayClassName={style['custom-popover']} placement='top' content={
                                            <div className={style['list-container']}>
                                                {
                                                    tempData.map((item,index)=>(
                                                        <div key={item} className={ item === runningInfo.temp_low ? style['selected'] : '' } onClick={()=>{
                                                            setRunningInfo({ ...runningInfo, temp_low:item, lowVisible:false });
                                                        }}>{ item + ' ' + '℃' }</div>
                                                    ))
                                                }
                                            </div>
                                        }><span>{ runningInfo.temp_low + '℃' }</span></Popover>
                                    <span onClick={()=>setRunningInfo({ ...runningInfo, temp_low:runningInfo.temp_low + 1})}><PlusOutlined /></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 每日开机时段参数 */}
                <div className={style['form-item']}>
                    <div className={style['form-item-title']}>每日开机时段参数</div>
                    <div className={style['form-item-content']}>
                        <div className={style['inline-flex']}>
                            <span className={style['label-text']}>工作时段外允许开机</span>
                            <Switch style={{ marginRight:'20px' }} checkedChildren='启用' unCheckedChildren='禁用' checked={exceptInfo.except_enable} onChange={checked=>{
                                setExceptInfo({ ...exceptInfo, except_enable:checked })
                            }}/>
                            <span className={style['label-text']}>允许开机时长</span>
                            <InputNumber style={{ width:'120px' }} className={style['custom-input']} formatter={value=>`${value} 分钟`} disabled={exceptInfo.except_enable ? false : true } value={exceptInfo.except_time} onChange={value=>setExceptInfo({ ...exceptInfo, except_time:value })} />
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
                                        autoInfo.map((item,index)=>(
                                            <td key={index}><Switch  checkedChildren='启用' unCheckedChildren='禁用' checked={item.is_running} onChange={checked=>{
                                                let temp = [...autoInfo];
                                                temp[index].is_running = checked;
                                                setAutoInfo(temp);
                                            }}/></td>
                                        ))
                                    }
                                </tr>
                                <tr>
                                    <td>是否允许自动开机</td>
                                    {
                                        autoInfo.map((item,index)=>(
                                            <td key={index}><Switch  checkedChildren='启用' unCheckedChildren='禁用' checked={item.is_auto} onChange={checked=>{
                                                let temp = [...autoInfo];
                                                temp[index].is_auto = checked;
                                                setAutoInfo(temp);
                                            }} /></td>
                                        ))
                                    }
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={style['form-item']}>
                    <div className={style['form-item-title']}>选择空调设备</div>
                    <div className={style['form-item-content']}>
                        <Select className={style['custom-select']} style={{ width:'100%'}} mode='multiple' allowClear value={selected} onChange={value=>setSelected(value)}>
                            {
                                machList && machList.length 
                                ?
                                machList.map(item=>(
                                    <Option key={item.mach_id} value={item.mach_id}>{ item.meter_name }</Option>
                                ))
                                :
                                null
                            }
                        </Select>
                    </div>
                </div>
                <div style={{ textAlign:'center', margin:'14px 0' }}>
                    <Button type='primary' onClick={()=>{
                        if ( !title ){
                            message.info('方案名称不能为空');
                            return ;
                        }
                        if ( selected.length ){
                            let values = {};
                            let seasonSummerStart = momentToStr(seasonSummer.start,'MM-DD', '-');
                            let seasonSummerEnd = momentToStr(seasonSummer.end, 'MM-DD','-');
                            let seasonWinterStart = momentToStr(seasonWinter.start, 'MM-DD', '-');
                            let seasonWinterEnd = momentToStr(seasonWinter.end, 'MM-DD','-');
                            let ctrlStartTime = momentToStr(ctrlInfo.disctrl_from,'HH:mm',':');
                            let ctrlEndTime = momentToStr(ctrlInfo.disctrl_to,'HH:mm',':');
                            values['plan_name'] = title;
                            values['ams_enable'] = sumEnable;
                            values['season_summer'] = { work_mode:seasonSummer.work_mode, start:{ month:seasonSummerStart[0], day:seasonSummerStart[1] }, end:{ month:seasonSummerEnd[0], day:seasonSummerEnd[1] }};
                            values['season_winter'] = { work_mode:seasonWinter.work_mode, start:{ month:seasonWinterStart[0], day:seasonWinterStart[1]}, end:{ month:seasonWinterEnd[0], day:seasonWinterEnd[1]}};
                            values['season_other_work_mode'] = seasonOther;
                            values['temp_enable'] = tempInfo.temp_enable;
                            values['temp_low'] = tempInfo.temp_low;
                            values['temp_high'] = tempInfo.temp_high;
                            values['disctrl_enable'] = ctrlInfo.disctrl_enable;
                            values['disctrl_from'] = { hour:ctrlStartTime[0], minute:ctrlStartTime[1] };
                            values['disctrl_to'] = { hour:ctrlEndTime[0], minute:ctrlEndTime[1] };
                            Object.keys(weekTimeObj).forEach(week=>{
                                values[`wwi_${weekEnMaps[week].toLowerCase()}`] = weekTimeObj[week].map(item=>{
                                    let obj = {};
                                    if ( item.on && item.off ){
                                        let startStr = item.on.format('HH:mm').split(':');
                                        let endStr = item.off.format('HH:mm').split(':');
                                        obj['on'] = { hour:startStr[0], minute:startStr[1] };
                                        obj['off'] = { hour:endStr[0], minute:endStr[1] };
                                    } else {
                                        obj['on'] = null;
                                    }
                                    return obj;
                                }).filter(item=>item.on)
                            });
                            values['pom_mode'] = runningInfo.pom_mode ? '2' : '1';
                            values['pom_temp_refrigeration'] = runningInfo.temp_low;
                            values['pom_temp_heating'] = runningInfo.temp_high;
                            values['weekenable_except_enable'] = exceptInfo.except_enable;
                            values['weekenable_except_mins'] = exceptInfo.except_time;
                            let isRunningObj = {}, isAutoObj = {};
                            autoInfo.forEach((item,index)=>{
                                isRunningObj[weekEnMaps[index+1]] = item.is_running;
                                isAutoObj[weekEnMaps[index+1]] = item.is_auto;
                            });
                            values['weekenable_interval_enable'] = isRunningObj;
                            values['weekenable_auto_enable'] = isAutoObj;
                            values['mach_ids'] = selected;
                            if ( info.forEdit ){
                                values['plan_id'] = info.currentPlan.plan_id;
                            }
                            new Promise((resolve, reject)=>{
                                dispatch({ type:'controller/addPlanSync', payload:{ values, resolve, reject, forEdit:info.forEdit }})
                            })
                            .then(()=>{
                                // 重置状态，关闭弹窗
                                message.success(`${ info.forEdit ? '修改' : '添加'}方案成功`);
                                onClose();
                            })
                            .catch(msg=>message.error(msg))
                        } else {
                            message.info('请至少选择一个要推送的空调设备!');
                        }
                    }} style={{ marginRight:'14px' }}>确定</Button>
                    <Button onClick={()=>onClose()}>取消</Button>
                </div>
            </div> 
        </Modal>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.info !== nextProps.info || prevProps.tplList !== nextProps.tplList ){
        return false;
    } else {
        return true;
    }
}
export default React.memo(FormContainer, areEqual);