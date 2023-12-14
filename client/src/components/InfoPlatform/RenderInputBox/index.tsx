import { gql, useMutation, useQuery } from '@apollo/client';
import React, { FC, Key, useState } from 'react';
import {
  ProForm,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormDigit,
  ProFormRadio,
  ProFormRate,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProFormGroup,
  ProFormDependency,
  ProFormList,
  ProCard
} from '@ant-design/pro-components';
import { Col, message, Row, Space, Select, Radio, Modal, Button, Form, Input } from 'antd';
import type { FormLayout } from 'antd/lib/form/Form';
import { PlusCircleFilled, PlusCircleOutlined, ReadOutlined } from '@ant-design/icons';
import { Link, useModel } from '@umijs/max';
import { GraphQLNonNull, GraphQLInputObjectType, GraphQLInputType, GraphQLScalarType, GraphQLList, GraphQLObjectType, GraphQLType, GraphQLEnumType, GraphQLInterfaceType } from 'graphql';
import { KeepAlive } from '@umijs/max';
import Filter from '../Filter';
import { ObjectList, firstUpperCase, pluralize, titleCase } from '../ObjectList';
import { Pos, PosChooser, WHUCSCoords } from '../Maps/PosChooser';
import { qInterface } from '../Viewer/abstractView';

type RenderEnumBoxProps={
  enumName: string
  fieldName: string
}
const RawInput:React.FC<{
  typename:string
  value?:any,
  onChange?: (value: any) => void,
}>=({typename,value,onChange})=> (<span>
  <p>Warning: type not considered:{typename}</p>
  <Input value={JSON.stringify(value)} onChange={(e)=>onChange?.(e.target.value)}/>
</span>)

const ClassChooser:React.FC<{
  typename:string,
  value?:string,
  onChange?: (value: any) => void,
}>=({typename,value,onChange})=>{
  console.log('ClassChooser',typename,value,onChange)
  const [open,setOpen]=useState(false);
  const [where,setWhere]=useState({});
  const [id,setId]=useState<string>(value);
  return <span>
    {id && <p>{id}</p>}
    <Button type="primary" onClick={()=>setOpen(true)}>Choose {typename}</Button>
    <Modal
      open={open}
      onOk={()=>{
        id && onChange?.(id)
        setOpen(false)
      }}
      onCancel={()=>setOpen(false)}
    >
      <Filter typename={typename} setWhere={setWhere} />
      <Link to={`/create/${typename}`} style={{
        position: 'absolute',
        right: '10%',
        transform: 'translate(-50%, -50%)',
      }}>
        <Button type="dashed" icon={<PlusCircleOutlined/>}></Button>
      </Link>
      <ObjectList typename={typename} where={where} onChange={setId}/>
    </Modal>
  </span>
}

