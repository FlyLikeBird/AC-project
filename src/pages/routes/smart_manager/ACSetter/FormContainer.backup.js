import React, { useState, useEffect } from 'react';
import { Form, Radio, Select, Button, Table, Modal, Checkbox, Switch, Popover, Input, DatePicker, TimePicker } from 'antd';
import { createFromIconfontCN, MinusOutlined, PlusOutlined } from '@ant-design/icons';
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
}
let weekData = [];
for(var i=1;i<=7;i++){
    weekData.push(i);
}
let tempData = [];
for(var i=-10;i<=30;i++){
    tempData.push(i);
}
function getWeekTimeArr(rowIndex){
    let result = [];
    for(var i=0;i<rowIndex;i++){
        result.push([{ title:`工作时段${i+1}`}, ...weekData.map(()=>({ 'on':moment('08:00', 'HH:mm'), 'off':moment('18:00','HH:mm')}) )])
    }
    return result;
}
function FormContainer({ dispatch, visible, onClose, data }){
    const [form] = Form.useForm();
    let [amsEnable, setAmsEnable] = useState(true);
    let [seasonSummer, setSeasonSummer] = useState({ work_mode:1, start:moment(new Date('2021-6-1')), end:moment(new Date('2021-8-31'))});
    let [seasonWinter, setSeasonWinter] = useState({ work_mode:1, start:moment(new Date('2021-12-1')), end:moment(new Date('2022-2-28'))})
    let [seasonOther, setSeasonOther] = useState(1);
    let [tempInfo, setTempInfo] = useState({ temp_enable:true, temp_low:26, temp_high:30, highVisible:false, lowVisible:false });
    let [ctrlInfo, setCtrlInfo] = useState({ disctrl_enable:true, disctrl_from:moment('08:00','HH:mm'), disctrl_to:moment('18:00','HH:mm')});
    let [timePeriod, setTimePeriod] = useState(1);
    let [weekTimeArr, setWeekTimeArr] = useState(getWeekTimeArr(timePeriod));
    console.log(weekTimeArr);
    useEffect(()=>{
        
    },[data]);
    useEffect(()=>{
        setWeekTimeArr(getWeekTimeArr(timePeriod));
    },[timePeriod])
    return (
        <Modal
            width='1200px'
            className={IndexStyle['custom-modal']}
            title='方案详情'
            footer={null}
            visible={visible}
            onCancel={()=>onClose()}
        >
            <div className={style['form-container']}>
                {/* 自动控制总开关 */}
                <div className={style['form-item']}>
                    <div className={style['form-item-title']}>自动控制总开关</div>
                    <div className={style['form-item-content']}>
                        <div className={style['inline-flex']} style={{ margin:'0' }}>
                            <span className={style['label-text']}>开关启用/禁用</span>
                            <Switch  checkedChildren='启用' unCheckedChildren='禁用' checked={amsEnable} />
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
                                    <td><RangePicker className={style['custom-date-picker']} allowClear={false} locale={zhCN} format='MM-DD' value={[seasonSummer.start, seasonSummer.end]} onChange={dates=>{
                                        setSeasonSummer({ ...seasonSummer, start:dates[0], end:dates[1] });
                                    }} /></td>
                                </tr>
                                <tr>
                                    <td>冬季</td>
                                    <td>
                                        <Radio.Group className={style['custom-radio']} value={seasonWinter.work_mode} onChange={e=>{
                                            
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
                    <div className={style['form-item-title']}>每日空调开机时段<Button type='primary' size='small' onClick={()=>{
                        setTimePeriod(timePeriod + 1);
                    }}>添加时段</Button></div>
                    <div className={style['form-item-content']}>
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
                                {
                                    weekTimeArr.map((row,i)=>(
                                        <tr key={i}>
                                            {                                              
                                                row.map((item,j)=>(
                                                    <td key={`${i}-${j}`}>
                                                        {
                                                            j === 0 
                                                            ?
                                                            <span>{ item.title }</span>
                                                            :
                                                            <TimePicker.RangePicker size='small' placeholder='' locale={zhCN} className={style['custom-date-picker']} format='HH:mm' value={[item.on, item.off]} onChange={dates=>{
                                                                
                                                                let temp = weekTimeArr.map((row,k)=>{
                                                                    if ( k === i ) {
                                                                        row = row.map((item,t)=>{
                                                                            if ( j === t ){
                                                                                item.on = dates ? dates[0] : null;
                                                                                item.off = dates ? dates[1] : null;
                                                                                return item;
                                                                            } else {
                                                                                return item;
                                                                            }
                                                                        });
                                                                        return row;
                                                                    } else {
                                                                        return row;
                                                                    }
                                                                });
                                                                setWeekTimeArr(temp);
                                                            }} />
                                                        }
                                                    </td>
                                                ))
                                            }
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        
                    </div>
                </div>
                {/* 开机工作模式 */}
                {/* <div className={style['form-item']}>
                    <div className={style['form-item-title']}>开机工作模式<Checkbox defaultChecked/></div>
                    <div className={style['form-item-content']}>
                        <div style={{ margin:'6px 0'}}><span className={style['label-text']}>按季节预设模式</span><Switch  checkedChildren='启用' unCheckedChildren='禁用' defaultChecked /></div>
                        <div className={style['inline-flex']} style={{ marginRight:'2rem' }}>
                            <MyIcon type='icon-taiyang-copy' style={{ fontSize:'2rem', color:'#f9a526'}} />
                            <span className={style['label-text']}>制热预设温度</span>
                            <div className={style['temp-container']}>
                                <span><MinusOutlined /></span>
                                <span>{ highTemp + '℃' }</span>
                                <span><PlusOutlined /></span>
                            </div>
                        </div>
                        <div className={style['inline-flex']}>
                            <MyIcon type='icon-kongdiao' style={{ fontSize:'2rem', color:'#5cc2e4'  }} />
                            <span className={style['label-text']}>制冷预设温度</span>
                            <div className={style['temp-container']}>
                                <span><MinusOutlined /></span>
                                <span>{ highTemp + '℃' }</span>
                                <span><PlusOutlined /></span>
                            </div>
                        </div>
                    </div>
                </div> */}
                {/* 每日开机时段参数 */}
                <div className={style['form-item']}>
                    <div className={style['form-item-title']}>每日开机时段参数<Checkbox defaultChecked/></div>
                    <div className={style['form-item-content']}>
                        <div style={{ margin:'6px 0'}}>
                            <span className={style['label-text']}>工作时段外允许开机</span>
                            <Switch style={{ marginRight:'20px' }} checkedChildren='启用' unCheckedChildren='禁用' defaultChecked />
                            <span className={style['label-text']}>允许开机时长</span>
                            <Input style={{ width:'120px' }} className={style['custom-input']} suffix='分' />
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
                                        weekData.map((item)=>(
                                            <td key={item}><Switch  checkedChildren='启用' unCheckedChildren='禁用' defaultChecked /></td>
                                        ))
                                    }
                                </tr>
                                <tr>
                                    <td>是否允许自动开机</td>
                                    {
                                        weekData.map((item)=>(
                                            <td key={item}><Switch  checkedChildren='启用' unCheckedChildren='禁用' defaultChecked /></td>
                                        ))
                                    }
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div> 
        </Modal>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data || prevProps.visible !== nextProps.visible ){
        return false;
    } else {
        return true;
    }
}
export default React.memo(FormContainer, areEqual);