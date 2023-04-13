const { ApolloServer, gql } = require('apollo-server');
//const { gql} = require("apollo-server")

const typeDefs = gql`

    type User {
        userID: ID!
        email: String!
        password: String!
        firstName: String
        lastName: String
        role: Int
        firstLogin: Boolean
    }

    type Student {
        studentID: ID!
        eGPA: Float
        cGPA: Float
        completedCourseCount: Int
        userID: Int!
    }

    type Course {
        courseID: ID!
        courseName: String
        courseCode: String
        courseNum: Int
        credits: Int
        userID: ID!
    }

    type PrevCourse {
        prevCourseID: ID!
        pCourseName: String
        pCourseNum: Int
        pCourseGrade: Float
        pCourseCredits: Int
        userID: ID!
    }

    type Token { 
        tokenID: ID
        content: String
        creationTime: String
        userID: ID!
    }

    type Grade {
        gradeID: ID!
        name: String
        dueDate: String
        expectedGrade: Float
        grade: Float
        category: String
        weight: Float
        urgency: Int
        locked: Boolean
        courseID: ID!
        userID: ID
    }

    type Query {
        getAllUser: [User]
        getUserbyID(userIDParam: ID!): User
        getUserbyEmail(emailParam: String): User
        validateUser(emailParam: String, passwordParam: String): User

        getAllStudent: [Student]
        getStudentbyStudentID(studentIDParam: ID): Student
        getStudentbyUserID(userIDParam: Int): Student
        
        getAllCourse: [Course]
        getCoursebyCourseID(courseIDParam: ID!): Course
        getAllCoursesbyUserID(userIDParam: ID!): [Course]

        getAllPrevCourse: [PrevCourse]
        getPrevCoursebyPrevCourseID(prevCourseIDParam: ID!): PrevCourse
        getAllPrevCoursebyUserID(userIDParam: ID!): [PrevCourse]

        getAllToken: [Token]
        getTokenbyTokenID(tokenIDParam: ID!): Token
        getTokenbyUserID(userIDParam: ID!): Token

        getAllGrade: [Grade]
        getGradebyGradeID(gradeIDParam: ID!): Grade
        getAllGradesbyUserID(userIDParam: ID!): [Grade]
        getAllGradebyCourseID(courseIDParam: ID!): [Grade]
        sendResetEmail(emailParam: String): User
        setNewPassword(emailParam: String, password: String, content: String): User
   
    }

    type Mutation {
        addUser(email: String!, firstName: String, lastName: String, role: Int): User
        updateUser(userIDParam: Int!, email: String!, password: String!, firstName: String, lastName: String, role: Int, firstLogin: Boolean): User
        deleteUser(userIDParam: Int!): User

        addStudent(eGPA: Float, cGPA: Float, completedCourseCount: Int, userID: Int!): Student
        updateStudent(studentIDParam: ID!, eGPA: Float, cGPA: Float, completedCourseCount: Int, userID: Int!): Student
        deleteStudent(studentIDParam: ID!): Student
    
        addCourse(courseName: String, courseCode: String, courseNum: Int, courseCredits: Int, userID: ID!): Course
        updateCourse(courseIDParam: ID!, courseName: String, courseCode: String, courseNum: Int, courseCredits: Int, userID: ID!): Course
        deleteCourse(courseIDParam: ID!): Course

        addPrevCourse(pCourseName: String, pCourseNum: Int, pCourseGrade: Float, pCourseCredits: Int, userID: ID!): PrevCourse
        updatePrevCourse(prevCourseIDParam: ID!, pCourseName: String, pCourseNum: Int, pCourseGrade: Float, pCourseCredits: Int, userID: ID!): PrevCourse
        deletePrevCourse(prevCourseIDParam: ID!): PrevCourse

        deleteToken(tokenIDParam: ID!): Token
        createorUpdateToken(tokenIDParam: ID, content: String, creationTime: String, userID: ID!): Token

        addGrade(name: String, dueDate: String, expectedGrade: Float, grade: Float, category: String, weight: Float, urgency: Int, locked: Boolean, courseID: ID!, userID: ID!): Grade
        updateGrade(gradeIDParam: ID!, name: String, dueDate: String, expectedGrade: Float, grade: Float, category: String, weight: Float, urgency: Int, locked: Boolean, courseID: ID!, userID: ID!): Grade
        deleteGrade(gradeIDParam: ID!): Grade
    }
`;
/*
        addGrade
        updateGrade
        deleteGrade
        deleteAllGradesByCourse
        */


module.exports = typeDefs
