import React, { useState, useEffect } from "react"
import axios from "axios"
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
    useNavigate,
} from "react-router-dom"
import Login from "./Login"
import "./App.css"

function Tasks({ token, setToken }) {
    const [tasks, setTasks] = useState([])
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/tasks/", {
                headers: {
                    Authorization: `Token ${token}`,
                },
            })
            .then((response) => {
                setTasks(response.data)
            })
            .catch((error) => {
                console.error("Ошибка при загрузке задач:", error)
            })
    }, [token])

    const handleSubmit = (e) => {
        e.preventDefault()
        axios
            .post(
                "http://127.0.0.1:8000/api/tasks/",
                {
                    title,
                    description,
                    completed: false,
                },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            )
            .then((response) => {
                setTasks([...tasks, response.data])
                setTitle("")
                setDescription("")
            })
            .catch((error) => {
                console.error("Ошибка при создании задачи:", error)
            })
    }

    const handleLogout = () => {
        setToken(null)
        localStorage.removeItem("token") // Удаляем токен из localStorage
        navigate("/login")
    }

    const toggleTaskStatus = (taskId, currentStatus) => {
        const task = tasks.find((t) => t.id === taskId)
        axios
            .put(
                `http://127.0.0.1:8000/api/tasks/${taskId}/`,
                {
                    title: task.title,
                    description: task.description,
                    completed: !currentStatus,
                },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            )
            .then((response) => {
                setTasks(
                    tasks.map((task) =>
                        task.id === taskId
                            ? { ...task, completed: !currentStatus }
                            : task
                    )
                )
            })
            .catch((error) => {
                console.error(
                    "Ошибка при обновлении задачи:",
                    error.response?.data || error
                )
            })
    }

    return (
        <div className="App">
            <h1>To-Do List</h1>
            <button onClick={handleLogout} className="logout-btn">
                Выход
            </button>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Название задачи"
                    required
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Описание"
                />
                <button type="submit">Добавить задачу</button>
            </form>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        {task.title} - {task.description} (
                        {task.completed ? "Выполнено" : "Не выполнено"})
                        <button
                            onClick={() =>
                                toggleTaskStatus(task.id, task.completed)
                            }
                            className="toggle-btn"
                        >
                            {task.completed ? "Отменить" : "Выполнить"}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

function App() {
    const [token, setToken] = useState(localStorage.getItem("token")) // Загружаем токен из localStorage

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login setToken={setToken} />} />
                <Route
                    path="/tasks"
                    element={
                        token ? (
                            <Tasks token={token} setToken={setToken} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    )
}

export default App
