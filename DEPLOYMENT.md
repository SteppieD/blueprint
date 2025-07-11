# Deployment Instructions

## Option 1: Using GitHub CLI (Recommended)

Run the setup script:
```bash
./setup-github.sh
```

This will guide you through GitHub authentication and repository creation.

## Option 2: Manual Setup

### 1. Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `blueprint-material-analyzer`
3. Description: "Web app that analyzes construction blueprints to calculate material quantities and costs"
4. Make it **Public**
5. **Don't** initialize with README (we already have one)
6. Click "Create repository"

### 2. Push Code to GitHub

After creating the repository, run these commands:

```bash
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/blueprint-material-analyzer.git

# Push the code
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### 3. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Start Deploying" or "New Project"
3. Import Git Repository
4. Select your `blueprint-material-analyzer` repository
5. Configure Project:
   - Framework Preset: Next.js (should auto-detect)
   - Root Directory: ./
   - Leave other settings as default
6. Click "Deploy"

### 4. Access Your App

Once deployed, Vercel will provide you with:
- A production URL (e.g., `blueprint-material-analyzer.vercel.app`)
- Automatic deployments on every push to main branch

## Environment Variables (Optional)

If you plan to add features that need environment variables:

1. In Vercel dashboard, go to Settings → Environment Variables
2. Add variables like:
   - `NEXT_PUBLIC_API_URL` (if you add external APIs)
   - `DATABASE_URL` (if you add a database)

## Local Development

To run locally:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Testing the Application

1. Upload a construction blueprint PDF
2. Select materials to calculate (2x4s, 2x6s, plywood, etc.)
3. Click "Analyze Blueprint"
4. View results and download CSV

## Troubleshooting

### PDF Upload Issues
- Ensure PDF is under 50MB
- Check browser console for errors
- Verify pdf-parse is installed: `npm ls pdf-parse`

### Deployment Issues
- Check Vercel build logs
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility (18+)

### Performance Issues
- PDF analysis is limited to 30 seconds
- Large PDFs may timeout - consider splitting them

## Next Steps

Consider adding:
- User authentication (NextAuth.js)
- Database for saving projects (Supabase/Prisma)
- Real-time pricing APIs
- More material types
- Mobile app version