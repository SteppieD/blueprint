import { NextRequest, NextResponse } from 'next/server'
import { processPDF } from '@/lib/pdfProcessor'
import { analyzeBlueprint } from '@/lib/claudeAnalyzer'
import { getCurrentPrices, calculateTotalCost } from '@/lib/priceScraper'
import { calculateMaterials } from '@/lib/materialCalculator'
import type { AnalysisResult } from '@/types/analysis'

// Vercel-optimized synchronous processing
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

    // Validate file size (Vercel limit)
    if (file.size > 4.5 * 1024 * 1024) { // 4.5MB to be safe
      return NextResponse.json(
        { error: 'File too large. Maximum 4.5MB for Vercel deployment.' },
        { status: 400 }
      )
    }

    // Convert to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Save temporarily
    const tempPath = `/tmp/${Date.now()}-${file.name}`
    const fs = await import('fs/promises')
    await fs.writeFile(tempPath, buffer)

    try {
      // Process PDF (simplified for Vercel)
      const pdfContent = await processPDF(tempPath)
      
      // Quick analysis (no Claude API to stay under 10s)
      const analysis = await analyzeBlueprint(pdfContent.text)
      
      // Calculate materials
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
      
      // Get prices (cached/simulated)
      const prices = await getCurrentPrices(materials)
      
      // Calculate costs
      const costAnalysis = calculateTotalCost(
        calculatedMaterials.map(m => ({ id: m.id, quantity: m.quantity })),
        prices
      )
      
      // Prepare result
      const result: AnalysisResult = {
        projectInfo: {
          name: file.name.replace('.pdf', ''),
          totalSqFt: analysis.totalSqFt,
          floors: Object.keys(analysis.floors).filter(f => analysis.floors[f as keyof typeof analysis.floors]).length,
          basementSqFt: analysis.floors.basement,
          mainFloorSqFt: analysis.floors.main,
          upperFloorSqFt: analysis.floors.upper
        },
        materials: costAnalysis.breakdown.map(item => ({
          name: item.name,
          quantity: item.quantity,
          unit: materials.find((m: string) => item.name.toLowerCase().includes(m.toLowerCase()))?.includes('studs') ? 'pieces' : 'sheets',
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
          notes: [
            ...analysis.notes,
            'Processed on Vercel (simplified analysis)'
          ],
          pdfPageCount: pdfContent.pageCount
        }
      }
      
      return NextResponse.json(result)
    } finally {
      // Clean up temp file
      try {
        await fs.unlink(tempPath)
      } catch {}
    }
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Analysis failed. Try a smaller file or simpler blueprint.' },
      { status: 500 }
    )
  }
}

// Configure Vercel runtime
export const runtime = 'nodejs'
export const maxDuration = 10 // Vercel free tier limit