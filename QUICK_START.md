# Quick Start Guide

## 📦 Installation & Setup

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

## 🚀 Running the App

### Terminal 1 - Backend Server
```bash
cd backend
npm start
```
Backend runs on `http://localhost:5000`

### Terminal 2 - Frontend Server
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:3000`

## 📧 Email Reminders Setup (Optional)

1. **Set Environment Variables** before starting backend:

   **Windows PowerShell:**
   ```powershell
   $env:EMAIL_USER="your-email@gmail.com"
   $env:EMAIL_PASS="your-app-password"
   ```

   **Windows CMD:**
   ```cmd
   set EMAIL_USER=your-email@gmail.com
   set EMAIL_PASS=your-app-password
   ```

   **Linux/Mac:**
   ```bash
   export EMAIL_USER="your-email@gmail.com"
   export EMAIL_PASS="your-app-password"
   ```

2. **Get Gmail App Password:**
   - Go to Google Account → Security
   - Enable 2-Step Verification
   - Generate App Password for "Mail"
   - Use the 16-character password

3. See [backend/EMAIL_SETUP.md](backend/EMAIL_SETUP.md) for detailed instructions

## ✨ Using the App

### Adding Tasks
1. Enter task description
2. (Optional) Set a due date
3. (Optional) Add your email for reminders
4. Click "Add Task"

### Calendar View
- Click "📅 Calendar View" button
- See all tasks organized by date
- Navigate months with Prev/Next buttons
- View upcoming tasks in sidebar

### Email Reminders
- Add tasks with due dates and your email
- Server checks daily at 9 AM
- Receive emails when tasks are due
- Only incomplete tasks trigger reminders

## 🎯 Key Features

- ✅ List & Calendar views
- ✅ Due date tracking
- ✅ Email reminders
- ✅ Local storage backup
- ✅ Beautiful, responsive UI

Happy organizing! 🎉

