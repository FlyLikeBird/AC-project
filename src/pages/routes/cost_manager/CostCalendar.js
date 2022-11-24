import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Select, Spin } from 'antd';
import CustomCalendar from '@/pages/components/CustomCalendar';
import Loading from '@/pages/components/Loading'; 
import style from '@/pages/routes/IndexPage.css';
import moment from 'moment';
const { Option } = Select;

let years = [], months = [];
for(let i = 2020;i<2050;i++){
    years.push(i);
}
for(let i=1;i<=12;i++){
    months.push(i);
}

function CostCalendar({ dispatch, cost }){
    let { calendarLoading, calendarInfo, mode, currentDate } = cost;
    let dateArr = currentDate.format('YYYY-MM-DD').split('-');
    useEffect(()=>{
        dispatch({ type:'cost/initCalendar' });
    },[])
    return (
        <div style={{ height:'100%' }}>
            {
                calendarLoading 
                ?
                <Loading />
                :
                null
            }
            <div style={{ height:'40px' }}>
                <Select 
                    className={style['custom-select']}
                    value={{ value:+dateArr[0] }}
                    labelInValue={true}
                    style={{ width:'100px', marginRight:'1rem' }}
                    onChange={obj=>{
                        dispatch({ type:'cost/setCurrentDate', payload:moment(new Date(`${obj.value}-${currentDate.month() + 1}`)) });
                        dispatch({ type:'cost/fetchCalendar' });
                    }}
                >
                    {
                        years.map((item,i)=>(
                            <Option key={item} value={item}>{ item + ' ' + '年' }</Option>
                        ))
                    }
                </Select>
                <Select 
                    className={style['custom-select']}
                    value={{ value:+dateArr[1] }}
                    labelInValue={true}
                    style={{ width:'100px', marginRight:'1rem' }}
                    onChange={obj=>{
                        dispatch({ type:'cost/setCurrentDate', payload:moment(new Date(`${currentDate.year()}-${obj.value}`)) });
                        dispatch({ type:'cost/fetchCalendar' });
                    }}
                >
                    {
                        months.map((item,i)=>(
                            <Option key={item} value={item}>{ item + ' ' + '月' }</Option>
                        ))
                    }
                </Select>
                <div style={{ display:'inline-block' }}>
                    <span style={{ padding:'0 1rem' }} className={style['btn'] + ' ' + style['opacity'] + ' ' + ( mode === 'month' ? style['selected'] : '')} onClick={()=>{
                        dispatch({ type:'cost/setMode', payload:'month' })
                        dispatch({ type:'cost/fetchCalendar' });
                    }}>日</span>
                    <span style={{ padding:'0 1rem' }}className={style['btn'] + ' ' + style['opacity'] + ' ' + ( mode === 'year' ? style['selected'] : '')} onClick={()=>{
                        dispatch({ type:'cost/setMode', payload:'year'});
                        dispatch({ type:'cost/fetchCalendar' });
                    }}>月</span>
                </div>
              
            </div>
            <div style={{ height:'calc( 100% - 40px)'}}>
                {
                    calendarLoading
                    ?
                    null
                    :
                    <CustomCalendar 
                        data={calendarInfo}
                        currentDate={currentDate} 
                        onChangeDate={value=>dispatch({ type:'cost/setCurrentDate', payload:value })} 
                        onDispatch={action=>dispatch(action)}
                        theme='dark'
                        mode={mode}
                        energyInfo={{ type_code:'ele', unit:'kwh' }}
                    />
                }
                
            </div>
        </div>
    )
}


export default connect(({ cost })=>({ cost }))(CostCalendar);
