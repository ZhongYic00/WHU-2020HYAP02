import { gql, useMutation, useQuery } from '@apollo/client';
import React, { Key, useState } from 'react';
import {
  ProForm,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProFormList,
} from '@ant-design/pro-components';
import { Col, message, Row, Space, Select, Radio } from 'antd';
import type { FormLayout } from 'antd/lib/form/Form';
import { ReadOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { GraphQLNonNull, GraphQLInputObjectType, GraphQLInputType, GraphQLScalarType, GraphQLList, GraphQLObjectType, GraphQLType, GraphQLEnumType } from 'graphql';

type RenderEnumBoxProps={
  enumName: string
  fieldName: string
}

const RenderEnumBox: React.FC<RenderEnumBoxProps> = ({fieldName, enumName}) => {
  console.log(enumName);
  const queryEnum = gql`
  query ($enumName: String!) {
    __type(name: $enumName) {
      enumValues {
        name
      }
    }
  }
  `;
  const { error, data } = useQuery(queryEnum, {variables:{enumName: enumName}});
  const enumValues = data?.__type?.enumValues;
  console.log(enumValues);
  return (
    <ProFormSelect
      options={
        enumValues?.map((item,index)=>(name))
      }
      fieldProps={{
        defaultValue:enumValues && enumValues[0].name
      }}
      name={fieldName}
      label={fieldName}
    ></ProFormSelect>
  )
  return (
    <div>
    <Row>
      <Col span={2}>
        <p>{fieldName}: </p>
      </Col>
      <Col>
        <Select
          defaultValue={0}
          style={{width:150}}
          // onChange={(value)=>}
          options={
            enumValues && enumValues.map((item, index) => ({
              value: index,
              label: name
            }))
          }
        />
        <p> </p>
      </Col>
    </Row>
    </div>
  )
}

export type RenderInputBoxProps={
  schemaName: string,
  id: string,
  queryFields:string
}

const RenderInputBox: React.FC<RenderInputBoxProps> = ({schemaName, id, queryFields}) => {
  const {initialState} = useModel("@@initialState");
  const schema = initialState?.clientSchema;
  const inputType=schema?.getType(`${schemaName}CreateInput`) as GraphQLInputObjectType
  const fields=inputType?.getFields()
  const type=schema?.getType(schemaName) as GraphQLObjectType
  // const fields=type.getFields()
  const unwrapList = (type:GraphQLType)=>{
    let list=false
    console.log('unwrap',type)
    while(!(type instanceof GraphQLScalarType||type instanceof GraphQLObjectType||type instanceof GraphQLInputObjectType||type instanceof GraphQLEnumType)){
      type=type.ofType
      list||=type instanceof GraphQLList
    }
    return [list,type]
  }
  const inputs:[string,boolean,boolean,GraphQLObjectType|GraphQLScalarType|GraphQLEnumType][]=Object.entries(fields)
  .map(([str,field])=>{
    let mustfill=field.type instanceof GraphQLNonNull
    const [listInput,leafType]=unwrapList(type.getFields()[field.name].type)
    return [field.name,mustfill,listInput,leafType]
  })
  console.log(schemaName,'Input',inputType,inputs)

  const upload=gql`
mutation CreatePosts($input: [PostCreateInput!]!) {
createPosts(input: $input) {
info {
nodesCreated
}
}
}
  `
  const [uploadObject]=useMutation(upload)
  
  return (
  <div>
    <ProForm
      layout = "horizontal"
      submitter={{
        render: (props, doms) => {
          return (
            <Row>
              <Col span={14} offset={4}>
                <Space>{doms}</Space>
              </Col>
            </Row>
          );
        }
      }}
      onFinish={async (values) => {
        console.log(values);
        uploadObject({
          variables:{
            input:[{
              policy: 'AllUsers',
              user: {
                connect: {
                  where: {
                    node: {
                      nickname: 'rubbish'
                    }
                  }
                }
              },
              content: {
                create: {
                  node: {
                    [schemaName]: {
                      ...values,
                      // interests: []
                    }
                  }
                }
              }
            }]
          }
        })
      }}
      isKeyPressSubmit = {true}
    >
    {inputs && inputs.map((item,index)=>{
    // schemaFields && schemaFields.map((item, index) => {
      // const nowItem = {...item} as { -readonly [K in keyof typeof item]: typeof item[K]};
      const [name,nullable,isList,leafType]=item
      if(leafType instanceof GraphQLScalarType) {
        if(leafType.name == "Boolean") {
          if(isList) {
            return (
              <ProFormList
                  name={name}
                  label={name}
                  creatorButtonProps={{
                    position: 'bottom',
                    creatorButtonText: '新增一行',
                  }}
                  min={1}
              >
                <div>
                <Row>
                  <Col span={2}>
                    <p>{name}: </p>
                  </Col>
                  <Col>
                    <Radio.Group name="genderGroup" defaultValue={1}>
                      <Radio value={1}>男</Radio>
                      <Radio value={2}>女</Radio>
                    </Radio.Group>              
                  </Col>
                </Row>
                </div>
              </ProFormList>
            )
          }
          else {
            return (
              <div>
              <Row>
                <Col span={2}>
                  <p>{name}: </p>
                </Col>
                <Col>
                  <Radio.Group name="genderGroup" defaultValue={1}>
                    <Radio value={1}>男</Radio>
                    <Radio value={2}>女</Radio>
                  </Radio.Group>              
                </Col>
              </Row>
              </div>
            )
          }
        }
        else if(leafType.name == "Date") {
          if(isList) {
            return (
              <ProFormList
                  name={name}
                  label={name}
                  creatorButtonProps={{
                    position: 'bottom',
                    creatorButtonText: '新增一行',
                  }}
                  min={1}
              >
                <ProFormDatePicker name={name} label={name} />
              </ProFormList>
            )
          }
          else {
            return (
              <ProFormDatePicker name={name} label={name} />
            )
          }
        }
        else if(name!='_id' && name!='age'){
          if(isList) {
            return (
              <ProFormList
                  name={name}
                  label={name}
                  initialValue={[
                    {
                      [name]: '请输入',
                    },
                  ]}
                  creatorButtonProps={{
                    position: 'bottom',
                    creatorButtonText: '新增一行',
                  }}
                  creatorRecord={{
                    [name]: '请输入',
                  }}
                  min={1}
              >
                <ProFormText
                  name={name}
                  label={name}
                  placeholder="请输入"
                />
              </ProFormList>
            )
          }
          else {
            return (
              <ProFormText
                name={name}
                label={name}
                placeholder="请输入"
              />
            )
          }
        }
      }
      else if(leafType instanceof GraphQLEnumType) {
        if(isList) {
          return (
            <ProFormList
                name={name}
                label={name}
                creatorButtonProps={{
                  position: 'bottom',
                  creatorButtonText: '新增一行',
                }}
                min={1}
            >
              <RenderEnumBox 
                fieldName={name}
                enumName={leafType?.name} 
              />
            </ProFormList>
          )
        }
        else {
          return (
            <RenderEnumBox 
              fieldName={name}
              enumName={leafType?.name} 
            />
          )
        }
      }
      else if(leafType instanceof GraphQLObjectType) {
        return <p>todo: render {leafType.name} chooser</p>
      }
      else{
        return <p>ERROR: type not considered:{JSON.stringify(item)}</p>
      }

      })
    }
    </ProForm>
  </div>
  )
}

export default RenderInputBox;