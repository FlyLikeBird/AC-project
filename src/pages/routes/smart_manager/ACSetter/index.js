import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Tree, Spin, Table, Input, Button, Modal, Popconfirm, Skeleton, message } from 'antd';
import { CloseCircleOutlined, DownloadOutlined, EditOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import style from '@/pages/routes/IndexPage.css';
import Loading from '@/pages/components/Loading';
import FormContainer from './FormContainer';

function SwitchSetter({ dispatch, gateway, controller }){
    let { ACList } = gateway;
    let { planList, currentPage, total, tplList, isLoading } = controller;
    let [info, setInfo] = useState({ visible:false, forEdit:false, currentPlan:null });
    let [tplInfo, setTplInfo] = useState({ visible:false, currentPlan:null });
    let [value, setValue] = useState('');
    let inputRef = useRef(null);
    useEffect(()=>{
        dispatch({ type:'controller/initPlanList' });
    },[]);
    useEffect(()=>{
        if ( tplInfo.visible ){
            if ( inputRef.current && inputRef.current ){
                inputRef.current.focus();
            }
        } else {
            setValue('');
        }
    },[tplInfo])
    let columns = [
        {
            title:'序号',
            width:'60px',
            fixed:'left',
            render:(text,record,index)=>{
                return `${(currentPage - 1) * 12 + index + 1}`;
            }
        },
        {
            title:'方案名称',
            dataIndex:'plan_name'
        },
        {
            title:'创建时间',
            dataIndex:'create_time'
        },
        {
            title:'创建人',
            dataIndex:'create_user_name'
        },
        {
            title:'操作',
            render:row=>{
                return (
                    <div>
                        <Button size='small' style={{ backgroundColor:'#33dc2f', border:'none', color:'#fff', marginRight:'1rem' }} onClick={()=>{
                            new Promise((resolve, reject)=>{
                                dispatch({ type:'controller/pushPlanSync', payload:{ resolve, reject, plan_id:row.plan_id }})
                            })
                            .then(()=>{
                                message.success('推送方案成功');
                            })
                            .catch((msg)=>message.error(msg));
                        }}><DownloadOutlined />下发</Button>
                        <Button size='small' style={{ backgroundColor:'#359dfd', border:'none', color:'#fff', marginRight:'1rem' }} onClick={()=>{
                            setInfo({ visible:true, forEdit:true, currentPlan:row });
                        }}><EditOutlined />修改</Button>
                        <Button size='small' style={{ backgroundColor:'#359dfd', border:'none', color:'#fff', marginRight:'1rem' }} onClick={()=>{
                            setTplInfo({ visible:true, currentPlan:row });
                        }}><CopyOutlined />复制成模板</Button>
                        <Popconfirm okText='确定' cancelText='取消' title='删除后无法撤回，请谨慎操作，确定删除此方案吗?' onConfirm={()=>{
                            new Promise((resolve, reject)=>{
                                dispatch({ type:'controller/delPlanSync', payload:{ resolve, reject, plan_id:row.plan_id }})
                            })
                            .then(()=>message.success('删除方案成功'))
                            .catch(msg=>message.error(msg))
                        }}><Button size='small' style={{ backgroundColor:'#ff2d2e', border:'none', color:'#fff', marginRight:'1rem' }}><DeleteOutlined />删除</Button></Popconfirm>

                    </div>
                )
            }
        }
    ]
    return (
        <div className={style['card-container']} style={{ overflow:'hidden', padding:'1rem' }}>
            <div style={{ padding:'0 1rem' }}>
                <Input style={{ marginRight:'6px' }} className={style['custom-input']} suffix={<CloseCircleOutlined style={{ cursor:'pointer' }} />} />
                <Button type='primary' style={{ marginRight:'6px' }}>查询方案</Button>
                <Button type='primary' onClick={()=>setInfo({ visible:true, forEdit:false })}>添加方案</Button>
            </div>
            {
                isLoading 
                ?
                <Loading />
                :
                null
            }
            <Table 
                rowKey='plan_id'
                columns={columns}
                dataSource={planList}
                className={style['self-table-container'] + ' ' + style['dark'] }
                pagination={{
                    current:currentPage,
                    total,
                    pageSize:12,
                    showSizeChanger:false
                }}
                locale={{
                    emptyText:<div style={{ height:'140px', lineHeight:'140px' }}>暂无方案记录</div>
                }}
                onChange={(pagination)=>{
                    dispatch({ type:'switchMach/fetchAction', payload:{ pageNum:pagination.current }});
                }}
            />
            <FormContainer dispatch={dispatch} info={info} onChangeTpl={obj=>setInfo(obj)} machList={ACList} tplList={tplList} onClose={()=>setInfo({ visible:false, forEdit:false })} />
            <Modal
                visible={tplInfo.visible}
                footer={null}
                onCancel={()=>setTplInfo({ visible:false })}
            >
                <div style={{ margin:'20px 0'}}>
                    <Input ref={inputRef} width='140px' placeholder='请输入模板名' value={value} onChange={e=>setValue(e.target.value)} />
                </div>
                <div style={{ textAlign:'center' }}>
                    <Button type='primary' onClick={()=>{
                        if (value){
                            new Promise((resolve, reject)=>{
                                dispatch({ type:'controller/copyToTpl', payload:{ resolve, reject, plan_id:tplInfo.currentPlan.plan_id, tpl_name:value }})
                            })
                            .then(()=>{
                                message.success('生成模板成功');
                                setTplInfo({ visible:false });
                            })
                            .catch(msg=>message.error(msg))
                        } else {
                            message.info('请输入模板名');
                        }
                    }} style={{ marginRight:'14px' }}>确定</Button>
                    <Button onClick={()=>setTplInfo({ visible:false })}>取消</Button>
                </div>
            </Modal>
        </div>
    );
}
export default connect(({ gateway, controller }) => ({ gateway, controller }))(SwitchSetter);