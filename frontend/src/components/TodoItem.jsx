function TodoItem({ todo, onToggle, onDelete }) {
  const getDueDateDisplay = () => {
    if (!todo.dueDate) return null
    
    const dueDate = new Date(todo.dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0)
    
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    let className = 'due-date'
    let display = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    
    if (diffDays < 0) {
      className += ' overdue'
      display = `Overdue: ${display}`
    } else if (diffDays === 0) {
      className += ' due-today'
      display = `Due today: ${display}`
    } else if (diffDays === 1) {
      className += ' due-soon'
      display = `Due tomorrow: ${display}`
    } else if (diffDays <= 7) {
      className += ' due-soon'
      display = `Due in ${diffDays} days: ${display}`
    }
    
    return { className, display }
  }

  const dueDateInfo = getDueDateDisplay()

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''} ${todo.dueDate ? 'has-due-date' : ''}`}>
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <div className="todo-content">
        <span className="todo-text">{todo.text}</span>
        {dueDateInfo && (
          <span className={dueDateInfo.className}>
            📅 {dueDateInfo.display}
          </span>
        )}
        {todo.userEmail && (
          <span className="todo-email">📧 {todo.userEmail}</span>
        )}
      </div>
      <div className="todo-actions">
        <button
          className="btn btn-danger btn-icon"
          onClick={() => onDelete(todo.id)}
          title="Delete task"
        >
          🗑️
        </button>
      </div>
    </li>
  )
}

export default TodoItem

