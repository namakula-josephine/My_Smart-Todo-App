# Email Setup Guide

To enable email reminders for tasks, you need to configure email credentials.

## Gmail Setup (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to your Google Account settings
   - Navigate to Security → 2-Step Verification → App passwords
   - Create a new app password for "Mail"
   - Copy the generated 16-character password

3. **Set Environment Variables**:
   
   **Windows (PowerShell):**
   ```powershell
   $env:EMAIL_USER="your-email@gmail.com"
   $env:EMAIL_PASS="your-app-password"
   ```
   
   **Windows (CMD):**
   ```cmd
   set EMAIL_USER=your-email@gmail.com
   set EMAIL_PASS=your-app-password
   ```
   
   **Linux/Mac:**
   ```bash
   export EMAIL_USER="your-email@gmail.com"
   export EMAIL_PASS="your-app-password"
   ```

4. **Create a .env file** (alternative):
   Create a `.env` file in the backend directory:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_SERVICE=gmail
   ```
   
   Then install `dotenv` package and load it in server.js:
   ```bash
   npm install dotenv
   ```
   
   Add at the top of server.js:
   ```javascript
   import 'dotenv/config'
   ```

## Other Email Services

You can use other email services by configuring the transporter differently:

### SendGrid
```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
})
```

### Mailgun
```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.mailgun.org',
  port: 587,
  auth: {
    user: process.env.MAILGUN_USER,
    pass: process.env.MAILGUN_PASS
  }
})
```

### Outlook/Hotmail
```javascript
const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})
```

## Testing Email

Once configured, you can test the email functionality by:
1. Adding a task with a due date and your email
2. Setting the due date to today
3. The server checks for due tasks daily at 9 AM and also on startup

You can also use the test endpoint (if implemented):
```bash
POST /api/send-test-email
Body: { "email": "your@email.com" }
```

## Security Notes

- Never commit your email credentials to version control
- Use environment variables or a secure secrets manager
- Use app passwords instead of your main account password
- Consider using a dedicated email account for notifications

