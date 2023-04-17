import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Table, Modal, Button } from 'antd';
import style from '../PlanManager/PlanManager.css';
import IndexStyle from '@/pages/routes/IndexPage.css';
import PlanCardList from '../PlanManager/PlanCardList';
import Icons from '../../../../../public/plan-icons.png';

let defaultPlanList = [
    { bgPos:4, title:'预约控制', key:'subscribe', subTitle:'可单次或日、周、月循环定时预约空调开启，多用于会议场所等办公场景，提前准备好人体舒适的环境', color1:'#7a7ab3', color2:'#8383bb' },
    // { bgPos:5, title:'红外控制', key:'hongwai', subTitle:'根据外挂人体红外探测器，可实现人走关闭空调的智能控制', color1:'#9324fe', color2:'#e837ff'},
    { bgPos:0, title:'限温开机', key:'templimit', subTitle:'利用控制器温感探头，判断室内温度需不需要开空调调节温度，当判断为不需要开空调时开启空调则会自动关闭，防止能源浪费', color1:'#188cfe', color2:'#34b5f7'},
    { bgPos:3, title:'季节控制', key:'season', subTitle:'根据当年季节交替时间判断环境需要制热还是制冷', color1:'#ff9944', color2:'#ffd367'},
    { bgPos:1, title:'一键控温', key:'ctrl', subTitle:'设定好模式，温度，风速等运行参数一键下发，下发完成后被下发一键控温方案的空调不能更改运行参数', color1:'#582df7', color2:'#7043df'},
    { bgPos:2, title:'时段控制', key:'timespan', subTitle:'可灵活配置每周每日多工作时段运行时间', color1:'#e84660', color2:'#ea4a7b'}
];
function PlanHistory({ dispatch, plan }){
    const { currentPage, logList, total } = plan;
    const [info, setInfo] = useState({});
    const [list, setList] = useState([]);
    useEffect(()=>{
        dispatch({ type:'plan/initLogList'});
    },[]);
    useEffect(()=>{
        if ( info.id ) {
            let newArr = [...defaultPlanList].sort((a,b)=>{
                return info[a.key+'_priority'] < info[b.key+'_priority'] ? -1 : 1;
            });
            setList(newArr);
        }
    },[info])
    let columns = [
        {
            title:'序号',
            width:'60px',
            render:(text,record,index)=>{
                return `${ ( currentPage - 1) * 12 + index + 1}`;
            }
        },
        // { title:'方案名', dataIndex:'plan_name', render:value=>(<span>{ value || '--' }</span>) },
        { 
            title:'模式',
            render:(row)=>{
                let arr = [];
                defaultPlanList.forEach(mode=>{
                    if ( row[mode.key + '_active'] ) {
                        arr.push(mode);
                    }
                })
                return (
                    <div>
                        {
                            arr.map(item=>(
                                <span style={{ display:'inline-block', padding:'2px 6px', background:item.color2, borderRadius:'6px', marginRight:'0.5rem', fontSize:'0.8rem', color:'rgba(255, 255, 255, 0.85)' }} key={item.key}>
                                    { item.title }
                                </span>
                            ))
                        }
                    </div>
                )
            }
        },
        { title:'下发时间', dataIndex:'create_date' },
        { title:'下发人', dataIndex:'create_user_name' },
        { title:'执行结果', dataIndex:'push_status', render:value=>(<span style={{ color: value ? '#7de068' : 'red' }}>{ value ? '已下发' : '未下发' }</span>)},
        {
            title:'操作',
            render:row=>{
                return (
                    <Button type='primary' onClick={()=>setInfo(row)} >查看</Button>
                )
            }
        }
    ]
    return (
        <div className={IndexStyle['card-container']}>
            <Table 
                columns={columns}
                dataSource={logList}
                rowKey='id'
                className={IndexStyle['self-table-container'] + ' ' + IndexStyle['dark'] + ' ' + IndexStyle['no-space']}
                onChange={(pagination)=>{
                    dispatch({ type:'plan/fetchLogList', payload:{ page:pagination.current }});
                }}
                locale={{
                    emptyText:<div style={{ margin:'1rem 2rem' }}>下发记录为空</div>
                }}
                pagination={{
                    total,
                    current:currentPage,
                    showSizeChanger:false,
                    pageSize:12
                }}
            />
            <Modal
                width='74%'
                height='600px'
                bodyStyle={{ height:'620px' }}
                visible={Object.keys(info).length ? true : false }
                className={style['custom-modal']}
                onCancel={()=>setInfo({})}
                closable={true}
                footer={null}
                title='方案下发记录'
            >
                <PlanCardList data={list} params={info} dispatch={dispatch} silent={true} />
            </Modal>
        </div>
    )
}

export default connect(({ plan })=>({ plan }))(PlanHistory);