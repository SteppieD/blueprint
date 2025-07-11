# 🚀 Blueprint Material Analyzer - Production Setup

## Quick Start

1. **Copy environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Edit `.env.local`** with your credentials:
   - `ANTHROPIC_API_KEY` - Get from https://console.anthropic.com
   - `REDIS_URL` - Optional, defaults to local Redis
   - AWS credentials - Optional, uses local storage by default

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Visit** http://localhost:3000

## Production Features Implemented

### ✅ Real PDF Processing
- Uses MCP PDF reader (if available) or pdf-parse library
- Extracts construction data from blueprints
- Handles files up to 50MB

### ✅ Claude AI Integration
- Intelligent blueprint analysis
- Extracts square footage, wall dimensions, material requirements
- Falls back to extraction algorithms if no API key

### ✅ Live Price Simulation
- Simulates market price variations (±10%)
- Caches prices for 1 hour
- Ready for real Rona scraping implementation

### ✅ Asynchronous Processing
- Job queue system (works without Redis in dev)
- Real-time progress updates
- Handles long-running analyses

### ✅ Professional UI
- Progress bars during analysis
- Detailed cost breakdowns
- Mobile-responsive design

## Configuration Options

### Local Development (No External Services)
```env
USE_LOCAL_STORAGE=true
ANTHROPIC_API_KEY=sk-ant-api03-xxx  # Optional
```

### Production with Redis
```env
REDIS_URL=redis://your-redis-url:6379
USE_LOCAL_STORAGE=false
```

### Production with S3
```env
AWS_S3_BUCKET=your-bucket-name
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
```

## API Endpoints

- `POST /api/analyze` - Start blueprint analysis
- `GET /api/analyze/status/:jobId` - Check job status
- `GET /api/health` - System health check

## Cost Per Analysis

- **Without Claude API**: $0 (uses extraction algorithms)
- **With Claude API**: ~$0.05-0.10 per blueprint
- **Storage**: Minimal (files cleaned up after 24 hours)

## Deployment

### Vercel (Recommended)
```bash
vercel
```

### Docker
```bash
docker build -t blueprint-analyzer .
docker run -p 3000:3000 blueprint-analyzer
```

## Testing

1. Upload the Wagner Residence PDF
2. Select materials (2x6 studs, plywood, etc.)
3. Click "Analyze Blueprint"
4. Watch real-time progress
5. Review detailed cost breakdown

## Next Steps

1. **Add real Rona price scraping** - Uncomment code in `priceScraper.ts`
2. **Set up Redis** for production job queue
3. **Configure Claude API** for intelligent analysis
4. **Add authentication** before public deployment

## Troubleshooting

- **PDF parsing fails**: Check file size and format
- **No progress updates**: Ensure job queue is running
- **Prices seem static**: This is normal - real scraping not enabled yet

Visit `/api/health` to check system status.