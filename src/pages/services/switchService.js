import request, { requestImg } from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { apiToken } from '../utils/encryption';
// 获取空调实时状态
export function getRealtimeInfo(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/getmachrealtime', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
// 控制单台空调设备
export function setACParams(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/ctrlacmach', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getRoomList(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/getattrmach', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
export function getPlanList(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/getplanlist', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
export function addPlan(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/addacplan', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
export function updatePlan(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/updateacplan', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
export function delPlan(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/deleteacplan', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
export function pushPlan(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/pushplan', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
export function copyPlanToTpl(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/cpplan2tpl', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getTplList(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/gettpllist', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
export function delTpl(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/deletetpl', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
// 获取网关分组树
export function getGroupTree(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/getgrptree', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
// 通过分组获取设备列表
export function getGroupMach(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/getgrpmach', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
// 控制网关下指定分组
export function setGroupAC(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/ctrlacgrp', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
// 室温预控任务
export function getTempCtrl(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/gettempctrlrule', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
export function setTempCtrl(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/settempctrlrule', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
export function cancelTempCtrl(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/canceltempctrlrule', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}


