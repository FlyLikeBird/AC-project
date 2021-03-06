import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Tree, Spin, Menu, message } from 'antd';
import style from '@/pages/routes/IndexPage.css';
import ColumnCollapse from '@/pages/components/ColumnCollapse';
import GatewayManager from './GatewayManager';
import GroupManager from './GroupManager';
import SwitchManager from './SwitchManager';
import FieldManager from './FieldManager';
import BillingManager from './BillingManager';
import UserCenter from './UserCenter';
import UserPermission from './UserPermission';
import LogManager from './LogManager';
import AddUserManager from './AddUserManager';


let subMenuMaps = {
    'ac_system_gateway':GatewayManager,
    'ac_system_group':GroupManager,
    'ac_system_mach':SwitchManager,
    'ac_system_field':FieldManager,
    'ac_system_user':AddUserManager,
    'ac_system_role':UserPermission,
    'ac_system_billing':BillingManager,
    'ac_system_log':LogManager
};

function SystemManager({ dispatch, user, switchMach }){
    let { currentMenu } = user;
    let { gatewayList, gatewayLoading, currentGateway, currentSwitch } = switchMach;
    const [subMenu, toggleSubMenu] = useState('');
    useEffect(()=>{
        if ( currentMenu.child && currentMenu.child.length ){
            toggleSubMenu(currentMenu.child[0]);
        }
    },[currentMenu]);
    
    let sidebar = (
        <div>
            <div className={style['card-container'] + ' ' + style['topRadius'] + ' ' + style['float-menu-container']}  style={{ padding:'0', height:'auto', paddingBottom:'10px' }}>
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
        </div>
    
    ); 
    let Component = subMenuMaps[subMenu.menu_code] || (()=>null);
    let content = <Component menu={subMenu} />;
    return (
        <ColumnCollapse sidebar={sidebar} content={content} />
    )
   
}

export default connect(({ user, switchMach })=>({ user, switchMach }))(SystemManager);