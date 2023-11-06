import { DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { gql, useQuery } from '@apollo/client';
import { useModel } from '@umijs/max';
import { Button, Card, Cascader, Col, Collapse, CollapseProps, Input, InputNumber, InputRef, List, Radio, RefSelectProps, Row, Select, Space, Tag, theme } from 'antd';
import { GraphQLEnumType, GraphQLInputField, GraphQLInputObjectType, GraphQLInputType, GraphQLScalarType } from 'graphql';
import React, { Key, Ref, createRef, useRef, useState } from 'react';

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
    setWhere:(w:any)=>void,
}
class NodeInput{
    constructor(field,label,type){
        this.field=field
        this.label=label
        this.type=type
        this.subs=[]
        this.ref=createRef()
    }
    field?:GraphQLInputField;
    label:string='';
    type:string='String';
    subs:any[];
    ref:Ref<any>;
}
const AND=new NodeInput(undefined,'AND','AND')
const OR=new NodeInput(undefined,'OR','OR')
const SelectNode:React.FC<{availNodes:NodeInput[],returnVal:(val:NodeInput)=>void}> = ({availNodes,returnVal}) => {
    availNodes = [
        ...availNodes,
        AND,
        OR,
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

type AST = NodeInput;
const FilterNode: React.FC<{
    filterAST:AST,
    setFilterAST:(v:NodeInput)=>void,
    availNodes:any[]
}> = ({filterAST,setFilterAST,availNodes})=>{
    console.log('FilterNode',filterAST,setFilterAST)
    // 检查是否现有的节点都选择/填写完毕
    const checkExistingNodesFilled = ()=>true
    return <Card>
        <Col>
            {filterAST.type}
        {filterAST.subs.map((node,index)=>{
            if(node=='')
            // if(!(node instanceof NodeInput))
                return <SelectNode key={index}
                availNodes={availNodes}
                returnVal={(node:NodeInput)=>{
                    console.log('selected',node,{op:filterAST.type,conds:[...filterAST.subs.slice(0,-1),node]})
                    setFilterAST({
                        ...filterAST,
                        subs:[...filterAST.subs.slice(0,-1),node]
                    })
                    console.log('selected',filterAST)
                }} />
            node as NodeInput
            if(['AND','OR'].includes(node.type)){
                return <FilterNode
                    filterAST={node}
                    setFilterAST={
                        val=>{
                            const newval:NodeInput={
                                ...filterAST,
                                subs: filterAST.subs.map((v,i)=>i==index?val:v)
                            }
                            console.log('my setFilterAST',newval)
                            setFilterAST(newval)
                        }
                    }
                    availNodes={availNodes}
                />
            }
            const RenderInput = (type:string,ref:Ref<any>,field:GraphQLInputField)=>{
                switch(type){
                    case 'String': return <Input ref={ref}></Input>;
                    case 'Int': return <InputNumber onChange={val=>ref.current=val}/>
                    case 'Boolean': return <Row>
                        <Radio.Group onChange={ev=>{console.log(ev);ref.current=ev.target.value}}>
                            <Radio value={false}>{'true'}</Radio>
                            <Radio value={true}>{'false'}</Radio>
                        </Radio.Group>
                    </Row>
                    default: {
                        const vals=(node.field.type as GraphQLEnumType).getValues()
                        return <Select
                            options={vals}
                            defaultValue={vals[0]}
                            onChange={(v,o)=>ref.current=v}
                        />
                    }
                }
            }
            return (
                <Space.Compact>
                    {node.label}
                    {RenderInput(node.type,node.ref,node.field)}
                    <Button
                        icon={<DeleteOutlined/>}
                        onClick={()=>setFilterAST({
                            ...filterAST,
                            subs:filterAST.subs.filter((_,i)=>i!=index)
                        })}
                    />
                </Space.Compact>
            )
        }).map(elem => <Col span={3}>{elem}</Col>)}
        <Button
            onClick={()=>{
                console.log('submit',filterAST)
                setFilterAST({
                    ...filterAST,
                    subs:[...filterAST.subs,'']
                })
            }}
            icon={<PlusOutlined />}
            disabled={!checkExistingNodesFilled()}
        ></Button>
        </Col>
    </Card>
}

const Filter: React.FC<FilterProps> = ({typename="Teacher",setWhere}) => {
    console.log('Filter',typename)
    const {initialState} = useModel("@@initialState");
    console.log(initialState?.clientSchema)
    const schema = initialState?.clientSchema
    const whereType = schema?.getType(`${typename}Where`) as GraphQLInputObjectType
    console.log(whereType)
    const avaiNodes = Object.entries(whereType.getFields())
    .filter(([str,field])=>field.type instanceof GraphQLScalarType || field.type instanceof GraphQLEnumType)
    .filter(([str,field])=>{
        if(field.type instanceof GraphQLEnumType) return !field.name.endsWith('IN')
        const type = field.type as GraphQLScalarType
        if(type.name=='String')
            return field.name.endsWith('CONTAINS')
        return ['Boolean','Int',].includes(type.name)
    })
    // console.log('where:',whereType,avaiNodes)
    
    const [filterAST,setFilterAST] = useState<AST>(AND)
    const availNodes=avaiNodes.map(n=>new NodeInput(n[1],n[1].name.replace('_CONTAINS',''),(n[1].type as GraphQLScalarType).name) )
    const traverse=(node:AST)=>{
        console.log('traverse',node,['AND','OR'].includes(node.type))
        if(['AND','OR'].includes(node.type))
            return {[node.type]: node.subs.length?
            node.subs.map((n,i)=>traverse(n))
            : null
        }
        const extractVal=(nd)=>{
            switch(nd.type){
                case 'String': return (nd.ref.current as unknown as InputRef).input?.value
                default: return nd.ref.current
            }
        }
        return {[(node.field as GraphQLInputField).name]: extractVal(node)}
    }
    return (
        <Col>
            <h1>Filter</h1>
            <FilterNode
                filterAST={filterAST} setFilterAST={setFilterAST}
                availNodes={availNodes}
            />
            <Button
                type='primary'
                icon={<SearchOutlined/>}
                onClick={()=>{
                    const wherepattern=traverse(filterAST)
                    console.log(wherepattern)
                    setWhere(wherepattern)
                }}
            >
                Search
            </Button>
        </Col>
    )
};

export default Filter;
