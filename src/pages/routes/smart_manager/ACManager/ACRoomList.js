import React, { useEffect } from 'react';
import { Checkbox, Button, Radio, Table, Pagination } from 'antd';
import { HomeFilled, PoweroffOutlined, AppstoreOutlined, UnorderedListOutlined, createFromIconfontCN } from '@ant-design/icons';
import Loading from '@/pages/components/Loading';
import style from '../SmartManager.css';
import IndexStyle from '@/pages/routes/IndexPage.css';
const MyIcon = createFromIconfontCN({
    scriptUrl:'//at.alicdn.com/t/font_3086161_dv63nyecczn.js'
});
// let data = [];
// for(var i=0;i<16;i++){
//     data.push({ key:i, meter_name:'1楼101海信空调', temp:'27.7', time:'23', warning:'test', energy:30 })
// }
function ACRoomList({ dispatch, data, isLoading, powerStatus, modeStatus, showMode, currentPage, total  }){
    let columns = [
        {
            title:'序号',
            width:'60px',
            fixed:'left',
            render:(text,record,index)=>{
                return `${ ( currentPage - 1) * 12 + index + 1}`;
            }
        },
        { title:'状态', dataIndex:'on_off', render:(value)=>(<span style={{ color:value ? '#89fa6e' : '#f41818'}}>{ value ? '开机' : '关机' }</span>)},
        { title:'位置', dataIndex:'attr_name' },
        { title:'节点', dataIndex:'field_name' },
        { title:'空调型号', dataIndex:'mach_type'},
        {
            title:'运行模式',
            dataIndex:'mode',
            render:(value)=>(
                <span style={{ display:'inline-flex', alignItems:'center', color:value === 1 ? '#5cc2e4' : value === 3 ? '#89fa6e' : value === 4 ? '#f9a426' : '#fff' }}>
                    {
                        value === 1
                        ?
                        <MyIcon type='icon-kongdiao' style={{ fontSize:'2rem' }} />
                        :
                        value === 3
                        ?
                        <MyIcon type='icon-wind' style={{ fontSize:'2rem' }} />
                        :
                        value === 4 
                        ?
                        <MyIcon type='icon-taiyang-copy' style={{ fontSize:'2rem' }} />
                        :
                        null
                    }
                    { value === 1 ? '制冷' : value === 3 ? '送风' : value === 4 ? '制热' : ''}
                </span>
            )
        },
        { title:'温度', dataIndex:'temp', render:value=>(<span>{ value + ' ' + '℃' }</span>) },
        { title:'运行时长', dataIndex:'run_time'},
        { title:'告警', dataIndex:'warning'},
        { title:'昨日用电', dataIndex:'energy'},
        {
            title:'操作',
            render:row=>{
                return (
                    <Button type='primary' onClick={()=>{
                        dispatch({ type:'controller/setCurrentRoom', payload:row });
                    }}>查看</Button>
                )
            }
        }
    ]
    return (
        <div>
            {
                isLoading 
                ?
                <Loading />
                :
                null
            }
            <div style={{ height:'60px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #2a2a33' }}>
                <div>
                    <span className={IndexStyle['sub-text']} style={{ marginRight:'6px' }}>状态 : </span>
                    <Checkbox.Group className={IndexStyle['custom-checkbox']}  options={[{ label:'开机', value:1 }, { label:'关机', value:0 }]} value={powerStatus} onChange={checkedValue=>{
                        dispatch({ type:'controller/setPowerStatus', payload:checkedValue });
                    }} />
                    <span className={IndexStyle['sub-text']} style={{ margin:'0 6px 0 2rem' }}>模式 : </span>
                    <Checkbox.Group className={IndexStyle['custom-checkbox']}  options={[{ label:'制冷', value:1 }, { label:'制热', value:4 }, { label:'送风', value:3 }]} value={modeStatus} onChange={checkedValue=>{
                        dispatch({ type:'controller/setModeStatus', payload:checkedValue });
                    }} />
                    <Button type='primary' style={{ marginLeft:'1rem'}} onClick={()=>dispatch({ type:'controller/fetchRoomList'})}>查询</Button>
                </div>
                <div>
                    <span className={IndexStyle['btn'] + ' ' + IndexStyle['opacity'] + ' ' + ( showMode === 'card' ? IndexStyle['selected'] : '')} onClick={()=>dispatch({ type:'controller/toggleShowMode', payload:'card' })}><AppstoreOutlined />视图</span>
                    <span className={IndexStyle['btn'] + ' ' + IndexStyle['opacity'] + ' ' + ( showMode === 'list' ? IndexStyle['selected'] : '')} onClick={()=>dispatch({ type:'controller/toggleShowMode', payload:'list'})}><UnorderedListOutlined />列表</span>
                </div>
            </div>
            <div style={{ height:'calc(100% - 60px)', paddingTop:'1rem' }}>
                {
                    showMode === 'card' 
                    ?
                    <div className={style['list-container']}>
                        <div className={style['list-main-content']}>
                            {
                                data && data.length 
                                ?
                                data.map((item,index)=>(
                                    <div className={style['list-item-wrapper']} key={index}>
                                        <div className={style['list-item']} onClick={()=>{
                                            dispatch({ type:'controller/setCurrentRoom', payload:item });
                                        
                                        }}>
                                            <div className={style['list-item-title']}>
                                                <div>
                                                    <div className={style['list-item-symbol'] + ' ' + ( item.on_off ? style['on'] : style['off']) } style={{ marginRight:'6px' }} >
                                                        <PoweroffOutlined style={{ fontSize:'1.2rem', color: item.on_off ? '#fff' : '#3c3c51'}} />
                                                    </div>
                                                    { item.meter_name }
                                                </div>
                                                <div>
                                                    {
                                                        item.mode === 1
                                                        ?
                                                        <MyIcon type='icon-kongdiao' style={{ fontSize:'2rem', color:'#5cc2e4' }} />
                                                        :
                                                        item.mode === 3
                                                        ?
                                                        <MyIcon type='icon-wind' style={{ fontSize:'2rem', color:'#89fa6e' }} />
                                                        :
                                                        item.mode === 4 
                                                        ?
                                                        <MyIcon type='icon-taiyang-copy' style={{ fontSize:'2rem', color:'#f9a426' }} />
                                                        :
                                                        null
                                                    }
                                                </div>
                                            </div>
                                            <div className={style['list-item-content']}>
                                                <div>房间温度 ： { item.temp } ℃ </div>
                                                <div>已开机时长 : { item.time || '-- --' } h </div>
                                                <div>告警 : { item.warning || '-- --' }</div>
                                                <div>昨日用电 : { item.energy || '-- --' } kwh </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                                :
                                <div className={IndexStyle['empty-text']}>还没有添加空调设备</div>
                            }
                        </div>
                        <div className={style['list-footer']}>
                            <Pagination className={IndexStyle['custom-pagination']} current={currentPage} pageSize={12} total={total} showSizeChanger={false} />
                        </div>
                    </div>
                    :
                    <Table
                        className={IndexStyle['self-table-container'] + ' ' + IndexStyle['dark']}
                        style={{ padding:'0' }}
                        columns={columns}
                        dataSource={data}
                        pagination={{
                            current:currentPage,
                            total,
                            pageSize:12,
                            showSizeChanger:false
                        }}
                        locale={{
                            emptyText:<div style={{ height:'140px', lineHeight:'140px' }}>查询的空调设备为空</div>
                        }}
                        onChange={(pagination)=>{
                            dispatch({ type:'controller/fetchRoomList', payload:{ currentPage:pagination.current }});
                        }}  
                    />
                }
                
            </div>
        
        </div>
    )
}

export default ACRoomList;