import React, { useState } from 'react'
import { Button, Icon, Confirm } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useApolloClient, useMutation } from '@apollo/react-hooks'

import { FETCH_POSTS_QUERY } from '../../util/graphql'

const DeleteButton = ({ postId, callback }) => {
    const client = useApolloClient()
    const [confirmOpen, setConfirmOpen] = useState(false)

    const [deletePost] = useMutation(DELETE_POST, {
        update(_, __) {
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

            setConfirmOpen(false)
            if (callback) callback()
        },
        variables: {
            postId,
        },
    })

    return (
        <>
            <Button
                as="div"
                color="red"
                floated="right"
                onClick={() => setConfirmOpen(true)}
            >
                <Icon name="trash" style={{ margin: 0 }} />
            </Button>
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deletePost}
            />
        </>
    )
}
const DELETE_POST = gql`
    mutation deletePost($postId: ID!) {
        deletePost(postId: $postId)
    }
`
export default DeleteButton
