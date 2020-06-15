import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Grid } from 'semantic-ui-react'
import PostCard from '../components/PostCard/PostCard'

const Home = () => {
    const {
        loading,
        data: { getPosts: posts },
    } = useQuery(FETCH_POSTS_QUERY)

    return (
        <Grid columns={3}>
            <Grid.Row>
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row>
                {loading ? (
                    <h1>Loading Posts..</h1>
                ) : (
                    posts &&
                    posts.map((post) => (
                        <Grid.Column>
                            <PostCard post={post} />
                        </Grid.Column>
                    ))
                )}
            </Grid.Row>
        </Grid>
    )
}

const FETCH_POSTS_QUERY = gql`
    {
        getPosts {
            id
            body
            username
            createdAt
            likeCount
            commentCount
            likes {
                username
            }
            comments {
                id
                username
                createdAt
                body
            }
        }
    }
`

export default Home
