# 💼 My Smart Todo App

A beautiful and feature-rich todo application built with React and Node.js, designed to help you stay organized and boost your productivity.

## 🌟 Features

- **User Authentication** - Create accounts and securely log in
- **Welcome Message** - Personalized greeting when you log in
- **User-Specific Tasks** - Each user has their own private task list
- **Add Tasks** - Quickly add new tasks to your todo list
- **Mark Tasks Done** - Check off completed tasks with a simple click
- **Delete Tasks** - Remove tasks you no longer need
- **Due Dates** - Set due dates for your tasks with date picker
- **Calendar View** - Visualize your tasks on a beautiful calendar interface
- **Email Reminders** - Get automatic email reminders when tasks are due
- **Local Storage** - All tasks are automatically saved to your browser's local storage
- **Backend API** - Node.js/Express backend for data persistence
- **Productivity Tips** - Get random productivity tips to stay motivated
- **Statistics** - View your task statistics (total, completed, pending)
- **Beautiful UI** - Modern, responsive design with smooth animations
- **View Toggle** - Switch between List View and Calendar View

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd todo-app
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   The backend will run on `http://localhost:5000`

2. **Start the frontend development server** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

3. **Open your browser**
   Navigate to `http://localhost:3000` to see the application

## 📁 Project Structure

```
todo-app/
├── backend/
│   ├── data/              # Todo data storage (auto-created)
│   ├── server.js          # Express server and API routes
│   └── package.json       # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TodoInput.jsx
│   │   │   ├── TodoList.jsx
│   │   │   ├── TodoItem.jsx
│   │   │   ├── ProductivityTip.jsx
│   │   │   ├── Stats.jsx
│   │   │   └── Calendar.jsx
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # React entry point
│   │   └── index.css      # Global styles
│   ├── index.html
│   ├── vite.config.js     # Vite configuration
│   └── package.json       # Frontend dependencies
│
└── README.md
```

## 🔧 API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user (requires: username, email, password)
- `POST /api/auth/login` - Login user (requires: username, password)
- `GET /api/auth/me` - Get current user info (requires: Bearer token)

### Todo Endpoints (All require authentication)
- `GET /api/todos` - Get all todos for the authenticated user
- `POST /api/todos` - Create a new todo (supports `dueDate` and `userEmail` fields)
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

### Other Endpoints
- `GET /api/productivity-tip` - Get a random productivity tip
- `POST /api/send-test-email` - Send a test email reminder
- `GET /api/health` - Health check endpoint

## 💾 Data Storage

- **Backend**: 
  - Todos are stored in `backend/data/todos.json` (user-specific)
  - Users are stored in `backend/data/users.json`
  - Passwords are hashed with bcrypt
- **Frontend**: Todos are also saved to browser's local storage as a backup (user-specific)
- If the backend is unavailable, the app will fall back to local storage

## 🔐 Authentication

The app includes secure user authentication:

- **Registration**: Create an account with username, email, and password
- **Login**: Sign in with your username/email and password
- **JWT Tokens**: Secure token-based authentication (7-day expiration)
- **Protected Routes**: All todo endpoints require authentication
- **User Isolation**: Each user only sees and manages their own tasks
- **Welcome Message**: Personalized greeting with your username when you log in

## 🎨 Features in Detail

### Task Management
- Add tasks with a clean input interface
- Set due dates for tasks with an intuitive date picker
- Add email address to receive reminders for tasks
- Mark tasks as completed with checkboxes
- Delete tasks with the delete button
- Visual feedback for completed tasks (strikethrough)
- Color-coded due date indicators (overdue, due today, due soon)

### Calendar View
- Beautiful calendar interface showing all tasks by date
- Visual indicators for days with tasks
- Highlighted current day
- Upcoming tasks sidebar
- Easy navigation between months
- Task counts per day (pending/completed)

### Email Reminders
- Automatic email reminders sent when tasks are due
- Daily check at 9 AM for due tasks
- Reminders only sent for incomplete tasks
- HTML formatted emails with task details
- Configurable email service (Gmail, SendGrid, Mailgun, etc.)
- See [EMAIL_SETUP.md](backend/EMAIL_SETUP.md) for configuration guide

### Productivity Tips
- Random productivity tips displayed in a sidebar
- Refresh button to get new tips
- Tips are served from the backend API

### Statistics
- Real-time statistics showing:
  - Total number of tasks
  - Completed tasks count
  - Pending tasks count

## 🛠️ Technologies Used

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API calls
- **CSS3** - Modern styling with CSS variables

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **CORS** - Cross-origin resource sharing
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing
- **Nodemailer** - Email sending functionality
- **node-cron** - Scheduled task checking for reminders

## 📝 Development

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

The production build will be in the `frontend/dist` directory.

### Running in Development Mode

The backend supports watch mode:
```bash
cd backend
npm run dev
```

### Email Reminder Setup

To enable email reminders:

1. **Configure email credentials** (see [EMAIL_SETUP.md](backend/EMAIL_SETUP.md) for detailed instructions)
2. Set environment variables:
   ```bash
   export EMAIL_USER="your-email@gmail.com"
   export EMAIL_PASS="your-app-password"
   ```
3. Restart the backend server

The server will automatically:
- Check for due tasks daily at 9 AM
- Send email reminders to users who have tasks due
- Only send one reminder per task per day

## 🎯 Future Enhancements

Potential features that could be added:
- User authentication
- Task categories/tags
- Task search and filter
- Drag and drop reordering
- Dark mode toggle
- Export/import functionality
- Multiple reminder times (1 day before, 1 hour before, etc.)
- Push notifications
- Task priorities

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Happy Tasking! 🎉**

