import { NextRequest, NextResponse } from 'next/server'
import { uploadFile, validateFile } from '@/lib/storage'
import { queueAnalysis } from '@/lib/jobQueue'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const materials = JSON.parse(formData.get('materials') as string)

    if (!file || !materials) {
      return NextResponse.json(
        { error: 'Missing file or materials' },
        { status: 400 }
      )
    }

    // Validate file
    const validation = validateFile(file)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Convert file to buffer and upload
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = await uploadFile(buffer, file.name)

    // Generate session ID for tracking
    const sessionId = crypto.randomBytes(16).toString('hex')

    // Queue the analysis job
    const jobId = await queueAnalysis(filePath, materials, sessionId)

    return NextResponse.json({
      jobId,
      sessionId,
      message: 'Analysis started. Poll /api/analyze/status for results.',
      estimatedTime: 30 // seconds
    })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to start analysis' },
      { status: 500 }
    )
  }
}