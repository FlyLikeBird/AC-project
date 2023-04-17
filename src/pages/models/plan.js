import { 
    getPlanList, pushPlan, getPushedPlan,
    getTplList, addTpl, applyTpl, delTpl
} from '../services/planService';

let defaultPlanList = [
    { bgPos:4, title:'预约控制', key:'subscribe', subTitle:'可单次或日、周、月循环定时预约空调开启，多用于会议场所等办公场景，提前准备好人体舒适的环境', color1:'#7a7ab3', color2:'#8383bb' },
    // { bgPos:5, title:'红外控制', key:'hongwai', subTitle:'根据外挂人体红外探测器，可实现人走关闭空调的智能控制', color1:'#9324fe', color2:'#e837ff'},
    { bgPos:0, title:'限温开机', key:'templimit', subTitle:'利用控制器温感探头，判断室内温度需不需要开空调调节温度，当判断为不需要开空调时开启空调则会自动关闭，防止能源浪费', color1:'#188cfe', color2:'#34b5f7'},
    { bgPos:3, title:'季节控制', key:'season', subTitle:'根据当年季节交替时间判断环境需要制热还是制冷', color1:'#ff9944', color2:'#ffd367'},
    { bgPos:1, title:'一键控温', key:'ctrl', subTitle:'设定好模式，温度，风速等运行参数一键下发，下发完成后被下发一键控温方案的空调不能更改运行参数', color1:'#582df7', color2:'#7043df'},
    { bgPos:2, title:'时段控制', key:'timespan', subTitle:'可灵活配置每周每日多工作时段运行时间', color1:'#e84660', color2:'#ea4a7b'}
];
let defaultParams = { 
    subscribe_priority:1, 
    /*hongwai_priority:2, */ 
    templimit_priority:3, 
    season_priority:4, 
    ctrl_priority:5, 
    timespan_priority:6
};
const initialState = {
    attrPlanList:[],
    params:defaultParams,
    tplList:[],
    
    currentPage:1,
    total:0,
    logList:[]
}

export default {
    namespace:'plan',
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
        *initPlanList(action, { put }){
            yield put.resolve({ type:'fields/init'});
            yield put({ type:'fetchPlanList'});
            yield put({ type:'fetchTplList'});
        },
        *fetchPlanList(action, { put, select, call }){
            let { fields:{ currentAttr }} = yield select();
            let { data } = yield call(getPlanList, { attr_id:currentAttr.key });
            if ( data && data.code === '0') {
                yield put({ type:'updatePlanList', payload:{ data:data.data }})
            } else if ( data.code === 507 ) {
                yield put({ type:'resetPlanList'});
            }
        },
        *pushPlanAsync(action, { put, select, call }){
            let { user:{ company_id }, fields:{ currentAttr }, plan:{ params }} = yield select();
            let { resolve, reject, only_save } = action.payload || {};
            let obj = { ...params };
            obj.company_id = company_id;
            obj.attr_id = currentAttr.key;
            if ( only_save ) {
                obj['only_save'] = only_save;
            }
            let { data } = yield call(pushPlan, obj);
            if ( data && data.code === '0'){
                if ( resolve ) resolve();
                yield put({ type:'fetchPlanList'});
            } else {
                if ( reject ) reject(data.msg);
            }
        },
        // 方案模板
        *fetchTplList(action, { put, select, call }){
            let { user:{ company_id }} = yield select();
            let { data } = yield call(getTplList, { company_id });
            if ( data && data.code === '0'){
                yield put({ type:'getTplListResult', payload:{ data:data.data }});
            }
        },
        *addTplAsync(action, { put, select, call }){
            let { fields:{ currentAttr }} = yield select();
            let { tpl_name, resolve, reject } = action.payload || { };
            // 先调用保存接口，将方案参数保存至服务器
            yield put.resolve({ type:'pushPlanAsync', payload:{ only_save:1 }});
            let { data } = yield call(addTpl, { attr_id:currentAttr.key, tpl_name });
            if ( data && data.code === '0' ) {
                yield put({ type:'fetchTplList'});
                if ( resolve ) resolve();
            } else {
                if ( reject ) reject(data.msg);
            }
        },
        *applyTplAsync(action, { put, select, call }){
            let { fields:{ currentAttr }} = yield select();
            let { tpl_id, resolve, reject } = action.payload;
            let { data } = yield call(applyTpl, { attr_id:currentAttr.key, tpl_id });
            if ( data && data.code === '0'){
                yield put({ type:'fetchPlanList'});
                if ( resolve ) resolve();
            } else {
                if ( reject ) reject(data.msg);
            }
        },
        *delTplAsync(action, { put, select, call }){
            let { tpl_id, resolve, reject } = action.payload;
            let { data } = yield call(delTpl, { tpl_id });
            if ( data && data.code === '0'){
                yield put({ type:'fetchTplList'});
                if ( resolve ) resolve();
            } else {
                if ( reject ) reject(data.msg);
            }
        },
        *initLogList(action, { put }){
            yield put.resolve({ type:'fields/init' });
            yield put({ type:'fetchLogList'});
        },
        *fetchLogList(action, { put, select, call }){
            let { user:{ company_id }, fields:{ currentAttr }} = yield select();
            let { page } = action.payload || {};
            page = page || 1;
            let { data } = yield call(getPushedPlan, { attr_id:currentAttr.key, page, page_size:12 });
            if ( data && data.code === '0') {
                yield put({ type:'getLogResult', payload:{ data:data.data, currentPage:page, total:data.count }});
            }
        }
        
       
    },
    reducers:{
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        updatePlanList(state, { payload:{ data } }){
            let newArr = [...defaultPlanList];
            let params = data ? data : defaultParams;
            if ( data ) {
                newArr = newArr.sort((a,b)=>{
                    return params[a.key+'_priority'] < params[b.key+'_priority'] ? -1 : 1;
                });
            } 
            return { ...state, params, attrPlanList:newArr }
        },
        resetPlanList(state, { payload }){
            return { ...state, attrPlanList:[] };
        },
        setParams(state, { payload }){
            return { ...state, params:payload };
        },
        getLogResult(state, { payload:{ data, currentPage, total }}){
            return { ...state, logList:data, currentPage, total };
        },
        getTplListResult(state, { payload:{ data }}){
            return { ...state, tplList:data };
        },
        
        reset(state){
            return initialState;
        }
    }
}
