const { ApolloServer, gql } = require('apollo-server');
//const { gql} = require("apollo-server")

const typeDefs = gql`

    type User {
        userID: ID!
        email: String!
        password: String!
        role: Int
        firstName: String
        lastName: String
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
        courseCode: String
        courseName: String
        userID: ID!
    }

    type Grade {
        gradeID: ID!
        urgency: Int
        weight: Float
        dueDate: String
        expectedGrade: Float
        grade: Float
        category: String
        courseID: ID!
        userID: ID!
    }

    type Query {
        getAllUser: [User]
        getUserbyID(userIDParam: ID!): User
        getUserbyEmail(emailParam: String): User

        getAllStudent: [Student]
        getStudentbyStudentID(studentIDParam: ID): Student
        getStudentbyUserID(userIDParam: Int): Student
        
        getAllCourse: [Course]
        getCoursebyCourseID(courseIDParam: ID!): Course
        getCoursebyUserID(userIDParam: ID!): Course

        getAllGrade: [Grade]
        getGradebyGradeID(gradeIDParam: ID!): Grade
        getGradebyUserID(userIDParam: ID!): Grade
        getGradebyCourseID(courseIDParam: ID!): Grade
   
    }

    type Mutation {
        addUser(email: String!, password: String!, role: Int, firstName: String, lastName: String): User
        updateUser(userIDParam: Int!, email: String, password: String, role: Int, firstName: String, lastName: String): User
        deleteUser(userIDParam: Int!): User

        addStudent(eGPA: Float, cGPA: Float, completedCourseCount: Int, userID: Int!): Student
        updateStudent(studentIDParam: ID!, eGPA: Float, cGPA: Float, completedCourseCount: Int, userID: Int!): Student
        deleteStudent(studentIDParam: ID!): Student
    
        addCourse(courseCode: String, courseName: String, userID: ID!): Course
        updateCourse(courseIDParam: ID!, courseCode: String, courseName: String, userID: ID!): Course
        deleteCourse(courseIDParam: ID!): Course

        addGrade(urgency: Int, weight: Float, dueDate: String, expectedGrade: Float, grade: Float, category: String, courseID: ID!, userID: ID!): Grade
        updateGrade(gradeIDParam: ID!, urgency: Int, weight: Float, dueDate: String, expectedGrade: Float, grade: Float, category: String, courseID: ID!, userID: ID!): Grade
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
