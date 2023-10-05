import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";
import { config } from 'dotenv';
config();

const typeDefs = `#graphql
    interface Person {
        name: String!
        birth: Date
        gender: Boolean
        id: Int!
    }
    type Student implements Person{
        classes: [Class!]! @relationship(type:"Takes", direction:OUT)

        name: String!
        birth: Date
        gender: Boolean
        id: Int! @unique
    }
    type Teacher {
        title: String
        classes: [Class!]! @relationship(type:"Teaches", direction:OUT)

        name: String!
        birth: Date
        gender: Boolean
        id: Int! @unique
    }
    type Period {
        weekday: Int!
        start: Int!
        end: Int!
        weekstart: Int!
        weekend: Int!
        weekInterval: Int!
    }
    type College {
        name: String!
        courses: [Course!]! @relationship(type:"offeredBy",direction:IN)
    }
    enum CourseType {
        BASIC
        INNOVATIVE
    }
    type Course {
        id: String! @unique
        name: String!
        type: CourseType
        college: [College!]! @relationship(type:"offeredBy",direction:OUT)
        prerequisite: [Course!]! @relationship(type:"REQUIRES",direction:OUT)
        advanceCourses: [Course!]! @relationship(type:"REQUIRES",direction:IN)
    }
    type Class {
        course: Course!
        teacher: Teacher!
        position: POI
        schedule: [Period!]! @relationship(type:"HAS_PERIOD",direction:OUT)
    }
    type POI {  # place of interest
        id: ID! @id @unique
        name: String!
        loc: Point
        subPOIs: [POI!]! @relationship(type:"locatedIn",direction:IN)
        parentPOI: POI @relationship(type:"locatedIn",direction:OUT)
    }
`;

async function start(){

    
    const driver = neo4j.driver(
        process.env.NEO4J_URI,
        neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
        );

    const { keys, records, summary } = await driver.executeQuery("match (_) return count(_)")
    console.info(keys,records,summary)
    
    const neoSchema = new Neo4jGraphQL({ typeDefs, driver });
    
    const server = new ApolloServer({
        schema: await neoSchema.getSchema(),
    });

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