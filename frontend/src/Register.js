import React, { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "./App.css"

function Register({ setToken }) {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post("/api/register/", {
                username,
                email,
                password,
            })
            const token = response.data.token
            setToken(token)
            localStorage.setItem("token", token)
            navigate("/tasks")
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                    "Ошибка при регистрации. Проверьте данные."
            )
        }
    }

    return (
        <div className="App">
            <h2>Регистрация</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Имя пользователя"
                    required
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Пароль"
                    required
                />
                <button type="submit">Зарегистрироваться</button>
            </form>
            {error && <p className="error">{error}</p>}
            <p>
                Уже есть аккаунт?{" "}
                <button onClick={() => navigate("/login")} className="link-btn">
                    Войти
                </button>
            </p>
        </div>
    )
}

export default Register
