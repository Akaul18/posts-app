import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Grid, Transition } from 'semantic-ui-react'

import PostCard from '../components/PostCard/PostCard'
import PostForm from '../components/PostForm/PostForm'
import { AuthContext } from '../context/auth'
import { FETCH_POSTS_QUERY } from '../util/graphql'

const Home = () => {
    const { user } = useContext(AuthContext)

    const { loading, data: { getPosts: posts } = {} } = useQuery(
        FETCH_POSTS_QUERY
    )

    return (
        <Grid columns={3}>
            <Grid.Row className="page-title">
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row>
                {user && (
                    <Grid.Column>
                        <PostForm />
                    </Grid.Column>
                )}
                {!loading ? (
                    <Transition.Group>
                        {posts &&
                            posts.map((post) => (
                                <Grid.Column
                                    key={post.id}
                                    style={{ marginBottom: '20px' }}
                                >
                                    <PostCard post={post} />
                                </Grid.Column>
                            ))}
                    </Transition.Group>
                ) : (
                    <h1>Loading Posts..</h1>
                )}
            </Grid.Row>
        </Grid>
    )
}

export default Home
