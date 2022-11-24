import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Table, Button, message } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';
import style from '@/pages/routes/IndexPage.css';
import Loading from '@/pages/components/Loading';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import { downloadExcel } from '@/pages/utils/array';
import XLSX from 'xlsx';

function CostReport({ dispatch, user, dataReport }){
    let { timeType, startDate, endDate, containerWidth } = user;
    let { sourceData, isLoading, currentPage } = dataReport;
    let [dataType, setDataType] = useState('cost');
    useEffect(()=>{
        dispatch({ type:'dataReport/initCostReport'});
    },[]);
    let columns = [];
    if ( Object.keys(sourceData).length ) {
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
                    width:'120px',
                    ellipsis:true,
                    render:(arr)=>{
                        return ( arr[index] === null ? '--' : (+arr[index]).toFixed(1) ) + ` ${ arr[index] === null ? '' : dataType === 'cost' ? '元' : 'kwh'}`;
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
                <div style={{ display:'flex' }}>
                    <span style={{ padding:'0 1rem' }} className={style['btn'] + ' ' + style['opacity'] + ' ' + ( dataType === 'cost' ? style['selected'] : '')} onClick={()=>{
                        setDataType('cost');
                    }}>成本</span>
                    <span style={{ padding:'0 1rem', marginRight:'1rem' }}className={style['btn'] + ' ' + style['opacity'] + ' ' + ( dataType === 'energy' ? style['selected'] : '')} onClick={()=>{
                        setDataType('energy');
                    }}>能耗</span>
                    <CustomDatePicker onDispatch={()=>{
                        dispatch({ type:'dataReport/fetchCostReport'});
                    }} />
                </div>
                
                <div><Button type='primary' onClick={()=>{
                    if ( sourceData.attrCostValue &&  sourceData.attrCostValue.length ){
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
                        let fileTitle = dateStr + '空调' + ( dataType === 'cost' ? '成本' : '能耗' ) +  '报表';
                        let aoa = [];
                        let thead = [];
                        let colsStyle = [];
                        thead.push('序号','位置');
                        sourceData.date.forEach(date=>{
                            thead.push(date);
                        });
                        thead.forEach(col=>{
                            colsStyle.push({ wch:18 });
                        });
                        aoa.push(thead);
                        let result = dataType === 'cost' ? sourceData.attrCostValue : sourceData.attrEnergyValue;
                        result.forEach((item,index)=>{
                            let temp = [];
                            temp.push(index + 1);
                            temp.push(item.attr_name);
                            item.view.forEach(value=>{
                                temp.push(value);
                            });
                            aoa.push(temp);                            
                        });
                        // console.log(aoa);
                        var sheet = XLSX.utils.aoa_to_sheet(aoa);
                        sheet['!cols'] = colsStyle;
                        downloadExcel(sheet, fileTitle + '.xlsx' );
                    } else {
                        message.info('数据源为空');
                    }
                }}><FileExcelOutlined /></Button></div>
            </div>
            <div style={{ height:'calc( 100% - 40px)'}} className={style['card-container']}>
                <Table 
                    columns={columns}
                    dataSource={ dataType === 'cost' ? ( sourceData.attrCostValue || [] ) : ( sourceData.attrEnergyValue || [] )}
                    rowKey='attr_name'
                    className={style['self-table-container'] + ' ' + style['dark'] + ' ' + style['no-space']}
                    scroll={{
                        x:1000
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

export default connect(({ user, dataReport })=>({ user, dataReport }))(CostReport);