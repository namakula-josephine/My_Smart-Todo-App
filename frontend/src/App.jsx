import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from './contexts/AuthContext'
import TodoList from './components/TodoList'
import TodoInput from './components/TodoInput'
import ProductivityTip from './components/ProductivityTip'
import Stats from './components/Stats'
import Calendar from './components/Calendar'
import Login from './components/Login'
import Signup from './components/Signup'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || '/api'

function TodoApp() {
  const { user, logout, isAuthenticated } = useAuth()
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('list') // 'list' or 'calendar'

  useEffect(() => {
    if (isAuthenticated) {
      loadTodos()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) {
      loadTodos()
    }
  }, [user])

  const loadTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/todos`)
      if (response.data) {
        setTodos(response.data)
        // Save to local storage with user ID
        if (user) {
          localStorage.setItem(`todos_${user.id}`, JSON.stringify(response.data))
        }
      }
    } catch (error) {
      console.error('Error loading todos from server:', error)
      // Fallback to local storage
      if (user) {
        const localTodos = localStorage.getItem(`todos_${user.id}`)
        if (localTodos) {
          try {
            const parsed = JSON.parse(localTodos)
            setTodos(parsed)
          } catch (e) {
            console.error('Error loading from local storage:', e)
          }
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (text, dueDate, userEmail) => {
    if (!text.trim()) return

    const updatedTodos = [{
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: dueDate || null,
      userEmail: userEmail || user?.email || null,
      lastReminderSent: null
    }, ...todos]
    
    setTodos(updatedTodos)

    try {
      const response = await axios.post(`${API_URL}/todos`, {
        text: text.trim(),
        dueDate: dueDate || null,
        userEmail: userEmail || user?.email || null
      })
      // Update with server response
      const newTodos = [response.data, ...todos.filter(t => t.id !== updatedTodos[0].id)]
      setTodos(newTodos)
      if (user) {
        localStorage.setItem(`todos_${user.id}`, JSON.stringify(newTodos))
      }
    } catch (error) {
      console.error('Error saving todo to server:', error)
      // Revert on error
      setTodos(todos)
    }
  }

  const toggleTodo = async (id) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
    setTodos(updatedTodos)
    if (user) {
      localStorage.setItem(`todos_${user.id}`, JSON.stringify(updatedTodos))
    }

    const todo = updatedTodos.find(t => t.id === id)
    try {
      await axios.put(`${API_URL}/todos/${id}`, todo)
    } catch (error) {
      console.error('Error updating todo on server:', error)
      // Revert on error
      setTodos(todos)
    }
  }

  const deleteTodo = async (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id)
    setTodos(updatedTodos)
    if (user) {
      localStorage.setItem(`todos_${user.id}`, JSON.stringify(updatedTodos))
    }

    try {
      await axios.delete(`${API_URL}/todos/${id}`)
    } catch (error) {
      console.error('Error deleting todo on server:', error)
      // Revert on error
      setTodos(todos)
    }
  }

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length
  }

  if (loading) {
    return (
      <div className="app-container">
        <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
          <div className="empty-state-text">Loading...</div>
        </div>
      </div>
    )
  }

  const userEmail = user?.email || ''

  return (
    <div className="app-container">
      <div className="app-header">
        <div className="header-top">
          <div>
            <h1>💼 My Smart Todo App</h1>
            <p>Stay organized and boost your productivity</p>
          </div>
          <div className="user-info">
            <span className="welcome-message">
              👋 Welcome, <strong>{user?.username}</strong>!
            </span>
            <button className="btn btn-small logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="view-toggle">
        <button
          className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => setViewMode('list')}
        >
          📋 List View
        </button>
        <button
          className={`view-toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`}
          onClick={() => setViewMode('calendar')}
        >
          📅 Calendar View
        </button>
      </div>

      <div className="main-content">
        <div className="todo-section">
          <div className="card">
            <h2 className="section-title">
              <span>{viewMode === 'list' ? '📝' : '📅'}</span>
              {viewMode === 'list' ? 'My Tasks' : 'Task Calendar'}
            </h2>
            
            <TodoInput onAdd={addTodo} defaultEmail={userEmail} />
            
            <Stats stats={stats} />
            
            {viewMode === 'list' ? (
              <TodoList
                todos={todos}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ) : (
              <Calendar
                todos={todos}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            )}
          </div>
        </div>

        <div>
          <ProductivityTip />
        </div>
      </div>
    </div>
  )
}

function App() {
  const { isAuthenticated, loading } = useAuth()
  const [authMode, setAuthMode] = useState('login') // 'login' or 'signup'

  if (loading) {
    return (
      <div className="app-container">
        <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
          <div className="empty-state-text">Loading...</div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <>
        {authMode === 'login' ? (
          <Login onSwitchToSignup={() => setAuthMode('signup')} />
        ) : (
          <Signup onSwitchToLogin={() => setAuthMode('login')} />
        )}
      </>
    )
  }

  return <TodoApp />
}

export default App

