import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Button, Form } from 'semantic-ui-react'

import { useForm } from '../../util/hooks'
import { FETCH_POSTS_QUERY } from '../../util/graphql'

const PostForm = () => {
    const [errors, setErrors] = useState()

    const { onChange, onSubmit, values } = useForm(
        { body: '' },
        createPostCallback
    )

    const [createPost, { error }] = useMutation(CREATE_POST, {
        variables: values,
        onError(err) {
            setErrors(err.graphQLErrors[0].message)
        },
        update(proxy, results) {
            // try {
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY,
            })

            // data.getPosts = [results.data.createPost, ...data.getPosts]
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                variables: values,
                data: {
                    getPosts: [results.data.createPost, ...data.getPosts],
                },
            })
            values.body = ''
            // } catch (err) {
            // console.log(err)
            // }
        },
    })

    function createPostCallback() {
        createPost()
    }
    return (
        <React.Fragment>
            <Form onSubmit={onSubmit}>
                <h2>Create a post:</h2>
                <Form.Field>
                    <Form.Input
                        placeholder="Hi World"
                        name="body"
                        onChange={onChange}
                        values={values.body}
                        error={error ? true : false}
                    />
                    <Button type="submit" color="teal">
                        Submit
                    </Button>
                </Form.Field>
            </Form>
            {errors && (
                <div
                    className="ui error message"
                    style={{ marginBottom: '20px' }}
                >
                    <ul className="list">
                        <li>{errors}</li>
                    </ul>
                </div>
            )}
        </React.Fragment>
    )
}

const CREATE_POST = gql`
    mutation createPost($body: String!) {
        createPost(body: $body) {
            id
            body
            username
            createdAt
            comments {
                id
                body
                username
                createdAt
            }
            commentCount
            likes {
                id
                username
                createdAt
            }
            likeCount
        }
    }
`

export default PostForm
