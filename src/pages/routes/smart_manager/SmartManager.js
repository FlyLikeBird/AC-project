import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { history } from 'umi';
import { Tree, Spin, Menu, Button, message } from 'antd';
import style from '@/pages/routes/IndexPage.css';
import ColumnCollapse from '@/pages/components/ColumnCollapse';
import ACManager from './ACManager';
import ACSetter from './ACSetter';
// import TimePlanner from './TimePlanner';
// import ExecuteRecorder from './ExecuteRecorder';
// import LimitManager from './LimitManager';
// import SwitchSetter from './SwitchSetter';
// import AutoCombine from './AutoCombine';
// import SwitchController from './SwitchController';

let subMenuMaps = {
    'ac_control_manager':ACManager,
    'ac_control_plan':null,
    'ac_control_params':ACSetter
};
function SmartManager({ dispatch, user, fields, controller }){
    let { currentMenu } = user;
    let { allFields, currentField, treeLoading } = fields;
    let { selectedNodes } = controller;
    let fieldList = allFields['ele'] ? allFields['ele'].fieldList : [];
    let fieldAttrs = allFields['ele'] && allFields['ele'].fieldAttrs ? allFields['ele']['fieldAttrs'][currentField.field_name] : [];
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
                subMenu.menu_code === 'ac_control_manager' 
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
           
        </div>
        
    );
    let Component = subMenuMaps[subMenu.menu_code] || (()=>null);
    let content = <Component menu={subMenu} />;
    return (
        <ColumnCollapse sidebar={sidebar} content={content} />
    )
   
}

export default connect(({ user, fields, controller })=>({ user, fields, controller }))(SmartManager);