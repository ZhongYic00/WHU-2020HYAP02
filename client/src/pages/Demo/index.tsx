import { PageContainer, ProList, ProCard } from '@ant-design/pro-components';
import { gql, useQuery } from '@apollo/client';
import { useModel } from '@umijs/max';
import { Card, Collapse, CollapseProps, List, theme } from 'antd';
import React, { Key, useState } from 'react';

const CoursesQuery=gql`
query {
  students {
    name
    classes {
      course {
        name
      }
    }
  }
}
`
const PeriodsQuery=gql`
query {
  students {
    id
    name
    gender
    birth
    age
    studyRecords {
      ... on MajorInRecord {
        major
        isAbort
        date
        subject {
          name
          category
          schoolingYear
        }
      }
      ... on RepetitionRecord {
        date
      }
    }
    classes {
      id
      course {
        name
      }
    }
  }
  periods {
    weekday
    start
    end
    weekstart
    weekend
    weekInterval
  }
}
`
const basicField=['id','name']

const date2str = (d:{year:string,month:string,day:string}) => `${d.year}-${d.month}-${d.day}`

const Demo: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  const { loading, error, data } = useQuery(PeriodsQuery);
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([]);
  return (
    <PageContainer>
        {data && data['students'] &&
        [(<ProList<{ title: string }>
          rowKey="id"
          headerTitle="支持展开的列表"
          itemLayout="vertical"
          toolBarRender={() => {
            return [];
          }}
          expandable={{ expandedRowKeys, onExpandedRowsChange: setExpandedRowKeys }}
          dataSource={data.students}
          metas={{
            title: {
              dataIndex: 'name'
            },
            subTitle: {
              dataIndex: 'id',
              render: (student)=>{
                console.log(student)
                return <p>nothing</p>
              }
            },
            description: {
              render: () => {
                return 'Ant Design, a design language for background applications, is refined by Ant UED Team';
              },
            },
            content: {
              dataIndex: 'studyRecords',
              render: (records) => {
                const items: CollapseProps['items'] = [{
                  key:'0',
                  label: '教学班',
                  children: 
                  (<List
                    dataSource={[...records,...records,]}
                    renderItem={(item,index)=>(
                      <List.Item>
                        <List.Item.Meta
                          title={item.subject?.name}
                        />
                      </List.Item>
                    )}
                  />)
                }]
                return <Collapse items={items} bordered={false}/>
              }
              
            },
          }}
        />),
        data.students.map((stu)=>(
          <ProCard
            title={stu.name}
            split='vertical'
          >
            <ProCard title='基本个人信息' colSpan="30%">
              {basicField.map((field)=><p>{field} : {stu[field]}</p>)}
            </ProCard>
            <ProCard>
              <ProCard direction="column">
                <ProCard title="学业变更记录" headerBordered>
                  {<List
                    dataSource={stu.studyRecords}
                    renderItem={(item,index)=>(
                      <List.Item>
                        <List.Item.Meta
                          title={item.subject?.name}
                          description={ `${item.isAbort?"肄业":"修习"} on ${date2str(item.date)}`}
                        />
                      </List.Item>
                    )}
                  />}
                </ProCard>
                <ProCard title="所修课程" headerBordered>
                  {<List
                    dataSource={stu.classes}
                    renderItem={(item,index)=>(
                      <List.Item>
                        <List.Item.Meta
                          title={item.course.name}
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

export default Demo;
