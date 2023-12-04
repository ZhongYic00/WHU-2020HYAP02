import { PageContainer, ProList } from '@ant-design/pro-components';
import { SettingOutlined, LikeOutlined, MessageOutlined, StarOutlined, StarFilled, DislikeOutlined } from '@ant-design/icons';
import { Button, Progress, Space, Tag, Rate, List, Row, Col, Form, Input, Checkbox } from 'antd';
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


  const onFinish = (values: any) => {
    console.log('Success:', values);
  };
  
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  type FieldType = {
    
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
  <><Form
  name="basic"
  labelCol={{ span: 8 }}
  wrapperCol={{ span: 16 }}
  style={{ maxWidth: 600 }}
  initialValues={{ remember: true }}
  onFinish={onFinish}
  onFinishFailed={onFinishFailed}
  autoComplete="off"
>
  <Form.Item<FieldType>
    label="姓名"
    rules={[{ required: true, message: 'Please input your username!' }]}
  >
    <Input />
  </Form.Item>

  <Form.Item<FieldType>
    label="职称"
    rules={[{ required: true, message: 'Please input your password!' }]}
  >
    <Input />
  </Form.Item>

  <Form.Item<FieldType>
    label="所属学院"
    rules={[{ required: true, message: 'Please input your password!' }]}
  >
    <Input />
  </Form.Item>

  <Form.Item<FieldType>
    label="办公地点"
    rules={[{ required: true, message: 'Please input your password!' }]}
  >
    <Input />
  </Form.Item>

  <Form.Item<FieldType>
    label="联系电话"
    rules={[{ required: true, message: 'Please input your password!' }]}
  >
    <Input />
  </Form.Item>

  <Form.Item<FieldType>
    label="教授课程"
    rules={[{ required: true, message: 'Please input your password!' }]}
  >
    <Input />
  </Form.Item>

  <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
    <Button type="primary" htmlType="submit">
      提交
    </Button>
  </Form.Item>
</Form>
  </>
  
);
};