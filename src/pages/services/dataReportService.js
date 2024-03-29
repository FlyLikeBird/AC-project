import request, { requestImg } from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { apiToken } from '../utils/encryption';
// 获取空调温度报表接口
export function getTempReport(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/tempreport', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
// 获取空调数据报表接口
export function getEnergyReport(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/datareport', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
// 获取空调成本报表接口
export function getCostReport(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/ac/costreport', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
// 环比报表接口
export function getAdjoinRate(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/eleroommonitor/adjoinrate', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
// 电力报表接口和运行日报接口
export function getEleReport(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/Eleroommonitor/elereport', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

// 告警列表接口
export function getWarningList(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/Eleroommonitor/getwarninglist', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

// 告警列表接口
export function getConfirmWarning(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/warn/operwarning', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}


export function uploadImg(data={}){
    let token = apiToken();
    let { company_id, file } = data;
    let formData = new FormData();
    formData.append('file', file);
    formData.append('token',token);
    return request('/upload/upload', { 
        method:'POST',
        body:formData
        }); 
}