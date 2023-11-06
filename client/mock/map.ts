import { AMap } from '@pansy/react-amap';
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_LOCATION } from './graphqlQueries'; // 假设有一个查询获取用户位置的GraphQL查询

//地点选择
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
/*
query Location($center: PointInput!, $minDistance: Float!, $maxDistance: Float!) {
  locations(center: $center, minDistance: $minDistance, maxDistance: $maxDistance) {
    pos
    typename
    label
    _id
  }
}
*/

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

// Define the schema
const schema = new GraphQLSchema({
  query: RootQuery,
});

module.exports = schema;

