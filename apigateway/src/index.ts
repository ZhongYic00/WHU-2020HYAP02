import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Neo4jGraphQL } from "@neo4j/graphql";
import { addMocksToSchema } from '@graphql-tools/mock';
import { makeExecutableSchema } from '@graphql-tools/schema'
import neo4j, { Date as neoDate,graph } from "neo4j-driver";
import { config } from 'dotenv';
import { mocks } from './mocks';
import {graphqls2s} from 'graphql-s2s';
config();
const toCypherRequire = s => {
    return s
    .replaceAll('\#graphql\n','')
    .replaceAll('\n',',')
}
const toFilter = s=>
    s.replaceAll('\#graphql','')
    .replaceAll('\n','')
    .replaceAll(' ','')

const majorReqStr = toCypherRequire(`#graphql
studyRecords {
    ... on MajorInRecord {
        date
        isAbort
        major
        subject {
            name
        }
    }
}
`)
const postClassmatesFilter = toFilter(`#graphql
{where:{
AND: [{
    node:{
      user: {
        realpersonConnection: {
          node:{
            _on:{
              Student:{
                adminClass: {
                  students_SOME: {
                    name: "zyc"
                  }
                }
              }
            }
          }
        }
      }
    }
    },{
      node: {
        policy: "Classmates"
      }
    }]
}}`)
const preDefs = `#graphql
    directive @customResolver(requires: String!) on FIELD_DEFINITION
    directive @relationship(type: String!, direction:Boolean!) on FIELD_DEFINITION

    scalar Point
    scalar Date
`
const typeDefs = graphqls2s.transpileSchema(`#graphql
    "Generic independent entity type"
    interface Entity {
        "system internal id"
        _id: ID @id
    }
    "Generic person type"
    interface PersonBase implements Entity inherits Entity {
        name: String!
        birth: Date
        age: Int @customResolver(requires: "birth")
        "biogender, 0 for male, 1 for female"
        gender: Boolean
        "stu/faculty ID"
        id: String!
    }
    enum VisibilityPolicy {
        AllUsers,
        Classmates,
        Schoolmates,
        Students,
        TeacherAndStudents
    }
    type Article implements Entity inherits Entity {
        content: String!
    }
    interface Citation @relationshipProperties {
        "True: to complement; False: to correct"
        Attitude:Boolean!
        createdAt: DateTime! @timestamp(operations: [CREATE])
    }

    type Identity implements Entity inherits Entity {
        nickname: String!
        realperson: PersonBase! @relationship(type:"Owner", direction:OUT)
        votes:[Post!]! @relationship(type: "VoteOn", direction: OUT, properties: "Citation")
    }

    type Subject {
        name: String! @unique
        category: String!
        "学制"
        schoolingYear: Int!
    }
    "修习某专业"
    type MajorInRecord {
        date: Date!
        subject: Subject! @relationship(type:"MajorIn", direction:OUT)
        major: Boolean!
        "是否为中止"
        isAbort: Boolean!
    }
    type RepetitionRecord {
        date: Date!
    }
    union StudyRecord = MajorInRecord | RepetitionRecord

    "行政班 administrative class"
    type AdminClass implements Entity inherits Entity {
        "literal name"
        name: String!
        students: [Student!]! @relationship(type:"BelongsTo", direction:IN)
        head: Teacher! @relationship(type:"HeadOf", direction:IN)
    }
    type Student implements PersonBase inherits PersonBase {
        "student id"
        id: String! @unique
        "classes the student has taken"
        classes: [Class!]! @relationship(type:"Takes", direction:OUT)
        "行政班"
        adminClass: AdminClass! @relationship(type:"BelongsTo",direction:OUT)
        "学业变更记录"
        studyRecords: [StudyRecord!]! @relationship(type:"HasRecord", direction:OUT)

        major: Subject! @customResolver(requires: "${majorReqStr}")
        
    }
    enum ProfessionalTitle{
        "Full Professor"
        Prof,
        "Associate Professor"
        AssocProf,
        "Assistant Professor"
        AssisProf,
        Lecturer,
    }
    interface FacultyBase inherits PersonBase {
        "职务"
        duties: [Duty!]! @relationship(type:"OnBusiness", direction:OUT)
        # duties: [String!]!
    }
    type Faculty implements FacultyBase & PersonBase inherits FacultyBase {
        "faculty id"
        id: String! @unique
    }
    "研究团队"
    type ResearchTeam implements Entity inherits Entity {
        name: String!
        members: [PersonBase!]! @relationship(type:"MemberOf", direction:IN)
    }
    type Teacher implements FacultyBase & PersonBase inherits Faculty {
        "职称"
        title: ProfessionalTitle
        "classes the teacher teaches"
        classes: [Class!]! @relationship(type:"Teaches", direction:OUT)
        "所指导班级"
        adminClasses: [AdminClass!]! @relationship(type:"HeadOf", direction:OUT)

        "research interests"
        interests: [String!]!
        "research teams"
        teams: [ResearchTeam!]! @relationship(type:"MemberOf", direction:OUT)
    }
    type Duty {
        name: String!
        depart: Department! @relationship(type:"DutyAt", direction:OUT)
    }
    type Department implements Entity inherits Entity {
        name: String!
        parent: Department @relationship(type:"SubDepartment", direction:IN)
        subDeparts: Department @relationship(type:"SubDepartment", direction:OUT)
    }
    "Repetition unit of each class"
    type Period {
        "On which day"
        weekday: Int!
        "Start block(节)"
        start: Int!
        "End block"
        end: Int!
        "Start semester week"
        weekstart: Int!
        "End semester week"
        weekend: Int!
        weekInterval: Int!
    }
    type College implements Entity inherits Entity {
        name: String! @unique
        courses: [Course!]! @relationship(type:"offeredBy",direction:IN)
    }
    "通识课程类型"
    enum HASSType {
        Humanity,
        Art,
        Science,
        SocialScience,
    }
    interface Course implements Entity inherits Entity {
        "ID in whu-jwgl"
        id: String!
        name: String!
        "开课学院"
        college: [College!]! @relationship(type:"offeredBy",direction:OUT)
        prerequisite: [Course!]! @relationship(type:"Requires",direction:OUT)
        advanceCourses: [Course!]! @relationship(type:"Requires",direction:IN)
        classes: [Class!]! @relationship(type:"ClassOf",direction:IN)
    }
    "专业课"
    type DepartmentCourse implements Course inherits Course {
        id: String! @unique
    }
    "公共课"
    type GeneralCourse implements Course inherits Course {
        id: String! @unique
    }
    "通识课"
    type LiberalCourse implements Course inherits Course {
        id: String! @unique
        type: HASSType
    }
    "体育课"
    type PECourse implements Course inherits Course {
        id: String! @unique
    }
    union CourseKinds = DepartmentCourse | GeneralCourse | LiberalCourse | PECourse
    union PersonUnion = Student | Faculty | Teacher
    type Class implements Entity inherits Entity {
        "ID in whu-jwgl"
        id: String! @unique
        course: Course! @relationship(type:"ClassOf", direction:OUT)
        teacher: [Teacher!]! @relationship(type:"Teaches", direction:IN)
        position: POI
        schedule: [Period!]! @relationship(type:"ClassPeriod",direction:OUT)
    }
    # place of information
    type POI implements Entity inherits Entity {
        name: String!
        # GPS pos
        loc: Point
        subPOIs: [POI!]! @relationship(type:"locatedIn",direction:IN)
        parentPOI: POI @relationship(type:"locatedIn",direction:OUT)
    }
    type Review implements Entity inherits Article {
        rating: Int!
    }
`) + 
// graphql-s2s parsing cannot solve following statements
`#graphql
type Query{
        courses: [CourseKinds!] @cypher(
            statement:"""
MATCH (n)
WHERE ANY(label IN labels(n) WHERE label IN ['GeneralCourse', 'DepartmentCourse', 'PECourse'])
RETURN n""",
            columnName:"n"
        )
        people: [PersonUnion!] @cypher(
            statement:"""
MATCH (n)
WHERE ANY(label IN labels(n) WHERE label IN ['Student', 'Teacher', 'Faculty'])
RETURN n""",
            columnName:"n"
        )
    }
    "Generic post type, info platform UGC unit"
    type Post implements Entity
    @authorization(filter:[
        {where:{node:{policy:"AllUsers"}}},
        ${postClassmatesFilter},
    ])
    {
        user: Identity! @relationship(type: "CreatedBy",direction:OUT)
        "Post creation time"
        createdAt: DateTime! @timestamp(operations: [CREATE])
        content: Entity! @relationship(type: "PostContent", direction:OUT)
        cite:[Post!]! @relationship(type: "citeOther", direction: OUT, properties: "Citation")
        policy: VisibilityPolicy!
        likes: Int! @cypher(
            statement:"""
match (this)<-[v:VoteOn]-(p:Identity)
where v.Attitude=true
return count(p) as likes
            """,
            columnName:"likes"
        )
        dislikes: Int! @cypher(
            statement:"""
match (this)<-[v:VoteOn]-(p:Identity)
where v.Attitude=false
return count(p) as dislikes
            """,
            columnName:"dislikes"
        )
        _id: ID @id
    }
`
;

