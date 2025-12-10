# 🚀 Deployment Guide for Render

This guide will walk you through deploying your Todo App to Render.

## Prerequisites

1. A GitHub account
2. Your code pushed to a GitHub repository
3. A Render account (sign up at https://render.com - it's free!)

## Step 1: Push Your Code to GitHub

1. Initialize git (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a new repository on GitHub and push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/todo-app.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy Backend to Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → Select **"Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service**:
   - **Name**: `todo-app-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or upgrade if needed)

5. **Environment Variables** (Add these in Render dashboard):
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=your-super-secret-jwt-key-change-this
   FRONTEND_URL=https://your-frontend-url.onrender.com
   EMAIL_USER=your-email@gmail.com (optional, for email reminders)
   EMAIL_PASS=your-app-password (optional, for email reminders)
   EMAIL_SERVICE=gmail (optional)
   ```

6. **Click "Create Web Service"**
7. **Wait for deployment** - Note the backend URL (e.g., `https://todo-app-backend.onrender.com`)

## Step 3: Deploy Frontend to Render

1. **Go to Render Dashboard** → Click **"New +"** → Select **"Web Service"**
2. **Select the same GitHub repository**
3. **Configure the service**:
   - **Name**: `todo-app-frontend`
   - **Environment**: `Node`
   - **Region**: Same as backend
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx serve -s dist -l 10000`
   - **Plan**: Free

4. **Environment Variables**:
   ```
   NODE_ENV=production
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
   ⚠️ **Important**: Replace `your-backend-url` with your actual backend URL from Step 2!

5. **Click "Create Web Service"**
6. **Wait for deployment** - Your app will be live!

## Step 4: Update Backend CORS (After Frontend is Deployed)

Once your frontend is deployed, update the backend environment variable:
1. Go to your backend service in Render
2. Go to **Environment** tab
3. Update `FRONTEND_URL` to your frontend URL (e.g., `https://todo-app-frontend.onrender.com`)
4. **Save Changes** - Render will automatically redeploy

## Alternative: Using render.yaml (Blue-Green Deployment)

If you want to use the `render.yaml` file for easier deployment:

1. **Push render.yaml to your repository**
2. **Go to Render Dashboard** → **"New +"** → **"Blueprint"**
3. **Connect your repository**
4. Render will automatically detect `render.yaml` and set up both services
5. **Set environment variables** in the Render dashboard as mentioned above

## Environment Variables Reference

### Backend Variables:
- `NODE_ENV` = `production`
- `PORT` = `10000` (Render's default)
- `JWT_SECRET` = Your secret key (generate a strong random string)
- `FRONTEND_URL` = Your frontend URL (set after frontend deployment)
- `EMAIL_USER` = Your Gmail (optional)
- `EMAIL_PASS` = Gmail app password (optional)
- `EMAIL_SERVICE` = `gmail` (optional)

### Frontend Variables:
- `NODE_ENV` = `production`
- `VITE_API_URL` = `https://your-backend-url.onrender.com/api`

## Generating JWT Secret

You can generate a secure JWT secret using:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Or use an online generator: https://randomkeygen.com/

## Troubleshooting

### Backend Issues:
- **Check logs**: Go to your service → "Logs" tab
- **Verify environment variables**: Make sure all required vars are set
- **Check PORT**: Render uses port 10000 by default

### Frontend Issues:
- **API connection errors**: Verify `VITE_API_URL` is correct
- **Build errors**: Check if all dependencies are in `package.json`
- **CORS errors**: Make sure `FRONTEND_URL` is set correctly in backend

### Common Issues:
1. **"Cannot find module"**: Make sure all dependencies are in `package.json`
2. **CORS errors**: Update `FRONTEND_URL` in backend after frontend deployment
3. **Build timeout**: Free tier has build time limits; consider upgrading if needed

## Free Tier Limitations

- **Sleep after inactivity**: Free tier services sleep after 15 minutes of inactivity
- **First request delay**: First request after sleep takes ~30 seconds to wake up
- **Build time**: 100 minutes/month free
- **Bandwidth**: 100GB/month free

## Upgrading (Optional)

For production apps, consider upgrading to:
- **Starter Plan ($7/month)**: No sleep, better performance
- **Professional Plans**: More resources, better support

## Testing Your Deployment

1. Visit your frontend URL
2. Create an account
3. Add some tasks
4. Verify features work (calendar, due dates, etc.)

## Support

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- Your app logs: Available in Render dashboard

---

**Your app is now live! 🎉**

Share your URLs:
- Frontend: `https://todo-app-frontend.onrender.com`
- Backend API: `https://todo-app-backend.onrender.com/api`

