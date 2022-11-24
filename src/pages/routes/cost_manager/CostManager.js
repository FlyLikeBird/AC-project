import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { history } from 'umi';
import { Tree, Spin, Menu, Button, message } from 'antd';
import style from '@/pages/routes/IndexPage.css';
import ColumnCollapse from '@/pages/components/ColumnCollapse';
import CostAnalyze from './CostAnalyze';
import CostTrend from './CostTrend';
import CostCalendar from './CostCalendar';

let subMenuMaps = {
    'ac_cost_analyze':CostAnalyze,
    'ac_cost_trend':CostTrend,
    'ac_cost_calendar':CostCalendar
};

function CostManager({ dispatch, user, fields }){
    let { currentMenu } = user;
    let { allFields, currentField, currentAttr, energyInfo, treeLoading } = fields;
    let fieldList = allFields[energyInfo.type_code] ? allFields[energyInfo.type_code].fieldList : [];
    let fieldAttrs = allFields[energyInfo.type_code] && allFields[energyInfo.type_code].fieldAttrs ? allFields[energyInfo.type_code]['fieldAttrs'][currentField.field_name] : [];
    const [subMenu, toggleSubMenu] = useState('');
    useEffect(()=>{
        if ( currentMenu.child && currentMenu.child.length ){
            toggleSubMenu(currentMenu.child[0]);
        }
    },[currentMenu]);
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
                                    if ( subMenu.menu_code === 'ac_cost_analyze') {
                                        dispatch({ type:'cost/fetchCostAnalysis'});                                                                                                                                           
                                    }
                                    if ( subMenu.menu_code === 'ac_cost_trend') {
                                        dispatch({ type:'cost/fetchCostTrend'});
                                    }
                                    if ( subMenu.menu_code === 'ac_cost_calendar') {
                                        dispatch({ type:'cost/fetchCalendar'});
                                    }
                                }}
                            />
                            :
                            null
                        }
                    </div>
                </div>
        </div>
        
    );
    let Component = subMenuMaps[subMenu.menu_code] || (()=>null);
    let content = <Component menu={subMenu} />;
    return (
        <ColumnCollapse sidebar={sidebar} content={content} />
    )
}

export default connect(({ user, fields })=>({ user, fields }))(CostManager);