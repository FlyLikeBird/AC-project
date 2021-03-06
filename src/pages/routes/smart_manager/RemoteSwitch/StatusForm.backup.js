import React, { useEffect } from 'react';
import { Form, Radio, Table, Switch, message } from 'antd';
import style from '@/pages/routes/IndexPage.css';
function FormContainer({ dispatch, data }){
    const [form] = Form.useForm();
    const layout = {
        labelCol: { span: 10 },
        wrapperCol: { span: 14 },
    };
    let tableData = [
        [{ voltage:data.power ? data.power.voltage : 0, current:data.power ? data.power.current : 0, power:data.power ? data.power.power : 0, powerfactor:data.power ? data.power.powerfactor : 0 , energy:data.power ? data.power.energy : 0 }],
        [{
            'combine_trip':data.status ? data.status.combine_trip : 0,
            'temp_alert':data.status ? data.status.temp_alert : 0,
            'temp_trip':data.status ? data.status.temp_trip : 0,
            'leakage':data.status ? data.status.leakage : 0,
            'hand_trip':data.status ? data.status.hand_trip : 0
        }],
        [{
            'overload':data.status ? data.status.overload : 0,
            'overload_trip':data.status ? data.status.overload_trip : 0,
            'trip_lock':data.status ? data.status.trip_lock : 0,
            'service_mode':data.status ? data.status.service_mode : 0,
            'power_overrun':data.status ? data.status.power_overrun : 0,
        }],
        [{
            'voltage_low':data.status ? data.status.voltage_low : 0,
            'voltage_high':data.status ? data.status.voltage_high : 0,
            'combine_fail':data.status ? data.status.combine_fail : 0,
            'trip_fail':data.status ? data.status.trip_fail : 0,
            'hand_combine':data.status ? data.status.hand_combine : 0,
        }],
        [{
            'unusual_combine_trip':data.status ? data.status.unusual_combine_trip : 0,
            'direct_short':data.status ? data.status.direct_short : 0,
            'auto_recombine':data.status ? data.status.auto_recombine : 0,
            'auto_recombine_fail':data.status ? data.status.auto_recombine_fail : 0,
            'enable_temp_control':data.status ? data.status.enable_temp_control : 0,
        }],
        [{
            'unusual_knife_travel':data.status ? data.status.unusual_knife_travel : 0,
            'unusual_k2':data.status ? data.status.unusual_k2 : 0,
            'disable_remote_control':data.status ? data.status.disable_remote_control : 0,
            'unusual_mechanical_structure':data.status ? data.status.unusual_mechanical_structure : 0
        }]
    ];
    let columnData = [
        [
           { title:'??????(V)', dataIndex:'voltage' },
           { title:'??????(A)', dataIndex:'current'},
           { title:'??????(KW)', dataIndex:'power'},
           { title:'????????????(cos??)', dataIndex:'powerfactor'}, 
           { title:'??????(KWH)', dataIndex:'energy'}
        ],
        [
            { 
                title:'??????/??????', 
                dataIndex:'combine_trip', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>??????</Radio><Radio value={0}>??????</Radio></Radio.Group>)
            },
            { 
                title:'????????????', 
                dataIndex:'temp_alert', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>??????</Radio><Radio value={0}>??????</Radio></Radio.Group>)
            },
            { 
                title:'????????????', 
                dataIndex:'temp_trip', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>??????</Radio><Radio value={0}>??????</Radio></Radio.Group>)
            },
            { 
                title:'????????????', 
                dataIndex:'leakage', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>??????</Radio><Radio value={0}>??????</Radio></Radio.Group>)
            },
            { 
                title:'??????????????????', 
                dataIndex:'hand_trip', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>??????</Radio><Radio value={0}>??????</Radio></Radio.Group>)
            },
        ],
        [
            { 
                title:'????????????', 
                dataIndex:'overload', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>??????</Radio><Radio value={0}>??????</Radio></Radio.Group>)
            },
            { 
                title:'????????????', 
                dataIndex:'overload_trip', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>??????</Radio><Radio value={0}>??????</Radio></Radio.Group>)
            },
            { 
                title:'????????????', 
                dataIndex:'trip_lock', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>??????</Radio><Radio value={0}>??????</Radio></Radio.Group>)
            },
            { 
                title:'????????????', 
                dataIndex:'service_mode', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>??????</Radio><Radio value={0}>??????</Radio></Radio.Group>)
            },
            { 
                title:'????????????', 
                dataIndex:'power_overrun', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>??????</Radio><Radio value={0}>??????</Radio></Radio.Group>)
            }
        ],
        [
            { 
                title:'????????????', 
                dataIndex:'voltage_low', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>??????</Radio><Radio value={0}>??????</Radio></Radio.Group>)
            },
            { 
                title:'????????????', 
                dataIndex:'voltage_high', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>??????</Radio><Radio value={0}>??????</Radio></Radio.Group>)
            },
            { 
                title:'????????????', 
                dataIndex:'combine_fail', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>??????</Radio><Radio value={0}>??????</Radio></Radio.Group>)
            },
            { 
                title:'????????????', 
                dataIndex:'trip_fail', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>??????</Radio><Radio value={0}>??????</Radio></Radio.Group>)
            },
            { 
                title:'??????????????????', 
                dataIndex:'hand_combine', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>??????</Radio><Radio value={0}>??????</Radio></Radio.Group>)
            }
        ],
        [
            { 
                title:'????????????/??????', 
                dataIndex:'unusual_combine_trip', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>??????</Radio><Radio value={0}>??????</Radio></Radio.Group>)
            },
            { 
                title:'????????????', 
                dataIndex:'direct_short', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>??????</Radio><Radio value={0}>??????</Radio></Radio.Group>)
            },
            { 
                title:'???????????????', 
                dataIndex:'auto_recombine', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>??????</Radio><Radio value={0}>??????</Radio></Radio.Group>)
            },
            { 
                title:'?????????????????????', 
                dataIndex:'auto_recombine_fail', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>??????</Radio><Radio value={0}>??????</Radio></Radio.Group>)
            },
            { 
                title:'??????????????????', 
                dataIndex:'enable_temp_control', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>??????</Radio><Radio value={0}>??????</Radio></Radio.Group>)
            }
        ],
        [
            { 
                title:'????????????????????????', 
                dataIndex:'unusual_knife_travel', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>??????</Radio><Radio value={0}>??????</Radio></Radio.Group>)
            },
            { 
                title:'??????????????????K2??????', 
                dataIndex:'unusual_k2', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>??????</Radio><Radio value={0}>??????</Radio></Radio.Group>)
            },
            { 
                title:'??????????????????', 
                dataIndex:'disable_remote_control', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>??????</Radio><Radio value={0}>??????</Radio></Radio.Group>)
            },
            { 
                title:'??????????????????', 
                dataIndex:'unusual_mechanical_structure', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>??????</Radio><Radio value={0}>??????</Radio></Radio.Group>)
            }
        ]
    ];    
    return (
        <div style={{ height:'100%' }}>
            {
                columnData.length
                ?
                columnData.map((item,index)=>(
                    <Table 
                        key={index}
                        style={{ padding:'0.5rem 1rem'}}
                        className={style['self-table-container'] + ' ' + style['dark'] + ' ' + style['small']}
                        dataSource={tableData[index]}
                        columns={item}
                        pagination={false}
                    /> 
                ))
                :
                null
            }          
        </div>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data ){
        return false;
    } else {
        return true;
    }
}
export default React.memo(FormContainer, areEqual);

                
                
           