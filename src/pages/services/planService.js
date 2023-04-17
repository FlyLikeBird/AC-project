import request, { requestImg } from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { apiToken } from '../utils/encryption';
// 控制方案管理接口
export function getPlanList(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/getacplancard', { 
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
    return request('/ac/pushacplancard', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getPushedPlan(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/getacplancardlist', { 
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
    return request('/ac/getcardtpllist', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function addTpl(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/cpcard2tpl', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function applyTpl(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/cptpl2card', { 
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
    return request('/ac/delcardtpl', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}




