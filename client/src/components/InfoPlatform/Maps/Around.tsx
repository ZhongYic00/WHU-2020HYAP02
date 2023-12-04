import { AntDesignOutlined, PlusOutlined } from '@ant-design/icons';
import { Map, MarkerCluster, Marker } from '@pansy/react-amap';
import { Avatar, Button, Card, Popover, message } from 'antd';

import React, { useState } from 'react';
import { WHUCSCoords } from './PosChooser';
import { AbstractViewer, abstractTitle, iconFor } from '../Viewer/abstractView';
import { Link, history } from '@umijs/max';

type MarkerData=AMap.MarkerCluster.DataOptions
export const Around:React.FC<{
  curpos:any,
  objects:MarkerData[]
}> = ({objects,curpos=WHUCSCoords}) => {
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
        center={curpos}
      >
        {curpos && <Marker position={curpos} />}
        <PlusOutlined style={centerCrossStyle} />
         <MarkerCluster
          data={objects}
          render={
            (o:MarkerData)=>{
              // console.log('node data',o)
              if(typeof o.extData==='string')
                return <p>{JSON.stringify(o.extData)}</p>
              const content=o.extData.content
              const type=content.__typename
              const title=abstractTitle(type,content)
              const icon=iconFor(type)
              return <Popover content={
                <div>
                  <AbstractViewer type={type} data={content}/>
                  <Button onClick={()=>{
                    history.push(`/view/Post/${o.extData._id}`)
                  }}>
                    view details
                  </Button>
                </div>
              }
              title={title}>
                <div style={{minWidth:'3vw'}}>
                  {icon}{title}
                </div>
              </Popover>
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