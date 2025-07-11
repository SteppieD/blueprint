# 🏗️ Blueprint Material Analyzer - Production Implementation Guide

## Overview

This guide explains how to transform the current demo website into a production-ready system that:
- Actually processes PDF construction blueprints
- Uses Claude AI for intelligent analysis
- Fetches real-time lumber prices from suppliers
- Provides accurate material calculations and cost estimates

## Current State vs. Production Requirements

### What We Have Now (Demo)
- ✅ Beautiful UI with modern design
- ✅ File upload interface
- ✅ Material selection system
- ❌ Mock PDF processing (hardcoded data)
- ❌ Static pricing (July 2025 estimates)
- ❌ No AI analysis

### What We Need for Production
- ✅ Real PDF text extraction and parsing
- ✅ Claude AI integration for blueprint analysis
- ✅ Live price fetching from Rona/suppliers
- ✅ Scalable backend infrastructure
- ✅ Caching and performance optimization

## Architecture Design

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│   API Routes    │────▶│ Backend Services│
│   (Frontend)    │     │  (Serverless)   │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                          │
                              ┌───────────────────────────┴───────────────┐
                              │                                           │
                    ┌─────────▼────────┐  ┌──────────▼────────┐  ┌──────▼──────┐
                    │  PDF Processor   │  │   Claude API      │  │Price Scraper│
                    │  (Docker/MCP)    │  │  (AI Analysis)    │  │   (Rona)    │
                    └──────────────────┘  └───────────────────┘  └─────────────┘
```

## Implementation Steps

### Step 1: Set Up Environment Variables

Create a `.env.local` file with:

```env
# AI Services
ANTHROPIC_API_KEY=sk-ant-api03-xxx

# Database/Cache
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgresql://user:pass@localhost:5432/blueprint_analyzer

# Storage
AWS_S3_BUCKET=blueprint-uploads
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx

# Optional: Supplier APIs
RONA_API_KEY=xxx
HOME_DEPOT_API_KEY=xxx

# Job Queue
QUEUE_URL=https://sqs.us-east-1.amazonaws.com/xxx
```

### Step 2: Install Required Dependencies

```bash
npm install @anthropic-ai/sdk aws-sdk ioredis puppeteer bull
npm install @types/bull --save-dev
```

### Step 3: Implement Real PDF Processing

#### Option A: Using MCP PDF Reader (Recommended)

```typescript
// /src/lib/pdfProcessor.ts
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function processPDFWithMCP(filePath: string): Promise<string> {
  // Use the MCP PDF reader that's already installed
  const { stdout } = await execAsync(
    `mcp-client pdf-reader read_local_pdf --path "${filePath}"`
  )
  
  return stdout
}
```

#### Option B: Using pdf-parse in Docker

```dockerfile
# Dockerfile.pdf-processor
FROM node:18-alpine

WORKDIR /app

RUN npm install pdf-parse

COPY pdf-processor.js .

CMD ["node", "pdf-processor.js"]
```

```javascript
// pdf-processor.js
const pdf = require('pdf-parse')
const fs = require('fs')

const dataBuffer = fs.readFileSync('/pdf/input.pdf')

pdf(dataBuffer).then(function(data) {
  console.log(JSON.stringify({
    text: data.text,
    pages: data.numpages,
    info: data.info
  }))
})
```

### Step 4: Integrate Claude AI for Analysis

```typescript
// /src/lib/claudeAnalyzer.ts
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

interface BlueprintAnalysis {
  totalSqFt: number
  floors: {
    basement?: number
    main: number
    upper?: number
  }
  walls: {
    exterior: { length: number; height: number }[]
    interior: { length: number; height: number }[]
  }
  rooms: {
    name: string
    sqFt: number
    walls: { length: number; height: number }[]
  }[]
}

