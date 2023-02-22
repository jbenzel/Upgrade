const { gql } = require("apollo-server");

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

    type Course {
        courseID: ID!
        courseCode: String
        courseName: String
        userID: ID!
    }

    type Query {
        getUser(userIDParam: ID): User
        getAllUser: [User]

        getStudentbyStudentID(studentIDParam: ID): Student
        getStudentbyUserID(userIDParam: Int): Student
        getAllStudents: [Student]
    }

    type Mutation {
        addUser(email: String, password: String, role: Int, firstName: String, lastName: String): User
        updateUser(userIDParam: Int, email: String, password: String, role: Int, firstName: String, lastName: String): User
        deleteUser(userIDParam: Int): User

        addStudent(eGPA: Float, cGPA: Float, completedCourseCount: Int, userID: Int): Student
        updateStudent(studentIDParam: ID, eGPA: Float, cGPA: Float, completedCourseCount: Int, userID: Int): Student
    }
`;



module.exports = typeDefs
