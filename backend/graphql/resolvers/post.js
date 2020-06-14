const Post = require('../../models/Post')
const { AuthenticationError, UserInputError } = require('apollo-server')
const checkAuth = require('../../util/auth-verify')

module.exports = {
    Query: {
        getPosts: async () => {
            try {
                const posts = await Post.find().sort({ createdAt: -1 })
                return posts
            } catch (err) {
                throw new Error(err)
            }
        },
        getPost: async (_, { postId }) => {
            try {
                const post = await Post.findById(postId)
                if (post) {
                    return post
                } else {
                    throw new Error('Post not found')
                }
            } catch (err) {
                throw new Error(err)
            }
        },
    },
    Mutation: {
        createPost: async (_, { body }, context) => {
            if (body.trim() === '') {
                throw new Error('Post body must not be empty')
            }
            const user = checkAuth(context)
            const newPost = new Post({
                user: user.id,
                username: user.username,
                body,
                createdAt: new Date().toISOString(),
            })
            const post = await newPost.save()

            context.pubsub.publish('NEW_POST', {
                newPost: post,
            })

            return post
        },
        deletePost: async (_, { postId }, context) => {
            const user = checkAuth(context)

            try {
                const post = await Post.findById(postId)

                if (user.username === post.username) {
                    await post.delete()
                    return 'Post deleted successfully'
                } else {
                    throw new AuthenticationError('Action not allowed')
                }
            } catch (e) {
                throw new Error(e)
            }
        },
        likePost: async (_, { postId }, context) => {
            const { username } = checkAuth(context)

            try {
                const post = await Post.findById(postId)
                if (post) {
                    if (post.likes.find((like) => like.username === username)) {
                        //unlike it
                        post.likes = post.likes.filter(
                            (like) => like.username !== username
                        )
                        await post.save()
                    } else {
                        //like it
                        post.likes.push({
                            username,
                            createdAt: new Date().toISOString(),
                        })
                    }
                    await post.save()
                    return post
                } else {
                    throw new UserInputError('Post not found')
                }
            } catch (err) {
                throw new Error(err)
            }
        },
    },
    Subscription: {
        newPost: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST'),
        },
    },
}
