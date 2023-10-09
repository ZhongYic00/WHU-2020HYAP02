import { PageContainer, ProList, ProCard } from '@ant-design/pro-components';
import { gql, useQuery } from '@apollo/client';
import { useMatch, useModel } from '@umijs/max';
import { Card, Collapse, CollapseProps, List, theme } from 'antd';
import React, { Key, useState } from 'react';

const PersonQuery=gql`
query Teachers($where: TeacherWhere) {
  teachers(where: $where) {
    age
    birth
    gender
    id
    interests
    name
    duties {
      depart {
        name
      }
      name
    }
    teams {
      name
    }
    title
    classes {
      id
      schedule {
        weekday
        start
        end
        weekstart
        weekend
        weekInterval
      }
    }
  }
}
`
const basicField=['id','name']

const date2str = (d:{year:string,month:string,day:string}) => `${d.year}-${d.month}-${d.day}`

const PersonInfo: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  const match = useMatch('/personInfo/:id')
  const personId = match?.params?.id
  const { loading, error, data } = useQuery(PersonQuery,{
    variables: {where: {id: personId}}
  });
  console.log('id',personId,'res',data)
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([]);
  return (
    <PageContainer>
        {data && data['teachers'] &&
        [[data.teachers[0]].map((teacher)=>(
          <ProCard
            title={teacher.name}
            split='vertical'
          >
            <ProCard title='基本个人信息' colSpan="30%">
              {basicField.map((field)=><p>{field} : {teacher[field]}</p>)}
            </ProCard>
            <ProCard>
              <ProCard direction="column">
                <ProCard title="任职" headerBordered>
                  {<List
                    dataSource={teacher.duties}
                    renderItem={(item,index)=>(
                      <List.Item>
                        <List.Item.Meta
                          title={`${item.depart?.name} ${item?.name}`}
                        />
                      </List.Item>
                    )}
                  />}
                </ProCard>
                <ProCard title="研究兴趣" headerBordered>
                  {<List
                    dataSource={teacher.interests}
                    renderItem={(item,index)=>(
                      <List.Item>
                        <List.Item.Meta
                          title={item}
                        />
                      </List.Item>
                    )}
                  />}
                </ProCard>
              </ProCard>
            </ProCard>
          </ProCard>
        ))]
        }
        {data && data['periods'] && data.periods.map((prd)=>(
            <Card title={prd.weekday}>
                <p>{JSON.stringify(prd)}</p>
            </Card>
        ))}
    </PageContainer>
  );
};

export default PersonInfo;
