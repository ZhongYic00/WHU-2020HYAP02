import { Map, ElasticMarker, Polygon, ControlBar } from '@pansy/react-amap';
import type { ElasticMarkerProps } from '@pansy/react-amap/es/elastic-marker';
import { touristSpots, paths } from './tiantan';
import './style.less';
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_LOCATION } from './graphqlQueries'; // 假设有一个查询获取用户位置的GraphQL查询

const zoomStyleMapping = {
    14: 0,
    15: 0,
    16: 0,
    17: 0,
    18: 0,
    19: 0,
    20: 0
  }
  
  export default () => {
    return (
      <div style={{ height: 500 }}>
        <Map
          viewMode="3D"
          zooms={[14, 20]}
          zoom={16}
          center={[116.408967, 39.880101]}
        >
          <div>
            {touristSpots.map((item, index) => {
              const styles: ElasticMarkerProps['styles'] = [
                {
                  icon: {
                      img: item.smallIcon,
                      size:[16,16],//可见区域的大小
                      ancher:[8,16],//锚点
                      fitZoom:14,//最合适的级别
                      scaleFactor:2,//地图放大一级的缩放比例系数
                      maxScale:2,//最大放大比例
                      minScale:1//最小放大比例
                  },
                  label: {
                      content: item.name,
                      offset:[-35,0],
                      position:'BM',
                      minZoom:15
                  }
                },
                {
                  icon:{
                      img: item.bigIcon,
                      size: item.size as [number, number],
                      ancher: item.ancher as [number, number],
                      fitZoom: 17.5,
                      scaleFactor: 2,
                      maxScale: 2,
                      minScale: 0.125
                  },
                  label:{
                      content: item.name,
                      offset: [-35,0],
                      position:'BM'
                  }
                }
  
              ]
              return (
                <ElasticMarker
                  key={index}
                  styles={styles}
                  position={item.position as AMap.ExpandPosition}
                  zoomStyleMapping={zoomStyleMapping}
                />
              )
            })}
          </div>
          <Polygon
            path={paths}
            bubble
            style={{
              fillOpacity: 0.3,
              strokeWeight: 1,
              fillColor: 'green'
            }}
          />
          <ControlBar />
        </Map>
      </div>
    );
  };
//地点选择
/*
const LocationSelector = ({ setPos }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  const { data } = useQuery(GET_USER_LOCATION); // 使用GraphQL查询获取用户当前位置

  useEffect(() => {
    if (data && data.userLocation) {
      // 初始化地图
      const map = new AMap.Map('map-container', {
        zoom: 15,
        center: [data.userLocation.latitude, data.userLocation.longitude], // 使用GraphQL查询获取的用户位置数据
      });

      // 创建自定义定位图标
      const marker = new AMap.Marker({
        position: map.getCenter(),
        icon: new AMap.Icon({
          image: '定位图标的URL',
          size: new AMap.Size(36, 36),
        }),
        offset: new AMap.Pixel(-18, -18),
        draggable: true,
      });

      map.add(marker);

      // 监听 marker 的拖动事件
      marker.on('dragend', (e) => {
        const position = e.lnglat;
        setPos(position);
      });

      setMap(map);
      setMarker(marker);
    }
  }, [data, setPos]);

  // 处理确认按钮点击事件
  const handleConfirmClick = () => {
    if (marker) {
      setPos(marker.getPosition());
    }
  };

  return (
    <div>
      <div id="map-container" style={{ height: '300px', width: '100%' }} />
      <button onClick={handleConfirmClick}>confirm</button>
    </div>
  );
};

export default LocationSelector;

//地理维度的查看

query Location($center: PointInput!, $minDistance: Float!, $maxDistance: Float!) {
  locations(center: $center, minDistance: $minDistance, maxDistance: $maxDistance) {
    pos
    typename
    label
    _id
  }
}


const { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLID } = require('graphql');
const { GraphQLNonNull, GraphQLInputObjectType } = require('graphql');
const { GraphQLSchema, GraphQLString } = require('graphql');

// Define a custom GraphQLInputObjectType for Point input
const PointInputType = new GraphQLInputObjectType({
  name: 'PointInput',
  fields: {
    latitude: { type: new GraphQLNonNull(GraphQLFloat) },
    longitude: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

// Define a custom GraphQLObjectType for Location
const LocationType = new GraphQLObjectType({
  name: 'Location',
  fields: {
    pos: { type: PointInputType },
    typename: { type: GraphQLString },
    label: { type: GraphQLString },
    _id: { type: GraphQLID },
  },
});

// Mock data for locations (replace with actual data source)
const locations = [{
  "pos": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "typename": "Event",
  "label": "New York City",
  "_id": "1"
}];

// Define the root query
const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    locations: {
      type: new GraphQLList(LocationType),
      args: {
        center: { type: PointInputType },
        minDistance: { type: GraphQLFloat },
        maxDistance: { type: GraphQLFloat },
      },
      resolve(parent, args) {
        // Implement the logic to query locations based on center, minDistance, and maxDistance
        const { center, minDistance, maxDistance } = args;
        const result = locations.filter(location => {
          // Implement distance calculation and filtering logic here
        });
        return result;
      },
    },
  },
});
*/