export async function analyzeBlueprint(pdfText: string): Promise<BlueprintAnalysis> {
  const response = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 4000,
    messages: [{
      role: 'user',
      content: `You are a construction blueprint analyzer. Extract the following information from this blueprint text:

1. Total square footage and square footage per floor
2. All wall dimensions (length and height) - separate exterior and interior
3. Room dimensions and names
4. Any structural elements mentioned

Return the data in this exact JSON format:
{
  "totalSqFt": number,
  "floors": {
    "basement": number or null,
    "main": number,
    "upper": number or null
  },
  "walls": {
    "exterior": [{"length": number, "height": number}],
    "interior": [{"length": number, "height": number}]
  },
  "rooms": [
    {
      "name": string,
      "sqFt": number,
      "walls": [{"length": number, "height": number}]
    }
  ]
}

Blueprint text:
${pdfText}`
    }]
  })
  
  const content = response.content[0].text
  return JSON.parse(content)
}
```

### Step 5: Implement Live Price Fetching

```typescript
// /src/lib/priceScraper.ts
import puppeteer from 'puppeteer'
import { redis } from './cache'

interface MaterialPrice {
  name: string
  price: number
  unit: string
  supplier: string
  lastUpdated: Date
}

export async function getRonaPrice(materialName: string): Promise<MaterialPrice> {
  // Check cache first
  const cacheKey = `price:rona:${materialName}`
  const cached = await redis.get(cacheKey)
  if (cached) return JSON.parse(cached)
  
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox'] 
  })
  
  try {
    const page = await browser.newPage()
    
    // Navigate to Rona search
    await page.goto(`https://www.rona.ca/en/search?q=${encodeURIComponent(materialName)}`)
    
    // Wait for results
    await page.waitForSelector('.product-card', { timeout: 10000 })
    
    // Get first result price
    const priceData = await page.evaluate(() => {
      const card = document.querySelector('.product-card')
      const priceElement = card?.querySelector('.price-now')
      const nameElement = card?.querySelector('.product-title')
      const unitElement = card?.querySelector('.price-unit')
      
      return {
        price: parseFloat(priceElement?.textContent?.replace('$', '') || '0'),
        name: nameElement?.textContent?.trim() || '',
        unit: unitElement?.textContent?.trim() || 'each'
      }
    })
    
    const result: MaterialPrice = {
      ...priceData,
      supplier: 'Rona',
      lastUpdated: new Date()
    }
    
    // Cache for 1 hour
    await redis.setex(cacheKey, 3600, JSON.stringify(result))
    
    return result
  } finally {
    await browser.close()
  }
}

// Batch price fetching with rate limiting
export async function getBatchPrices(materials: string[]): Promise<Record<string, MaterialPrice>> {
  const prices: Record<string, MaterialPrice> = {}
  
  // Rate limit to avoid being blocked
  for (const material of materials) {
    prices[material] = await getRonaPrice(material)
    await new Promise(resolve => setTimeout(resolve, 1000)) // 1 second delay
  }
  
  return prices
}
```

### Step 6: Create Job Queue for Long-Running Tasks

```typescript
// /src/lib/jobQueue.ts
import Bull from 'bull'
import { processPDFWithMCP } from './pdfProcessor'
import { analyzeBlueprint } from './claudeAnalyzer'
import { getBatchPrices } from './priceScraper'
import { calculateMaterials } from './materialCalculator'

const analysisQueue = new Bull('blueprint-analysis', process.env.REDIS_URL)

// Job processor
analysisQueue.process(async (job) => {
  const { pdfPath, materials, userId } = job.data
  
  // Update job progress
  await job.progress(10)
  
  // 1. Process PDF
  const pdfText = await processPDFWithMCP(pdfPath)
  await job.progress(30)
  
  // 2. Analyze with Claude
  const analysis = await analyzeBlueprint(pdfText)
  await job.progress(50)
  
  // 3. Calculate material quantities
  const quantities = calculateMaterials(analysis, materials)
  await job.progress(70)
  
  // 4. Get current prices
  const prices = await getBatchPrices(materials)
  await job.progress(90)
  
  // 5. Generate report
  const report = generateReport(quantities, prices)
  await job.progress(100)
  
  return report
})

