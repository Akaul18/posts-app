require('dotenv').config()

const { ApolloServer } = require('apollo-server')
const mongoose = require('mongoose')

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        return server.listen({ port: 5000 })
    })
    .then((result) => {
        console.log(
            'connected to mongodb \n',
            `🚀 Server ready at ${result.url}`
        )
    })
