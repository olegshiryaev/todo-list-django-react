import React, { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Login({ setToken }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        axios
            .post("http://127.0.0.1:8000/api-token-auth/", {
                username,
                password,
            })
            .then((response) => {
                const newToken = response.data.token
                setToken(newToken)
                localStorage.setItem("token", newToken) // Сохраняем токен в localStorage
                navigate("/tasks")
            })
            .catch((error) => {
                setError("Неверный логин или пароль")
                console.error("Ошибка авторизации:", error)
            })
    }

    return (
        <div className="Login">
            <h1>Вход</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Имя пользователя"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Пароль"
                    required
                />
                <button type="submit">Войти</button>
            </form>
        </div>
    )
}

export default Login
