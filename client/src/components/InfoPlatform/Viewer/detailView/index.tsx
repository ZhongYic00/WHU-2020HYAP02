import { PageContainer, ProList, ProCard } from '@ant-design/pro-components';
import { gql, useQuery } from '@apollo/client';
import { useMatch, useModel } from '@umijs/max';
import { Card, Col, Collapse, CollapseProps, List, Row, Tag, theme } from 'antd';
import React, { Key, useState } from 'react';
import Article from './article';
import Post from './post';
import Teacher from './teacher';
import { AbstractIdViewer } from '../abstractView';
import POI from './poi';
import Class from './class';

const date2str = (d:{year:string,month:string,day:string}) => `${d.year}-${d.month}-${d.day}`

export const dispatchComponent = (type:string,id:string) => {
    switch(type){
        case 'Article':
            return <Article id={id}></Article>
        case 'Post':
            return <Post id={id}></Post>
        case 'Teacher':
            return <Teacher id={id}></Teacher>
        case 'POI':
            return <POI id={id}></POI>
        case 'Class':
            return <Class id={id}></Class>
        default:
            return <AbstractIdViewer type={type} id={id}/>
    }
}
export type ViewerProps={
    id:string
}

const Viewer: React.FC<{type:string,id:string}> = ({type,id}) => {
  return (
        dispatchComponent(type,id)
  );
};

export default Viewer;