export async function queueAnalysis(pdfPath: string, materials: string[], userId: string) {
  const job = await analysisQueue.add({
    pdfPath,
    materials,
    userId
  })
  
  return job.id
}
```

### Step 7: Update API Routes

```typescript
// /src/app/api/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { uploadToS3 } from '@/lib/storage'
import { queueAnalysis } from '@/lib/jobQueue'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const materials = JSON.parse(formData.get('materials') as string)
    
    // Upload PDF to S3
    const buffer = Buffer.from(await file.arrayBuffer())
    const s3Key = await uploadToS3(buffer, file.name)
    
    // Queue the analysis job
    const jobId = await queueAnalysis(s3Key, materials, 'user-id')
    
    return NextResponse.json({
      jobId,
      message: 'Analysis started. Poll /api/analyze/status for results.'
    })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to start analysis' },
      { status: 500 }
    )
  }
}
```

```typescript
// /src/app/api/analyze/status/[jobId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getJob } from '@/lib/jobQueue'

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const job = await getJob(params.jobId)
  
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  }
  
  const state = await job.getState()
  const progress = job.progress()
  
  if (state === 'completed') {
    const result = job.returnvalue
    return NextResponse.json({ status: 'completed', result })
  }
  
  return NextResponse.json({ 
    status: state, 
    progress,
    message: getProgressMessage(progress)
  })
}

function getProgressMessage(progress: number): string {
  if (progress < 30) return 'Reading blueprint PDF...'
  if (progress < 50) return 'Analyzing blueprint with AI...'
  if (progress < 70) return 'Calculating material quantities...'
  if (progress < 90) return 'Fetching current prices...'
  return 'Generating report...'
}
```

### Step 8: Update Frontend for Async Processing

```typescript
// /src/app/page.tsx (update handleAnalyze function)
const handleAnalyze = async () => {
  if (!file || selectedMaterials.length === 0) return
  
  setIsAnalyzing(true)
  
  try {
    // Start analysis
    const formData = new FormData()
    formData.append('file', file)
    formData.append('materials', JSON.stringify(selectedMaterials))
    
    const response = await fetch('/api/analyze', {
      method: 'POST',
      body: formData,
    })
    
    const { jobId } = await response.json()
    
    // Poll for results
    const pollInterval = setInterval(async () => {
      const statusResponse = await fetch(`/api/analyze/status/${jobId}`)
      const status = await statusResponse.json()
      
      setAnalysisProgress(status.progress)
      setProgressMessage(status.message)
      
      if (status.status === 'completed') {
        clearInterval(pollInterval)
        setAnalysisResult(status.result)
        setIsAnalyzing(false)
      } else if (status.status === 'failed') {
        clearInterval(pollInterval)
        alert('Analysis failed. Please try again.')
        setIsAnalyzing(false)
      }
    }, 1000)
  } catch (error) {
    console.error('Analysis error:', error)
    alert('Failed to analyze blueprint. Please try again.')
    setIsAnalyzing(false)
  }
}
```

## Deployment Options

### Option 1: Vercel + External Processing (Recommended)

```yaml
# vercel.json
{
  "functions": {
    "src/app/api/analyze/route.ts": {
      "maxDuration": 10
    }
  },
  "env": {
    "PROCESSING_SERVICE_URL": "@processing_service_url"
  }
}
```

Use AWS Lambda or Google Cloud Run for the actual processing.

### Option 2: Self-Hosted with Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - REDIS_URL=redis://redis:6379
      - DATABASE_URL=postgres://user:pass@postgres:5432/blueprint
    depends_on:
      - redis
      - postgres
  
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
  
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=blueprint
    ports:
      - "5432:5432"
  
  worker:
    build: .
    command: npm run worker
    environment:
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
```

### Option 3: AWS Infrastructure

```typescript
// infrastructure/cdk/stack.ts
import * as cdk from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as sqs from 'aws-cdk-lib/aws-sqs'

export class BlueprintAnalyzerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
    
    // S3 bucket for PDFs
    const pdfBucket = new s3.Bucket(this, 'PDFBucket', {
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
    })
    
    // SQS queue for jobs
    const jobQueue = new sqs.Queue(this, 'JobQueue', {
      visibilityTimeout: cdk.Duration.minutes(15),
    })
    
    // Lambda for processing
    const processor = new lambda.Function(this, 'Processor', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'processor.handler',
      code: lambda.Code.fromAsset('lambda'),
      timeout: cdk.Duration.minutes(15),
      memorySize: 3008,
      environment: {
        BUCKET_NAME: pdfBucket.bucketName,
        ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY!,
      }
    })
    
    pdfBucket.grantRead(processor)
  }
}
```

