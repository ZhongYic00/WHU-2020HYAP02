import { ProCard } from '@ant-design/pro-components';
import { gql, useQuery } from '@apollo/client';
import { Card, Col, Collapse, CollapseProps, List, Tag, theme } from 'antd';
import React, { Key, useState } from 'react';
import { ViewerProps } from '.';
import { AbstractIdViewer, AbstractViewer, abstractFragment, abstractTitle } from '../abstractView';
import { BookOutlined } from '@ant-design/icons';
import { Link } from '@umijs/max';
import { Around } from '../../Maps/Around';
import { ShowAround } from '@/pages/Maps';

const POI: React.FC<ViewerProps> = ({id}) => {
  const {data}=useQuery(gql`
  ${abstractFragment['POI']}
query($where:POIWhere){
  pois(where:$where){
    ...POIAbstract
  }
}
  `,{variables:{where:{_id:id}}})
  const {  data:relatedClass } = useQuery(gql`
  ${abstractFragment['Class']}
query($where: ClassWhere) {
  classes(where: $where) {
    _id
    ...ClassAbstract
  }
}
  `,{
    variables: {where:{
        position:{
            _id:id
        }
    }}
  });
  const { loading, error,data:relatedPois } = useQuery(gql`
  ${abstractFragment['POI']}
query($where: POIWhere) {
  pois(where: $where) {
    _id
    ...POIAbstract
  }
}
  `,{
    variables: {where:{
        parentPOI:{
            _id:id
        }
    }}
  });
  console.log('_id',id,{
    variables: {where:{
        position:{
            _id:id
        }
    }}
  },'res',relatedClass)
  console.log(gql`
  ${abstractFragment['POI']}
query($where: POIWhere) {
  classes(where: $where) {
    _id
    ...POIAbstract
  }
}
  `,error)
  return (<Col>
    <AbstractIdViewer type={'POI'} id={id}/>
    <ShowAround curpos={data?.pois[0].loc} addfake={false}/>
    <h1>相关课程</h1>
    <List>
        {relatedClass?.classes.map(cls=>(
            <Link to={`/view/Class/${cls._id}`}>
                <AbstractViewer type='Class' data={cls}/>
            </Link>
        ))}
    </List>
    <h1>相关地点</h1>
    <List>
        {relatedPois?.pois.map(poi=>(
            <Link to={`/view/POI/${poi._id}`}>
                <AbstractViewer type='POI' data={poi}/>
            </Link>
        ))}
    </List>
</Col>)
};

export default POI;
