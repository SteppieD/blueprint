import Bull from 'bull'
import { processPDF } from './pdfProcessor'
import { analyzeBlueprint } from './claudeAnalyzer'
import { getCurrentPrices, calculateTotalCost } from './priceScraper'
import { calculateMaterials } from './materialCalculator'
import type { AnalysisResult } from '@/types/analysis'

// Initialize Bull queue
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'
let analysisQueue: Bull.Queue | null = null

// Only initialize queue if Redis is properly configured
if (REDIS_URL !== 'redis://localhost:6379' || process.env.USE_REDIS === 'true') {
  analysisQueue = new Bull('blueprint-analysis', REDIS_URL, {
    defaultJobOptions: {
      removeOnComplete: true,
      removeOnFail: false,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      }
    }
  })
  
  // Process jobs
  analysisQueue.process(async (job) => {
    return processAnalysisJob(job)
  })
}

interface JobData {
  filePath: string
  materials: string[]
  userId?: string
  sessionId: string
}

interface JobProgress {
  stage: string
  progress: number
  message: string
}

/**
 * Process a blueprint analysis job
 */
async function processAnalysisJob(job: Bull.Job<JobData>): Promise<AnalysisResult> {
  const { filePath, materials } = job.data
  
  try {
    // Update progress: Reading PDF
    await job.progress({
      stage: 'reading',
      progress: 10,
      message: 'Reading blueprint PDF...'
    } as JobProgress)
    
    // Process PDF
    const pdfContent = await processPDF(filePath)
    
    // Update progress: Analyzing
    await job.progress({
      stage: 'analyzing',
      progress: 30,
      message: 'Analyzing blueprint with AI...'
    } as JobProgress)
    
    // Analyze with Claude
    const analysis = await analyzeBlueprint(pdfContent.text)
    
    // Update progress: Calculating
    await job.progress({
      stage: 'calculating',
      progress: 50,
      message: 'Calculating material quantities...'
    } as JobProgress)
    
    // Calculate materials based on analysis
    const calculatedMaterials = calculateMaterials(
      {
        text: pdfContent.text,
        projectInfo: {
          totalSqFt: analysis.totalSqFt,
          floors: Object.keys(analysis.floors).filter(f => analysis.floors[f as keyof typeof analysis.floors]).length,
          basementSqFt: analysis.floors.basement,
          mainFloorSqFt: analysis.floors.main,
          upperFloorSqFt: analysis.floors.upper
        }
      },
      materials
    )
    
    // Update progress: Getting prices
    await job.progress({
      stage: 'pricing',
      progress: 70,
      message: 'Fetching current market prices...'
    } as JobProgress)
    
    // Get current prices
    const prices = await getCurrentPrices(materials)
    
    // Update progress: Generating report
    await job.progress({
      stage: 'report',
      progress: 90,
      message: 'Generating cost report...'
    } as JobProgress)
    
    // Calculate costs
    const costAnalysis = calculateTotalCost(
      calculatedMaterials.map(m => ({ id: m.id, quantity: m.quantity })),
      prices
    )
    
    // Prepare final result
    const result: AnalysisResult = {
      projectInfo: {
        name: 'Blueprint Analysis',
        totalSqFt: analysis.totalSqFt,
        floors: Object.keys(analysis.floors).filter(f => analysis.floors[f as keyof typeof analysis.floors]).length,
        basementSqFt: analysis.floors.basement,
        mainFloorSqFt: analysis.floors.main,
        upperFloorSqFt: analysis.floors.upper
      },
      materials: costAnalysis.breakdown.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unit: materials.find(m => item.name.includes(m))?.includes('studs') ? 'pieces' : 'sheets',
        unitPrice: item.unitPrice,
        totalCost: item.total
      })),
      summary: {
        subtotal: costAnalysis.subtotal,
        taxRate: 0.12,
        tax: costAnalysis.tax,
        total: costAnalysis.total
      },
      metadata: {
        analysisDate: new Date().toISOString(),
        confidence: analysis.confidence,
        notes: analysis.notes,
        pdfPageCount: pdfContent.pageCount
      }
    }
    
    // Update progress: Complete
    await job.progress({
      stage: 'complete',
      progress: 100,
      message: 'Analysis complete!'
    } as JobProgress)
    
    return result
  } catch (error) {
    console.error('Job processing error:', error)
    throw error
  }
}

/**
 * Queue a new analysis job
 */
export async function queueAnalysis(
  filePath: string,
  materials: string[],
  sessionId: string,
  userId?: string
): Promise<string> {
  // If no queue (development mode), process synchronously
  if (!analysisQueue) {
    console.log('Processing synchronously (no Redis queue)')
    const result = await processAnalysisJob({
      data: { filePath, materials, sessionId, userId },
      progress: async () => {},
    } as any)
    
    // Store result in memory for retrieval
    if (typeof window === 'undefined') {
      // Server-side storage
      global.analysisResults = global.analysisResults || {}
      global.analysisResults[sessionId] = { status: 'completed', result }
    }
    
    return sessionId
  }
  
  // Queue the job
  const job = await analysisQueue.add({
    filePath,
    materials,
    sessionId,
    userId
  })
  
  return job.id.toString()
}

/**
 * Get job status and result
 */
export async function getJobStatus(jobId: string): Promise<{
  status: 'active' | 'completed' | 'failed' | 'waiting' | 'delayed'
  progress?: JobProgress
  result?: AnalysisResult
  error?: string
}> {
  // Development mode - check memory storage
  if (!analysisQueue) {
    if (typeof window === 'undefined' && global.analysisResults?.[jobId]) {
      return global.analysisResults[jobId]
    }
    return { status: 'failed', error: 'Job not found' }
  }
  
  const job = await analysisQueue.getJob(jobId)
  
  if (!job) {
    return { status: 'failed', error: 'Job not found' }
  }
  
  const state = await job.getState()
  const progress = job.progress()
  
  if (state === 'completed') {
    return {
      status: 'completed',
      result: job.returnvalue
    }
  }
  
  if (state === 'failed') {
    return {
      status: 'failed',
      error: job.failedReason || 'Analysis failed'
    }
  }
  
  return {
    status: state as any,
    progress: typeof progress === 'object' ? progress as JobProgress : undefined
  }
}

/**
 * Clean up old jobs
 */
export async function cleanupOldJobs(): Promise<void> {
  if (!analysisQueue) return
  
  const jobs = await analysisQueue.getJobs(['completed', 'failed'])
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
  
  for (const job of jobs) {
    if (job.timestamp < oneDayAgo) {
      await job.remove()
    }
  }
}

// Declare global type for TypeScript
declare global {
  var analysisResults: Record<string, any>
}