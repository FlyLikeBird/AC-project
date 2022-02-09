import { 
    getIndexData,
    getGatewayList, addGateway, updateGateway, deleteGateway, 
    getACList, getACBrand, getACModel, addAC, updateAC, deleteAC,
    getGroup, addGroup, updateGroup, deleteGroup 
} from '../services/gatewayService';
const initialState = {
    monitorInfo:{},
    gatewayList:[],
    currentGateway:{},
    gatewayLoading:true,
    currentPage:1,
    total:0,
    groupList:[],
    ACList:[],
    ACModel:[],
    ACBrand:[]
}

export default {
    namespace:'gateway',
    state:initialState,
    effects:{
        *cancelable({ task, payload, action }, { call, race, take}) {
            yield race({
                task:call(task, payload),
                cancel:take(action)
            })
        },
        // 统一取消所有action
        *cancelAll(action, { put }){
            yield put({ type:'reset'});
        },
        *fetchIndexInfo(action, { put, select, call }){
            let { user:{ company_id }} = yield select();
            let { data } = yield call(getIndexData, { company_id });
            if ( data && data.code === '0'){
                yield put({ type:'getIndexData', payload:{ data:data.data }});
            }
        },
        *fetchGateway(action, { put, call, select }){
            try {
                let { user:{ company_id }, gateway:{ gatewayList }} = yield select();
                let { keyword, forceUpdate } = action.payload || {};
                if ( forceUpdate || !gatewayList.length ){
                    let { data } = yield call(getGatewayList, { company_id, keyword, app_type:'4' });
                    if ( data && data.code === '0'){
                        yield put({ type:'getGateway', payload:{ data:data.data }});
                    } 
                }
            } catch(err){
                console.log(err);
            }  
        },
        *add(action, { put, call, select }){
            try {
                let { values, resolve, reject, forEdit } = action.payload || {};
                let { mach_id, meter_name, register_code, lng, lat, address } = values;
                let { user:{ company_id }} = yield select();  
                let params = { company_id, meter_name, register_code, lng, lat, address, app_type:'4' };
                if ( forEdit ){
                    params['mach_id'] = mach_id; 
                }      
                let { data } = yield call( forEdit ? updateGateway : addGateway, params );
                if ( data && data.code === '0'){
                    yield put({ type:'fetchGateway', payload:{ forceUpdate:true } });
                    if ( resolve && typeof resolve === 'function' ) resolve();
                } else {
                    if ( reject && typeof reject === 'function' ) reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }
        },
        *del(action, { put, call, select }){
            try {
                let { user:{ company_id }} = yield select();
                let { resolve, reject, mach_id } = action.payload || {};
                let { data } = yield call(deleteGateway, { company_id, mach_id });
                if ( data && data.code === '0'){
                    yield put({ type:'fetchGateway', payload:{ forceUpdate:true } });
                    if ( resolve && typeof resolve === 'function' ) resolve();
                } else {
                    if ( reject && typeof reject === 'function' ) reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }
        },
        // 网关组操作
        *fetchGroup(action, { put, call, select }){
            try {
                let { gateway:{ currentGateway }} = yield select();
                let { data } = yield call(getGroup, { mach_id:currentGateway.mach_id });
                if ( data && data.code === '0'){
                    yield put({ type:'getGroupResult', payload:{ data:data.data }});
                }
            } catch(err){
                console.log(err);
            }
        },
        *addGroupSync(action, { put, call, select }){
            try {
                let { values, resolve, reject, forEdit } = action.payload || {};
                let { grp_id, mach_id, grp, grp_name } = values;
                let params = { mach_id, grp, grp_name };
                if ( forEdit ){
                    params['id'] = grp_id; 
                }      
                let { data } = yield call( forEdit ? updateGroup : addGroup, params );
                if ( data && data.code === '0'){
                    yield put({ type:'fetchGroup' });
                    if ( resolve && typeof resolve === 'function' ) resolve();
                } else {
                    if ( reject && typeof reject === 'function' ) reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }
        },
        *delGroupSync(action, { put, call, select }){
            try {
                let { resolve, reject, grp_id } = action.payload || {};
                let { data } = yield call(deleteGroup, { id:grp_id });
                if ( data && data.code === '0'){
                    yield put({ type:'fetchGroup' });
                    if ( resolve && typeof resolve === 'function' ) resolve();
                } else {
                    if ( reject && typeof reject === 'function' ) reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }
        },
        // 空调设备操作
        *initACList(action, { put }){
            yield put.resolve({ type:'fetchGateway'});
            yield put({ type:'fetchGroup'});
            yield put({ type:'fetchACList', payload:{ gateway_id:0.1 }});
            yield put({ type:'fetchACModel'});
            yield put({ type:'fetchACBrand'});
        },
        *fetchACList(action, { put, call, select }){
            try {
                let { user:{ company_id }} = yield select();
                let { gateway_id, currentPage } = action.payload || {};
                currentPage = currentPage || 1;
                let params = { company_id, page:currentPage, pagesize:12 };
                if ( gateway_id !== 0.1 ) {
                    params.gateway_id = gateway_id;
                }
                let { data } = yield call(getACList, params);
                if ( data && data.code === '0'){
                    yield put({ type:'getACListResult', payload:{ data:data.data, total:data.count, currentPage }});
                }
            } catch(err){
                console.log(err);
            }
        },
        *fetchACModel(action, { put, call }){
            try {
                let { data } = yield call(getACModel, { app_type:'4' });
                if ( data && data.code === '0'){
                    yield put({ type:'getACModelResult', payload:{ data:data.data }});
                }
            } catch(err){
                console.log(err);
            }
        },
        *fetchACBrand(action, { put, call }){
            try {
                let { data } = yield call(getACBrand);
                if ( data && data.code === '0'){
                    yield put({ type:'getACBrandResult', payload:{ data:data.data }});
                }
            } catch(err){
                console.log(err);
            }
        },
        *addACSync(action, { put, select, call }){
            let { user:{ company_id }} = yield select();
            let { values, resolve, reject, gateway_id, forEdit } = action.payload || {};
            values.company_id = company_id;
            let { data } = yield call( forEdit ? updateAC : addAC, values);
            if ( data && data.code === '0'){
                yield put({ type:'fetchACList', payload:{ gateway_id }});
                if ( resolve && typeof resolve === 'function' ) resolve();
            } else {
                if ( reject && typeof reject === 'function') reject(data.msg);
            }
        },
        *delACSync(action, { put, select, call }){
            let { resolve, reject, mach_id, gateway_id } = action.payload || {};
            let { data } = yield call(deleteAC, { mach_id });
            if ( data && data.code === '0'){
                yield put({ type:'fetchACList', payload:{ gateway_id }});
                if ( resolve && typeof resolve === 'function' ) resolve();
            } else {
                if ( reject && typeof reject === 'function') reject(data.msg);
            }
        }
    },
    reducers:{
        toggleGatewayLoading(state){
            return { ...state, gatewayLoading:true };
        },
        getIndexData(state, { payload:{ data }}){
            return { ...state, monitorInfo:data };
        },
        getGateway(state, { payload:{ data }}){
            let currentGateway = data && data.length ? data[0] : {};
            return { ...state, gatewayList:data, currentGateway, gatewayLoading:false };
        },
        getGroupResult(state, { payload:{ data }}){
            return { ...state, groupList:data };
        },
        toggleGateway(state, { payload }){
            return { ...state, currentGateway:payload };
        },
        getACListResult(state, { payload:{ data, total, currentPage }}){
            return { ...state, ACList:data, total, currentPage };
        },
        getACModelResult(state, { payload:{ data }}){
            return { ...state, ACModel:data };
        },
        getACBrandResult(state, { payload:{ data }}){
            return { ...state, ACBrand:data };
        },
        reset(state){
            return initialState;
        }
    }
}