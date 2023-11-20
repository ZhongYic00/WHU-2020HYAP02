import { ProCard } from '@ant-design/pro-components';
import { gql, useQuery } from '@apollo/client';
import { Card, Collapse, CollapseProps, List, Row, Tag, theme } from 'antd';
import React, { Key, useState } from 'react';
import { ViewerProps, dispatchComponent } from '.';
import { Link } from '@umijs/max';
import { AbstractIdViewer, abstractTitle } from '../abstractView';

const PostQuery=gql`
query($where: PostWhere) {
  posts(where: $where) {
    createdAt
    citeConnection {
      edges {
        Attitude
        # createdAt
        node {
          _id
          __typename
        }
      }
    }
    content {
      _id
      __typename
    }
    user {
      _id
      nickname
    }
    policy
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

const Post: React.FC<ViewerProps> = ({id}) => {
  console.log('Post',id)
  const { loading, error, data } = useQuery(PostQuery,{
    variables: {where: {_id: id}}
  });
  console.log('_id',id,'res',data)
  const item = data?.posts[0]
  return item &&
  (<ProCard>
    <p>{`${item.content.__typename} by ${item.user.nickname}`}</p>
    <i>{`created At ${item.createdAt}`}</i>
    {dispatchComponent(item.content.__typename,item.content._id)}
    <Row>
        {item.citeConnection.edges.map((edge)=>{
            return (<Tag>
                <AbstractIdViewer id={edge.node._id} type={edge.node.__typename}
                render={({type,data})=>(
                  <Link to={`/view/${edge.node.__typename}/${edge.node._id}`}>
                    {abstractTitle(type,data)}
                </Link>
                )
                }/>
                </Tag>)
        })}
    </Row>
  </ProCard>)
};

export default Post;
