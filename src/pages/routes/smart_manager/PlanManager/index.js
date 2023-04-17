import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'dva';
import { Button, Input, Popconfirm, Modal, Drawer, Tooltip, message, Switch, Spin } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import PlanCardList from './PlanCardList';
import EmptyImg from '../../../../../public/mach-empty.png';
import style from './PlanManager.css';

function PlanManager({ dispatch, plan }){
    const { attrPlanList, params, tplList } = plan;
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState('');
    useEffect(()=>{
        dispatch({ type:'plan/initPlanList'});
        return ()=>{
            dispatch({ type:'plan/reset' });
        }
    },[])
    // console.log(params);
    // console.log(attrPlanList);
    return (
        <div style={{ height:'100%' }}>
            {
                !attrPlanList.length 
                ?
                <div style={{ position:'relative', background:'#191a2f', height:'100%' }}>
                    <div style={{ width:'26%', textAlign:'center', position:'absolute', left:'50%', top:'50%', transform:'translate(-50%, -50%)'}}>
                        <img src={EmptyImg} style={{ width:'100%' }} />
                        <div style={{ fontSize:'1.2rem', color:'#1890ff', margin:'1rem' }}>该节点下无空调设备</div>
                    </div>
                </div>
                :
                null
            }

            {
                attrPlanList.length 
                ?
                <div style={{ height:'50px', display:'flex', justifyContent:'flex-end' }}>
                       
                        
                    <Button type='primary' style={{ marginRight:'1rem' }} onClick={()=>{
                        new Promise((resolve, reject)=>{
                            dispatch({ type:'plan/pushPlanAsync', payload:{ resolve, reject }})
                        })
                        .then(()=>{
                            message.success('方案下发成功');
                        })
                        .catch(msg=>message.error(msg))
                    }}>方案下发</Button>
                    
                    <Button type='primary' style={{ marginRight:'1rem' }} onClick={()=>setVisible(true)}>方案模板选用</Button>
                    <Popconfirm cancelText='取消' okText='确定' title={(<Input value={value} placeholder='输入模板名称' onChange={e=>setValue(e.target.value)} />)} onConfirm={()=>{
                        if ( value ) {
                            new Promise((resolve, reject)=>{
                                dispatch({ type:'plan/addTplAsync', payload:{ tpl_name:value, resolve, reject }})
                            })
                            .then(()=>message.success('添加方案模板成功'))
                            .catch(msg=>message.error(msg));
                        } else {
                            message.info('模板名称不能为空');
                        }
                    }}><Button type='primary' ghost>保存为方案模板</Button></Popconfirm>
                </div>
                :
                null
            }            
            <div style={{ position:'relative', height:'calc( 100% - 50px)' }}>
                <PlanCardList data={attrPlanList} params={params} dispatch={dispatch}/>
            </div>
            <Modal
                visible={visible}
                className={style['custom-modal']}
                onCancel={()=>setVisible(false)}
                closable={true}
                footer={null}
                title='方案模板'
            >
                <div style={{ display:'flex', color:'#fff', padding:'0.5rem 1rem' }}>
                    <div style={{ flex:'1' }}>方案名称</div>
                    <div style={{ flex:'1' }}>修改时间</div>
                    <div style={{ flex:'1' }}>操作</div>
                </div>
                <div>
                    <div style={{ display:'flex', color:'rgba(255, 255, 255, 0.65)', padding:'0.5rem 1rem', borderBottom:'1px solid #31313b' }}>
                        <div style={{ flex:'1'}}>新建空模板</div>
                        <div style={{ flex:'1'}}>--</div>
                        <div style={{ flex:'1'}}><Button type='primary' size='small' onClick={()=>{
                            dispatch({ type:'plan/updatePlanList', payload:{ data:null }});
                            message.success('应用模板成功');
                            setVisible(false);
                        }}>应用</Button></div>
                    </div>
                    {
                        tplList.map(item=>(
                            <div key={item.tpl_id} style={{ display:'flex', color:'rgba(255, 255, 255, 0.65)', padding:'0.5rem 1rem', borderBottom:'1px solid #31313b' }}>
                                <div style={{ flex:'1'}}>{ item.tpl_name }</div>
                                <div style={{ flex:'1'}}>{ item.create_date }</div>
                                <div style={{ flex:'1'}}>
                                    <Button type='primary' size='small' style={{ marginRight:'0.5rem' }} onClick={()=>{
                                        new Promise((resolve, reject)=>{
                                            dispatch({ type:'plan/applyTplAsync', payload:{ resolve, reject, tpl_id:item.tpl_id }})
                                        })
                                        .then(()=>{
                                            message.success('应用模板成功');
                                            setVisible(false);
                                        })
                                        .catch(msg=>message.error(msg));
                                    }}>应用</Button>
                                    <Button type='primary' danger size='small' onClick={()=>{
                                        new Promise((resolve, reject)=>{
                                            dispatch({ type:'plan/delTplAsync', payload:{ resolve, reject, tpl_id:item.tpl_id }})
                                        })
                                        .then(()=>message.success('删除模板成功'))
                                        .catch(msg=>message.error(msg))
                                    }}>删除</Button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </Modal>
            
        </div>
    )
}

export default connect(({ plan })=>({ plan }))(PlanManager);