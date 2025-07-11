import { extractConstructionData } from './pdfProcessor'

// OpenRouter configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.ANTHROPIC_API_KEY || ''
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'

export interface BlueprintAnalysis {
  totalSqFt: number
  floors: {
    basement?: number
    main: number
    upper?: number
    garage?: number
  }
  walls: {
    exterior: {
      totalLength: number
      height: number
      studSize: string
      studSpacing: number
    }
    interior: {
      totalLength: number
      height: number
      studSize: string
      studSpacing: number
    }
  }
  materials: {
    studs: {
      '2x4': number
      '2x6': number
    }
    sheathing: {
      wallArea: number
      roofArea: number
    }
  }
  confidence: number
  notes: string[]
}

/**
 * Analyze blueprint text using Claude AI
 */
export async function analyzeBlueprint(pdfText: string): Promise<BlueprintAnalysis> {
  // First, try to extract structured data
  const extractedData = extractConstructionData(pdfText)
  
  // For development/testing without API key, return extracted data
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'sk-ant-api03-xxx') {
    console.warn('Using extracted data only - no AI API key configured')
    return convertExtractedToAnalysis(extractedData)
  }
  
  try {
    // Use OpenRouter API
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://blueprint-analyzer.vercel.app',
        'X-Title': 'Blueprint Material Analyzer'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku-20240307', // Using Haiku for cost efficiency
        messages: [{
          role: 'user',
          content: `You are a construction blueprint analyzer. Analyze this blueprint text and extract detailed information.

Blueprint text:
${pdfText}

Extracted preliminary data:
${JSON.stringify(extractedData, null, 2)}

Please provide a comprehensive analysis including:
1. Verify and correct the square footage numbers
2. Calculate total wall lengths (perimeter) for each floor
3. Estimate interior wall lengths based on typical home layouts
4. Calculate material quantities needed
5. Note any special considerations

Return the data in this exact JSON format:
{
  "totalSqFt": number,
  "floors": {
    "basement": number or null,
    "main": number,
    "upper": number or null,
    "garage": number or null
  },
  "walls": {
    "exterior": {
      "totalLength": number (in feet),
      "height": number (in feet),
      "studSize": string (e.g., "2x6"),
      "studSpacing": number (in inches)
    },
    "interior": {
      "totalLength": number (in feet),
      "height": number (in feet),
      "studSize": string (e.g., "2x4"),
      "studSpacing": number (in inches)
    }
  },
  "materials": {
    "studs": {
      "2x4": number (count),
      "2x6": number (count)
    },
    "sheathing": {
      "wallArea": number (sq ft),
      "roofArea": number (sq ft)
    }
  },
  "confidence": number (0-1),
  "notes": [string]
}`
        }],
        max_tokens: 4000,
        temperature: 0.3 // Lower temperature for more consistent results
      })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(`OpenRouter API error: ${error.error?.message || 'Unknown error'}`)
    }
    
    const data = await response.json()
    const content = data.choices[0]?.message?.content
    
    if (content) {
      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    }
    
    throw new Error('Failed to parse AI response')
  } catch (error) {
    console.error('OpenRouter API error:', error)
    // Fallback to extracted data
    return convertExtractedToAnalysis(extractedData)
  }
}

/**
 * Convert extracted data to analysis format
 */
function convertExtractedToAnalysis(extracted: ReturnType<typeof extractConstructionData>): BlueprintAnalysis {
  const { squareFootage, walls } = extracted
  
  // Calculate perimeter based on square footage (rough estimate)
  const mainPerimeter = Math.sqrt(squareFootage.mainFloor) * 4 * 1.2 // 1.2 factor for non-square homes
  const upperPerimeter = squareFootage.upperFloor ? Math.sqrt(squareFootage.upperFloor) * 4 * 1.2 : 0
  const basementPerimeter = squareFootage.basement ? Math.sqrt(squareFootage.basement) * 4 * 1.2 : 0
  
  // Estimate interior walls (typically 2-3x the exterior perimeter)
  const interiorMultiplier = 2.5
  const mainInterior = mainPerimeter * interiorMultiplier
  const upperInterior = upperPerimeter * interiorMultiplier
  const basementInterior = basementPerimeter * interiorMultiplier
  
  // Calculate total lengths
  const totalExteriorLength = mainPerimeter + upperPerimeter + basementPerimeter
  const totalInteriorLength = mainInterior + upperInterior + basementInterior
  
  // Calculate stud counts
  const exteriorStuds = Math.ceil((totalExteriorLength * 12) / walls.exterior.spacing) + 
                       Math.ceil(totalExteriorLength / 8) // Extra for corners, openings
  
  const interiorStuds = Math.ceil((totalInteriorLength * 12) / walls.interior.spacing) +
                       Math.ceil(totalInteriorLength / 10) // Extra for corners, openings
  
  // Calculate sheathing areas
  const wallArea = totalExteriorLength * walls.height
  const roofArea = squareFootage.total * 1.2 // Rough estimate with 1.2 factor for roof pitch
  
  return {
    totalSqFt: squareFootage.total || 
               (squareFootage.basement + squareFootage.mainFloor + squareFootage.upperFloor),
    floors: {
      basement: squareFootage.basement || undefined,
      main: squareFootage.mainFloor,
      upper: squareFootage.upperFloor || undefined,
      garage: squareFootage.garage || undefined
    },
    walls: {
      exterior: {
        totalLength: Math.round(totalExteriorLength),
        height: walls.height,
        studSize: walls.exterior.size,
        studSpacing: walls.exterior.spacing
      },
      interior: {
        totalLength: Math.round(totalInteriorLength),
        height: walls.height,
        studSize: walls.interior.size,
        studSpacing: walls.interior.spacing
      }
    },
    materials: {
      studs: {
        '2x4': walls.interior.size === '2x4' ? interiorStuds : 0,
        '2x6': walls.exterior.size === '2x6' ? exteriorStuds : 0
      },
      sheathing: {
        wallArea: Math.round(wallArea),
        roofArea: Math.round(roofArea)
      }
    },
    confidence: 0.7, // Lower confidence for estimated data
    notes: [
      'Wall lengths estimated based on square footage',
      'Interior wall length estimated at 2.5x exterior perimeter',
      'Actual quantities may vary based on specific floor plan'
    ]
  }
}

/**
 * Generate material recommendations based on analysis
 */
export function generateMaterialRecommendations(analysis: BlueprintAnalysis): string[] {
  const recommendations = []
  
  // Stud recommendations
  if (analysis.materials.studs['2x6'] > 0) {
    recommendations.push(
      `Order ${Math.ceil(analysis.materials.studs['2x6'] * 1.1)} pieces of 2x6x8' studs (includes 10% waste factor)`
    )
  }
  
  if (analysis.materials.studs['2x4'] > 0) {
    recommendations.push(
      `Order ${Math.ceil(analysis.materials.studs['2x4'] * 1.1)} pieces of 2x4x8' studs (includes 10% waste factor)`
    )
  }
  
  // Sheathing recommendations
  const wallSheets = Math.ceil(analysis.materials.sheathing.wallArea / 32) // 4x8 sheets
  const roofSheets = Math.ceil(analysis.materials.sheathing.roofArea / 32)
  
  recommendations.push(
    `Order ${Math.ceil(wallSheets * 1.1)} sheets of wall sheathing (4x8)`,
    `Order ${Math.ceil(roofSheets * 1.1)} sheets of roof sheathing (4x8)`
  )
  
  return recommendations
}