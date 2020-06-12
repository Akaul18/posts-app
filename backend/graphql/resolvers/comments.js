const Post = require('../../models/Post')
const checkAuth = require('../../util/auth-verify')
const { AuthenticationError, UserInputError } = require('apollo-server')

module.exports = {
    Mutation: {
        createComment: async (_, { postId, body }, context) => {
            const { username } = checkAuth(context)

            if (body.trim() === '') {
                throw new UserInputError('empty comment', {
                    errors: {
                        body: 'comment body must not be empty',
                    },
                })
            }
            const post = await Post.findById(postId)
            if (post) {
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString(),
                })
                await post.save()
                return post
            } else {
                throw new UserInputError('Post not found')
            }
        },
        deleteComment: async (_, { postId, commentId }, context) => {
            const { username } = checkAuth(context)

            try {
                const post = await Post.findById(postId)
                if (post) {
                    const commentIndex = post.comments.findIndex(
                        (comment) => comment.id === commentId
                    )
                    if (post.comments[commentIndex].username === username) {
                        await post.comments.splice(commentIndex, 1)
                        await post.save()
                        return post
                    } else {
                        throw new AuthenticationError('Action not allowed')
                    }
                } else {
                    throw new UserInputError('Post not found')
                }
            } catch (err) {
                throw new Error(err)
            }
        },
    },
}
