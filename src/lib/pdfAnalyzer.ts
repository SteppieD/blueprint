// import pdf from 'pdf-parse'

export interface PDFAnalysis {
  text: string
  projectInfo: {
    totalSqFt: number
    floors: number
    basementSqFt?: number
    mainFloorSqFt?: number
    upperFloorSqFt?: number
  }
}

export async function analyzePDF(buffer: Buffer): Promise<PDFAnalysis> {
  try {
    // For now, use mock data - in production you'd use pdf-parse
    // const data = await pdf(buffer)
    const text = "BASEMENT AREA: 1175.82 SQFT\nMAIN FLOOR AREA: 1187.51 SQFT\nUPPER FLOOR AREA: 1185.70 SQFT\nTOTAL LIVABLE SPACE: 3549.03 SQFT"

    // Extract square footage information
    const sqftPattern = /(\d+(?:,\d+)?(?:\.\d+)?)\s*(?:SQFT|sq\s*ft|square\s*feet)/gi
    const floorPattern = /(basement|main\s*floor|upper\s*floor|garage)\s*(?:area\s*:)?\s*(\d+(?:,\d+)?(?:\.\d+)?)\s*(?:SQFT|sq\s*ft)/gi

    const projectInfo = {
      totalSqFt: 0,
      floors: 1,
      basementSqFt: undefined as number | undefined,
      mainFloorSqFt: undefined as number | undefined,
      upperFloorSqFt: undefined as number | undefined,
    }

    // Extract floor-specific areas
    let match
    while ((match = floorPattern.exec(text)) !== null) {
      const floorType = match[1].toLowerCase()
      const sqft = parseFloat(match[2].replace(/,/g, ''))
      
      if (floorType.includes('basement')) {
        projectInfo.basementSqFt = sqft
      } else if (floorType.includes('main')) {
        projectInfo.mainFloorSqFt = sqft
      } else if (floorType.includes('upper')) {
        projectInfo.upperFloorSqFt = sqft
      }
    }

    // Calculate total square footage
    projectInfo.totalSqFt = 
      (projectInfo.basementSqFt || 0) +
      (projectInfo.mainFloorSqFt || 0) +
      (projectInfo.upperFloorSqFt || 0)

    // Count floors
    projectInfo.floors = 
      (projectInfo.basementSqFt ? 1 : 0) +
      (projectInfo.mainFloorSqFt ? 1 : 0) +
      (projectInfo.upperFloorSqFt ? 1 : 0)

    // If no specific floor data found, try to extract total sqft
    if (projectInfo.totalSqFt === 0) {
      const totalMatch = text.match(/total\s*(?:livable\s*)?(?:space|area)\s*:\s*(\d+(?:,\d+)?(?:\.\d+)?)\s*(?:SQFT|sq\s*ft)/i)
      if (totalMatch) {
        projectInfo.totalSqFt = parseFloat(totalMatch[1].replace(/,/g, ''))
        projectInfo.floors = Math.max(1, Math.ceil(projectInfo.totalSqFt / 1500)) // Estimate floors
      }
    }

    // Default values if nothing found
    if (projectInfo.totalSqFt === 0) {
      projectInfo.totalSqFt = 2000 // Default assumption
      projectInfo.floors = 2
    }

    return {
      text,
      projectInfo
    }
  } catch (error) {
    console.error('PDF parsing error:', error)
    throw new Error('Failed to parse PDF')
  }
}