import React, { useEffect } from 'react';
import { connect } from 'dva';
import ACRoomList from '../ACManager/ACRoomList';
import ACRoomDetail from '../ACManager/ACRoomDetail';
import FormContainer from './FormContainer';

function ACGroup({ dispatch, controller }){
    useEffect(()=>{
        dispatch({ type:'controller/initGroup'});
    },[]);
    const { roomList, ctrlInfo, currentGroup, currentRoom, detailInfo, chartInfo, isLoading, currentPage, total } = controller;
    return (
        <div style={{ height:'100%', display:'flex' }}>
            <div style={{ width:'76%'}}>
                {
                    Object.keys(currentRoom).length 
                    ?
                    <ACRoomDetail
                        dispatch={dispatch}
                        data={currentRoom}
                        detailInfo={detailInfo}
                        chartInfo={chartInfo}
                        isLoading={isLoading}
                    />
                    :
                    roomList.length 
                    ?
                    <ACRoomList 
                        dispatch={dispatch} 
                        data={roomList} 
                        isLoading={isLoading} 
                        showMode='card'
                        currentPage={currentPage} 
                        total={total} 
                        forGroup={true}
                    />
                    :
                    <div>该分组下没有挂载设备</div>
                }
            </div>
            <div style={{ width:'24%', background:'#191932', position:'absolute', top:'-1rem', right:'-1rem', height:'calc( 100% + 2rem)'}}>
                <FormContainer dispatch={dispatch} info={ctrlInfo} />
            </div>
        </div>
    )
}

export default connect(({ controller })=>({ controller }))(ACGroup);