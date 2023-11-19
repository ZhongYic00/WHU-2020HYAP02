import { ProCard } from '@ant-design/pro-components';
import { gql, useQuery } from '@apollo/client';
import { Card, Collapse, CollapseProps, List, Tag, theme } from 'antd';
import React, { Key, useState } from 'react';
import { ViewerProps } from '.';

const ArticleQuery=gql`
query($where: ArticleWhere) {
  articles(where: $where) {
    content
  }
}
`
const basicField=(Object.entries({
  name: {
    text: '姓名'
  },
  gender: {
    render: (t:boolean)=>t?'女':'男',
    text: '性别'
  },
  title: {
    text: '职称'
  }
}))

const date2str = (d:{year:string,month:string,day:string}) => `${d.year}-${d.month}-${d.day}`

const Article: React.FC<ViewerProps> = ({id}) => {
  const { loading, error, data } = useQuery(ArticleQuery,{
    variables: {where: {_id: id}}
  });
  console.log('_id',id,'res',data)
  return data &&
  (<ProCard>
    <p>{data.articles[0].content}</p>
  </ProCard>)
};

export default Article;
