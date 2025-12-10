import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs/promises'
import nodemailer from 'nodemailer'
import cron from 'node-cron'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true
}
app.use(cors(corsOptions))
app.use(express.json())

// Data file paths
const DATA_FILE = join(__dirname, 'data', 'todos.json')
const USERS_FILE = join(__dirname, 'data', 'users.json')
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = join(__dirname, 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Read todos from file
async function readTodos() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    if (error.code === 'ENOENT') {
      return []
    }
    throw error
  }
}

// Write todos to file
async function writeTodos(todos) {
  await ensureDataDir()
  await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2), 'utf8')
}

// User management functions
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    if (error.code === 'ENOENT') {
      return []
    }
    throw error
  }
}

async function writeUsers(users) {
  await ensureDataDir()
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8')
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' })
    }
    req.user = user
    next()
  })
}

// Email configuration
// For production, use environment variables for email credentials
const createTransporter = () => {
  // Using Gmail as default - configure with your email credentials
  // You can also use other services like SendGrid, Mailgun, etc.
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER || '', // Your email
      pass: process.env.EMAIL_PASS || ''  // Your app password (not regular password)
    }
  })
  return transporter
}

// Send reminder email
async function sendReminderEmail(todo, userEmail) {
  if (!userEmail || !userEmail.trim()) {
    console.log('No email provided for reminder')
    return false
  }

  try {
    const transporter = createTransporter()
    
    // Skip if email credentials are not configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email credentials not configured. Skipping email send.')
      console.log('To enable emails, set EMAIL_USER and EMAIL_PASS environment variables')
      return false
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `⏰ Reminder: Task Due Today - ${todo.text}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">Task Reminder</h2>
          <p>You have a task that is due today:</p>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${todo.text}</h3>
            <p><strong>Due Date:</strong> ${new Date(todo.dueDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            ${todo.completed ? '<p style="color: #10b981;"><strong>Status: Completed ✓</strong></p>' : '<p style="color: #ef4444;"><strong>Status: Pending</strong></p>'}
          </div>
          <p>Don't forget to complete your task!</p>
          <p style="color: #64748b; font-size: 12px; margin-top: 30px;">
            This is an automated reminder from your Smart Todo App.
          </p>
        </div>
      `,
      text: `
Task Reminder

You have a task that is due today:

Task: ${todo.text}
Due Date: ${new Date(todo.dueDate).toLocaleDateString()}
Status: ${todo.completed ? 'Completed' : 'Pending'}

Don't forget to complete your task!
      `
    }

    await transporter.sendMail(mailOptions)
    console.log(`Reminder email sent to ${userEmail} for task: ${todo.text}`)
    return true
  } catch (error) {
    console.error('Error sending reminder email:', error)
    return false
  }
}

// Check for due tasks and send reminders
async function checkDueTasks() {
  try {
    const todos = await readTodos()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (const todo of todos) {
      if (todo.dueDate && !todo.completed && todo.userEmail) {
        const dueDate = new Date(todo.dueDate)
        dueDate.setHours(0, 0, 0, 0)

        // Check if task is due today
        if (dueDate.getTime() === today.getTime()) {
          // Check if we've already sent a reminder today
          const lastReminderDate = todo.lastReminderSent 
            ? new Date(todo.lastReminderSent).toDateString()
            : null
          
          if (lastReminderDate !== today.toDateString()) {
            await sendReminderEmail(todo, todo.userEmail)
            // Update last reminder sent date
            todo.lastReminderSent = new Date().toISOString()
            await writeTodos(todos)
          }
        }
      }
    }
  } catch (error) {
    console.error('Error checking due tasks:', error)
  }
}

// Schedule daily check for due tasks (runs every day at 9 AM)
cron.schedule('0 9 * * *', () => {
  console.log('Checking for due tasks...')
  checkDueTasks()
})

// Also check immediately on server start
checkDueTasks()

// Authentication Routes

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' })
    }

    const users = await readUsers()

    // Check if user already exists
    if (users.find(u => u.username === username)) {
      return res.status(400).json({ error: 'Username already exists' })
    }

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    }

    users.push(newUser)
    await writeUsers(users)

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, username: newUser.username, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      }
    })
  } catch (error) {
    console.error('Error registering user:', error)
    res.status(500).json({ error: 'Failed to register user' })
  }
})

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' })
    }

    const users = await readUsers()
    const user = users.find(u => u.username === username || u.email === username)

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Error logging in:', error)
    res.status(500).json({ error: 'Failed to login' })
  }
})

