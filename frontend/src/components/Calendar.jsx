import { useState } from 'react'

function Calendar({ todos, onToggle, onDelete }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getTodosForDate = (date) => {
    return todos.filter(todo => {
      if (!todo.dueDate) return false
      const todoDate = new Date(todo.dueDate)
      return (
        todoDate.getDate() === date.getDate() &&
        todoDate.getMonth() === date.getMonth() &&
        todoDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const isToday = (date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const renderCalendarDays = () => {
    const days = []
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dayTodos = getTodosForDate(date)
      const hasTodos = dayTodos.length > 0
      const completedTodos = dayTodos.filter(t => t.completed).length
      const pendingTodos = dayTodos.length - completedTodos
      const isTodayDate = isToday(date)

      days.push(
        <div
          key={day}
          className={`calendar-day ${isTodayDate ? 'today' : ''} ${hasTodos ? 'has-todos' : ''}`}
        >
          <div className="calendar-day-number">{day}</div>
          {hasTodos && (
            <div className="calendar-day-todos">
              {pendingTodos > 0 && (
                <span className="todo-indicator pending" title={`${pendingTodos} pending task(s)`}>
                  {pendingTodos}
                </span>
              )}
              {completedTodos > 0 && (
                <span className="todo-indicator completed" title={`${completedTodos} completed task(s)`}>
                  ✓{completedTodos}
                </span>
              )}
            </div>
          )}
        </div>
      )
    }

    return days
  }

  // Get upcoming tasks for sidebar
  const upcomingTasks = todos
    .filter(todo => todo.dueDate && !todo.completed)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5)

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="btn btn-small" onClick={goToPreviousMonth}>
          ◀ Prev
        </button>
        <h3 className="calendar-month-year">
          {monthNames[month]} {year}
        </h3>
        <button className="btn btn-small" onClick={goToNextMonth}>
          Next ▶
        </button>
        <button className="btn btn-small btn-primary" onClick={goToToday}>
          Today
        </button>
      </div>

      <div className="calendar-grid">
        {weekDays.map(day => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
        {renderCalendarDays()}
      </div>

      {upcomingTasks.length > 0 && (
        <div className="upcoming-tasks">
          <h4>📅 Upcoming Tasks</h4>
          <ul className="upcoming-tasks-list">
            {upcomingTasks.map(todo => {
              const dueDate = new Date(todo.dueDate)
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              const due = new Date(dueDate)
              due.setHours(0, 0, 0, 0)
              const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24))

              return (
                <li key={todo.id} className="upcoming-task-item">
                  <div className="upcoming-task-content">
                    <span className="upcoming-task-text">{todo.text}</span>
                    <span className={`upcoming-task-date ${diffDays === 0 ? 'due-today' : diffDays < 0 ? 'overdue' : ''}`}>
                      {diffDays === 0 ? 'Today' : diffDays === 1 ? 'Tomorrow' : diffDays < 0 ? 'Overdue' : `${diffDays} days`}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Calendar

