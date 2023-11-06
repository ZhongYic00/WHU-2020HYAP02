import { DocumentNode, gql, useQuery } from "@apollo/client"
import { List } from "antd"
import { ProList } from '@ant-design/pro-components'
import { useState } from "react"


const abstractFragment = Object.fromEntries
(Object.entries({
    Article: `#graphql
    fragment $1 on $2{
        content
    }
    `,
    Class: `#graphql
    fragment $1 on $2{
        id
        course {
            name
        }
        teacher {
            name
        }
    }
    `,
    Duty: `#graphql
    fragment $1 on $2{
        name
        depart {
            name
        }
    }
    `,
}).map(([k,v])=>[k,v.replace('$1',`${k}Abstract`).replace('$2',k)])
.map(([k,v])=>[k,gql(v)])
)
const qInterface = {
    Class: 'classes',
    Article: 'articles',
    Duty: 'duties',
}

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