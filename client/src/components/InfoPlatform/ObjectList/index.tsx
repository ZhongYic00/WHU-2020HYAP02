import { DocumentNode, gql, useQuery } from "@apollo/client"
import { List } from "antd"
import { ProList } from '@ant-design/pro-components'
import { useState } from "react"
import { abstractFragment, qInterface } from "../Viewer/abstractView"


export const ObjectList:React.FC<{
    typename:string,
    where:any,
    onChange:(id:string)=>void,
}> = ({typename,where,onChange})=>{
    const frag=abstractFragment[typename] as DocumentNode
    console.log(frag)
    const entry=qInterface[typename]
    // const qstrObjList=
    const queryObjList = gql
    `#graphql
    ${frag}
    query ${entry}Query($where:${typename}Where){
        ${entry}(where:$where) {
            _id
            ...${typename}Abstract
        }
    }
    `
    console.log(queryObjList,'where',where)
    const {data} = useQuery(queryObjList,{
        variables:{where}
    })
    console.log(data)

    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const rowSelection = {
      selectedRowKeys,
      // 只保留一项，使其成为单选
      onChange: (keys: string[]) => {
        setSelectedRowKeys([keys[keys.length-1]])
        onChange(keys[keys.length-1])
    },
    };
  

    return <>
    <p>{typename} list</p>
    {data && <ProList
        dataSource={
            data[entry].map((item,k)=>{
                return {title:JSON.stringify(item),key:item._id}
            })
        }
        metas={{
            title:{
                dataIndex:'title'
            }
        }}
        rowKey='key'
        rowSelection={rowSelection}
    >
    </ProList>
    }
    </>
}

export function firstUpperCase(str:string){
    return str.replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
}
export function titleCase(str:string){
    return firstUpperCase(str.toLowerCase());
}
export function pluralize(word:string){
    const special:{[key:string]:string}={
        class:'classes',
        duty:'duties',
    }
    return special[word.toLowerCase()] || word+'s'
}
