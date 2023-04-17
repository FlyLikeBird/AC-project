import React, { useEffect, useState, useRef } from 'react';
import { Switch, Drawer, message, Button } from 'antd';
import OrderSetterForm from './components/OrderSetterForm';
import LimitTempForm from './components/LimitTempForm';
import TempSetterForm from './components/TempSetterForm';
import TimePeriodForm from './components/TimePeriodForm';
import SeasonForm from './components/SeasonForm';
import Icons from '../../../../../public/plan-icons.png';
import style from './PlanManager.css';

let startX = 0, startY = 0, inRect = false, isDrag = false, timer = null;
function getStyle(element,attribute){
    //先获取需要获取样式的元素对象
    var style = window.getComputedStyle ? window.getComputedStyle(element) : element.currentStyle
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

function PlanCardList({ data, params, dispatch, silent }){
    const [info, setInfo] = useState({});
    const containerRef = useRef();
    const posMaps = useRef();
    useEffect(()=>{
        return ()=>{
            startX = 0;
            startY = 0;
            inRect = false;
            isDrag = false;
            clearTimeout(timer);
            timer = null;
        }
    },[]);
    // 全局保存参数对象，当属性改变时，重置参数对象
   
    useEffect(()=>{
        // 当列表次序改变时，更新列表的位置映射关系
        let childNodes = containerRef.current.childNodes;
        posMaps.current = data.reduce((sum, cur, index)=>{
            let obj = childNodes[index];
            let left = +getStyle(obj, 'left').replace(/px/,'');
            let top = +getStyle(obj, 'top').replace(/px/, '');
            sum[cur.key] = { left, top, index, leftPercent:33.3 * ( index % 3 ), topPercent:Math.floor(index / 3) * 30 }
            return sum;
        },{});
    },[data])
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
            if ( silent ) return;
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
                        // console.log(key);
                        // console.log(enterKey);
                        // console.log(posMaps.current);
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
    return (
        <div ref={containerRef} style={{ height:'100%', position:'relative' }}>
            {
                data.map((item, index)=>(
                    <div key={item.key} style={{ 
                        position:'absolute', 
                        left:33.3 * ( index % 3 ) + '%',
                        top:Math.floor(index / 3) * 30  + '%', 
                        display:'inline-block', 
                        width:'33.3%', 
                        height:'30%', 
                        padding:'0 1.4rem 1.4rem 0'
                    }}>
                        <div onMouseDown={(e)=>{
                            handleDrag(e, index, item.key, ()=>setInfo(item))
                            
                        }} style={{ position:'relative', cursor:'grab', padding:'1.6rem 1.4rem 1.4rem 1.4rem', width:'100%', height:'100%', borderRadius:'6px', background:`linear-gradient( to Right, ${item.color1}, ${item.color2})` }}>
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
                                        if ( silent ) {
                                            message.info('下发记录不可更改');
                                            return ;
                                        }
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
                    <LimitTempForm info={info} params={params} silent={silent} onClose={()=>setInfo({})} onDispatch={action=>dispatch(action)} />
                    :
                    info.title === '一键控温' 
                    ?
                    <TempSetterForm info={info} params={params} silent={silent} onClose={()=>setInfo({})} onDispatch={action=>dispatch(action)}/>
                    :
                    info.title === '时段控制'
                    ?
                    <TimePeriodForm info={info} params={params} silent={silent} onClose={()=>setInfo({})} onDispatch={action=>dispatch(action)}/>
                    :
                    info.title === '季节控制'
                    ?
                    <SeasonForm info={info} params={params} silent={silent} onClose={()=>setInfo({})} onDispatch={action=>dispatch(action)}/>
                    :
                    info.title === '预约控制'
                    ?
                    <OrderSetterForm info={info} params={params} silent={silent} onClose={()=>setInfo({})} onDispatch={action=>dispatch(action)}/>
                    :
                    null
                }
                
            </Drawer>
        </div>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data || prevProps.params !== nextProps.params ) {
        return false;
    } else {
        return true;
    }
}
export default React.memo(PlanCardList, areEqual);