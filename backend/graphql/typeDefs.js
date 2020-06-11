const { gql } = require('apollo-server')

module.exports = gql`
    type Post {
        id: ID!
        username: String!
        body: String!
        createdAt: String!
    }

    type User {
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
    }

    input RegisterInput {
        email: String!
        username: String!
        password: String!
        confirmPassword: String!
    }

    type Query {
        getPosts: [Post!]!
    }

    type Mutation {
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
    }
`
