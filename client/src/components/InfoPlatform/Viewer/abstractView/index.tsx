import { gql, useQuery } from "@apollo/client"


export const abstractFragment = Object.fromEntries
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
    Teacher: `#graphql
    fragment $1 on $2{
        name
        title
        gender
    }
    `,
}).map(([k,v])=>[k,v.replace('$1',`${k}Abstract`).replace('$2',k)])
.map(([k,v])=>[k,gql(v)])
)
export const qInterface:{[k:string]:string} = {
    Class: 'classes',
    Article: 'articles',
    Duty: 'duties',
    Teacher: 'teachers'
}
const elide=(s:string,mx:number)=>{
    return s.length>mx?s.slice(0,mx-1)+'...':s
}
export const abstractTitle = (type:string,data:any)=>{
    switch(type){
        case 'Article':
            return elide(data.content as string,30)
        default:
            return JSON.stringify(data)
    }
}
type AbstractViewerProps ={
    type:string,
    data?:any,
}
export const AbstractViewer:React.FC<AbstractViewerProps>=({type,data})=>{
    if(!data)return <p>null</p>
    switch(type){
        default:
            return <p>unsupported {'<'}{type}{'>'}, fallback to plaintext: {abstractTitle(type,data)} </p>
    }
}
export const AbstractIdViewer:React.FC<{
    type:string,
    id:string,
    render?:React.FC<AbstractViewerProps>
}>=({type,id,render})=>{
    console.log('AbstractIdViewer',type,id)
    const frag=abstractFragment[type]
    console.log(frag)
    const entry=qInterface[type]
    if(!frag) return <p>unsupported object of type {type}, no fragment</p>
    const {data} = useQuery(gql`
    ${frag}
    query ${entry}Query($where:${type}Where){
        ${entry}(where:$where) {
            _id
            ...${type}Abstract
        }
    }
    `,{variables:{where:{
        _id:id
    }}})
    const obj=data?.[entry][0]
    if(render)
        return render({type:type,data:obj})
    return <AbstractViewer type={type} data={obj}/>
}