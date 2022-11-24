import React, { useState, useEffect } from 'react';
import { history } from 'umi';
import AMapLoader from '@amap/amap-jsapi-loader';
import { Spin } from 'antd';
import arrowNormal from '../../../../public/arrow-normal-3.png';
import arrowError from '../../../../public/arrow-warning-3.png';
import style from './AgentManager.css';
let map = null;
let timer = null;
let moveTimer = null;
let points = [];
let warningInfo = null;
let infoWindow = null;
// 标记定位点所在的省份;
let provinceList = [];
let polygonList = [];

function AgentMap({ companyList, msg, AMap, currentNode, userType, dispatch }) {
    let [info, setInfo] = useState({}); 
    
    useEffect(()=>{
        if ( !AMap ){
            AMapLoader.load({
                key:'26dbf93c4af827e4953d7b72390e3362',
                // version:'1.4.15',
                // 2.0版本对自定义地图的适配性更好，旧版本道路文字渲染不出来;
                version:'2.0',
            })
            .then((MapInfo)=>{                
                // 经纬度转换成容器内像素坐标
                let lng = 113.27324;
                let lat = 23.15792;
                // 添加canvas图层            
                // 添加标记点
                // 南宁（108.27331，22.78121），广州（113.27324，23.15792） 福州（119.27345，26.04769) 惠州(114.38257,23.08464)
                dispatch({ type:'user/setMap', payload:MapInfo });   
            })
        }
        window.handleProjectEntry = (id, name)=>{
            history.push({
                pathname:'/terminal_monitor',
                state:{
                    key:+id,
                    title:name,
                    type:'company'
                }
            })
        }
        return ()=>{
            if ( map && map.destroy ){
                map.destroy();
            }
            clearTimeout(timer);
            timer = null;
            clearTimeout(moveTimer);
            moveTimer = null;
            map = null;
            points = [];
            warningInfo = null;
            infoWindow = null;
            provinceList = [];
            polygonList = [];
            window.handleProjectEntry = null;
        }
    },[]);
    useEffect(()=>{
        if ( AMap ){
            if ( !map ){
                // 清除定位点
                let company = companyList.length ? companyList[0] : {};
                console.log(company);
                map = new AMap.Map('my-map',{
                    resizeEnable:true,
                    zoom:18,
                    // zoom 比例尺缩放级别   17.5-公司  11.12-区/镇  9.83-市 8.02-省 5.72-全国
                    viewMode:'3D',
                    // mapStyle: 'amap://styles/16612875d805eaf4ea70c9173129eb65',
                    mapStyle:'amap://styles/be84be2d3726a44041476b8929ccdf00',
                    center:[+company.lng, +company.lat],
                    // center: [116.397428, 39.90923],
                    pitch:65,
                    showLabel:true,
                    features:['bg', 'road', 'building'],
                    // layers: [
                    //     new AMap.TileLayer(),
                    //     new AMap.Buildings({
                    //         zooms: [12, 20],
                    //         zIndex: 10,
                    //         opacity:1,
                    //         // heightFactor: 1//2倍于默认高度，3D下有效
                    //     })
                    // ],
                });
            }
            if ( points.length ) map.remove(points);
            function handleShowInfo(e){
                clearTimeout(timer);
                let target = e.target;
                let { lng, lat, company_name, company_id, totalMach, warningMach } = target._originOpts.extData;
                let pos = map.lngLatToContainer(new AMap.LngLat(lng, lat));
                setInfo({ x:pos.x, y:pos.y, company_name, company_id, totalMach, warningMach });
                timer = setTimeout(()=>{
                    setInfo({});
                },2000)                    
            }
            function handleHideInfo(e){
                clearTimeout(timer);
                timer = setTimeout(()=>{
                    setInfo({});
                },1000)
            }
            companyList.forEach(item=>{
                // 添加标记点
                let marker = new AMap.Marker({
                    position:new AMap.LngLat(+item.lng, +item.lat),
                    title:'',
                    offset:new AMap.Pixel(-20, -20),
                    icon:arrowNormal,
                    extData:{ province:item.province, city:item.city, area:item.area, lng:+item.lng, lat:+item.lat, company_name:item.company_name, company_id:item.company_id, totalMach:item.totalMach, warningMach:item.warningMach, combust_type:item.combust_type }
                });
                map.add(marker);
                points.push(marker);
                marker.on('mouseover', handleShowInfo);
            });
            // 将标记点所在的省份区分出来
            let allPromise = [];
            var opts = {
                subdistrict: 0,
                extensions: 'all',
                level: 'province'
            };
            if ( msg.detail && msg.detail.length ){
                warningInfo = msg.detail[0];
                // let marker = new AMap.Marker({
                //     position:new AMap.LngLat(warningInfo.lng, warningInfo.lat),
                //     title:'',
                //     icon:arrowError,
                //     offset:new AMap.Pixel(-20, -20),
                //     // zIndex默认值100
                //     zIndex:110,
                //     extData:{ is_warning:true, province:warningInfo.province, city:warningInfo.city, area:warningInfo.area, lng:+warningInfo.lng, lat:+warningInfo.lat, company_name:warningInfo.company_name, company_id:warningInfo.company_id, totalMach:warningInfo.totalMach, warningMach:warningInfo.warningMach, combust_type:warningInfo.combust_type }
                // });
                // map.add(marker);
                // points.push(marker);
                var content = `
                    <div class=${style['info-container-2']}>
                        <div class=${style['info-title']}>${ warningInfo.type_name }</div>
                        <div class=${style['info-content']}>
                            <div>
                                <span class=${style['sub-text']}>公司:</span>
                                <span class=${style['data']}>${warningInfo.company_name}</span>
                            </div>
                            <div>
                                <span class=${style['sub-text']}>地点:</span>
                                <span class=${style['data']}>${warningInfo.position_name || '--'}</span>
                            </div>
                            <div>
                                <span class=${style['sub-text']}>时间:</span>
                                <span class=${style['data']}>${warningInfo.date_time}</span>
                            </div>
                            <div>
                                <span class=${style['sub-text']}>设备:</span>
                                <span class=${style['data']}>${warningInfo.mach_name}</span>
                            </div>
                        </div>
                        
                        <div class=${style['info-result']}>${ ( warningInfo.warning_info || '--' ) + ' ' + ( warningInfo.warning_value || '--' )}</div>
                        <div style="text-align:center"><span class=${style['btn']} onclick="handleProjectEntry('${warningInfo.company_id}', '${warningInfo.company_name}')">进入项目</span></div>
                    </div>
                `;
                // var position = new AMap.LngLat(warningInfo.lng, warningInfo.lat);
                // infoWindow = new AMap.InfoWindow({
                //     isCustom:true,
                //     content,
                //     offset: new AMap.Pixel(5,-50)
                // });
                // // console.log(infoWindow);
                // infoWindow.open(map,position);
            
                moveTimer = setTimeout(()=>{
                    map.setCenter([warningInfo.lng, warningInfo.lat]);
                },1000) 
            } 
            map.setFitView();
        }
    },[msg, AMap]);
    
    return (
        <div style={{ height:'100%', width:'100%' }}>
            <div className={style['info-container']} style={{ display: Object.keys(info).length ? 'block' : 'none', top: ( info.y - 140 ) + 'px', left: ( info.x - 100 ) + 'px' }}>
                <div className={style['info-title']}>{ info.company_name }</div>
                <div className={style['info-content']}>
                   
                    {/* <div>
                        <div style={{ color:'rgba(255,255,255,0.64)', fontSize:'0.8rem' }}>总设备数</div>
                        <div><span className={style['data']}>{ info.totalMach }</span><span className={style['unit']}>个</span></div>
                    </div>
                    <div>
                        <div style={{ color:'rgba(255,255,255,0.64)', fontSize:'0.8rem' }}>告警设备</div>
                        <div><span className={style['data']} style={{ color:'#f30d0d' }}>{ info.warningMach }</span><span className={style['unit']} style={{ color:'#f30d0d' }}>个</span></div>
                    </div> */}
                </div>
                <div style={{ textAlign:'center' }}><span className={style['btn']} onClick={()=>{ 
                    history.push({
                        pathname:'/ac_control'
                    }) 
                }}>进入项目</span></div>
            </div>
            <div id='my-map' style={{ height:'100%' }}></div>
        </div>
    )
}
function areEqual(prevProps, nextProps){
    if ( prevProps.msg !== nextProps.msg || prevProps.AMap !== nextProps.AMap  ) {
        return false;
    } else {
        return true;
    }
}
export default React.memo(AgentMap, areEqual);