# Quick Fix for Frontend Build Issue

## Problem
`npm ci` is failing because the `package-lock.json` is out of sync.

## Solution

### Option 1: Update Build Command in Render (Recommended)

1. Go to your **frontend service** in Render Dashboard
2. Go to **Settings** tab
3. Find **"Build Command"**
4. Change it to:
   ```
   npm install && npm run build
   ```
5. **OR** if that still fails, use:
   ```
   NODE_ENV=development npm install && npm run build
   ```
6. Click **"Save Changes"** - It will auto-redeploy

### Option 2: Regenerate package-lock.json locally

If Option 1 doesn't work, regenerate your lock file:

1. **Locally**, run:
   ```bash
   cd frontend
   rm package-lock.json
   npm install
   ```

2. **Commit and push**:
   ```bash
   git add frontend/package-lock.json
   git commit -m "Fix package-lock.json"
   git push
   ```

3. Render will automatically redeploy with the new lock file

### Option 3: Use .npmrc file (Advanced)

Create a file `frontend/.npmrc` with:
```
production=false
```

This forces npm to install devDependencies even in production.

## Why This Happens

- `npm ci` requires an exact match between `package.json` and `package-lock.json`
- If dependencies were added/updated without updating the lock file, `npm ci` fails
- `npm install` is more forgiving and will update the lock file if needed

## Recommended Command

Use this in Render's Build Command:
```
npm install && npm run build
```

This will:
- Install all dependencies (including devDependencies needed for build)
- Build the production bundle
- Work even if lock file is slightly out of sync

