import Filter from '@/components/InfoPlatform/Filter';
import { PageContainer, ProList, ProCard } from '@ant-design/pro-components';
import { gql, useQuery } from '@apollo/client';
import { useModel } from '@umijs/max';
import { Button, Card, Collapse, CollapseProps, List, Space, Switch, theme } from 'antd';
import { forEach } from 'lodash';
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
const basicField=['id','name','gender','birth','age','college','grade']
const chineseField=['编号','姓名','性别','生日','年龄','所属学院','年级']

const date2str = (d:{year:string,month:string,day:string}) => `${d.year}-${d.month}-${d.day}`

//可被搜索状态回调函数
function permission(){}

const MyInfo: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  const { loading, error, data } = useQuery(PeriodsQuery);
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([]);
  return (
    <PageContainer>
        {data && data['students'] &&
        [
        data.students.map((stu)=>(
          <ProCard
            title={stu.name}
            split='vertical'
          >
            <ProCard title='基本个人信息' colSpan="30%">
            {basicField.map((field,index)=><p>{chineseField[index]} : {stu[field]}</p>)}
            {<p>专业:{stu.studyRecords.major}</p>}
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
        <Space direction="vertical">
        <Button href='/Myinfo/Update'>修改</Button>
        <Switch
        checkedChildren="不可被搜索" unCheckedChildren="可被搜索" onChange={permission}></Switch>
        </Space>
        {/* {data && data['periods'] && data.periods.map((prd)=>(
            <Card title={prd.weekday}>
                <p>{JSON.stringify(prd)}</p>
            </Card>
        ))} */}
    </PageContainer>
  );
};

export default MyInfo;
