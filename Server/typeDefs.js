const { gql } = require("apollo-server");

const typeDefs = gql`

    type User {
        userID: ID!
        email: String!
        password: String!
        role: Int!
        firstName: String!
        lastName: String!
    }

    type Query {
        getUser(userIDParam:Int): User
        getAllUsers: [User]
    }

    type Mutation {
        addUser(email: String, password: String, role: Int, firstName: String, lastName: String): User
        updateUser(userIDParam: Int, email: String, password: String, role: Int, firstName: String, lastName: String): User
        deleteUser(userIDParam: Int): User
    }
`;

module.exports = typeDefs
