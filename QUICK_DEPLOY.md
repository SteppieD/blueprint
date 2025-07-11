# Quick Deploy Instructions

## Step 1: Create GitHub Repository (2 minutes)

1. Go to https://github.com/new
2. Repository name: `blueprint-material-analyzer`
3. Description: `Web app that analyzes construction blueprints to calculate material quantities and costs`
4. Make it **Public**
5. **Don't** check "Add a README file" (we already have one)
6. Click "Create repository"

## Step 2: Push Your Code (1 minute)

Copy and paste these commands in your terminal:

```bash
cd /Users/sepg/Documents/blueprint-material-analyzer

# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/blueprint-material-analyzer.git

# Push the code
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel (3 minutes)

1. Go to https://vercel.com
2. Click "Continue with GitHub" 
3. Sign in with your GitHub account
4. Click "Import Project" or "New Project"
5. Find and select `blueprint-material-analyzer` from your repositories
6. Click "Import"
7. Leave all settings as default
8. Click "Deploy"

**That's it!** Vercel will build and deploy your app automatically.

## Step 4: Test Your Live App

1. Vercel will give you a URL like: `https://blueprint-material-analyzer-xxx.vercel.app`
2. Visit the URL
3. Upload a PDF blueprint
4. Select materials to calculate
5. Get instant cost estimates!

## Your App Features

✅ Drag & drop PDF upload
✅ Material selection (2x4s, 2x6s, plywood, OSB)
✅ Automatic square footage extraction
✅ Real-time cost calculations
✅ CSV export functionality
✅ Mobile responsive design

## Need Help?

If you get stuck:
1. Check the GitHub repository was created correctly
2. Ensure you replaced YOUR_USERNAME in the git command
3. Verify you're signed into the same GitHub account on Vercel
4. Try refreshing the Vercel import page

The whole process should take about 6 minutes total!