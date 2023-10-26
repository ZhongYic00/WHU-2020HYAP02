import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Avatar, Card, Divider, List, Skeleton } from 'antd';
import { useQuery,gql } from '@apollo/client';
import { Link } from '@umijs/max';

interface DataType {
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  nat: string;
}
const postQuery = gql`
query {
  posts {
    _id
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

const App: React.FC = () => {
  const {data,loading,fetchMore} = useQuery(postQuery)

  const loadMoreData = () => {
    console.log('loadmore')
    // fetch('https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo')
    //   .then((res) => res.json())
    //   .then((body) => {
    //     setData([...data, ...body.results]);
    //     setLoading(false);
    //   })
    //   .catch(() => {
    //     setLoading(false);
    //   });
  };
  console.log(data)

  return data && (
      <InfiniteScroll
        dataLength={data.posts?.length||0}
        next={loadMoreData}
        hasMore={data.posts?.length < 50}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <List
          grid={{ gutter: 6, column: 5 }}
          dataSource={data.posts}
          renderItem={(item) => (
            <List.Item key={item._id}>
              <Card
                  cover={
                    <img
                      alt="example"
                      src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    />
                  }
              >
                <Link to={`/view/${item.__typename}/${item._id}`}>{`${item.content.__typename} by ${item.user.nickname}`}</Link>
                <p>{`created At ${item.createdAt}`}</p>
              </Card>
            </List.Item>
          )}
        />
      </InfiniteScroll>
  );
};

export default App;
