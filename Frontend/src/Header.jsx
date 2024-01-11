import { useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { UserContext } from "./UserContext"

const Header = () => {

    const navigate = useNavigate()

    const { userInfo, setUserInfo, storeToken } = useContext(UserContext)

    useEffect(() => {

        fetch(import.meta.env.VITE_APP_DEV_URL + '/profile', {
            credentials: 'include',
        }).then((response) => {
            response.json().then(userInfo => {
                setUserInfo(userInfo)
            })
        })

    }, [setUserInfo]);



    const logout = () => {
        fetch(import.meta.env.VITE_APP_DEV_URL + '/logout', {
            credentials: 'include',
            method: 'POST',
        })

        storeToken('')
        setUserInfo(null)
        navigate('/')
    }


    return (
        <header>
            <Link to="/" className='logo'>Trending Blog&apos;s</Link>
            <nav>
                {
                    userInfo?.username ? (
                        <>
                            <Link to="/create">Create Post</Link>
                            <a onClick={logout}>Logout</a>
                        </>
                    )
                        :
                        (
                            <>
                                <Link to="/login">Login</Link>
                                <Link to="/register">Register</Link>
                            </>
                        )
                }
            </nav>
        </header>
    )
}

export default Header