require('dotenv').config()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { UserInputError } = require('apollo-server')
const User = require('../../models/User')
const {
    validateRegisterInput,
    validateLoginInput,
} = require('../../util/inputValidator')

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username,
        },
        process.env.TOKEN_SECRET,
        { expiresIn: '1h' }
    )
}

module.exports = {
    Mutation: {
        register: async (
            _,
            { registerInput: { email, username, password, confirmPassword } }
        ) => {
            const { valid, errors } = validateRegisterInput(
                username,
                email,
                password,
                confirmPassword
            )

            if (!valid) {
                throw new UserInputError('errors', { errors })
            }

            const existingUser = await User.findOne({
                username,
            })
            if (existingUser) {
                throw new UserInputError('User already exists', {
                    errors: {
                        username: 'This username is taken',
                    },
                })
            }

            const hashedPassword = await bcrypt.hash(password, 12)

            const newUser = new User({
                email: email,
                username: username,
                password: hashedPassword,
                createdAt: new Date().toISOString(),
            })
            const result = await newUser.save()

            const token = generateToken(result)

            return {
                ...result._doc,
                id: result.id,
                token: token,
            }
        },
        login: async (_, { username, password }) => {
            const { valid, errors } = validateLoginInput(username, password)

            if (!valid) {
                throw new UserInputError('errors', { errors })
            }

            const user = await User.findOne({ username })

            if (!user) {
                errors.general = 'User not found'
                throw new UserInputError('User not found', { errors })
            }

            const match = await bcrypt.compare(password, user.password)
            if (!match) {
                errors.general = 'wrong credentials'
                throw new UserInputError('wrong credentials', { errors })
            }

            const token = generateToken(user)
            return {
                ...user._doc,
                id: user.id,
                token: token,
            }
        },
    },
}