## Cost Analysis

### Per Analysis Costs
- **Claude API**: ~$0.05 (based on 3-4k tokens)
- **PDF Processing**: ~$0.01 (compute time)
- **Price Scraping**: ~$0.02 (Puppeteer runtime)
- **Storage**: ~$0.001 (S3)
- **Total**: ~$0.08-0.10 per analysis

### Monthly Infrastructure
- **Small (< 1000 analyses/month)**: ~$50-100
  - Vercel Pro: $20
  - Redis Cloud: $15
  - AWS Lambda: ~$20
  
- **Medium (1000-10000 analyses/month)**: ~$200-500
  - Dedicated VPS: $40-80
  - Managed Database: $50
  - CDN/Storage: $50
  
- **Large (10000+ analyses/month)**: $500+
  - Auto-scaling infrastructure
  - Multiple workers
  - Enterprise APIs

## Security Considerations

1. **API Keys**: Store in environment variables, never commit
2. **Rate Limiting**: Implement on all endpoints
3. **File Validation**: Check file types and sizes
4. **User Authentication**: Add auth before production
5. **Data Encryption**: Encrypt PDFs at rest and in transit

## Testing Strategy

```typescript
// /src/__tests__/pdfAnalysis.test.ts
import { analyzeBlueprint } from '@/lib/claudeAnalyzer'
import { calculateMaterials } from '@/lib/materialCalculator'

describe('Blueprint Analysis', () => {
  it('should extract square footage correctly', async () => {
    const mockPdfText = `
      BASEMENT AREA: 1175.82 SQFT
      MAIN FLOOR AREA: 1187.51 SQFT
      UPPER FLOOR AREA: 1185.70 SQFT
    `
    
    const analysis = await analyzeBlueprint(mockPdfText)
    
    expect(analysis.totalSqFt).toBe(3549.03)
    expect(analysis.floors.basement).toBe(1175.82)
  })
  
  it('should calculate 2x6 studs correctly', () => {
    const analysis = {
      totalSqFt: 3549,
      walls: {
        exterior: [
          { length: 40, height: 9 },
          { length: 30, height: 9 },
          { length: 40, height: 9 },
          { length: 30, height: 9 }
        ]
      }
    }
    
    const materials = calculateMaterials(analysis, ['2x6_studs'])
    const studs = materials.find(m => m.id === '2x6_studs')
    
    expect(studs.quantity).toBeGreaterThan(350)
  })
})
```

## Monitoring & Analytics

```typescript
// /src/lib/analytics.ts
export async function trackAnalysis(data: {
  userId: string
  blueprintSize: number
  materialCount: number
  processingTime: number
  totalCost: number
}) {
  // Send to analytics service
  await fetch('https://analytics.example.com/track', {
    method: 'POST',
    body: JSON.stringify({
      event: 'blueprint_analyzed',
      ...data
    })
  })
}
```

## Next Steps

1. **Choose deployment strategy** based on expected volume
2. **Set up Claude API account** and get API key
3. **Implement PDF processing** (MCP or Docker)
4. **Add price scraping** with proper rate limiting
5. **Set up job queue** for async processing
6. **Add authentication** before going live
7. **Implement caching** to reduce API costs
8. **Add error handling** and retry logic
9. **Set up monitoring** and alerts
10. **Load test** before launch

## Common Issues & Solutions

### Issue: PDF parsing fails
**Solution**: Use multiple fallback parsers (pdf-parse, pdfjs-dist, MCP)

### Issue: Price scraping blocked
**Solution**: Rotate user agents, add delays, use proxy services

### Issue: Claude API rate limits
**Solution**: Implement queue with rate limiting, cache common analyses

### Issue: Long processing times
**Solution**: Show progress updates, allow email notifications for results

## Support Resources

- Claude API Docs: https://docs.anthropic.com
- Next.js Deployment: https://nextjs.org/docs/deployment
- AWS Lambda Guide: https://docs.aws.amazon.com/lambda/
- Docker Best Practices: https://docs.docker.com/develop/dev-best-practices/

---

This guide should help you transform the demo into a production-ready system. The key is to start with one component (e.g., PDF processing) and gradually add the others. Good luck with your implementation! 🚀