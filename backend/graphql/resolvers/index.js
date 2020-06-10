const postResolvers = require('./post')
const userResolvers = require('./users')

module.exports = {
    Query: {
        ...postResolvers.Query,
        // ...userResolvers.Query,
    },
    Mutation: {
        ...userResolvers.Mutation,
    },
}