// Verify token (get current user)
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({
    user: {
      id: req.user.userId,
      username: req.user.username,
      email: req.user.email
    }
  })
})

// Productivity tips
const productivityTips = [
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
  "Learn to say 'no' to tasks that don't align with your goals or priorities.",
  "Use time blocking to allocate specific time slots for different types of tasks.",
  "Keep your workspace clean and organized. A cluttered space leads to a cluttered mind.",
  "Delegate tasks that others can do, so you can focus on what only you can do.",
  "Track your time to understand where it actually goes and identify time-wasting activities.",
  "Set realistic expectations. Overcommitting leads to stress and decreased productivity.",
  "Practice the 'Done' list: Write down what you've completed to maintain motivation.",
  "Use the power of habit: Attach new tasks to existing routines.",
  "Sleep well! Adequate rest is crucial for maintaining high productivity levels."
]

// API Routes

// Get all todos (user-specific)
app.get('/api/todos', authenticateToken, async (req, res) => {
  try {
    const todos = await readTodos()
    const userTodos = todos.filter(todo => todo.userId === req.user.userId)
    res.json(userTodos)
  } catch (error) {
    console.error('Error reading todos:', error)
    res.status(500).json({ error: 'Failed to read todos' })
  }
})

// Create a new todo
app.post('/api/todos', authenticateToken, async (req, res) => {
  try {
    const { text, completed = false, dueDate, userEmail } = req.body
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Todo text is required' })
    }

    const todos = await readTodos()
    const newTodo = {
      id: req.body.id || Date.now().toString(),
      userId: req.user.userId,
      text: text.trim(),
      completed,
      createdAt: req.body.createdAt || new Date().toISOString(),
      dueDate: dueDate || null,
      userEmail: userEmail || req.user.email || null,
      lastReminderSent: null
    }

    todos.push(newTodo)
    await writeTodos(todos)
    res.status(201).json(newTodo)
  } catch (error) {
    console.error('Error creating todo:', error)
    res.status(500).json({ error: 'Failed to create todo' })
  }
})

// Update a todo
app.put('/api/todos/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const todos = await readTodos()
    const todo = todos.find(t => t.id === id)

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' })
    }

    // Check if todo belongs to user
    if (todo.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized to update this todo' })
    }

    const index = todos.findIndex(t => t.id === id)
    todos[index] = { ...todos[index], ...req.body }
    await writeTodos(todos)
    res.json(todos[index])
  } catch (error) {
    console.error('Error updating todo:', error)
    res.status(500).json({ error: 'Failed to update todo' })
  }
})

// Delete a todo
app.delete('/api/todos/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const todos = await readTodos()
    const todo = todos.find(t => t.id === id)

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' })
    }

    // Check if todo belongs to user
    if (todo.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized to delete this todo' })
    }

    const filteredTodos = todos.filter(t => t.id !== id)
    await writeTodos(filteredTodos)
    res.json({ message: 'Todo deleted successfully' })
  } catch (error) {
    console.error('Error deleting todo:', error)
    res.status(500).json({ error: 'Failed to delete todo' })
  }
})

// Get a random productivity tip
app.get('/api/productivity-tip', (req, res) => {
  const randomTip = productivityTips[Math.floor(Math.random() * productivityTips.length)]
  res.json({ tip: randomTip })
})

// Send test email
app.post('/api/send-test-email', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    const testTodo = {
      text: 'Test Reminder',
      dueDate: new Date().toISOString(),
      completed: false
    }

    const sent = await sendReminderEmail(testTodo, email)
    if (sent) {
      res.json({ message: 'Test email sent successfully' })
    } else {
      res.status(500).json({ error: 'Failed to send test email. Check email configuration.' })
    }
  } catch (error) {
    console.error('Error sending test email:', error)
    res.status(500).json({ error: 'Failed to send test email' })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Todo API is running' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
  console.log(`📝 Todo API available at http://localhost:${PORT}/api/todos`)
  console.log(`💡 Productivity tips available at http://localhost:${PORT}/api/productivity-tip`)
  console.log(`📧 Email reminders enabled. Checking for due tasks daily at 9 AM.`)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`⚠️  Email credentials not configured. Set EMAIL_USER and EMAIL_PASS environment variables to enable email reminders.`)
  }
})

