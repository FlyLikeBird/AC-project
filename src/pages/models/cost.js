import { 
    getCostAnalysis,
    getCostTrend,
    getCostCalendar
} from '../services/costService';
import moment from 'moment';
const initialState = {
    isLoading:true,
    chartInfo:{},
    trendInfo:{},
    // 成本日历字段
    mode:'month',
    currentDate:moment(new Date()),
    calendarInfo:{},
    calendarLoading:true
}

export default {
    namespace:'cost',
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
            console.log('all');
           
            yield put({ type:'reset'});
        },
        
        *initCostAnalysis(action, { call, put }){
            yield put.resolve({ type:'fields/init'});
            yield put({ type:'user/toggleTimeType', payload:'2' });
            yield put.resolve({ type:'fetchCostAnalysis'});
        },
        *fetchCostAnalysis(action, { call, put, select }){
            try {
                let { user:{ company_id, startDate, endDate, timeType }, fields:{ currentAttr }} = yield select();
                yield put({ type:'toggleLoading'});
                let { data } = yield call(getCostAnalysis, { time_type:timeType, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), company_id, attr_id:currentAttr.key });
                if ( data && data.code === '0') {
                    yield put({ type:'getAnalysisResult', payload:{ data:data.data }});
                }
            } catch(err){
                console.log(err);
            }
        },
        *initCostTrend(action, { call, put, select }){
            yield put.resolve({ type:'fields/init'});
            yield put({ type:'user/toggleTimeType', payload:'2'});
            yield put({ type:'fetchCostTrend'});
        },
        *fetchCostTrend(action, { call, put, select }) {
            try {
                let { user:{ company_id, startDate, endDate, timeType }, fields:{ currentAttr }} = yield select();
                yield put({ type:'toggleLoading'});
                let { data } = yield call(getCostTrend, { time_type:timeType, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), company_id, attr_id:currentAttr.key });
                if ( data && data.code === '0') {
                    yield put({ type:'getTrendResult', payload:{ data:data.data }});
                }
            } catch(err){
                console.log(err);
            }
        },
        *initCalendar(action, { call, put }){
            yield put.resolve({ type:'fields/init'});
            yield put({ type:'fetchCalendar' });
        },
        *fetchCalendar(action, { call, put, select }){
            let { user:{ company_id }, fields:{ currentAttr }, cost:{ mode, currentDate }} = yield select();
            let dateStr = currentDate.format('YYYY-MM-DD').split('-');
            yield put({ type:'toggleCalendarLoading' });
            let { data } = yield call(getCostCalendar, { company_id, attr_id:currentAttr.key, year:dateStr[0], month:dateStr[1], time_type:mode === 'month' ? '2' : '3' });
            if ( data && data.code === '0'){
                yield put({ type:'getCalendarResult', payload:{ data:data.data }});
            } else {
                yield put({ type:'getCalendarResult', payload:{ data:{} }})
            } 
        }
    },
    reducers:{
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        toggleCalendarLoading(state){
            return { ...state, calendarLoading:true };
        },
        getAnalysisResult(state, { payload:{ data }}){
            let infoList = [
                { color:'#04a3fe', child:[{ title:'本月开机时长', value:data.month ? (+data.month.work).toFixed(1) : 0.0, unit:'h' }, { title:'昨日开机时长', value:data.yesterday ? (+data.yesterday.work).toFixed(1) : 0.0, unit:'h' }] },
                { color:'#7318ef', child:[{ title:'本月能耗', value:data.month ? (+data.month.totalEnergy).toFixed(1) : 0.0, unit:'kwh' }, { title:'昨日能耗', value:data.yesterday ? (+data.yesterday.totalEnergy).toFixed(1) : 0.0, unit:'kwh' }] },
                { color:'#89fa6e', child:[{ title:'本月成本', value:data.month ? (+data.month.totalCost).toFixed(1) : 0.0, unit:'元' }, { title:'昨日成本', value:data.yesterday ? (+data.yesterday.totalCost).toFixed(1) : 0.0, unit:'元' }] },
                { color:'#fcd224', child:[{ title:'室内平均温度', value:data.temp ? !data.temp.temp || data.temp.temp === '-' ? '--' : (+data.temp.temp).toFixed(1) : '--', unit:'℃' }, { title:'空调平均温度', value:data.temp ? !data.temp.alter_temp || data.temp.alter_temp === '-' ? '--' : (+data.temp.alter_temp).toFixed(1) : '--', unit:'℃'}] },
            ];
            data.infoList = infoList;
            return { ...state, chartInfo:data, isLoading:false };
        },
        getTrendResult(state, { payload:{ data }}){
            let infoList = [
                { color:'#04a3fe', child:[{ title:'本期成本', value:data.now ? (+data.now.totalCost).toFixed(1) : 0.0, unit:'元' }, { title:'本期能耗', value:data.now ? (+data.now.totalEnergy).toFixed(1) : 0.0, unit:'kwh' }] },
                { color:'#7318ef', child:[{ title:'同比成本', value:data.same ? (+data.same.totalCost).toFixed(1) : 0.0, unit:'元' }, { title:'同比能耗', value:data.same ? (+data.same.totalEnergy).toFixed(1) : 0.0, unit:'kwh' }] },
                { color:'#89fa6e', child:[{ title:'环比成本', value:data.link ? (+data.link.totalCost).toFixed(1) : 0.0, unit:'元' }, { title:'环比能耗', value:data.link ? (+data.link.totalEnergy).toFixed(1) : 0.0, unit:'kwh' }] },
                { color:'#fcd224', child:[{ title:'同比增长率', value:data.same ? (+data.same.rate).toFixed(1) : 0.0, unit:'%' }, { title:'环比增长率', value:data.link ? (+data.link.rate).toFixed(1) : 0.0, unit:'%' }] },
            ];
            data.infoList = infoList;
            return { ...state, trendInfo:data, isLoading:false };
        },
        getCalendarResult(state, { payload:{ data }}){
            return { ...state, calendarInfo:data, calendarLoading:false };
        },
        setMode(state, { payload }){
            return { ...state, mode:payload };
        },
        setCurrentDate(state, { payload }){
            return { ...state, currentDate:payload };
        },
        reset(state){
            return initialState;
        }
    }
}