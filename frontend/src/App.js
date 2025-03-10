import React, { useState, useEffect } from "react" // useEffect нужен здесь
import axios from "axios"
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
    useNavigate,
} from "react-router-dom"
import Login from "./Login"
import Register from "./Register" // Убедись, что Register.js существует
import "./App.css"

// Компонент Tasks с правильными импортами
function Tasks({ token, setToken }) {
    const [tasks, setTasks] = useState([])
    const [categories, setCategories] = useState([])
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [categoryId, setCategoryId] = useState("")
    const [filter, setFilter] = useState("all")
    const [editingTask, setEditingTask] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        axios
            .get("/api/tasks/", {
                headers: { Authorization: `Token ${token}` },
            })
            .then((response) => setTasks(response.data))
            .catch((error) =>
                console.error("Ошибка при загрузке задач:", error)
            )

        axios
            .get("/api/categories/", {
                headers: { Authorization: `Token ${token}` },
            })
            .then((response) => setCategories(response.data))
            .catch((error) =>
                console.error("Ошибка при загрузке категорий:", error)
            )
    }, [token])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (editingTask) {
            axios
                .put(
                    `/api/tasks/${editingTask.id}/`,
                    {
                        title: title || editingTask.title,
                        description: description || editingTask.description,
                        completed: editingTask.completed,
                        category_id:
                            categoryId || editingTask.category?.id || null,
                    },
                    {
                        headers: { Authorization: `Token ${token}` },
                    }
                )
                .then((response) => {
                    setTasks(
                        tasks.map((task) =>
                            task.id === editingTask.id ? response.data : task
                        )
                    )
                    setEditingTask(null)
                    setTitle("")
                    setDescription("")
                    setCategoryId("")
                })
                .catch((error) =>
                    console.error("Ошибка при редактировании:", error)
                )
        } else {
            axios
                .post(
                    "/api/tasks/",
                    {
                        title,
                        description,
                        completed: false,
                        category_id: categoryId || null,
                    },
                    {
                        headers: { Authorization: `Token ${token}` },
                    }
                )
                .then((response) => {
                    setTasks([...tasks, response.data])
                    setTitle("")
                    setDescription("")
                    setCategoryId("")
                })
                .catch((error) => console.error("Ошибка при создании:", error))
        }
    }

    const handleLogout = () => {
        setToken(null)
        localStorage.removeItem("token")
        navigate("/login")
    }

    const toggleTaskStatus = (taskId, currentStatus) => {
        const task = tasks.find((t) => t.id === taskId)
        axios
            .put(
                `/api/tasks/${taskId}/`,
                {
                    title: task.title,
                    description: task.description,
                    completed: !currentStatus,
                    category_id: task.category?.id || null,
                },
                {
                    headers: { Authorization: `Token ${token}` },
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
            .catch((error) => console.error("Ошибка при обновлении:", error))
    }

    const deleteTask = (taskId) => {
        axios
            .delete(`/api/tasks/${taskId}/delete/`, {
                headers: { Authorization: `Token ${token}` },
            })
            .then(() => setTasks(tasks.filter((task) => task.id !== taskId)))
            .catch((error) => console.error("Ошибка при удалении:", error))
    }

    const editTask = (task) => {
        setEditingTask(task)
        setTitle(task.title)
        setDescription(task.description)
        setCategoryId(task.category?.id || "")
    }

    const filteredTasks = tasks.filter((task) => {
        if (filter === "completed") return task.completed
        if (filter === "incomplete") return !task.completed
        return true
    })

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
                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                >
                    <option value="">Без категории</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <button type="submit">
                    {editingTask ? "Сохранить" : "Добавить задачу"}
                </button>
            </form>
            <div className="filter">
                <button onClick={() => setFilter("all")}>Все</button>
                <button onClick={() => setFilter("completed")}>
                    Выполненные
                </button>
                <button onClick={() => setFilter("incomplete")}>
                    Невыполненные
                </button>
            </div>
            <ul>
                {filteredTasks.map((task) => (
                    <li key={task.id}>
                        {task.title} - {task.description} (
                        {task.completed ? "Выполнено" : "Не выполнено"})
                        {task.category && <span> [{task.category.name}]</span>}
                        <button
                            onClick={() =>
                                toggleTaskStatus(task.id, task.completed)
                            }
                            className="toggle-btn"
                        >
                            {task.completed ? "Отменить" : "Выполнить"}
                        </button>
                        <button
                            onClick={() => editTask(task)}
                            className="edit-btn"
                        >
                            Редактировать
                        </button>
                        <button
                            onClick={() => deleteTask(task.id)}
                            className="delete-btn"
                        >
                            Удалить
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

function App() {
    const [token, setToken] = useState(localStorage.getItem("token"))

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login setToken={setToken} />} />
                <Route
                    path="/register"
                    element={<Register setToken={setToken} />}
                />{" "}
                {/* Добавлен маршрут для регистрации */}
                <Route
                    path="/tasks"
                    element={
                        token ? (
                            <Tasks token={token} setToken={setToken} />
                        ) : (
                            <Navigate to="/register" />
                        )
                    }
                />
                <Route path="/" element={<Navigate to="/register" />} />{" "}
                {/* Стартовая страница - регистрация */}
            </Routes>
        </Router>
    )
}

export default App
