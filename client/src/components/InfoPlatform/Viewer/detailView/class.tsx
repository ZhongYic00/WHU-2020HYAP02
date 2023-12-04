import { ProCard } from '@ant-design/pro-components';
import { gql, useQuery } from '@apollo/client';
import { Card, Col, Collapse, CollapseProps, List, Tag, theme } from 'antd';
import React, { Key, useState } from 'react';
import { ViewerProps } from '.';
import { AbstractIdViewer, AbstractViewer, abstractFragment, abstractTitle, iconFor } from '../abstractView';
import { BookOutlined } from '@ant-design/icons';
import { Link } from '@umijs/max';
import Meta from 'antd/es/card/Meta';

const Class: React.FC<ViewerProps> = ({id}) => {
  const {  data } = useQuery(gql`
  ${abstractFragment['Class']}
  ${abstractFragment['POI']}
query($where: ClassWhere) {
  classes(where: $where) {
    _id
    ...ClassAbstract
    position {
        _id
        ...POIAbstract
    }
  }
}
  `,{
    variables: {where:{
        _id:id
    }}
  });
  const cls=data?.classes[0]
  console.log('_id',id,{
    variables: {where:{
        position:{
            _id:id
        }
    }}
  },'res',cls)
  return cls && (<Card>
    <Meta
    avatar={iconFor('Class')} title={abstractTitle('Class',cls)}
    description={<p>
        教务系统课头号：{cls.id}
    </p>}/>
    <h1>授课教师</h1>
    <List>
        {cls.teacher.map(t=>(
            <Link to={`/view/Teacher/${t._id}`}>
                <AbstractIdViewer type='Teacher' id={t._id} render={(d)=><AbstractViewer {...d} compact={true}/>}/>
            </Link>
        )
        )}
    </List>
    <Card title='教学地点'>
        <Link to={`/view/POI/${cls.position._id}`}>
            <AbstractViewer type='POI' data={cls.position}/>
        </Link>
    </Card>
</Card>)
};

export default Class;
