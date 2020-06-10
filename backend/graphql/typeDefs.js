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
        token: String
        username: String
        createdAt: String
    }

    input RegisterInput {
        id: ID!
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }

    type Query {
        getPosts: [Post!]!
    }

    type Mutation {
        register(registerInput: RegisterInput): User!
    }
`
