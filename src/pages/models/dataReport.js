import { getTempReport, getEnergyReport, getCostReport } from '../services/dataReportService';
const initialState = {
    sourceData:{},
    isLoading:true,
    currentPage:1,
    selectedKeys:[],
    total:0,
    cateCode:'1',
    warningStatus:'1',
    eleType:'1'
}

export default {
    namespace:'dataReport',
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
        *initTempReport(action, { put, select }){
            yield put.resolve({ type:'fields/init'});
            let { fields:{ allFields, energyInfo, currentAttr, fieldAttrs }} = yield select();
            let temp = [];
            if ( currentAttr.children && currentAttr.children.length ) {
                temp.push(currentAttr.key);
                currentAttr.children.map(i=>temp.push(i.key));
            } else {
                temp.push(currentAttr.key);
            }
            yield put({ type:'select', payload:temp });
            yield put({ type:'fetchTempReport'});
        },
        *fetchTempReport(action, { put, select, call }){
            let { user:{ company_id, timeType, startDate, endDate }, dataReport:{ selectedKeys }} = yield select();
            yield put({ type:'toggleLoading'});
            let { data } = yield call(getTempReport, { company_id, attrs:selectedKeys, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), time_type:timeType });
            if ( data && data.code === '0'){
                yield put({ type:'getResult', payload:{ data:data.data }});
            }
        },
        *initEnergyReport(action, { put, select }){
            yield put.resolve({ type:'fields/init'});
            let { fields:{ allFields, energyInfo, currentAttr, fieldAttrs }} = yield select();
            let temp = [];
            if ( currentAttr.children && currentAttr.children.length ) {
                temp.push(currentAttr.key);
                currentAttr.children.map(i=>temp.push(i.key));
            } else {
                temp.push(currentAttr.key);
            }
            yield put({ type:'select', payload:temp });
            yield put({ type:'fetchEnergyReport'});
        },
        *fetchEnergyReport(action, { put, select, call }){
            let { user:{ company_id, timeType, startDate, endDate }, dataReport:{ selectedKeys }} = yield select();
            yield put({ type:'toggleLoading'});
            let { data } = yield call(getEnergyReport, { company_id, attrs:selectedKeys, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), time_type:timeType });
            if ( data && data.code === '0'){
                yield put({ type:'getResult', payload:{ data:data.data }});
            }
        },
        *initCostReport(action, { put, select, call }){
            yield put.resolve({ type:'fields/init'});
            let { fields:{ currentAttr, fieldAttrs }} = yield select();
            let temp = [];
            if ( currentAttr.children && currentAttr.children.length ) {
                temp.push(currentAttr.key);
                currentAttr.children.map(i=>temp.push(i.key));
            } else {
                temp.push(currentAttr.key);
            }
            yield put({ type:'select', payload:temp });
            yield put({ type:'fetchCostReport'});
        },
        *fetchCostReport(action, { put, select, call }){
            let { user:{ company_id, timeType, startDate, endDate }, dataReport:{ selectedKeys }} = yield select();
            yield put({ type:'toggleLoading'});
            let { data } = yield call(getCostReport, { company_id, attrs:selectedKeys, time_type:timeType, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD')});
            if ( data && data.code === '0'){
                yield put({ type:'getResult', payload:{ data:data.data }});
            }
        }
    },
    reducers:{
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        getResult(state, { payload:{ data }}){
            return { ...state, sourceData:data, isLoading:false  };
        },
        toggleEleType(state, { payload }){
            return { ...state, eleType:payload };
        },
        setPage(state, { payload }){
            return { ...state, currentPage:payload };
        },
        setSelectedKeys(state, { payload }){
            return { ...state, selectedKeys:payload };
        },
        select(state, { payload }){
            return { ...state, selectedKeys:payload };
        },
        reset(state){
            return initialState;
        }
    }
}