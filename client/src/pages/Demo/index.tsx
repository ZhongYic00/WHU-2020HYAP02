import { PageContainer } from '@ant-design/pro-components';
import { gql, useQuery } from '@apollo/client';
import { useModel } from '@umijs/max';
import { Card, theme } from 'antd';
import React from 'react';

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

const Demo: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  const { loading, error, data } = useQuery(PeriodsQuery);
  return (
    <PageContainer>
        {data && data['students'] && data.students.map(({name, classes})=>(
            <Card title={name}>
                <p>{classes}</p>
            </Card>
        ))}
        {data && data['periods'] && data.periods.map((prd)=>(
            <Card title={prd.weekday}>
                <p>{JSON.stringify(prd)}</p>
            </Card>
        ))}
    </PageContainer>
  );
};

export default Demo;
