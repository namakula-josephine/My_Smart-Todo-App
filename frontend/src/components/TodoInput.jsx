import { useState } from 'react'

function TodoInput({ onAdd, defaultEmail }) {
  const [input, setInput] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [email, setEmail] = useState(defaultEmail || localStorage.getItem('userEmail') || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      onAdd(input, dueDate || null, email || null)
      setInput('')
      setDueDate('')
      // Save email to localStorage for future use
      if (email) {
        localStorage.setItem('userEmail', email)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="todo-input-form">
      <div className="input-group">
        <input
          type="text"
          className="todo-input"
          placeholder="What needs to be done?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
        />
        <button type="submit" className="btn btn-primary">
          <span>➕</span>
          Add Task
        </button>
      </div>
      <div className="input-row">
        <div className="input-field">
          <label htmlFor="due-date">📅 Due Date (optional)</label>
          <input
            id="due-date"
            type="date"
            className="todo-input date-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className="input-field">
          <label htmlFor="email">📧 Email for Reminders (optional)</label>
          <input
            id="email"
            type="email"
            className="todo-input email-input"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
    </form>
  )
}

export default TodoInput

