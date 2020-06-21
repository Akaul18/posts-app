// require('dotenv').config()

const { ApolloServer, PubSub } = require('apollo-server')
const mongoose = require('mongoose')

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')
const { MONGO_URI } = require('./util/config')

const pubsub = new PubSub()
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, pubsub }),
})

mongoose
    .connect(MONGO_URI, {
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
    .catch((err) => {
        console.error(err)
    })