const PointInput:React.FC<{
  value?: Pos,
  onChange?: (value: any) => void,
}>=({value,onChange})=>{
  const [open,setOpen]=useState(false);
  const [pos,setPos]=useState<Pos>();
  return <span>
    {pos && <p>{JSON.stringify(pos)}</p>}
    <Button type="primary" onClick={()=>setOpen(true)}>Select a pos on map</Button>
    <Modal
      open={open}
      onCancel={()=>setOpen(false)}
      okButtonProps={{hidden:true}}
      style={{width:'80%'}}
    >
      <PosChooser setPos={(pos)=>{
        setPos(pos)
        onChange?.(pos)
        setOpen(false)
      }} initialPos={value&&{lng:value.longitude,lat:value.latitude}||WHUCSCoords} />
    </Modal>
  </span>
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
        enumValues?.map((item,index)=>(item.name))
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

const BooleanInput:FC<{
  value?: boolean,
  onChange?: (value: any) => void,
}> = ({value,onChange})=>{
  return (
        <Radio.Group name="genderGroup" defaultValue={value} onChange={v=>onChange?.(v)}>
          <Radio value={true}>true</Radio>
          <Radio value={false}>false</Radio>
        </Radio.Group>
  )
}

export type RenderInputBoxProps={
  schemaName: string,
  id?: string,
}

const RenderInputBox: React.FC<RenderInputBoxProps> = ({schemaName, id,}) => {
  const {initialState} = useModel("@@initialState");
  const schema = initialState?.clientSchema;
  const inputType=schema?.getType(`${schemaName}CreateInput`) as GraphQLInputObjectType
  const fields=inputType?.getFields()
  const type=schema?.getType(schemaName) as GraphQLObjectType
  // const fields=type.getFields()
  const unwrapList = (type:GraphQLType)=>{
    let list=false
    // console.log('unwrap',type)
    while(!(type instanceof GraphQLScalarType||type instanceof GraphQLObjectType||type instanceof GraphQLInputObjectType||type instanceof GraphQLEnumType||type instanceof GraphQLInterfaceType)){
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
  const entry=qInterface[schemaName]
  const initialValQuery=`#graphql
  query($where:${schemaName}Where) {
    ${entry}(where:$where) {
      ${inputs.map(([name,_,__,leafType])=>{
        if([GraphQLScalarType,GraphQLEnumType].some(t=>leafType instanceof t)||['Point'].includes(leafType.name))
          return name
        else if(['Period','Subject','MajorInRecord'].includes(leafType.name))
          return ''
        else
          return `${name}{_id}`
      }).join('\n')}
    }
  }`
  const {data} = useQuery(gql(initialValQuery),{variables:{where:{_id:id||''}}})
  const initialObj=data?.[entry]?.[0]
  console.log('forked from',id,initialValQuery,data,initialObj)
  const initialObjTransformed=initialObj && Object.fromEntries(
  Object.entries(initialObj)
        .filter(([k])=>inputs.find(([name,])=>name==k))
        .map(([k,v])=>{
          const cfg=inputs.find(([name,])=>name==k)
          if(!cfg)return null
          const [name,nullable,isList,leafType]=cfg
          const unflattenList=(vals:any[])=>vals.map(itemval=>({[k]:itemval}))
          if(leafType instanceof GraphQLObjectType){
            if(isList)return [k,unflattenList((v as any[]).map(vv=>vv._id))]
            else return [k,v?._id]
          } else {
            if(isList){
              console.log(k,v,cfg)
              return [k,unflattenList(v as any[])]
            }
            return [k,v]
          }
        }) as [string,any][]
  )
  console.log('initialVal',initialObjTransformed)

  const {data:forkedPost} = useQuery(gql`
query($where:PostWhere){
  posts(where:$where){
    _id
  }
}
  `,{variables:{where:{contentConnection:{node:{
    _on:{[schemaName]:{_id:id}}
  }}}}})
  const initialVal={
    ...initialObjTransformed,
    _cite:id?[{
      objtype:schemaName,
      obj:id,
      attitude:true,
    }]:[]
  }
  
  return (
  <KeepAlive>
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
      initialValues={initialVal}
      params={initialVal}
      request={(params:any) => {
        return Promise.resolve({
          data: params,
          success: true,
        })
      }}
      onFinish={async (values) => {
        console.log('form values',values);
        const inputVal=
        Object.fromEntries(
        Object.entries(values)
        .filter(([k,v])=>!['_cite','_policy'].includes(k))
        .map(([k,v])=>{
          const cfg=inputs.find(([name,])=>name==k)
          if(!cfg)return null
          const [name,nullable,isList,leafType]=cfg
          const flattenList=(vals:any[])=>vals.map(({[k]:itemval})=>itemval)
          if(leafType instanceof GraphQLObjectType){
            if(['Point'].includes(leafType.name)){
              if(isList) throw "Point should not be list"
              return [k,v[0][k]]
            } else
              return [k,{connect:{where:{node:{_id_IN:flattenList(v as any[])}}}}]
          } else if(leafType instanceof GraphQLInterfaceType){
            console.log('interface',k,v)
            const parsedval=typeof v ==='string'?JSON.parse(v):v
            return [k,{connect:{where:{node:{_id:v._id}}}}]
          } else {
            if(isList){
              console.log(k,v,cfg)
              return [k,flattenList(v as any[])]
            }
            return [k,v]
          }
        }) as [string,any][]
        )
        console.log('inputval',inputVal)
        uploadObject({
          variables:{
            input:[{
              policy: values._policy,
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
                      ...inputVal,
                      // interests: []
                    }
                  }
                }
              },
              cite: {
                connect:
                  (values._cite as any[]).map(v=>({
                    where:{
                      node:{
                        contentConnection:{
                          node:{
                            _id:v.obj
                          }
                        }
                      }
                    },
                    edge:{
                      Attitude:v.attitude
                    }
                  }))
              }
            }]
          }
        }).then((v)=>{
          message.info(`upload success! msg:${JSON.stringify(v)}`)
          // setInterval(()=>history.back(),1500)
        }).catch((r)=>{
          message.error(`upload failed! reason:${JSON.stringify(r)}`)
        })
      }}
      isKeyPressSubmit = {true}
    >
    {inputs && 
    // 根据schema自动渲染字段结构化填写控件
    inputs.map((item,index)=>{
    // schemaFields && schemaFields.map((item, index) => {
      // const nowItem = {...item} as { -readonly [K in keyof typeof item]: typeof item[K]};
      const [name,nullable,isList,leafType]=item
      if(leafType instanceof GraphQLScalarType) {
        if(leafType.name == "Boolean") {
          const item=(
            <ProFormRadio.Group
            name={name}
            label={name}
            options={[
              {
                label:'true',
                value:true,
              },{
                label:'false',
                value:false,
              }
            ]}
            />
          )
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
                {item}
              </ProFormList>
            )
          }
          else {
            return (
              item
            )
          }
        }
        else if(leafType.name == "Int"){
          const item=name=="rating" ? <ProFormRate name={name} label={name}/>
          : (<ProFormDigit name={name} label={name}/>)
          if(isList){
            return <ProFormList
                name={name}
                label={name}
                creatorButtonProps={{
                  position: 'bottom',
                  creatorButtonText: '新增一行',
                }}
                min={1}
            >
              {item}
            </ProFormList>
          }
          return item
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
                  creatorButtonProps={{
                    position: 'bottom',
                    creatorButtonText: '新增一行',
                  }}
                  // creatorRecord={{
                  //   [name]: '请输入',
                  // }}
                  min={1}
              >
                <ProFormText
                  name={name}
                  // label={name}
                  placeholder="请输入"
                />
              </ProFormList>
            )
          }
          else {
            if(name=='content')
              return <ProFormTextArea
                name={name}
                label={name}
                placeholder="请输入"
              />
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
        const dispatchInput=()=>{
          switch(leafType.name){
            case 'Point':
              return <PointInput />
            case 'Period':
            case 'MajorInRecord':
            case 'AbortRecord':
              return <RawInput typename={leafType.name}/>
            default:
              return <ClassChooser typename={leafType.name}/>
          }
        }
        const itemInput =
        <ProForm.Item name={name} label={isList?undefined:name}>
          {dispatchInput()}
        </ProForm.Item>
      return <ProFormList name={name} label={name}
        creatorButtonProps={{
          position: 'bottom',
          creatorButtonText: '新增一行',
        }}
        min={0}
        max={isList?10:1}
      >
        {itemInput}
      </ProFormList>
      }
      else{
        return (
          <ProForm.Item name={name} label={name}>
            <RawInput typename={leafType.name}/>
          </ProForm.Item>
        )
      }

      })
    }
    <ProCard
      bordered
      title=''
    >
      <ProFormGroup>
        <ProFormSelect name='_policy' label='可见性'
        options={schema && (schema.getType('VisibilityPolicy') as GraphQLEnumType).getValues().map(v=>v.name)}
        initialValue={'AllUsers'}
        />
      </ProFormGroup>
      <ProFormList name='_cite' label='引用'>
        <ProFormGroup>
          <ProFormSelect name='objtype' label='类型'
          options={schema && schema.getPossibleTypes(schema.getType('Entity') as GraphQLInterfaceType).map(t=>t.name) }
          />
          <ProFormDependency name={['objtype']}>
            {({objtype})=>(
              <ProForm.Item
              name='obj'
              label='被引用对象'
              >
                <ClassChooser typename={objtype}/>
              </ProForm.Item>
            )}
          </ProFormDependency>
          <ProFormRadio.Group
            name='attitude'
            label='引用类型'
            options={[
              {
                label:'正面引用',
                value:true,
              },{
                label:'负面引用',
                value:false,
              }
            ]}
            />
        </ProFormGroup>
      </ProFormList>
    </ProCard>
    </ProForm>
  </KeepAlive>
  )
}

export default RenderInputBox;