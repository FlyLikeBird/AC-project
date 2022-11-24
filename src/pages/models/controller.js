import { 
    getRealtimeInfo,
    getRoomList,
    setACParams, 
    getPlanList, pushPlan, addPlan, updatePlan, delPlan,
    getTplList, copyPlanToTpl, delTpl,
    getGroupTree, getGroupMach, setGroupAC,
    getTempCtrl, setTempCtrl, cancelTempCtrl
} from '../services/switchService';
import { getCostAnalysis } from '../services/costService';
const initialState = {
    currentRoom:{},
    detailInfo:{},
    chartInfo:{},
    selectedNodes:[],
    roomList:[],
    isLoading:true,
    powerStatus:[0,1],
    modeStatus:[1,3,4],
    // 分组控制的树节点
    groupTree:[],
    currentGroup:{},
    // 室温预控状态
    ctrlInfo:{},
    // card-卡片容器模式  list-列表模式
    showMode:'card',
    currentPage:1,
    total:0,
    planList:[],
    tplList:[]
}

export default {
    namespace:'controller',
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
        *init(action, { put, select }){
            yield put.resolve({ type:'fields/init'});
            let { fields:{ currentAttr }} = yield select();
            let result = [];
            getSelectedKeys(currentAttr, result);
            yield put({ type:'setSelectedNodes', payload:result });
            yield put({ type:'fetchRoomList'});
        },
        *fetchRoomList(action, { put, select, call }){
            let { controller:{ selectedNodes, powerStatus, modeStatus }} = yield select();
            let { currentPage } = action.payload || {};
            currentPage = currentPage || 1;
            yield put({ type:'toggleLoading' });
            let { data } = yield call(getRoomList, { attr_ids:selectedNodes, power_status:powerStatus, mode_status:modeStatus, page:currentPage, page_size:12 });
            if ( data && data.code === '0'){
                yield put({ type:'getRoomListResult', payload:{ data:data.data, currentPage, total:data.count }});
            }
        },
        *fetchDetailInfo(action, { put, select, call }){

            let { data } = yield call(getRealtimeInfo, { mach_id:action.payload });
            yield put({ type:'toggleLoading'});
            if ( data && data.code === '0'){
                yield put({ type:'getDetailResult', payload:{ data:data.data }});
            }
        },
        *fetchCostAnalysis(action, { call, put, select }){
            try {
                let { user:{ company_id, startDate, endDate, timeType }} = yield select();
                let { attr_id } = action.payload ;
                let { data } = yield call(getCostAnalysis, { time_type:timeType, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), company_id, attr_id });
                if ( data && data.code === '0') {
                    yield put({ type:'getAnalysisResult', payload:{ data:data.data }});
                }
            } catch(err){
                console.log(err);
            }
        },
        *initGroup(action, { call, put }){
            yield put.resolve({ type:'fetchGroupTree'});
            yield put({ type:'fetchGroupMach'});
            yield put({ type:'fetchTempCtrl'});
        },
        *fetchGroupTree(action, { call, select, put }){
            let { user:{ company_id }} = yield select();
            let { data } = yield call(getGroupTree, { company_id });
            if ( data && data.code === '0'){
                yield put({ type:'getGroupTreeResult', payload:{ data:data.data }});
            }
        },
        *fetchGroupMach(action, { call, select, put }){
            let { controller:{ currentGroup }} = yield select();
            if ( currentGroup.id ){
                yield put({ type:'toggleLoading'});
                let { data } = yield call(getGroupMach, { grp_id:currentGroup.id });
                if ( data && data.code === '0'){
                    yield put({ type:'getRoomListResult', payload:{ data:data.data, currentPage:1, total:data.count }});
                }
            } else {
                
            }
        },
        // 组控制
        *setGroupAsync(action, { put, select, call }){
            let { controller:{ currentGroup }} = yield select();
            if ( currentGroup.id ) {
                let { resolve, reject, values } = action.payload || {};
                let { data } = yield call(setGroupAC, { ...values, mach_id:currentGroup.gatewayId, grp:currentGroup.grp });
                if ( data && data.code === '0'){
                    yield put({ type:'fetchGroupMach'});
                    if ( resolve ) resolve();
                } else {
                    if ( reject ) reject(data.msg);
                }
            }  
        },
        // 室温预控任务
        *fetchTempCtrl(action, { put, call, select }){
            let { user:{ company_id }, controller:{ currentGroup }} = yield select();
            if ( currentGroup.id ) {
                let { data } = yield call(getTempCtrl, { company_id, grp_id:currentGroup.id });
                if ( data && data.code === '0'){
                    yield put({ type:'getTempCtrlResult', payload:{ data:data.data }});
                }
            }
        },
        *setTempCtrlAsync(action, { put, call, select }){
            let { user:{ company_id }, controller:{ currentGroup }} = yield select();
            let { temp, resolve, reject } = action.payload;
            let { data } = yield call(setTempCtrl, { grp_id:currentGroup.id, company_id, temp });
            if ( data && data.code === '0'){
                yield put({ type:'fetchTempCtrl'});
                if ( resolve ) resolve();
            } else {
                if ( reject ) reject(data.msg);
            }
        },
        *cancelTempCtrlAsync(action, { put, call, select }){
            let { user:{ company_id }, controller:{ currentGroup }} = yield select();
            let { resolve, reject } = action.payload;
            let { data } = yield call(cancelTempCtrl, { grp_id:currentGroup.id, company_id });
            if ( data && data.code === '0'){
                if ( resolve ) resolve();
            } else {
                if ( reject ) reject(data.msg);
            }
        },
        // 方案状态管理
        *initPlanList(action, { put }){
            yield put.resolve({ type:'gateway/fetchACList'});
            yield put({ type:'getTplSync'});
            yield put({ type:'getPlanListSync'});
        },
        *getPlanListSync(action, { put, select, call }){
            try {
                let { user:{ company_id }} = yield select();
                let { currentPage } = action.payload || {};
                currentPage = currentPage || 1;
                yield put({ type:'toggleLoading'});
                let { data } = yield call(getPlanList, { company_id, page:currentPage, page_size:12 });
                if ( data && data.code === '0'){
                    yield put({ type:'getPlanListResult', payload:{ data:data.data, currentPage, total:data.count }});
                }
            } catch(err){
                console.log(err);
            }
        },
        *setACSync(action, { put, select, call }){
            try {
                let { mach_id, values, resolve, reject } = action.payload || {};
                let { status_mode, status_on_off, status_wind_speed, status_temp, status_antifreeze_state } = values;
                let obj = {};
                obj.mach_id = mach_id;
                obj.mode = status_mode;
                obj.on_off = status_on_off;
                obj.wind_speed = status_wind_speed;
                obj.temp = status_temp;
                obj.antifreeze_state = status_antifreeze_state;
                let { data } = yield call(setACParams, obj);
                if ( data && data.code === '0'){
                    if ( resolve && typeof resolve === 'function') resolve();
                    console.log('a');
                    yield put({ type:'fetchDetailInfo', payload:mach_id });
                } else {
                    if ( reject && typeof reject === 'function') reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }
        },
        *pushPlanSync(action, { put, select, call }){
            let { resolve, reject, plan_id } = action.payload;
            let { data } = yield call(pushPlan, { plan_id });
            if ( data && data.code === '0'){
                yield put({ type:'getPlanListSync' });
                if ( resolve && typeof resolve === 'function' ) resolve();
            } else {
                if ( reject && typeof reject === 'function' ) reject(data.msg);
            }
        },
        *addPlanSync(action, { put, select, call }){
            try {
                let { user:{ company_id }} = yield select();
                let { values, resolve, reject, forEdit } = action.payload || {};
                values['company_id'] = company_id;
                let { data } = yield call( forEdit ? updatePlan : addPlan, values);
                if ( data && data.code === '0'){
                    yield put({ type:'getPlanListSync'});
                    if ( resolve && typeof resolve === 'function') resolve();
                } else {
                    if ( reject && typeof reject === 'function' ) reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }
        },
        *delPlanSync(action, { put, select, call }){
            let { plan_id, resolve, reject } = action.payload || {};
            let { data } = yield call(delPlan, { plan_id });
            if ( data && data.code === '0'){
                yield put({ type:'getPlanListSync'});
                if ( resolve && typeof resolve === 'function') resolve();
            } else {
                if ( reject && typeof reject === 'function' ) reject(data.msg);
            }
        },
        // 模板状态管理
        *getTplSync(action, { put, select, call }){
            let { user:{ company_id }} = yield select();
            let { data } = yield call(getTplList, { company_id });
            if ( data && data.code === '0'){
                yield put({ type:'getTplResult', payload:{ data:data.data }});
            }
        },
        *copyToTpl(action, { put, select, call }){
            try {
                let { resolve, reject, plan_id, tpl_name } = action.payload;
                let { data } = yield call(copyPlanToTpl, { plan_id, tpl_name });
                if ( data && data.code === '0'){
                    yield put({ type:'getTplSync'});
                    if ( resolve && typeof resolve === 'function') resolve();
                } else {
                    if ( reject && typeof reject === 'function' ) reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }  
        },
        *delTplSync(action, { put, select, call }){
            let { tempelate_id, resolve, reject } = action.payload || {};
            let { data } = yield call(delTpl, { tempelate_id });
            if ( data && data.code === '0'){
                yield put({ type:'getTplSync'});
                if ( resolve && typeof resolve === 'function') resolve();
            } else {
                if ( reject && typeof reject === 'function' ) reject(data.msg);
            }
        },
       
    },
    reducers:{
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        setSelectedNodes(state, { payload }){
            return { ...state, selectedNodes:payload };
        },
        getRoomListResult(state, { payload:{ data, currentPage, total }}){
            return { ...state, roomList:data, currentPage, total, isLoading:false };
        },
        toggleShowMode(state, { payload }){
            return { ...state, showMode:payload };
        },
        setPowerStatus(state, { payload }){
            return { ...state, powerStatus:payload };
        },
        setModeStatus(state, { payload }){
            return { ...state, modeStatus:payload };
        },
        setCurrentRoom(state, { payload }){
            return { ...state, currentRoom:payload };
        },
        getDetailResult(state, { payload:{ data }}){
            return { ...state, detailInfo:data, isLoading:false };
        },
        getAnalysisResult(state, { payload:{ data }}){
            return { ...state, chartInfo:data };
        },
        resetDetail(state){
            return { ...state, currentRoom:{}, detailInfo:{}, chartInfo:{} };
        },
        getPlanListResult(state, { payload:{ data, currentPage, total }}){
            return { ...state, planList:data, currentPage, total, isLoading:false };
        },
        getTplResult(state, { payload:{ data }}){
            return { ...state, tplList:data };
        },
        getGroupTreeResult(state, { payload:{ data }}){
            let temp = {};
            if ( data.length ){
                data.forEach(item=>{
                    item.key = item.id;
                    item.title = '网关-' + item.title;
                    item.disabled = true;
                    if ( item.child && item.child.length ){
                        item.child.forEach(sub=>{
                            sub.key = sub.id;
                            sub.gatewayId = item.id;
                        });
                    }
                    item.children = item.child || [];
                })
                if ( data[0].child && data[0].child.length ) {
                    temp = data[0].child[0];
                }
            }
            return { ...state, groupTree:data, currentGroup:temp };
        },
        setCurrentGroup(state, { payload }){
            return { ...state, currentGroup:payload };
        },
        getTempCtrlResult(state, { payload:{ data } }){
            return { ...state, ctrlInfo:data };
        },
        reset(state){
            return initialState;
        }
    }
}

function getSelectedKeys(data, result){
    if ( data.key ){
        result.push(data.key);
    }
    if ( data.children && data.children.length ){
        data.children.forEach((item)=>{
            getSelectedKeys(item, result);
        })
    }
}