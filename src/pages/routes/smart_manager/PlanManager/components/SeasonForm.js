import React, { useState, useEffect } from 'react';
import { Popover, Radio, DatePicker, Select, Switch, InputNumber, Tooltip, message, Button } from 'antd';
import { createFromIconfontCN, MinusOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import style from '../PlanManager.css';
import moment from 'moment';
import zhCN from 'antd/es/date-picker/locale/zh_CN';

const { Option } = Select;
const { RangePicker } = DatePicker;
const MyIcon = createFromIconfontCN({
    scriptUrl:'//at.alicdn.com/t/font_3086161_o5layfhgryf.js'
});
const year = new Date().getFullYear();
function formatData(str){
    let obj = typeof str === 'string' ? JSON.parse(str) : str;
    return { mode:obj.work_mode, start:moment(year + '-' + obj.start.month ), end:moment(year + '-' + obj.end.month ) }
}
function SeasonForm({ info, params, silent, onClose, onDispatch }){
    const { season_summer, season_winter, season_other_work_mode } = params;
    let summerInfo = season_summer ? formatData(season_summer) : null;
    let winterInfo = season_winter ? formatData(season_winter) : null;
    const [summerMode, setSummerMode] = useState( summerInfo ? summerInfo.mode : 1);
    const [summerDate, setSummerDate] = useState( summerInfo ? { start:summerInfo.start, end:summerInfo.end } : { start:moment(year + '-' + '6'), end:moment(year + '-' + '8') });
    const [winterMode, setWinterMode] = useState( winterInfo ? winterInfo.mode : 1);
    const [winterDate, setWinterDate] = useState( winterInfo ? { start:winterInfo.start, end:winterInfo.end } : { start:moment(year + '-' + '12'), end:moment((year + 1) + '-' + '2') });
    const [otherMode, setOtherMode] = useState( season_other_work_mode ? +season_other_work_mode : 1);
    
    return (
        <div className={style['form-container']}>
            <div className={style['form-title']}>{ '方案设置' + ' - ' + info.title }</div>
            <div className={style['form-content']}>           
                <div style={{ marginBottom:'3rem' }}>               
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
                                    <Radio.Group className={style['custom-radio']} value={summerMode} onChange={e=>{
                                        setSummerMode(e.target.value);
                                    }}>
                                        <Radio value={1}>制冷</Radio>
                                        <Radio value={3}>送风</Radio>
                                        <Radio value={4}>制热</Radio>
                                    </Radio.Group>
                                </td>
                                <td>
                                    <RangePicker picker='month'  className={style['custom-date-picker']} allowClear={false} locale={zhCN} value={[summerDate.start, summerDate.end]}  onChange={dates=>{
                                        console.log(dates);
                                        setSummerDate({ start:dates[0], end:dates[1] });
                                        // console.log(dates[0].format('YYYY-MM-DD'));
                                        // console.log(dates[1].endOf('month').format('YYYY-MM-DD'));
                                    }} />
                                   
                                </td>
                            </tr>
                            <tr>
                                <td>冬季</td>
                                <td>
                                    <Radio.Group className={style['custom-radio']} value={winterMode} onChange={e=>{
                                        setWinterMode(e.target.value);
                                    }}>
                                        <Radio value={1}>制冷</Radio>
                                        <Radio value={3}>送风</Radio>
                                        <Radio value={4}>制热</Radio>
                                    </Radio.Group>
                                </td>
                                <td><RangePicker picker='month' className={style['custom-date-picker']} allowClear={false} locale={zhCN}  value={[winterDate.start, winterDate.end]} onChange={dates=>{
                                    setWinterDate({ start:dates[0], end:dates[1] });
                                }} /></td>
                            </tr>
                            <tr>
                                <td>其他时段</td>
                                <td colSpan={2}>
                                    <Radio.Group className={style['custom-radio']} value={otherMode} onChange={e=>{
                                        setOtherMode(e.target.value);
                                    }}>
                                        <Radio value={1}>制冷</Radio>
                                        <Radio value={3}>送风</Radio>
                                        <Radio value={4}>制热</Radio>
                                    </Radio.Group>
                                </td>
                            </tr>
                        </tbody>
                    </table>             
                </div>                                          
            </div>
            {
                silent 
                ?
                null
                :
                <div style={{ position:'absolute', left:'50%', transform:'translateX(-50%)', bottom:'4rem' }}>
                    <Button size='large' type='primary' style={{ marginRight:'1rem' }} onClick={()=>{
                        let summerStartArr = summerDate.start.format('YYYY-MM-DD').split('-');
                        let summerEndArr = summerDate.end.format('YYYY-MM-DD').split('-');
                        let winterStartArr = winterDate.start.format('YYYY-MM-DD').split('-');
                        let winterEndArr = winterDate.end.format('YYYY-MM-DD').split('-');
                        onDispatch({ type:'plan/setParams', payload:{
                            ...params,
                            season_summer:{
                                work_mode:summerMode,
                                start:{
                                    month:+summerStartArr[1],
                                    day:+summerStartArr[2]
                                },
                                end:{
                                    month:+summerEndArr[1],
                                    day:+summerEndArr[2]
                                }
                            },
                            season_winter:{
                                work_mode:winterMode,
                                start:{
                                    month:+winterStartArr[1],
                                    day:+winterStartArr[2]
                                },
                                end:{
                                    month:+winterEndArr[1],
                                    day:+winterEndArr[2]
                                }
                            },
                            season_other_work_mode:otherMode
                        }});
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
export default React.memo(SeasonForm, areEqual);