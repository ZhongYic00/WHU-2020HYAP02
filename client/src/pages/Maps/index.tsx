import { PlusOutlined } from '@ant-design/icons';
import { Map, Marker } from '@pansy/react-amap';
import { message } from 'antd';
import { MapProps } from '@pansy/react-amap/es/map';

import React, { useState } from 'react';

export default () => {
  // 武汉大学计算机学院的经纬度
  const wuhanUniversityCoords = {
    longitude: 114.357365,
    latitude: 30.538707
  };

  const mapEvents: MapProps['events'] = {
    click: (e) => { message.info(`点击的坐标为${e.lnglat}`) 
    setCenterCoords({longitude:e.lnglat.lng,latitude:e.lnglat.lat})
  }
  }

  const [centerCoords, setCenterCoords] = useState(wuhanUniversityCoords);

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
    alert(`地图中心点的经度：${centerCoords.longitude}, 纬度：${centerCoords.latitude}`);
  };

  return (
    <div style={{ height: 500, position: 'relative' }}>
      <Map
        zoom={15}
        center={wuhanUniversityCoords}
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
