import { NextRequest, NextResponse } from 'next/server'
import { analyzePDF } from '@/lib/pdfAnalyzer'
import { calculateMaterials } from '@/lib/materialCalculator'
import { getCurrentPrices } from '@/lib/pricingService'

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

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Extract text and project info from PDF
    const pdfAnalysis = await analyzePDF(buffer)
    
    // Calculate material quantities based on project info
    const quantities = calculateMaterials(pdfAnalysis, materials)
    
    // Get current prices
    const prices = await getCurrentPrices(materials)
    
    // Combine quantities with prices
    const materialItems = quantities.map(item => {
      const price = prices[item.id] || 0
      return {
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: price,
        totalCost: item.quantity * price
      }
    })

    // Calculate summary
    const subtotal = materialItems.reduce((sum, item) => sum + item.totalCost, 0)
    const taxRate = 0.12 // 12% tax (GST + PST in BC)
    const tax = subtotal * taxRate
    const total = subtotal + tax

    const result = {
      projectInfo: pdfAnalysis.projectInfo,
      materials: materialItems,
      summary: {
        subtotal,
        taxRate,
        tax,
        total
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze blueprint' },
      { status: 500 }
    )
  }
}