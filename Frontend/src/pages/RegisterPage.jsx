import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function RegisterPage() {

    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [redirect, setRedirect] = useState(false)

    const register = async (e) => {
        e.preventDefault()

        const response = await fetch(import.meta.env.VITE_APP_DEV_URL + '/register', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' }
        })

        if (response.status === 200) {
            setRedirect(true)
            alert('Registeration successful')
        }
        else {
            alert('Registeration failed')
        }
    }


    if (redirect) {
        navigate('/login')
    }


    return (
        <form className="register" onSubmit={register}>
            <h1>Register</h1>

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
                <button className="btn">Register</button>
            </div>
        </form>
    )
}
