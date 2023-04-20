const { ApolloServer, gql } = require('apollo-server');
//const { gql} = require("apollo-server")


/*
type tableName {attribute: datatype} (the optional '!' means it is required/not nullable)
function(parameters: parameterType): table ([table] means return all tuples vs one)
*/
const typeDefs = gql`

    type User {
        userID: ID!
        email: String!
        password: String!
        firstName: String
        lastName: String
        role: String
        firstLogin: Boolean
    }

    type Student {
        studentID: ID!
        eGPA: String
        cGPA: String
        completedCourseCount: String
        userID: ID
    }

    type Course {
        courseID: ID!
        courseName: String
        courseCode: String
        courseNum: String
        courseCredits: String
        userID: ID
    }

    type PrevCourse {
        prevCourseID: ID!
        pCourseName: String
        pCourseNum: String
        pCourseGrade: String
        pCourseCredits: String
        userID: ID
    }

    type Token { 
        tokenID: ID
        content: String
        creationTime: String
        userID: ID
    }

    type Grade {
        gradeID: ID!
        name: String
        dueDate: String
        expectedGrade: String
        grade: String
        category: String
        weight: String
        urgency: String
        locked: Boolean
        courseID: ID
        userID: ID
        history: Boolean
    }

    type Query {
        getAllUser: [User]
        getUserbyID(userIDParam: ID!): User
        getUserbyEmail(emailParam: String): User
        validateUser(emailParam: String, passwordParam: String): User

        getAllStudent: [Student]
        getStudentbyStudentID(studentIDParam: ID!): Student
        getStudentbyUserID(userIDParam: ID!): Student
        
        getAllCourse: [Course]
        getCoursebyCourseID(courseIDParam: ID!): Course
        getAllCoursesbyUserID(userIDParam: ID!): [Course]

        getAllPrevCourse: [PrevCourse]
        getPrevCoursebyPrevCourseID(prevCourseIDParam: ID!): PrevCourse
        getAllPrevCoursebyUserID(userIDParam: ID!): [PrevCourse]

        getAllToken: [Token]
        getTokenbyTokenID(tokenIDParam: ID!): Token
        getTokenbyUserID(userIDParam: ID!): [Token]

        getAllGrade: [Grade]
        getGradebyGradeID(gradeIDParam: ID!): Grade
        getAllGradesbyUserID(userIDParam: ID!): [Grade]
        getAllGradebyCourseID(courseIDParam: ID!): [Grade]
        sendResetEmail(emailParam: String): User
        setNewPassword(emailParam: String, password: String, content: String): User
   
    }

    type Mutation {
        addUser(email: String!, firstName: String, lastName: String, role: String): User
        updateUser(userIDParam: ID!, email: String!, password: String!, firstName: String, lastName: String, role: String, firstLogin: Boolean): User
        deleteUser(userIDParam: ID!): User

        addStudent(eGPA: String, cGPA: String, completedCourseCount: String, userID: ID!): Student
        updateStudent(studentIDParam: ID!, eGPA: String, cGPA: String, completedCourseCount: String, userID: ID!): Student
        deleteStudent(studentIDParam: ID!): Student
    
        addCourse(courseName: String, courseCode: String, courseNum: String, courseCredits: String, userID: ID!): Course
        updateCourse(courseIDParam: ID!, courseName: String, courseCode: String, courseNum: String, courseCredits: String, userID: ID!): Course
        deleteCourse(courseIDParam: ID!): Course

        addPrevCourse(pCourseName: String, pCourseNum: String, pCourseGrade: String, pCourseCredits: String, userID: ID!): PrevCourse
        updatePrevCourse(prevCourseIDParam: ID!, pCourseName: String, pCourseNum: String, pCourseGrade: String, pCourseCredits: String, userID: ID!): PrevCourse
        deletePrevCourse(prevCourseIDParam: ID!): PrevCourse

        deleteToken(tokenIDParam: ID!): Token
        createorUpdateToken(tokenIDParam: ID, content: String, creationTime: String, userID: ID!): Token

        addGrade(name: String, dueDate: String, expectedGrade: String, grade: String, category: String, weight: String, urgency: String, locked: Boolean, courseID: ID!, userID: ID!, history: Boolean): Grade
        updateGrade(gradeIDParam: ID!, name: String, dueDate: String, expectedGrade: String, grade: String, category: String, weight: String, urgency: String, locked: Boolean, courseID: ID!, userID: ID!, history: Boolean): Grade
        deleteGrade(gradeIDParam: ID!): Grade
    }
`;

module.exports = typeDefs
