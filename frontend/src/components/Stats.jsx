function Stats({ stats }) {
  if (stats.total === 0) return null

  return (
    <div className="stats">
      <div className="stat-item">
        <div className="stat-value">{stats.total}</div>
        <div className="stat-label">Total Tasks</div>
      </div>
      <div className="stat-item">
        <div className="stat-value">{stats.completed}</div>
        <div className="stat-label">Completed</div>
      </div>
      <div className="stat-item">
        <div className="stat-value">{stats.pending}</div>
        <div className="stat-label">Pending</div>
      </div>
    </div>
  )
}

export default Stats

