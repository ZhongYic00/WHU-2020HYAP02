import { ProList, PageContainer } from '@ant-design/pro-components';
import { gql, useQuery } from '@apollo/client';
import { SettingOutlined, LikeOutlined, MessageOutlined, StarOutlined, StarFilled, DislikeOutlined } from '@ant-design/icons';
import { Button, Progress, Space, Tag, Rate, Collapse, CollapseProps } from 'antd';
import React, { Key, useState } from 'react';
import {
  ProCard,
  ProForm,
  ProFormList,
  ProFormText,
} from '@ant-design/pro-components';
import { Link } from '@umijs/max';

const IconText = ({ icon, text }: { icon: any; text: string }) => (
  <span>
    {React.createElement(icon, { style: { marginInlineEnd: 8 } })}
    {text}
  </span>
);

// 后端从数据库读取的数据
const CourseQuery = gql`
query CourseQuery {
  courses {
    ... on DepartmentCourse {
      __typename
      classes {
        id
        position {
          id
          name
        }
        schedule {
          end
          start
          weekInterval
          weekday
          weekend
          weekstart
        }
        teacher {
          id
          name
        }
      }
      id
      name
      college {
        name
      }
    }
    ... on GeneralCourse {
      __typename
      classes {
        id
        position {
          id
          name
        }
        schedule {
          end
          start
          weekInterval
          weekday
          weekend
          weekstart
        }
        teacher {
          id
          name
        }
      }
      id
      name
      college {
        name
      }
    }
    ... on LiberalCourse {
      __typename
      classes {
        id
        position {
          id
          name
        }
        schedule {
          end
          start
          weekInterval
          weekday
          weekend
          weekstart
        }
        teacher {
          id
          name
        }
      }
      id
      name
      college {
        name
      }
      type
    }
    ... on PECourse {
      __typename
      classes {
        id
        position {
          id
          name
        }
        schedule {
          end
          start
          weekInterval
          weekday
          weekend
          weekstart
        }
        teacher {
          id
          name
        }
      }
      id
      name
      college {
        name
      }
    }
  }
}
`;

export default () => {

  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([]);

  const handleClickComment = (id) => {
    
  };

  const handleClick1 = (id) => {
    console.log(id);
  };

  const genExtra = () => (
    <SettingOutlined
      onClick={(event) => {
        // If you don't want click extra trigger collapse, you can prevent this:
        event.stopPropagation();
      }}
    />
  );

  const { loading, error, data } = useQuery(CourseQuery);

  console.log(data);

  return (
    <PageContainer>
      { data && data['courses'] && 
      [[data.courses].map((courses) => (
          <ProList<API.CoursesTableItem>
            showActions="hover"
            rowKey="courseID"
            headerTitle="课程列表"
            dataSource={courses}
            // itemLayout="vertical"
            search={{}}
            expandable={{expandedRowKeys, onExpandedRowsChange: setExpandedRowKeys}}
            metas={{
              title: {
                dataIndex: 'name',
                title: '课程名称'
              },
              subTitle: {
                search: false,
                render: (_, record) => {
                  let tagText, tagColor;
                  switch (record.__typename) {
                    case 'DepartmentCourse':
                      tagText = '专业课';
                      tagColor = 'blue';
                      break;
                    case 'GeneralCourse':
                      tagText = '公共课';
                      tagColor = 'red';
                      break;
                    case 'LiberalCourse':
                      tagText = '通识课';
                      tagColor = 'green';
                      break;
                    // 可以继续添加其他情况
                    default:
                      tagText = '体育课';
                      tagColor = 'yellow';
                      break;
                  }
                
                  return (
                    <div>
                      <Tag color={tagColor}>{tagText}</Tag>
                      <Tag>开课学院：{record.college[0].name}</Tag>
                    </div>
                  );
                }
                // render: (_, record) => (
                //   <div>
                //     <Tag>{record.__typename}</Tag>
                //     <Tag color="green">开课学院：{record.college[0].name}</Tag>
                //   </div>
                // )
              },
              description: {
                search: false,
                render: (_, record) => (
                  <div>
                    <p> </p>
                    <Collapse
                      items={
                        record.classes.map((item, index) => ({
                            key: index,
                            label: <Link to={`/personInfo/${item.teacher[0].id}`}>{item.teacher[0].name}</Link>,
                            children: <div>这是内容</div>,
                            extra: <a key={`comment_${item.id}`}>评价</a>
                        }))
                      }
                      collapsible="icon"
                    ></Collapse>
                  </div>
                )
              },
              content: {
                search: false,
                // render: (_, record) => (
                //   <div>
                //     <div style={{display: 'inline-block', width: '100px'}}>评分：{(record.rating).toFixed(1)}/10</div>
                //     <div style={{display: 'inline-block'}}>基于{record.comment}条评价</div>
                //   </div>
                // ),
              },
              actions: {
                
              },
            }}
          />
          ))
        ]
      }
    </PageContainer>
  );
};