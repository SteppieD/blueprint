# 🚀 Deploying to Vercel

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SteppieD/blueprint)

## Manual Deployment

1. **Push to GitHub** (already done ✓)

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Configure environment variables (see below)

3. **Environment Variables** (optional)
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-xxx  # For AI analysis
   ```

## What Works on Vercel

### ✅ Full Features
- PDF upload and parsing
- Material calculations
- Price estimates with variations
- Beautiful UI with progress indicators
- Mobile responsive design

### ⚠️ Limitations
- **4.5MB max file size** (Vercel limit)
- **10-second processing time** (no job queue)
- **Simplified analysis** (no Claude API calls to stay under timeout)
- **No Redis** (in-memory processing only)
- **No persistent storage** (files processed on-demand)

## Vercel-Specific Optimizations

The app automatically detects Vercel deployment and:
1. Uses `/api/analyze/vercel` endpoint (synchronous)
2. Processes files directly without job queue
3. Shows file size warning in UI
4. Completes analysis in <10 seconds

## Testing on Vercel

1. Visit your deployed URL
2. Upload a PDF under 4.5MB
3. Select materials
4. Click "Analyze Blueprint"
5. Get instant results (no progress bar needed)

## Upgrading for Production

### Vercel Pro ($20/month)
- 60-second timeout (can use Claude API)
- 100MB file uploads
- Priority support

### External Services
Add these for full functionality:
- **Upstash Redis**: Free tier for job queue
- **Cloudinary**: PDF storage and processing
- **AWS Lambda**: Background processing for large files

## Cost on Vercel

### Free Tier
- **100GB bandwidth/month**
- **100 hours build time/month**
- **Unlimited API calls**
- **Perfect for**: Personal use, demos, small projects

### With Claude API
- Add ~$0.05-0.10 per analysis
- Requires Pro plan for longer timeouts

## Environment Variables for Vercel

```bash
# Required for AI analysis (optional)
ANTHROPIC_API_KEY=your-key-here

# Automatically set by Vercel
NEXT_PUBLIC_VERCEL_URL=1
VERCEL_ENV=production
```

## Troubleshooting

### "File too large" error
- Vercel limits: 4.5MB for API routes
- Solution: Compress PDFs or use external storage

### "Analysis timed out"
- Free tier: 10-second limit
- Solution: Upgrade to Pro or simplify analysis

### "No styling in production"
- Already fixed! Using Tailwind v3.4
- Clear cache if issues persist

## Architecture on Vercel

```
User uploads PDF → Vercel Function → Process PDF → Calculate → Return results
     (4.5MB max)     (10s timeout)    (No Claude)   (Instant)    (Direct response)
```

## Next Steps

1. **Deploy to Vercel** ✓
2. **Test with small PDFs**
3. **Monitor usage in Vercel Dashboard**
4. **Upgrade to Pro if needed**
5. **Add external services for scale**

Your app is **Vercel-ready** and will work great within the platform limits! 🎉