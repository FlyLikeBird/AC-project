import React, { useRef, useEffect } from 'react';
import { connect } from 'dva';
import Header from '@/pages/components/Header';
import style from '../IndexPage.css';

function IndexPage({ children, user }){
    let { currentMenu, theme, authorized, isFrame } = user;
    return (
        <div className={style['container'] + ' ' + style['dark']} >
            { 
                authorized 
                ?
                isFrame 
                ?
                null
                :
                <Header />
                :
                null
            }
            <div style={{ height: isFrame ? '100%' : 'calc( 100% - 60px)' }}>
                { children }
            </div>
        </div>
    )
}

export default connect(({ user })=>({ user }))(IndexPage);