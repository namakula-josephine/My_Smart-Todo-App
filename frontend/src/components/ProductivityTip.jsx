import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const defaultTips = [
  "Break large tasks into smaller, manageable pieces. This makes them less overwhelming and easier to complete.",
  "Use the 2-minute rule: If a task takes less than 2 minutes, do it immediately instead of adding it to your list.",
  "Focus on one task at a time. Multitasking can reduce productivity by up to 40%.",
  "Take regular breaks using the Pomodoro Technique: 25 minutes of focused work, then a 5-minute break.",
  "Prioritize your tasks by importance and urgency. Tackle high-priority items first.",
  "Review your todo list at the end of each day and plan for the next day.",
  "Use the 'Eat the Frog' method: Do your most challenging task first thing in the morning.",
  "Set specific deadlines for your tasks. Open-ended tasks tend to get postponed.",
  "Celebrate small wins. Acknowledging progress keeps you motivated.",
  "Limit distractions by turning off notifications and creating a dedicated workspace.",
  "Batch similar tasks together to maintain focus and efficiency.",
  "Learn to say 'no' to tasks that don't align with your goals or priorities."
]

function ProductivityTip() {
  const [tip, setTip] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadTip()
  }, [])

  const loadTip = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_URL}/productivity-tip`)
      if (response.data && response.data.tip) {
        setTip(response.data.tip)
      } else {
        // Fallback to random default tip
        setTip(defaultTips[Math.floor(Math.random() * defaultTips.length)])
      }
    } catch (error) {
      console.error('Error loading tip from server:', error)
      // Fallback to random default tip
      setTip(defaultTips[Math.floor(Math.random() * defaultTips.length)])
    }
    setLoading(false)
  }

  const handleRefresh = () => {
    loadTip()
  }

  return (
    <div className="productivity-tip">
      <div className="productivity-tip-header">
        <span>💡</span>
        <h3 className="productivity-tip-title">Productivity Tip</h3>
      </div>
      {loading ? (
        <div className="tip-content">Loading tip...</div>
      ) : (
        <>
          <div className="tip-content">{tip || defaultTips[0]}</div>
          <button className="refresh-tip-btn" onClick={handleRefresh}>
            🔄 Get Another Tip
          </button>
        </>
      )}
    </div>
  )
}

export default ProductivityTip

