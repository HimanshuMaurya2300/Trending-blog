import Post from "../Post";
import { useContext, useEffect, useState } from 'react'
import { UserContext } from "../UserContext";

export default function IndexPage() {

    const { userInfo } = useContext(UserContext)

    const [posts, setPosts] = useState([])

    useEffect(() => {
        fetch(import.meta.env.VITE_APP_DEV_URL + '/post').then(response => {
            response.json().then(post => {
                // console.log(post)
                setPosts(post)
            })
        })
    }, [])

    return (
        <>
            {userInfo && (
                <div className="username">
                    👋 Welcome, <span>{userInfo?.username}</span>
                </div>
            )}

            {
                posts.length > 0 && posts.map(post => (
                    <Post key={post._id} {...post} />
                ))
            }
        </>
    )
}

