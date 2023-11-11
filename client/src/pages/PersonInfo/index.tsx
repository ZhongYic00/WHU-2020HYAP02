import { PageContainer, ProList, ProCard } from '@ant-design/pro-components';
import { gql, useQuery } from '@apollo/client';
import { useMatch, useModel } from '@umijs/max';
import { Card, Collapse, CollapseProps, List, Tag, theme } from 'antd';
import React, { Key, useState } from 'react';

const PersonQuery=gql`
query Teachers($where: TeacherWhere) {
  teachers(where: $where) {
    # age
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
      course {
        name
      }
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

const PersonInfo: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  const match = useMatch('/personInfo/:id')
  const entityId = match?.params?.id
  const { loading, error, data } = useQuery(PersonQuery,{
    variables: {where: {_id: entityId}}
  });
  console.log('_id',entityId,'res',data)
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
              {basicField.map(([field,config])=>
                <p>{config.text?config.text:field}
                  : {(config.render?config.render:(t:any)=>t)(teacher[field])}</p>)}
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
                    grid={{ gutter: 0, column: 6 }}
                    dataSource={teacher.interests}
                    renderItem={(item,index)=>(
                      <List.Item>
                        <Tag color='success'>{item}</Tag>
                      </List.Item>
                    )}
                  />}
                </ProCard>
                <ProCard title="所授课程" headerBordered>
                  {<List
                    dataSource={
                    Object.entries(teacher.classes.reduce(
                      (group,cls)=>{
                      const course = cls.course.name
                      group[course] = group[course] ?? [];
                      group[course].push(cls);
                      console.log(group)
                      return group;
                    }, {}))}
                    renderItem={([name,classes],index)=>(
                      <List.Item>
                        <List.Item.Meta
                          title={`${name}`}
                          description={`课头: ${classes.map(({id,schedule})=>`${id}@${JSON.stringify(schedule)},`)}`}
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
