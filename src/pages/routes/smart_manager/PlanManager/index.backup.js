import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'dva';
import { Button, Input, Popconfirm, Modal, Drawer, Tooltip, message, Switch, Spin } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import OrderSetterForm from './components/OrderSetterForm';
import LimitTempForm from './components/LimitTempForm';
import TempSetterForm from './components/TempSetterForm';
import TimePeriodForm from './components/TimePeriodForm';
import SeasonForm from './components/SeasonForm';
import PlanCardList from './PlanCardList';
import EmptyImg from '../../../../../public/mach-empty.png';
import style from './PlanManager.css';
import Icons from '../../../../../public/plan-icons.png';

let isDrag = false;
let startX = 0, startY = 0;
let inRect = false;
let timer = null;
function getStyle(element,attribute){
    //先获取需要获取样式的元素对象
    var style = window.getComputedStyle?window.getComputedStyle(element):element.currentStyle
    //再获取元素属性
    return style[attribute]
}
function getMovePosName(posMaps, left, top ){
    let result = '';
    Object.keys(posMaps).forEach(key=>{
        if ( Math.abs(posMaps[key].left - left) < 60 && Math.abs(posMaps[key].top - top ) < 60 ) {
            result = key;
        }
    })
    return result;
}
function PlanManager({ dispatch, plan }){
    const { attrPlanList, params, tplList } = plan;
    const [info, setInfo] = useState({});
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState('');
    const containerRef = useRef();
    const posMaps = useRef();
    useEffect(()=>{
        dispatch({ type:'plan/initPlanList'});
        return ()=>{
            startX = 0;
            startY = 0;
            inRect = false;
            isDrag = false;
            clearTimeout(timer);
            timer = null;
            dispatch({ type:'plan/reset' });
        }
    },[]);
    // 全局保存参数对象，当属性改变时，重置参数对象
   
    useEffect(()=>{
        // 当列表次序改变时，更新列表的位置映射关系
        let childNodes = containerRef.current.childNodes;
        posMaps.current = attrPlanList.reduce((sum, cur, index)=>{
            let obj = childNodes[index];
            let left = +getStyle(obj, 'left').replace(/px/,'');
            let top = +getStyle(obj, 'top').replace(/px/, '');
            sum[cur.key] = { left, top, index, leftPercent:33.3 * ( index % 3 ), topPercent:Math.floor(index / 3) * 30 }
            return sum;
        },{});
    },[attrPlanList])
    function handleDrag(e, index, key, handleOpenModal){
        let target = e.currentTarget.parentNode;
        let childNodes = containerRef.current.childNodes;
        let enterKey = '';
        let dragNode = null;
        // 判断是click事件还是Drag事件
        timer = setTimeout(()=>{
            isDrag = true;
            // 当前操作的节点显示层级最高
            dragNode = target.cloneNode(true);
            target.style.opacity = '0.25';
            dragNode.style.zIndex= '10';
            if ( containerRef.current ) {
                containerRef.current.appendChild(dragNode);
            }
        }, 200);
        let left = posMaps.current[key].left;
        let top = posMaps.current[key].top;
        let boxWidth = +getStyle(target, 'width').replace(/px/, '');
        let boxHeight = +getStyle(target, 'height').replace(/px/, '');
        startX = e.clientX;
        startY = e.clientY;
        function handleMouseMove(e){
            if ( isDrag ) {
                let moveX = e.clientX - startX;
                let moveY = e.clientY - startY;
                left += moveX;
                top += moveY;
                // 判断拖动的极限范围
                if ( left < 0 ) {
                    left = 0;
                }
                if ( left > containerRef.current.offsetWidth - boxWidth ) {
                    left = containerRef.current.offsetWidth - boxWidth;
                }
                if ( top < 0 ) {
                    top = 0;
                }
                if ( top > containerRef.current.offsetHeight - boxHeight ) {
                    top = containerRef.current.offsetHeight - boxHeight;
                }
                // 判断当前操作节点是否落在某个节点区域内（排除自身的占位区)
                enterKey = getMovePosName(posMaps.current, left, top);
                if ( enterKey && enterKey !== key ) {
                    if ( !inRect ) {
                        // 更新列表次序的预览状态
                        let enterPosIndex = posMaps.current[enterKey].index;   
                        childNodes[enterPosIndex].style.opacity = '0.25';
                    }
                    inRect = true;
                } else {
                    childNodes.forEach((node, j)=>{
                        if ( j !== index ) {
                            node.style.opacity = '1';
                        }
                    })
                    inRect = false;
                }
                startX = e.clientX;
                startY = e.clientY;
                if ( dragNode ) {
                    dragNode.style.left = left + 'px';
                    dragNode.style.top = top + 'px';
                
                }
            }
        }
        document.addEventListener('mousemove', handleMouseMove);
        function handleMouseUp(){
            if ( !isDrag ) {
                clearTimeout(timer);
                // 单击打开模态弹窗
                handleOpenModal();
            } else {
                // 拖动过程结束
                isDrag = false;                
                // 根据是否在某个节点区域内更新拖拽后的列表状态            
                if ( dragNode ) {
                    if ( inRect ) {
                        // let newArr = [...list];
                        // let temp = newArr[enterPosIndex];
                        // newArr[enterPosIndex] = newArr[index];
                        // newArr[index] = temp;
                        console.log(key);
                        console.log(enterKey);
                        console.log(posMaps.current);
                        let temp = params[key+'_priority'];
                        
                        dispatch({ type:'plan/updatePlanList', payload:{ data:{ ...params, [key+'_priority']:params[enterKey+'_priority'], [enterKey+'_priority']:temp }}});
                    }
                    target.style.opacity = '1';
                    childNodes.forEach(node=>{
                        node.style.opacity = '1';
                    })
                }  
            }
            if ( dragNode ) {
                containerRef.current.removeChild(dragNode);
            }
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            
        }
        document.addEventListener('mouseup', handleMouseUp);
    }
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
            <div ref={containerRef} style={{ position:'relative', height:'calc( 100% - 50px)' }}>
            {
                attrPlanList.map((item, index)=>(
                    <div key={item.key} style={{ 
                        position:'absolute', 
                        left:33.3 * ( index % 3 ) + '%',
                        top:Math.floor(index / 3) * 30  + '%', 
                        display:'inline-block', 
                        width:'33.3%', 
                        height:'30%', 
                        padding:'0 1.4rem 1.4rem 0'
                    }}>
                        <div onMouseDown={(e)=>handleDrag(e, index, item.key, ()=>setInfo(item))} style={{ position:'relative', cursor:'grab', padding:'1.6rem 1.4rem 1.4rem 1.4rem', width:'100%', height:'100%', borderRadius:'6px', background:`linear-gradient( to Right, ${item.color1}, ${item.color2})` }}>
                            <div style={{ background:'rgba(0, 0, 0, 0.25)', position:'absolute', right:'0', top:'0', color:'#fff', padding:'0.5rem 1rem', borderBottomLeftRadius:'6px', borderTopRightRadius:'6px', fontSize:'1.2rem', fontWeight:'bold' }}>{ index + 1 }</div>
                            <div style={{ height:'32%', marginBottom:'1rem', display:'flex', justifyContent:'space-between' }}>
                                <div style={{ display:'inline-flex', alignItems:'center' }}>
                                    <div style={{ 
                                        width:'37px',
                                        height:'37px',
                                        backgroundImage:`url(${Icons})`,
                                        backgroundRepeat:'no-repeat',
                                        backgroundPosition:`-${item.bgPos * 37}px 0`
                                    }}></div>
                                    <div style={{ color:'#fff', fontSize:'1.2rem', marginLeft:'0.5rem' }}>{ item.title }</div>
                                </div>    
                                <div style={{ display:'inline-flex', alignItems:'center' }}>
                                    <Switch checked={Boolean(params[item.key + '_active'])} style={{ marginRight:'0.5rem' }} onMouseDown={(e)=>{
                                        e.stopPropagation();
                                        let active = params[item.key + '_active'];
                                        let obj = { ...params, [item.key + '_active']:!active };
                                        // 当开启相应模式配置时，将对应的字段初始化
                                        if ( item.key === 'subscribe') {

                                        }
                                        dispatch({ type:'plan/setParams', payload:obj })                                       
                                    }}/>
                                    <div style={{ marginRight:'1rem', color:'#fff' }}>{ params[item.key + '_active'] ? '已配置' : '未配置' }</div>
                                    {/* <Tooltip placement='bottom' title={(<div>
                                        <div onMouseDown={(e)=>{
                                            e.stopPropagation();
                                            console.log('click');
                                        }}>删除</div>
                                    </div>)}>
                                        <MoreOutlined style={{ color:'#fff', fontSize:'1.4rem', fontWeight:'bold' }} />
                                    </Tooltip> */}
                                </div>
                            </div>
                            <div style={{ height:'64%', background:'rgba(0, 0, 0, 0.1)', fontSize:'0.8rem', borderRadius:'6px', padding:'1rem', color:'rgba(255, 255, 255, 0.85)' }}>
                                <div>{ item.subTitle }</div>
                            </div>
                        </div>
                    </div>
                ))
            }
                {/* <PlanCardList data={attrPlanList} params={params} dispatch={dispatch} /> */}
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
                        <div style={{ flex:'1'}}><Button type='primary' size='small'>应用</Button></div>
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
            <Drawer
                visible={Object.keys(info).length ? true : false }
                placement="right"
                className={style['custom-drawer']}
                width="50%"
                closeIcon={null}
                onClose={()=>setInfo({})} 
            >
                {
                    info.title === '限温开机' 
                    ?
                    <LimitTempForm info={info} params={params} onClose={()=>setInfo({})} onDispatch={action=>dispatch(action)} />
                    :
                    info.title === '一键控温' 
                    ?
                    <TempSetterForm info={info} params={params} onClose={()=>setInfo({})} onDispatch={action=>dispatch(action)}/>
                    :
                    info.title === '时段控制'
                    ?
                    <TimePeriodForm info={info} params={params} onClose={()=>setInfo({})} onDispatch={action=>dispatch(action)}/>
                    :
                    info.title === '季节控制'
                    ?
                    <SeasonForm info={info} params={params} onClose={()=>setInfo({})} onDispatch={action=>dispatch(action)}/>
                    :
                    info.title === '预约控制'
                    ?
                    <OrderSetterForm info={info} params={params} onClose={()=>setInfo({})} onDispatch={action=>dispatch(action)}/>
                    :
                    null
                }
                
            </Drawer>
        </div>
    )
}

export default connect(({ plan })=>({ plan }))(PlanManager);