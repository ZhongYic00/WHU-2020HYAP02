import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { gql, useQuery } from '@apollo/client';
import { useModel } from '@umijs/max';
import { Button, Card, Cascader, Col, Collapse, CollapseProps, Input, InputNumber, List, Row, Select, Space, Tag, theme } from 'antd';
import { GraphQLInputField, GraphQLInputObjectType, GraphQLInputType, GraphQLScalarType } from 'graphql';
import React, { Key, useState } from 'react';

const basicField=(Object.entries({
  name: {
    text: '姓名'
  },
  gender: {
    render: (t:boolean)=>t?'女':'男',
    text: '性别'
  },
  title: {
    text: '职称'
  }
}))

const date2str = (d:{year:string,month:string,day:string}) => `${d.year}-${d.month}-${d.day}`
export type FilterProps = {
    typename?:string,
}
class NodeInput{
    constructor(field,label,type){
        this.field=field
        this.label=label
        this.type=type
    }
    field?:GraphQLInputField;
    label:string='';
    type:string='String';
}

const SelectNode:React.FC<{availNodes:NodeInput[],returnVal:(val:NodeInput)=>void}> = ({availNodes,returnVal}) => {
    availNodes = [
        ...availNodes,
        new NodeInput(undefined,'AND','OP'),
        new NodeInput(undefined,'OR','OP'),
    ]
    const options=availNodes.map(val=>({
            value: val.label,
            label: val.label
        }))
    console.log(options)
    return <Cascader
        options={options}
        onChange={(value)=>{
            console.log(value[0])
            returnVal(availNodes.find(val=>val.label==(value[0] as unknown as string)))
        }}
    ></Cascader>
}

const Filter: React.FC<FilterProps> = ({typename="Student"}) => {
    const {initialState} = useModel("@@initialState");
    console.log(initialState?.clientSchema)
    const schema = initialState?.clientSchema
    const whereType = schema?.getType(`${typename}Where`) as GraphQLInputObjectType
    const avaiNodes = Object.entries(whereType.getFields())
    .filter(([str,field])=>field.type instanceof GraphQLScalarType)
    .filter(([str,field])=>{
        const type = field.type as GraphQLScalarType
        if(type.name=='String')
            return field.name.endsWith('CONTAINS')
        return type.name in ['Boolean','Int',]
    })
    console.log('where:',whereType,avaiNodes)
    
    const [filterAST,setFilterAST] = useState<any[]>([])
    // 检查是否现有的节点都选择/填写完毕
    const checkExistingNodesFilled = ()=>true
    return (
        <Col>
            <h1>Filter</h1>
            <Row
                gutter={2}
            >
                {filterAST.map((node,index)=>{
                    if(!(node instanceof NodeInput))
                        return <SelectNode key={index}
                        availNodes={
                            avaiNodes.map(n=>new NodeInput(n[1],n[1].name.replace('_CONTAINS',''),(n[1].type as GraphQLScalarType).name) )
                        }
                        returnVal={(node:NodeInput)=>{
                            console.log('selected',node)
                            setFilterAST([...filterAST.slice(0,-1),node])
                            console.log('selected',filterAST)
                        }} />
                    node as NodeInput
                    if(node.type=='OP'){
                        return <p>Unsupported</p>
                    }
                    const RenderInput = (type:string)=>{
                        switch(type){
                            case 'String': return <Input></Input>;
                            case 'Int': return <InputNumber/>
                        }
                    }
                    return (
                        <Space.Compact>
                            {node.label}
                            {RenderInput(node.type)}
                            <Button
                                icon={<DeleteOutlined/>}
                                onClick={()=>setFilterAST(cur=>cur.filter((_,i)=>i!=index))}
                            />
                        </Space.Compact>
                    )
                }).map(elem => <Col span={3}>{elem}</Col>)}
                <Button
                    onClick={()=>{
                        console.log('submit',filterAST)
                        setFilterAST([...filterAST,''])
                    }}
                    icon={<PlusOutlined />}
                    disabled={!checkExistingNodesFilled()}
                ></Button>
            </Row>
        </Col>
    )
};

export default Filter;
