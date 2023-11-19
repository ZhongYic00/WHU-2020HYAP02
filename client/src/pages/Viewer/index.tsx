import { PageContainer, ProList, ProCard } from '@ant-design/pro-components';
import { gql, useQuery } from '@apollo/client';
import { useMatch, useModel } from '@umijs/max';
import { Card, Collapse, CollapseProps, List, Row, Tag, theme } from 'antd';
import React, { Key, useState } from 'react';
import Article from './components/article';
import Post from './components/post';

const date2str = (d:{year:string,month:string,day:string}) => `${d.year}-${d.month}-${d.day}`

export const dispatchComponent = (type,id) => {
    switch(type){
        case 'Article':
            return <Article id={id}></Article>
        case 'Post':
            return <Post id={id}></Post>
    }
}
export type ViewerProps={
    id: string
}

const Viewer: React.FC = () => {
  const { token } = theme.useToken();
  const match = useMatch('/view/:type/:id')
  const type = match?.params?.type
  const entityId = match?.params?.id
  console.log('_id',entityId,'type',type)
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([]);
  return (
    <PageContainer>
        {dispatchComponent(type,entityId)}
    </PageContainer>
  );
};

export default Viewer;
