import { ProList } from '@ant-design/pro-components';
import { LikeOutlined, MessageOutlined, StarOutlined, StarFilled, DislikeOutlined } from '@ant-design/icons';
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


const IconText = ({ icon, text }: { icon: any; text: string }) => (
  <span>
    {React.createElement(icon, { style: { marginInlineEnd: 8 } })}
    {text}
  </span>
);

// 后端从数据库读取的数据
// import { courseData } from './components/courseData';

// 用于前端编写时的测试数据
const courseData = [
  {
    name: '计算机组成原理',
    teacher: '蔡朝晖',
    id: '123456',
    courseType: '专业必修',
    hours: 72,
    credit: 3,
    school: '计算机学院',
    rating: 9.85,
    comment: 35
  },
  {
    name: '高等数学',
    teacher: '胡新启',
    id: '3456789',
    courseType: '公共必修',
    hours: 72,
    credit: 4,
    school: '数学与统计学院',
    rating: 9.67,
    comment: 14
  },
  {
    name: '线性代数',
    teacher: '胡新启',
    id: '7894561',
    courseType: '专业必修',
    hours: 48,
    credit: 2,
    school: '数学与统计学院',
    rating: 9.68,
    comment: 18
  }
];



export default () => {

  const handleClickComment = (id) => {
    
  };

  return (
    <ProList<API.CoursesTableItem>
      showActions="hover"
      rowKey="courseID"
      headerTitle="课程列表"
      dataSource={courseData}
      search={{}}
      metas={{
        title: {
          dataIndex: 'name',
          title: '课程名称'
        },
        subTitle: {
          render: (_, record) => (
            <a key='teacher'>{record.teacher}</a>
          )
        },
        description: {
          search: false,
          render: (_, record) => (
            <div>
              <div style={{display: 'inline-block', width: '100px'}}>{record.courseType}</div>
              <div style={{display: 'inline-block', width: '80px'}}>学时：{record.hours}</div>
              <div style={{display: 'inline-block', width: '80px'}}>学分：{record.credit}</div>
              <div>开课学院：{record.school}</div>
            </div>
          )
        },
        content: {
          search: false,
          render: (_, record) => (
            <div>
              <div style={{display: 'inline-block', width: '100px'}}>评分：{(record.rating).toFixed(1)}/10</div>
              <div style={{display: 'inline-block'}}>基于{record.comment}条评价</div>
            </div>
          ),
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