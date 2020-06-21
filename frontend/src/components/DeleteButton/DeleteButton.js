import React, { useState } from 'react'
import { Button, Icon, Confirm, Popup } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useApolloClient, useMutation } from '@apollo/react-hooks'

import { FETCH_POSTS_QUERY } from '../../util/graphql'

const DeleteButton = ({ postId, callback, commentId }) => {
    const client = useApolloClient()
    const [confirmOpen, setConfirmOpen] = useState(false)

    const mutation = commentId ? DELETE_COMMENT : DELETE_POST

    const [deletePostOrComment] = useMutation(mutation, {
        update(_, __) {
            if (!commentId) {
                const data = client.readQuery({
                    query: FETCH_POSTS_QUERY,
                })

                let newData = {
                    getPosts: [],
                }

                newData.getPosts = data.getPosts.filter(
                    (post) => post.id !== postId
                )

                client.writeQuery({
                    query: FETCH_POSTS_QUERY,
                    variables: {
                        postId,
                    },
                    data: newData,
                })
            }

            setConfirmOpen(false)
            if (callback) callback()
        },
        variables: {
            postId,
            commentId,
        },
    })

    return (
        <>
            <Popup
                content={commentId ? 'Delete Comment' : 'Delete Post'}
                inverted
                trigger={
                    <Button
                        as="div"
                        color="red"
                        floated="right"
                        onClick={() => setConfirmOpen(true)}
                    >
                        <Icon name="trash" style={{ margin: 0 }} />
                    </Button>
                }
            />
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deletePostOrComment}
            />
        </>
    )
}
const DELETE_POST = gql`
    mutation deletePost($postId: ID!) {
        deletePost(postId: $postId)
    }
`

const DELETE_COMMENT = gql`
    mutation deleteComment($postId: ID!, $commentId: ID!) {
        deleteComment(postId: $postId, commentId: $commentId) {
            id
            comments {
                id
                username
                createdAt
                body
            }
            commentCount
        }
    }
`

export default DeleteButton
