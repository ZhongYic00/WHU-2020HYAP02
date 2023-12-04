import { PageContainer, ProList } from '@ant-design/pro-components';
import { SettingOutlined, LikeOutlined, MessageOutlined, StarOutlined, StarFilled, DislikeOutlined } from '@ant-design/icons';
import { Button, Progress, Space, Tag, Rate, List, Row, Col } from 'antd';
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
import { constant, forEach } from 'lodash';
import Link from 'antd/es/typography/Link';
import button from 'antd/es/button';



// 后端从数据库读取的数据
// import { courseData } from './components/CourseData';

// 用于前端编写时的测试数据
const PersonData =[
  {
  id:'1',
  name:'蔡朝晖',
  title:'教授',
  college:'计算机学院',
  location:'计院C407',
  phone:'123456',
  course:'计算机基础'
  
},
{
  id:'2',
  name:'胡新启',
  title:'教授',
  college:'数学与统计学院',
  location:'数院C407',
  phone:'123456',
  course:'高等数学'
  
}];
let data=[
  {}
];


export default () => {

  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([]);



  const genExtra = () => (
    <SettingOutlined
      onClick={(event) => {
        // If you don't want click extra trigger collapse, you can prevent this:
        event.stopPropagation();
      }}
    />
  );

  return (
  <><Row><img src='error' width={200} height={200}></img>
  </Row>
  <Row><p>姓名：{PersonData[0].name}</p></Row>
  <Row><p>职称：{PersonData[0].title}</p></Row>
  <Row><p>所属学院：{PersonData[0].college}</p></Row>
  <Row><p>办公地点：{PersonData[0].location}</p></Row>
  <Row><p>电话：{PersonData[0].phone}</p></Row>
  <Row><p>教授课程</p></Row>
  {/* <Link to={`/myinfo/update`}>修改</Link> */}
  <Row><Button href='/myinfo/update'>修改</Button></Row>
  </>
  
);
};