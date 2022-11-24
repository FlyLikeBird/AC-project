import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Drawer, Modal, Form, Select, Input, Button, message } from 'antd';
import FieldItem from './FieldItem';
import FieldGroup from './FieldGroup';
import style from '@/pages/routes/IndexPage.css';

function FieldManager({ dispatch, fields, fieldDevice }){
    useEffect(()=>{
        dispatch({ type:'fields/fetchFieldType'});
        dispatch({ type:'fields/fetchField'});
    },[])
    let { fieldType, allFields, energyList, energyInfo, loaded } = fields;
    let { selectedField, selectedAttr, addModal, setModal, isRootAttr, attrModal, editAttr, editField } = fieldDevice;
    let fieldList = allFields[energyInfo.type_code] ? allFields[energyInfo.type_code].fieldList : [];
    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
    };
    return (
        <div className={style['card-container']} style={{ padding:'1rem' }}>
            {
                fieldList.length 
                ?              
                fieldList.map((field,index)=>(
                    <FieldItem field={field} key={index} dispatch={dispatch} theme='dark' />
                ))                 
                :
                <div style={{ padding:'1rem'}}>
                    <div style={{ paddingBottom:'1rem' }}><Button type="primary" onClick={()=>dispatch({type:'fieldDevice/toggleAddModal', payload:true})}>添加维度</Button></div>
                    <div className={style['text']} >还没有设置维度</div>
                </div>
            }
            <Modal 
                footer={null} 
                visible={addModal} 
                bodyStyle={{padding:'40px'}}
                destroyOnClose={true}
                closable={false}
                onCancel={()=>dispatch({type:'fieldDevice/toggleAddModal', payload:false})}
            >
                <Form name="add_field" onFinish={values=>{
                    new Promise((resolve, reject)=>{
                        dispatch({type:'fieldDevice/add', payload:{ values, resolve, reject }})
                    })
                    .then(()=>{
                        dispatch({ type:'fieldDevice/toggleAddModal', payload:false });
                    })
                    .catch(msg=>{
                        message.info(msg);
                    })
                }} {...layout}>
                    <Form.Item name="field_name" label="维度名称" rules={[{required:true, message:'维度名称不能为空!'}]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="field_type" label="维度类型" rules={[{required:true, message:'必须选择一种维度类型'}]}>
                        <Select>
                            {
                                fieldType.map(item=>(
                                    <Option key={item.field_type} value={item.field_type}>{item.code_name}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item wrapperCol={{...layout.wrapperCol, offset:6}}>
                        <Button type="primary" htmlType="submit">确定</Button>
                        <Button style={{marginLeft:'10px'}} onClick={()=>dispatch({type:'fieldDevice/toggleAddModal', payload:false})} >取消</Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Drawer
                title={ `${selectedField['field_name'] || ''}维度管理`}
                placement="right"
                width="80%"
                onClose={()=>{
                    // dispatch({type:'fieldDevice/toggleField', payload:{ visible:false, field:selectedField }});
                    dispatch({ type:'fieldDevice/reset'});
                }}
                visible={setModal}
            >
                <FieldGroup />
            </Drawer>
            <Modal
                footer={null}
                visible={attrModal}
                bodyStyle={{padding:'40px'}}
                destroyOnClose={true}
                closable={false}
                onCancel={()=>dispatch({type:'fieldDevice/toggleAttrModal', payload:{visible:false}})}
            >
                <Form 
                    name="add_field_attr" 
                    {...layout}  
                    initialValues={{field_attr:editAttr  ? selectedAttr.title : ''}}
                    onFinish={(values)=>{
                        if (editAttr) {
                            new Promise((resolve, reject)=>{
                                dispatch({type:'fieldDevice/editAttr', payload:{ field_attr:values.field_attr, resolve, reject }})
                            })
                            .then(()=>{
                                dispatch({ type:'fieldDevice/toggleAttrModal', payload:{ visible:false }})
                            })
                            .catch(msg=>message.info(msg))
                        } else {
                            new Promise((resolve, reject)=>{
                                dispatch({type:'fieldDevice/addAttr', payload:{ field_attr:values.field_attr, resolve, reject }})
                            })
                            .then(()=>{
                                dispatch({ type:'fieldDevice/toggleAttrModal', payload:{ visible:false }})
                            })
                            .catch(msg=>message.info(msg))
                        }
                    }}
                >
                    <Form.Item name="field_attr" label="维度属性" rules={[{required:true, message:'维度属性不能为空!'}]}>
                        <Input />
                    </Form.Item>
                    <Form.Item wrapperCol={{...layout.wrapperCol, offset:6}}>
                        <Button type="primary" htmlType="submit" style={{marginRight:'6px'}}>确定</Button>
                        <Button onClick={()=>dispatch({type:'fieldDevice/toggleAttrModal', payload:false})}>取消</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default connect(({ fields, fieldDevice })=>({ fields, fieldDevice }))(FieldManager);