import { PlusOutlined } from '@ant-design/icons';
import { Map, Marker, toLnglat } from '@pansy/react-amap';
import { message } from 'antd';
import { MapProps } from '@pansy/react-amap/es/map';

import React, { useState } from 'react';
// 武汉大学计算机学院的经纬度
export const WHUCSCoords = {
  lng: 114.357365,
  lat: 30.538707
};
export const WHUCoords = {
  lng: 114.365519,
  lat: 30.5381
}
export type Pos = typeof WHUCSCoords
export const PosChooser:React.FC<{setPos:(pos:any)=>void,initialPos:Pos}> = ({setPos,initialPos}) => {

  const mapEvents: MapProps['events'] = {
    click: (e) => { message.info(`点击的坐标为${e.lnglat}`) 
    setCenterCoords({lng:e.lnglat.lng,lat:e.lnglat.lat})
  }
  }

  const [centerCoords, setCenterCoords] = useState(initialPos);

  const centerCrossStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '20px',
    height: '20px',
  };

  const handleConfirmClick = () => {
    // 点击确认按钮时，显示地图中心点的经纬度
    // alert(`地图中心点的经度：${centerCoords.longitude}, 纬度：${centerCoords.latitude}`);
    setPos?.({longitude:centerCoords.lng,latitude:centerCoords.lat})
  };

  return (
    <div style={{ height: 500, position: 'relative' }}>
      <Map
        zoom={18}
        center={centerCoords}
        events={mapEvents}
      
      >
        <div>
          <Marker position={centerCoords} />
        </div>
      </Map>
      <PlusOutlined style={centerCrossStyle} />
      <button onClick={handleConfirmClick} style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>确认</button>

    </div>
  );
};