import fs from 'fs'
import { printSchema, validate, validateSchema } from 'graphql';
fs.writeFileSync('schema.graphql',typeDefs)

const ageResolver = (source:{birth:neoDate}) => {
    const now=new Date()
    return now.getFullYear()-source.birth.year.toInt()
}
const resolvers = {
    Faculty: {
        age: ageResolver
    },
    Teacher: {
        age: ageResolver,
    },
    Student: {
        age: ageResolver,
        major: (node:{studyRecords:[{date:neoDate,major:boolean,isAbort:boolean,subject:any}]})=>{
            console.log(node.studyRecords)
            const [record]=node.studyRecords
            ?.filter(_=>_.major)
            ?.sort((a,b)=> a.date.toStandardDate()<b.date.toStandardDate()?-1:1 )
            .slice(-1)
            console.log(record)
            if(record.isAbort) throw "MajorInRecord invalid!"
            return record.subject
        }
    },
    Query: { 
        // validPosts: (_, __, context) => { 
        //     const allPosts = [] //"get the data of all posts"
        //     const validPosts = allPosts.filter(post => post.location && post.course); 
        //     return validPosts; 
        // }, 
        // postsSortedByScoreAndTime: (_, __, context) => { 
        //     const allPosts = [] //"get the data of all posts"
        //     const validPosts = allPosts.filter(post => post.location && post.course); 
        //     const sortedPosts = validPosts.sort((a, b) => { 
        //         const scoreComparison = (a.likes - a.dislikes) - (b.likes - b.dislikes);  
        //         if (scoreComparison === 0) { 
        //             // return new Date(b.createdAt) - new Date(a.createdAt); 
        //         } 
        //         return scoreComparison; 
        //     }); 
        //     return sortedPosts; 
        // } 
    }
}

