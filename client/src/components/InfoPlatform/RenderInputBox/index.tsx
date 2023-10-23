import { gql, useQuery } from '@apollo/client';
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
} from '@ant-design/pro-components';
import { Col, message, Row, Space, Select, Radio } from 'antd';
import type { FormLayout } from 'antd/lib/form/Form';
import { ReadOutlined } from '@ant-design/icons';

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
    <div>
    <Row>
      <Col span={2}>
        <p>{fieldName}: </p>
      </Col>
      <Col>
        <Select
          defaultValue={0}
          style={{width:150}}
          options={
            enumValues && enumValues.map((item, index) => ({
              value: index,
              label: item.name
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
  const query_field=gql`
  query($schemaName:String!) {
    __type(name:$schemaName){
      fields{
        name
        type{
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                }
              }
            }
          }
        }
      }
    }
  }
  `;
  
  const {data,error} = useQuery(query_field,{variables:{schemaName:schemaName}});
  console.log(data);
  const schemaFields = data?.__type.fields.slice();
  console.log(schemaFields);

  // const fieldsArray = schemaFields?.map((field) => field.name);
  // const fieldsString = fieldsArray?.join('\n');

  // console.log(fieldsString);

  // const query_data=gql`
  // query($id:String!) {
  //   ${queryFields} (where: {id: $id}) {
      
  //   }
  // }
  // `;
  
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
        },
      }}
      isKeyPressSubmit = {true}
    >
    {schemaFields && schemaFields.map((item, index) => {
      const nowItem = {...item} as { -readonly [K in keyof typeof item]: typeof item[K]};
      while(nowItem?.type?.kind == "NON_NULL") {
        nowItem.type = nowItem?.type?.ofType;
      }
      if (nowItem?.type?.kind == "LIST") {
        while(nowItem?.type?.kind == "NON_NULL") {
          nowItem.type = nowItem?.type?.ofType;
        }
        // TODO
      }
      else if(nowItem?.type?.kind == "SCALAR") {
        if(nowItem?.type?.name == "Boolean") {
          return (
            <div>
            <Row>
              <Col span={2}>
                <p>{item?.name}: </p>
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
        else if(nowItem?.type?.name == "Date") {
          return (
            <ProFormDatePicker name="date" label={item.name} />
          )
        }
        else {
          return (
            <ProFormText
              name={index}
              label={item.name}
              placeholder="请输入"
            />
          )
        }
      }
      else if(nowItem?.type?.kind == "ENUM") {
        return (
          <RenderEnumBox 
            fieldName={nowItem?.name}
            enumName={nowItem?.type?.name} 
          />
        )
      }
      else if(nowItem?.type?.kind == "OBJECT") {
        // 总结规律发现所有有用的对象型都由LIST包裹，因此直接为对象型的抛弃
        // console.log("object", nowItem?.name);
        // do nothing
      }
      else{
        return (
          <ProFormText
            name={index}
            label={item.name}
            placeholder="请输入"
          />
        )
      }

      })
    }
    </ProForm>
  </div>
  )
}

export default RenderInputBox;