// require('dotenv').config()
const jwt = require('jsonwebtoken')
const { AuthenticationError } = require('apollo-server')
const { TOKEN_SECRET } = require('../util/config')

module.exports = (context) => {
    const authHeader = context.req.headers.authorization

    if (authHeader) {
        const token = authHeader.split(' ')[1]
        if (token) {
            try {
                const user = jwt.verify(token, TOKEN_SECRET)
                // const user = jwt.verify(token, process.env.TOKEN_SECRET)
                return user
            } catch (e) {
                throw new AuthenticationError('Invalid/expired token')
            }
        }
        throw new Error('invalid token')
    }
    throw new Error('Unauthorized no token')
}
