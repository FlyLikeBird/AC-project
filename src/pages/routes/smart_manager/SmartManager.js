import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { history } from 'umi';
import { Tree, Spin, Menu, Button, message } from 'antd';
import style from '@/pages/routes/IndexPage.css';
import ColumnCollapse from '@/pages/components/ColumnCollapse';
import ACManager from './ACManager';
import ACSetter from './ACSetter';
import PlanHistory from './PlanHistory';
import PlanManager from './PlanManager';
import ACGroup from './ACGroup';

let subMenuMaps = {
    'ac_control_manager':ACManager,
    // 'ac_control_params':PlanManager,
    'ac_control_params':ACSetter,
    'ac_control_log':PlanHistory,
    'ac_control_grp':ACGroup
};
function SmartManager({ dispatch, user, fields, controller }){
    let { currentMenu } = user;
    let { allFields, currentField, energyInfo, currentAttr, treeLoading } = fields;
    let { selectedNodes, roomList, currentRoom, groupTree, currentGroup } = controller;
    let fieldList = allFields[energyInfo.type_code] ? allFields[energyInfo.type_code].fieldList : [];
    let fieldAttrs = allFields[energyInfo.type_code] && allFields[energyInfo.type_code].fieldAttrs ? allFields[energyInfo.type_code]['fieldAttrs'][currentField.field_name] : [];
    const [subMenu, toggleSubMenu] = useState('');
    useEffect(()=>{
        if ( currentMenu.child && currentMenu.child.length ){
            toggleSubMenu(currentMenu.child[0]);
        }
    },[currentMenu]);
    // console.log(fieldAttrs);
    // console.log(selectedNodes);
    let sidebar = (
        <div>
            <div className={style['card-container'] + ' ' + style['topRadius'] + ' ' + style['float-menu-container']} style={{ padding:'0', height:'auto', paddingBottom:'10px' }}>
                <div className={style['card-title']}>导航功能</div>
                <div className={style['card-content']} style={{ padding:'0' }}>
                    <Menu mode='inline' selectedKeys={[subMenu.menu_code]} onClick={e=>{
                        let temp = currentMenu.child.filter(i=>i.menu_code === e.key)[0];
                        toggleSubMenu(temp);
                    }}>
                        {
                            currentMenu.child && currentMenu.child.length 
                            ?
                            currentMenu.child.map((item,index)=>(
                                <Menu.Item key={item.menu_code}>{ item.menu_name }</Menu.Item>
                            ))
                            :
                            null
                        }
                    </Menu>
                </div>
            </div>
            {/* 远程控制菜单，可选择网关或者空开设备 */}
            {
                subMenu.menu_code === 'ac_control_manager' && !Object.keys(currentRoom).length 
                ?
                <div className={style['card-container'] + ' ' + style['bottomRadius']} style={{ padding:'0', height:'auto', boxShadow:'none' }}>
                    <div className={style['card-title']}>统计对象</div>
                    <div className={style['card-content']}>
                        {
                            treeLoading
                            ?
                            <Spin className={style['spin']} />
                            :
                            fieldAttrs.length 
                            ?
                            <Tree
                                className={style['custom-tree']}
                                defaultExpandAll={true}
                                checkable
                                // expandedKeys={expandedKeys}
                                // onExpand={temp=>{
                                //     dispatch({ type:'fields/setExpandedKeys', payload:temp });
                                // }}
                                checkedKeys={selectedNodes}
                                treeData={fieldAttrs}
                                onSelect={(selectedKeys, { node })=>{
                                    let target = roomList.filter(i=>i.attr_id === node.key )[0];
                                    if ( target ){
                                        dispatch({ type:'controller/setCurrentRoom', payload:{ mach_id:target.mach_id, attr_id:target.attr_id }});
                                    } else {
                                        message.info('该区域没有挂载设备');
                                    }
                                }}
                                onCheck={(checkedKeys)=>{
                                    dispatch({ type:'controller/setSelectedNodes', payload:checkedKeys });
                                    dispatch({ type:'controller/fetchRoomList'});
                                }}
                            />
                            :
                            <div></div>
                        }
                    </div>
                </div>              
                :
                null
            }
            {
                subMenu.menu_code === 'ac_control_manager' && Object.keys(currentRoom).length
                ?
                <div className={style['card-container'] + ' ' + style['bottomRadius']} style={{ padding:'0', height:'auto', boxShadow:'none' }}>
                    <div className={style['card-title']}>统计对象</div>
                    <div className={style['card-content']}>
                        {
                            treeLoading
                            ?
                            <Spin className={style['spin']} />
                            :
                            fieldAttrs.length 
                            ?
                            <Tree
                                className={style['custom-tree']}
                                defaultExpandAll={true}
                                // expandedKeys={expandedKeys}
                                // onExpand={temp=>{
                                //     dispatch({ type:'fields/setExpandedKeys', payload:temp });
                                // }}
                                selectedKeys={[currentRoom.attr_id]}
                                treeData={fieldAttrs}
                                onSelect={(selectedKeys, { node })=>{
                                    let target = roomList.filter(i=>i.attr_id === node.key )[0];
                                    if ( target ){
                                        dispatch({ type:'controller/setCurrentRoom', payload:{ mach_id:target.mach_id, attr_id:target.attr_id }});
                                    } else {
                                        message.info(`${node.title}没有挂载设备`);
                                    }
                                }}
                            />
                            :
                            <div></div>
                        }
                    </div>
                </div>
                :
                null
            }
            {/* 控制方案功能 */}
            {
                subMenu.menu_code === 'ac_control_params' || subMenu.menu_code === 'ac_control_log'
                ?
                <div className={style['card-container'] + ' ' + style['bottomRadius']} style={{ padding:'0', height:'auto', boxShadow:'none' }}>
                    <div className={style['card-title']}>
                        <div>统计对象</div>                                        
                    </div>
                    <div className={style['card-content']}>
                        {
                            treeLoading
                            ?
                            <Spin className={style['spin']} />
                            :
                            fieldAttrs.length 
                            ?
                            <Tree
                                className={style['custom-tree']}
                                defaultExpandAll={true}
                                // expandedKeys={expandedKeys}
                                // onExpand={temp=>{
                                //     dispatch({ type:'fields/setExpandedKeys', payload:temp });
                                // }}
                                selectedKeys={[currentAttr.key]}
                                treeData={fieldAttrs}
                                onSelect={(selectedKeys, {node})=>{                                    
                                    dispatch({ type:'fields/toggleAttr', payload:node });
                                    if ( subMenu.menu_code === 'ac_control_params') {
                                        dispatch({ type:'plan/fetchPlanList'});
                                    } else {
                                        dispatch({ type:'plan/fetchLogList'});
                                    }
                                }}
                            />
                            :
                            null
                        }
                    </div>
                </div>
                :
                null
            }
            {/* 分组控制功能 */}
            {
                subMenu.menu_code === 'ac_control_grp' 
                ?
                <div className={style['card-container'] + ' ' + style['bottomRadius']} style={{ padding:'0', height:'auto', boxShadow:'none' }}>
                    <div className={style['card-title']}>统计对象</div>
                    <div className={style['card-content']}>
                        {
                            
                            groupTree.length 
                            ?
                            <Tree
                                className={style['custom-tree']}
                                defaultExpandAll={true}
                                // expandedKeys={expandedKeys}
                                // onExpand={temp=>{
                                //     dispatch({ type:'fields/setExpandedKeys', payload:temp });
                                // }}
                                selectedKeys={[currentGroup.key]}
                                treeData={groupTree}
                                onSelect={(selectedKeys, { node })=>{
                                    dispatch({ type:'controller/setCurrentGroup', payload:node });
                                    dispatch({ type:'controller/fetchGroupMach'});
                                    dispatch({ type:'controller/fetchTempCtrl'});
                                }}
                            />
                            :
                            <div>还没有设置分组</div>
                        }
                    </div>
                </div>
                :
                null
            }

        </div>
        
    );
    let Component = subMenuMaps[subMenu.menu_code] || (()=>null);
    let content = <Component menu={subMenu} />;
    return (
        <ColumnCollapse sidebar={sidebar} content={content} />
    )
   
}

export default connect(({ user, fields, controller })=>({ user, fields, controller }))(SmartManager);