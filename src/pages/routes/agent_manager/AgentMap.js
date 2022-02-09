import React, { useState, useEffect } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import { Spin } from 'antd';
import arrowNormal from '../../../../public/arrow-normal.png';
import arrowError from '../../../../public/arrow-error.png';
import style from './AgentManager.css';
let map = null;
var topColor = [0.22, 0.63, 0.87, 0.9];
var topFaceColor = [0, 1, 1, 0.4];
var bottomColor = [0, 0, 1, 0.9];
function createPrism(AMap, center, segment, height, radius) {
    var cylinder = new AMap.Object3D.Mesh();
    var geometry = cylinder.geometry;
    var verticesLength = segment * 2;
    var path = []
    for (var i = 0; i < segment; i += 1) {
        var angle = 2 * Math.PI * i / segment;
        var x = center.x + Math.cos(angle) * radius;
        var y = center.y + Math.sin(angle) * radius;
        path.push([x, y]);
        geometry.vertices.push(x, y, 0); //底部顶点
        geometry.vertices.push(x, y, -height); //顶部顶点

        geometry.vertexColors.push.apply(geometry.vertexColors, bottomColor); //底部颜色
        geometry.vertexColors.push.apply(geometry.vertexColors, topColor); //顶部颜色
        var bottomIndex = i * 2;
        var topIndex = bottomIndex + 1;
        var nextBottomIndex = (bottomIndex + 2) % verticesLength;
        var nextTopIndex = (bottomIndex + 3) % verticesLength;

        geometry.faces.push(bottomIndex, topIndex, nextTopIndex); //侧面三角形1
        geometry.faces.push(bottomIndex, nextTopIndex, nextBottomIndex); //侧面三角形2
    }
    console.log(path);
    // 构建顶面三角形,为了区分顶面点和侧面点使用不一样的颜色,所以需要独立的顶点
  
    for (var i = 0; i < segment; i += 1) {
        geometry.vertices.push.apply(geometry.vertices, geometry.vertices.slice(i * 6 + 3, i * 6 + 6)); //底部顶点
        geometry.vertexColors.push.apply(geometry.vertexColors, topFaceColor);
    }
    var triangles = AMap.GeometryUtil.triangulateShape(path);
    var offset = segment * 2;
    for (var v = 0; v < triangles.length; v += 3) {
        geometry.faces.push(triangles[v] + offset, triangles[v + 2] + offset, triangles[v + 1] + offset);
    }
    
    cylinder.backOrFront = 'both';
    cylinder.transparent = true; // 如果使用了透明颜色，请设置true
    return cylinder;
};
function AgentMap({ companyList, msg, AMap, dispatch }) {
    const [isLoading, setLoading] = useState(true);
    useEffect(()=>{
        if ( !AMap ){
            AMapLoader.load({
                key:'26dbf93c4af827e4953d7b72390e3362',
                version:'1.4.15',
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
        return ()=>{
            if ( map && map.destroy ){
                map.destroy();
            }
            map = null;
        }
    },[]);
    useEffect(()=>{
        if ( AMap ){
            let company = companyList[0] || {};
            if ( !map ){
                map = new AMap.Map('my-map',{
                    resizeEnable:true,
                    zoom:18,
                    // zoom:12,
                    viewMode:'3D',
                    mapStyle: 'amap://styles/16612875d805eaf4ea70c9173129eb65',
                    center:[company.lng, company.lat],
                    pitch:65,
                    layers: [
                        new AMap.TileLayer(),
                        // 高德默认标准图层
                        // 楼块图层
                        new AMap.Buildings({
                            zooms: [12, 20],
                            zIndex: 10,
                            opacity:1,
                            // heightFactor: 1//2倍于默认高度，3D下有效
                        })
                    ],
                });
                companyList.forEach(item=>{
                    // 添加标记点
                    let marker = new AMap.Marker({
                        position:new AMap.LngLat(item.lng,item.lat),
                        title:'',
                        icon:arrowNormal
                    });
                    map.add(marker);
                });
                setLoading(false);
            }
            if ( msg.detail && msg.detail.length ){
                let info = msg.detail[0];
                companyList.forEach(item=>{
                    let marker = new AMap.Marker({
                        position:new AMap.LngLat(item.lng,item.lat),
                        title:'',
                        icon:arrowError
                    });
                    map.add(marker);
                });
                // var points = [[108.27331,22.78121],[113.27324,23.15792],[119.27345,26.04769]];   
                var content = `
                    <div class=${style['info-container']} onClick="">
                        <div class=${style['info-title']}>${info.warning_info}</div>
                        <div class=${style['info-sub-text']}>${info.date_time}</div>
                        <div>公司 : ${company.company_name}</div>
                        <div>告警类型 : ${info.type_name}</div>
                        <div>告警区域 : ${info.region_name}</div>
                        <div>终端编号 : ${info.mach_name}</div>
                    </div>
                `;
                var position = new AMap.LngLat(company.lng, company.lat);
                var infoWindow = new AMap.InfoWindow({
                    isCustom:true,
                    content,
                    offset: new AMap.Pixel(0,-50)
                });
                // console.log(infoWindow);
                infoWindow.open(map,position);          
            } 
        }
    },[msg, AMap])
    return (
        <div style={{ height:'100%' }}>
            {
                isLoading 
                ?
                <Spin size='large' className={style['spin']}>地图加载中...</Spin>
                :
                null
            }
            <div id='my-map' style={{ height:'100%' }}></div>
        </div>
    )
}
function areEqual(prevProps, nextProps){
    if ( prevProps.msg !== nextProps.msg || prevProps.AMap !== nextProps.AMap ) {
        return false;
    } else {
        return true;
    }
}
export default React.memo(AgentMap, areEqual);