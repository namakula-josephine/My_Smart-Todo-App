# 🚀 Render Deployment - Step by Step (No Root Directory Needed)

## Quick Method (Using Commands Only)

Since Root Directory might not be visible, we'll use commands with directory paths instead.

### Step 1: Deploy Backend

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. **Connect GitHub** and select your repository
4. Fill in these settings:

   ```
   Name: todo-app-backend
   Environment: Node
   Region: (choose closest to you)
   Branch: main (or your main branch name)
   
   Build Command: cd backend && npm install
   Start Command: cd backend && npm start
   
   Plan: Free
   ```

5. Click **"Advanced"** at the bottom (if visible) and you might see "Root Directory" there, but **it's not needed** - our commands handle it.

6. **Click "Create Web Service"**

7. **After it's created**, go to the **"Environment"** tab and add:
   ```
   NODE_ENV = production
   PORT = 10000
   JWT_SECRET = (generate a random string - see below)
   ```

8. **Wait for deployment** - Copy your service URL (like `https://todo-app-backend.onrender.com`)

### Step 2: Deploy Frontend

1. Go back to Render Dashboard
2. Click **"New +"** → **"Web Service"** (again, yes - separate service)
3. **Same repository**, different settings:

   ```
   Name: todo-app-frontend
   Environment: Node
   Region: (same as backend)
   Branch: main
   
   Build Command: cd frontend && npm ci --include=dev && npm run build
   
   > 💡 If that fails, try: `cd frontend && npm install --include=dev && npm run build`
   Start Command: cd frontend && npx serve -s dist -l 10000
   
   Plan: Free
   ```

4. Click **"Create Web Service"**

5. **After it's created**, go to **"Environment"** tab and add:
   ```
   NODE_ENV = production
   VITE_API_URL = https://your-backend-url.onrender.com/api
   ```
   ⚠️ Replace `your-backend-url` with your actual backend URL from Step 1!

6. **Save** - It will redeploy automatically

### Step 3: Update Backend CORS

1. Go back to your **backend service**
2. Go to **"Environment"** tab
3. Add this variable:
   ```
   FRONTEND_URL = https://your-frontend-url.onrender.com
   ```
   Replace `your-frontend-url` with your frontend URL from Step 2!

4. **Save** - Backend will redeploy

## Generate JWT Secret

Run this command locally or use an online generator:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Or visit: https://randomkeygen.com/ and copy a "CodeIgniter Encryption Keys" key

## Visual Guide - Where to Find Settings

### Basic Settings (Top Section):
- ✅ Name
- ✅ Environment (Node)
- ✅ Region
- ✅ Branch

### Build & Deploy Settings (Middle Section):
- ✅ Build Command ← **Put `cd backend && npm install` here**
- ✅ Start Command ← **Put `cd backend && npm start` here**
- ✅ Plan

### Environment Variables (After Creation):
- Go to your service → **"Environment"** tab
- Click **"Add Environment Variable"**
- Add each variable one by one

## Troubleshooting

### "Root Directory not found"
✅ **Solution**: You don't need it! The `cd backend &&` in commands handles it.

### Build fails with "Cannot find package.json"
✅ **Solution**: Make sure your commands include `cd backend &&` or `cd frontend &&`

### Frontend can't connect to backend
✅ **Solution**: 
1. Check `VITE_API_URL` is set correctly in frontend
2. Check `FRONTEND_URL` is set in backend
3. Make sure both services are running (green status)

### Service goes to sleep
✅ **Normal on free tier**: First request after sleep takes ~30 seconds to wake up

## You're Done! 🎉

Your app should now be live at:
- Frontend: `https://todo-app-frontend.onrender.com`
- Backend: `https://todo-app-backend.onrender.com`

