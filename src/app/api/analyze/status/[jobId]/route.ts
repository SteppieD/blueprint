import { NextRequest, NextResponse } from 'next/server'
import { getJobStatus } from '@/lib/jobQueue'

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const jobId = params.jobId
    
    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID required' },
        { status: 400 }
      )
    }
    
    const status = await getJobStatus(jobId)
    
    if (status.status === 'failed') {
      return NextResponse.json(
        { 
          status: 'failed',
          error: status.error || 'Analysis failed'
        },
        { status: 500 }
      )
    }
    
    if (status.status === 'completed') {
      return NextResponse.json({
        status: 'completed',
        result: status.result
      })
    }
    
    // Still processing
    return NextResponse.json({
      status: status.status,
      progress: status.progress || {
        stage: 'queued',
        progress: 0,
        message: 'Analysis queued...'
      }
    })
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check job status' },
      { status: 500 }
    )
  }
}