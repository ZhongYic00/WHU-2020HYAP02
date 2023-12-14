import { EnvironmentOutlined, InfoOutlined, TeamOutlined } from "@ant-design/icons"
import { gql, useQuery } from "@apollo/client"
import { Card } from "antd"
import Meta from "antd/es/card/Meta"


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
            _id
            name
        }
        teacher {
            _id
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
    Post: `#graphql
    fragment $1 on $2{
        user {
            nickname
        }
        content {
            __typename
        }
    }
    `,
    POI: `#graphql
    fragment $1 on $2{
        name
        loc {
            longitude
            latitude
        }
    }
    `,
    DepartmentCourse: `#graphql
    fragment $1 on $2{
        name
        college {
            name
        }
        classesAggregate {
            count
        }
    }
    `,
    GeneralCourse: `#graphql
    fragment $1 on $2{
        name
        college {
            name
        }
        classesAggregate {
            count
        }
    }
    `,
}).map(([k,v])=>[k,v.replace('$1',`${k}Abstract`).replace('$2',k)])
.map(([k,v])=>[k,gql(v)])
)
export const qInterface:{[k:string]:string} = {
    Class: 'classes',
    Article: 'articles',
    Duty: 'duties',
    Teacher: 'teachers',
    Post: 'posts',
    POI: 'pois',
    DepartmentCourse: 'departmentCourses',
    GeneralCourse: 'generalCourses',
}
const elide=(s:string,mx:number)=>{
    return s.length>mx?s.slice(0,mx-1)+'...':s
}
export const abstractTitle = (type:string,data:any)=>{
    switch(type){
        case 'Article':
            return elide(data.content as string,30)
        case 'Post':
            return `${data?.content.__typename} by ${data?.user?.nickname}`
        case 'POI':
            return `${data?.name}`
        case 'Class':
            return `${data?.course.name} by ${data?.teacher?.[0]?.name}et.al`
        case 'Teacher':
            return `${data?.title}. ${data.name}`
        case 'DepartmentCourse':
            return `${data?.name}`
        case 'GeneralCourse':
            return `${data?.name}`
        case 'Duty':
            return `${data?.depart.name}, ${data?.name}`
        default:
            return JSON.stringify(data)
    }
}
export const iconFor=(type:string)=>{
    switch(type){
        case 'POI': return <EnvironmentOutlined/>
        case 'Teacher': return <TeamOutlined/>
        default: return <InfoOutlined/>
    }
}
type AbstractViewerProps ={
    type:string,
    data?:any,
    jumpOnclick?:boolean,
    compact?:boolean,
}
export const AbstractViewer:React.FC<AbstractViewerProps>=({type,data,jumpOnclick=false,compact=false})=>{
    if(!data)return <p>null</p>
    switch(type){
        case 'Article':
            return <Card>{abstractTitle(type,data)}</Card>
        case 'POI':
            return <Card>
                <Meta
                avatar={<EnvironmentOutlined />} title={abstractTitle(type,data)}
                description={`${data.loc.longitude}°N, ${data.loc.latitude}°S`}/>
            </Card>
        case 'Class':
            return <Card>
                <Meta
                avatar={iconFor(type)} title={abstractTitle(type,data)}
                description={<p>
                    教务系统课头号：{data.id}
                    <br/>
                    授课老师({data?.teacher.length})：{data.teacher.map(t=>t.name).join(', ')}
                </p>}/>
            </Card>
        case 'Teacher':
            return <Card cover={
                compact?null:<img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />}>
                <Meta
                avatar={iconFor(type)} title={abstractTitle(type,data)}
                description={<p>
                    性别：{!data.gender?'男':'女'}<br/>
                    职称：{data.title}
                </p>}/>
            </Card>
        case 'DepartmentCourse':
            return <Card>
                <Meta
                avatar={iconFor(type)} title={abstractTitle(type,data)}
                description={<p>
                    开课学院 {data.college.name}
                </p>}/>
                <p>开设课头 {data.classesAggregate.count} 个</p>
            </Card>
        case 'GeneralCourse':
            return <Card>
                <Meta
                avatar={iconFor(type)} title={abstractTitle(type,data)}
                description={<p>
                    开课学院 ${data.college.name}
                </p>}/>
                <p>开设课头 {data.classesAggregate.count} 个</p>
            </Card>
        default:
            return <Card>
                <Meta
                avatar={iconFor(type)}
                title={abstractTitle(type,data)}
                description={<p>unsupported {'<'}{type}{'>'}, fallback to plaintext {JSON.stringify(data)}</p>}
                />
            </Card>
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