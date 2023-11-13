import { PageContainer, ProList, ProCard } from '@ant-design/pro-components';
import { gql, useQuery } from '@apollo/client';
import { useMatch, useModel } from '@umijs/max';
import { Card, Collapse, CollapseProps, List, Row, Tag, theme } from 'antd';
import React, { Key, useState } from 'react';
import Article from './article';
import Post from './post';

const date2str = (d:{year:string,month:string,day:string}) => `${d.year}-${d.month}-${d.day}`

export const dispatchComponent = (type:string,id:string) => {
    switch(type){
        case 'Article':
            return <Article id={id}></Article>
        case 'Post':
            return <Post id={id}></Post>
        default:
            return <p>unsupported {type} object {id} </p>
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