const _parseSchemaObjToString = (comments, type, name, _implements, blockProps, extend=false, directive) =>
	[
		`${comments && comments != '' ? `\n${comments}` : ''}`,
		`${extend ? 'extend ' : ''}${type.toLowerCase()} ${name.replace('!', '')}${_implements && _implements.length > 0 ? ` implements ${_implements.join(', ')}` : ''} ${blockProps.some(x => x) ? `${directive ? ` '' ` : ''}{`: ''} `,
		blockProps.map(prop => `    ${prop.comments != '' ? `${prop.comments}\n    ` : ''}${prop.value}`).join('\n'),
		blockProps.some(x => x) ? '}': ''
	].filter(x => x).join('\n')


const removeConstraint=(schema:string)=>{
    const rt=schema.replaceAll('@unique','',).replaceAll('@id','')
    // console.log('rt=',rt)
    return rt
}

async function start(){

    
    const driver = neo4j.driver(
        process.env.NEO4J_URI,
        neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
        );

    const { keys, records, summary } = await driver.executeQuery("match (_) return count(_)")
    // console.info(keys,records,summary)
    
    const neoSchema = new Neo4jGraphQL({
        typeDefs,
        driver,
        resolvers
    });
    
    const server = new ApolloServer({
        schema: await neoSchema.getSchema(),
        // schema: addMocksToSchema({
            //     schema: makeExecutableSchema({
                //         typeDefs: printSchema(await neoSchema.getSchema())
        //     }),
        //     mocks: mocks
        // })
    });
    neoSchema.assertIndexesAndConstraints({ options: { create: true }});

    const { url } = await startStandaloneServer(server, {
        context: async ({ req }) => ({ req }),
        listen: { port: 4000 },
    });

    console.log(`🚀 Server ready at ${url}`);
}
start()
.catch((r)=>{
    console.error(
        "cannot start server",r)
})