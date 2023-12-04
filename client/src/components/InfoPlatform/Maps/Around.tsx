import { AntDesignOutlined, PlusOutlined } from '@ant-design/icons';
import { Map, MarkerCluster } from '@pansy/react-amap';
import { Avatar, message } from 'antd';

import React, { useState } from 'react';
import { WHUCSCoords } from './PosChooser';

type MarkerData=AMap.MarkerCluster.DataOptions
export const Around:React.FC<{
  objects:MarkerData[]
}> = ({objects}) => {
  console.log('Around',objects)

  const centerCrossStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '20px',
    height: '20px',
  };


  return (
    <div style={{ height: 500, position: 'relative' }}>
      <Map
        zoom={18}
        center={WHUCSCoords}
      >
        <PlusOutlined style={centerCrossStyle} />
         <MarkerCluster
          data={objects}
          render={
            (o:MarkerData)=>{
              // console.log('node data',o)
              return <p>{JSON.stringify(o.extData)}</p>
            }
          }
          renderCluster={({ count, list = [] }) => {
            return (
              <Avatar
                style={{ backgroundColor: '#87d068' }}
              >
                {count}
              </Avatar>
            )
          }}
        />
      </Map>
    </div>
  );
};