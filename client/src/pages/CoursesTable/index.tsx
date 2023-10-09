import { ProList } from '@ant-design/pro-components';
import { SettingOutlined, LikeOutlined, MessageOutlined, StarOutlined, StarFilled, DislikeOutlined } from '@ant-design/icons';
import { Button, Progress, Space, Tag, Rate } from 'antd';
import type { Key } from 'react';
import { useState } from 'react';
import {
  ProCard,
  ProForm,
  ProFormList,
  ProFormText,
} from '@ant-design/pro-components';
import React from 'react';
import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';
import { Link } from '@umijs/max';


const IconText = ({ icon, text }: { icon: any; text: string }) => (
  <span>
    {React.createElement(icon, { style: { marginInlineEnd: 8 } })}
    {text}
  </span>
);

// 后端从数据库读取的数据
// import { courseData } from './components/CourseData';

// 用于前端编写时的测试数据
const courseData = [
  {
    name: '计算机组成原理',
    id: '123456',
    courseType: '专业必修',
    college: '计算机学院',
    rating: 9.85,
    comment: 35,
    classes: [
      {
        id: '123456-1', 
        teacher: "蔡朝晖",
      },
      {
        id: '123456-2',
        teacher: "龚奕利"
      }
    ]
  },
  {
    name: '高等数学',
    id: '3456789',
    courseType: '公共必修',
    college: '数学与统计学院',
    rating: 9.67,
    comment: 14,
    classes: [
      {
        id: '3456789-1', 
        teacher: "胡新启"
      },
      {
        id: '3456789-2',
        teacher: "黄正华"
      }
    ]
  },
  {
    name: '线性代数',
    id: '7894561',
    courseType: '专业必修',
    college: '数学与统计学院',
    rating: 9.68,
    comment: 18,
    classes: [
      {
        id: '7894561-1', 
        teacher: "胡新启"
      },
      {
        id: '7894561-2',
        teacher: "黄正华"
      }
    ]
  }
];



export default () => {

  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([]);

  const handleClickComment = (id) => {
    
  };

  const handleClickTeacher = (teacher) => {

  };

  const genExtra = () => (
    <SettingOutlined
      onClick={(event) => {
        // If you don't want click extra trigger collapse, you can prevent this:
        event.stopPropagation();
      }}
    />
  );


  return (
    <ProList<API.CoursesTableItem>
      showActions="hover"
      rowKey="courseID"
      headerTitle="课程列表"
      dataSource={courseData}
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
          render: (_, record) => (
            // <a key='teacher'>{record.teacher}</a>
            <div>
              <Tag>{record.courseType}</Tag>
              <Tag>开课学院：{record.college}</Tag>
            </div>
            
          )
        },
        description: {
          search: false,
          render: (_, record) => (
            <div>
              <p> </p>
              <Collapse
                items={record.classes.map((item) => ({
                  key: item.id,
                  label: <Link to={`/personInfo/${item.id}`}>{item.teacher}</Link>,
                  children: item.id,
                  extra: <a OnClick={handleClickTeacher(item.teacher)}>教师主页</a>
                }))}
                defaultActiveKey={['1']}
                // onChange={onChange}
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
          render: (_, record) => {
            return <a key="comment" onClick={handleClickComment(record.id)}>评价</a>;
          },
        },
      }}
    />
  );
};