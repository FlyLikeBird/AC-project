import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Tree, Spin, Modal, Checkbox, Button, Skeleton, message } from 'antd';
import { ReloadOutlined, CloudSyncOutlined, ControlOutlined  } from '@ant-design/icons';
import style from '@/pages/routes/IndexPage.css';
import ACRoomList from './ACRoomList';
import ACRoomDetail from './ACRoomDetail';

let btnMaps = {};


function RemoteSwitch({ dispatch, user, controller, menu }){
    let { roomList, currentRoom, isLoading, powerStatus, modeStatus, showMode, currentPage, total } = controller;
    let [visible, setVisible] = useState(false);
    useEffect(()=>{
        if ( user.authorized ){
            dispatch({ type:'controller/init' });
        }
    },[user.authorized]);
    useEffect(()=>{
        return ()=>{
            dispatch({ type:'controller/reset' });
            btnMaps = {};
        }
    },[]);
    
    if ( menu.child && menu.child.length ){
        menu.child.forEach(item=>{
            btnMaps[item.menu_code] = true;
        })
    }
    return (
        Object.keys(currentRoom).length
        ?
        <ACRoomDetail
            dispatch={dispatch}
            data={currentRoom}
        />
        :
        <ACRoomList 
            dispatch={dispatch} 
            data={roomList} 
            powerStatus={powerStatus} 
            modeStatus={modeStatus} 
            isLoading={isLoading} 
            showMode={showMode}
            currentPage={currentPage} 
            total={total} 
        />
        
    )   
   
   
}
export default connect(({ user, controller }) => ({ user, controller }))(RemoteSwitch);