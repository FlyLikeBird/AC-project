import request, { requestImg } from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { apiToken } from '../utils/encryption';

export function getIndexData(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/home', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getGatewayList(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/getgateways', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function addGateway(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/addgateway', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function updateGateway(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/updategateway', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function deleteGateway(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/deletegateway', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getACList(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/getmachs', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getACModel(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/getswitchmodel', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getACBrand(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/getacbrand', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function addAC(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/addmach', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function updateAC (data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/updatemach', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function deleteAC(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/deletemach', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

// 添加、修改网关分组接口
export function getGroup(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/getgrplist', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function addGroup(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/addgrp', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function updateGroup(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/updategrp', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function deleteGroup(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/delgrp', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
