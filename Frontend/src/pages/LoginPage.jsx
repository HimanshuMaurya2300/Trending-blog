import { useContext, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { UserContext } from "../UserContext"

export default function LoginPage() {

    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { setUserInfo, storeToken } = useContext(UserContext)

    const login = async (e) => {
        e.preventDefault()

        const response = await fetch(import.meta.env.VITE_APP_DEV_URL + '/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })

        if (response.ok) {

            response.json().then(userInfo => {
                console.log(userInfo)
                storeToken(userInfo.token)
                setUserInfo(userInfo)
                navigate('/')
            })
        }
        else {
            alert('Wrong credentials')
        }
    }


    return (
        <form className="login" onSubmit={login}>

            <h1>Login</h1>

            <div className="input-container">
                <input
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <div className="input-container">
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <div className="input-container">
                <button className="btn">Login</button>
            </div>
        </form>
    )
}
