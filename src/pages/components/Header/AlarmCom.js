import React, { useState, useEffect, useRef } from 'react';
import { Popover, Badge } from 'antd';
import { history } from 'umi';
import { createFromIconfontCN, AlertOutlined } from '@ant-design/icons';
import ScrollTable from '../ScrollTable';
let alarmTimer = null;

const IconFont = createFromIconfontCN({
    scriptUrl:'//at.alicdn.com/t/font_2314993_bryih7jtrtn.js'
});
function AlarmCom({ msg }){
    const containerRef = useRef();
    const [muted, setMuted] = useState(true);
    useEffect(()=>{  
        // var audio = document.createElement('audio');
        
        // audio.id = 'my-audio';
        // audio.src = '/alarm.mp3';
        // audio.width = '100px';
        // audio.muted = true;
        // audio.loop = true;
        // audio.play();
        // containerRef.current.appendChild(audio);
        // // setTimeout(()=>{
        // //     audio.muted = false;
        // // },3000)
        // audio.addEventListener('play', ()=>{
        //     console.log('a');
        // })
        function handleAudio(){
            setMuted(false);
            document.onclick = null;  
        }
        document.onclick = handleAudio;
        return ()=>{
            clearTimeout(alarmTimer);
            alarmTimer = null;
        }
    },[]);
    useEffect(()=>{
        let audio = document.getElementById('my-audio');
        if ( audio ){
            if ( msg.count ){
                try {           
                    if ( !muted ){
                        audio.currentTime = 0;
                        audio.play(); 
                        alarmTimer = setTimeout(()=>{
                            audio.pause();
                        },5000)                              
                    } else {
                        audio.pause();
                    }
                } catch(err){
                    console.log(err);
                }
            } else {
                if ( audio && audio.pause ) audio.pause();
            }
        }
    },[msg, muted])
    // console.log(msg);
    let thead = [{ title:'位置', dataIndex:'region_name', width:'20%', collapse:true }, { title:'设备', dataIndex:'mach_name', width:'20%', collapse:true }, { title:'分类', dataIndex:'type_name', width:'25%', border:true }, { title:'发生时间', dataIndex:'date_time', key:'time', width:'35%' }];

    return (
        <div ref={containerRef} style={{ cursor:'pointer', display:'inline-flex', alignItems:'center'  }}>
            <AlertOutlined style={{ marginRight:'6px', fontSize:'1.2rem' }} onClick={()=>{
            }} />
            <Popover color='#1d1e32' content={<div style={{ width:'500px'}}><ScrollTable scrollNum={5} thead={thead} data={ msg.detail || []} /></div>}>
                <Badge count={msg.count} onClick={()=>{
                    history.push('/ac_alarm');
                }} />
            </Popover>
            <audio src='/alarm.mp3' width="420" id="my-audio" loop style={{ display:'none', right:'0', position:'absolute' }}></audio>

            {/* <video id='my-audio' src={AlarmSound} muted={true} autoPlay={true} loop={true} style={{ position:'absolute', left:'100%' }}></video> */}
            <IconFont style={{ fontSize:'1.2rem', margin:'0 10px'}} type={ muted ? 'iconsound-off' : 'iconsound'} onClick={()=>{
                setMuted(!muted);
                let audio = document.getElementById('my-audio');
                if ( audio ){
                    if ( audio.muted ){
                        audio.muted = false;
                    } else {
                        audio.muted = true;
                    }
                }
                
            }}></IconFont>
            <span style={{ margin:'0 6px' }}>|</span>
        </div>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.msg !== nextProps.msg ) {
        return false;
    } else {
        return true;
    }
}
export default React.memo(AlarmCom, areEqual);