import { Point, Date as neoDate} from "neo4j-driver";

export const mocks = {
    Student: ()=>({
        name: ()=> 'zyc',
        gender: ()=> false,
        id: ()=> '2020302192187',
        birth: ()=> new neoDate(2000,1,1),
        age: ()=> 21,
        studyRecords: ()=>([...new Array(3)])
    }),
    MajorInRecord: ()=>({
        date: ()=> new neoDate(2020,9,1),
        subject: ()=> ({
            name: '计算机科学与技术（弘毅班）',
            category: '计算机科学与技术',
            schoolingYear: 4,
        }),
        major: ()=> true,
        isAbort: ()=> false,
    }),
    RepetitionRecord: ()=>({
        date: ()=> new neoDate(2021,6,30),
    }),
    Date: ()=> new neoDate(1926,8,17),
    Teacher: ()=>({
        name: ()=> '蔡朝晖',
        gender: ()=> true,
        id: ()=> '2020302192187',
        birth: ()=> new neoDate(1970,1,1),
        age: ()=> 55,
        title: ()=>'AssocProf'
    }),
    Department: ()=>({
        name: ()=>'计算机系',
        parent: ()=>({
            name: '计算机学院',
            parent: null,
            subDeparts: null,
        }),
        subDeparts: null,
    }),
    Duty: ()=>({
        name: ()=> '主任',
    }),
    College: ()=>({
        name: '计算机学院',
    }),
    DepartmentCourse: ()=>({
        id: ()=> '0abadfa28ax',
        name: ()=> 'CSAPP',
        college: ()=> [...new Array(1)],
    }),
    Class: ()=>({
        id: ()=> 'xa80fabadsf',
        teacher: ()=> [...new Array(3)],
        schedule: ()=> [...new Array(2)],
    }),
    Period: ()=>({
        weekday: 1,
        start: 6,
        end: 10,
        weekstart: 1,
        weekend: 10,
        weekInterval: 2,
    }),
    POI: ()=>({
        id: ()=> 'dafa=aefaw8unv',
        name: '教五101',
        loc: ()=> new Point(7203,1,5.1),
    })
}