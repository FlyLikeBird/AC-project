import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Menu, Tree, Spin } from 'antd';
import style from '@/pages/routes/IndexPage.css';
import ColumnCollapse from '@/pages/components/ColumnCollapse';

import HistoryAlarm from './HistoryAlarm';
import AlarmAnalyze from './AlarmAnalyze';
import AlarmSetting from './AlarmSetting';
let subMenuMaps = {
    'ac_alarm_list':HistoryAlarm,
    'ac_alarm_analyze':AlarmAnalyze,
    'ac_alarm_setting':AlarmSetting,
};

function AlarmManager({ dispatch, user, fields, alarm }){
    let { currentMenu } = user;
    let { selectedKeys } = alarm;
    let { allFields, currentField, currentAttr, energyInfo, treeLoading } = fields;
    let fieldList = allFields[energyInfo.type_code] ? allFields[energyInfo.type_code].fieldList : [];
    let fieldAttrs = allFields[energyInfo.type_code] && allFields[energyInfo.type_code].fieldAttrs ? allFields[energyInfo.type_code]['fieldAttrs'][currentField.field_name] : [];
    const [subMenu, toggleSubMenu] = useState('');
    useEffect(()=>{
        if ( currentMenu.child && currentMenu.child.length ){
            toggleSubMenu(currentMenu.child[0]);
        }
    },[currentMenu]);
    const sidebar = (
        <div>
            <div className={style['card-container'] + ' ' + style['topRadius'] + ' '+ style['float-menu-container']} style={{ padding:'0', height:'auto', paddingBottom:'10px' }}>
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
            {
                subMenu.menu_code === 'ac_alarm_analyze' 
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
                                checkable
                                // expandedKeys={expandedKeys}
                                // onExpand={temp=>{
                                //     dispatch({ type:'fields/setExpandedKeys', payload:temp });
                                // }}
                                checkedKeys={selectedKeys}
                                treeData={fieldAttrs}
                                onCheck={(checkedKeys)=>{
                                    dispatch({ type:'alarm/select', payload:checkedKeys });
                                    dispatch({ type:'alarm/fetchAlarmAnalysis'});
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
                subMenu.menu_code === 'ac_alarm_list'
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
                                    dispatch({ type:'alarm/fetchAlarmList'});
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
        </div>
        
    );
    let Component = subMenuMaps[subMenu.menu_code] || (()=>null);
    let content = <Component menu={subMenu} />;
    return (
        <ColumnCollapse sidebar={sidebar} content={content} />
    )
    
}

export default connect(({ user, fields, alarm })=>({ user, fields, alarm }))(AlarmManager);