import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Table, Button, message } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';
import style from '@/pages/routes/IndexPage.css';
import Loading from '@/pages/components/Loading';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import { downloadExcel } from '@/pages/utils/array';
import XLSX from 'xlsx';

let category = [
    { key:'totalCost', title:'电费', unit:'元' },
    { key:'totalEnergy', title:'电量', unit:'kwh'},
    { key:'maxTemp', title:'最大温度', unit:'℃'},
    { key:'avgTemp', title:'平均温度', unit:'℃'},
    { key:'minTemp', title:'最小温度', unit:'℃'},
    { key:'maxPower', title:'最大功率', unit:'kw'},
    { key:'avgPower', title:'平均功率', unit:'kw'},
    { key:'minPower', title:'最小功率', unit:'kw'}
];

function EnergyReport({ dispatch, user, dataReport }){
    let { timeType, startDate, endDate, containerWidth } = user;
    let { sourceData, isLoading, currentPage } = dataReport;
    useEffect(()=>{
        dispatch({ type:'dataReport/initEnergyReport'});
    },[]);
    let columns = [];
    if ( Object.keys(sourceData).length  ) {
        columns = [
            {
                title:'序号',
                width:'60px',
                fixed:'left',
                render:(text,record,index)=>{
                    return `${ ( currentPage - 1) * 12 + index + 1}`;
                }
            },
            {
                title:'位置',
                width:'180px',
                fixed:'left',
                dataIndex:'attr_name',
                ellipsis: true,
            },
            ...sourceData.date.map((date, index)=>{
                let dateArr = timeType === '1' ? date.split(' ') : []
                return {
                    title:timeType === '1' ? dateArr[1] : date,
                    dataIndex:'view',
                    width:'200px',
                    className:'multi-table-cell',
                    render:(arr)=>{
                        return (
                            <div>
                                {
                                    category.map(attr=>{                                      
                                        let obj = arr[index];
                                        return (
                                        
                                        <div key={`${date}-${attr.key}`} style={{ display:'flex', justifyContent:'space-between' }}>
                                            <span>{ attr.title + '(' + attr.unit + ')' }</span>
                                            <span>{ obj ? ( obj[attr.key] === '-' || obj[attr.key] === null ) ? '--' : (+obj[attr.key]).toFixed(1) : '--' }</span>
                                        </div>
                                        )                               
                                    })
                                }
                            </div>
                        )
                    }
                }
            })
        ];
    }
    return (
        <div style={{ height:'100%' }}>
            {
                isLoading ? <Loading /> : null
            }
            <div style={{ display:'flex', justifyContent:'space-between', height:'40px'}}>
                <CustomDatePicker onDispatch={()=>{
                    dispatch({ type:'dataReport/fetchEnergyReport'});
                }} />
                <div><Button type='primary' onClick={()=>{
                    if ( sourceData.attrValue &&  sourceData.attrValue.length ){
                        let dateStr =  
                            timeType === '1' 
                            ?
                            `${startDate.format('YYYY-MM-DD')}日`
                            :
                            timeType === '2' 
                            ?
                            `${startDate.format('YYYY-MM')}月`
                            :
                            `${startDate.format('YYYY')}年`
                        
                        // console.log(dateStr);
                        let fileTitle = dateStr + '空调数据报表';
                        let aoa = [];
                        let thead = [];
                        let colsStyle = [];
                        let merges = [];
                        thead.push('序号','位置');
                        sourceData.date.forEach((date, index)=>{
                            thead.push(date);
                            thead.push(null);
                            merges.push({
                                s:{ r:0, c:2 + index * 2 },
                                e:{ r:0, c:2 + index * 2 + 1 }
                            })
                        });
                        thead.forEach(col=>{
                            colsStyle.push({ wch:20 });
                        });
                        aoa.push(thead);
                        sourceData.attrValue.forEach((item,index)=>{
                            category.forEach((attr, j)=>{
                                let temp = [];
                                if ( j === 0 ){
                                    temp.push(index + 1);
                                    temp.push(item.attr_name);
                                } else {
                                    temp.push(null);
                                    temp.push(null);
                                }
                                item.view.forEach(view=>{
                                    temp.push(attr.title + '(' + attr.unit + ')');
                                    temp.push(view[attr.key]);
                                })
                                aoa.push(temp);
                            })                                                      
                        });
                        // console.log(aoa);
                        var sheet = XLSX.utils.aoa_to_sheet(aoa);
                        sheet['!cols'] = colsStyle;
                        sheet['!merges'] = merges;
                        downloadExcel(sheet, fileTitle + '.xlsx' );
                    } else {
                        message.info('数据源为空');
                    }
                }}><FileExcelOutlined /></Button></div>
            </div>
            <div style={{ height:'calc( 100% - 40px)'}} className={style['card-container']}>
                <Table 
                    columns={columns}
                    rowKey='attr_name'
                    dataSource={sourceData.attrValue || []}
                    className={style['self-table-container'] + ' ' + style['dark'] + ' ' + style['no-space']}
                    scroll={{
                        x:1000,
                        y:user.containerWidth <= 1440 ? 560 : 700
                    }}
                    onChange={(pagination)=>{
                        dispatch({ type:'dataReport/setPage', payload:pagination.current });
                    }}
                    // pagination={{
                    //     total:data.length,
                    //     current:currentPage,
                    //     showSizeChanger:false,
                    //     pageSize:12
                    // }}
                />
            </div>
        </div>
    )
}

export default connect(({ user, dataReport })=>({ user, dataReport }))(EnergyReport);