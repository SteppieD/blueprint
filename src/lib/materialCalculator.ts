import { PDFAnalysis } from './pdfAnalyzer'

interface MaterialQuantity {
  id: string
  name: string
  quantity: number
  unit: string
}

export function calculateMaterials(
  pdfAnalysis: PDFAnalysis,
  selectedMaterials: string[]
): MaterialQuantity[] {
  const { projectInfo } = pdfAnalysis
  const quantities: MaterialQuantity[] = []

  // Calculate perimeters (assuming roughly square layouts)
  const basementPerimeter = projectInfo.basementSqFt 
    ? 4 * Math.sqrt(projectInfo.basementSqFt) 
    : 0
  const mainPerimeter = projectInfo.mainFloorSqFt 
    ? 4 * Math.sqrt(projectInfo.mainFloorSqFt) 
    : 4 * Math.sqrt(projectInfo.totalSqFt / projectInfo.floors)
  const upperPerimeter = projectInfo.upperFloorSqFt 
    ? 4 * Math.sqrt(projectInfo.upperFloorSqFt) 
    : (projectInfo.floors > 1 ? mainPerimeter : 0)

  // Wall heights (standard assumptions)
  const basementHeight = 8
  const mainFloorHeight = 9
  const upperFloorHeight = 8

  // Calculate materials
  selectedMaterials.forEach(materialId => {
    switch (materialId) {
      case '2x4_studs': {
        // Interior walls - roughly 1.5x exterior perimeter
        const interiorWallLength = 
          (basementPerimeter * 1.5) +
          (mainPerimeter * 1.5) +
          (upperPerimeter * 1.5)
        
        // Studs at 16" O/C = 0.75 studs per linear foot + 10% waste
        const quantity = Math.ceil(interiorWallLength * 0.75 * 1.1)
        
        quantities.push({
          id: materialId,
          name: '2x4 Studs',
          quantity,
          unit: 'pieces'
        })
        break
      }

      case '2x6_studs': {
        // Exterior walls
        const exteriorWallLength = basementPerimeter + mainPerimeter + upperPerimeter
        
        // Studs at 24" O/C = 0.5 studs per linear foot + 10% waste
        const quantity = Math.ceil(exteriorWallLength * 0.5 * 1.1)
        
        quantities.push({
          id: materialId,
          name: '2x6 Studs',
          quantity,
          unit: 'pieces'
        })
        break
      }

      case '2x8_studs': {
        // Floor joists - main and upper floors
        const floorArea = (projectInfo.mainFloorSqFt || 0) + (projectInfo.upperFloorSqFt || 0)
        
        // Joists at 16" O/C across width (assume 30ft average span)
        const quantity = Math.ceil((floorArea / 30) * 0.75 * 1.1)
        
        quantities.push({
          id: materialId,
          name: '2x8 Studs',
          quantity,
          unit: 'pieces'
        })
        break
      }

      case '2x10_studs': {
        // Beams and headers - roughly 10% of 2x8 quantity
        const floorArea = (projectInfo.mainFloorSqFt || 0) + (projectInfo.upperFloorSqFt || 0)
        const quantity = Math.ceil((floorArea / 30) * 0.75 * 0.1 * 1.1)
        
        quantities.push({
          id: materialId,
          name: '2x10 Studs',
          quantity,
          unit: 'pieces'
        })
        break
      }

      case '2x12_studs': {
        // Heavy beams - minimal quantity
        const quantity = Math.ceil(projectInfo.floors * 4)
        
        quantities.push({
          id: materialId,
          name: '2x12 Studs',
          quantity,
          unit: 'pieces'
        })
        break
      }

      case 'plywood_3/8': {
        // Wall sheathing for exterior walls
        const wallArea = 
          (basementPerimeter * basementHeight) +
          (mainPerimeter * mainFloorHeight) +
          (upperPerimeter * upperFloorHeight)
        
        // 4x8 sheets = 32 sq ft per sheet + 10% waste
        const quantity = Math.ceil((wallArea / 32) * 1.1)
        
        quantities.push({
          id: materialId,
          name: '3/8" Plywood',
          quantity,
          unit: 'sheets'
        })
        break
      }

      case 'plywood_1/2': {
        // Alternative wall sheathing
        const wallArea = 
          (basementPerimeter * basementHeight) +
          (mainPerimeter * mainFloorHeight) +
          (upperPerimeter * upperFloorHeight)
        
        const quantity = Math.ceil((wallArea / 32) * 1.1)
        
        quantities.push({
          id: materialId,
          name: '1/2" Plywood',
          quantity,
          unit: 'sheets'
        })
        break
      }

      case 'plywood_3/4': {
        // Subfloor
        const floorArea = (projectInfo.mainFloorSqFt || 0) + (projectInfo.upperFloorSqFt || 0)
        const quantity = Math.ceil((floorArea / 32) * 1.1)
        
        quantities.push({
          id: materialId,
          name: '3/4" Plywood',
          quantity,
          unit: 'sheets'
        })
        break
      }

      case 'osb_7/16': {
        // Roof sheathing
        const roofArea = (projectInfo.mainFloorSqFt || projectInfo.totalSqFt) * 1.25 // 25% extra for pitch
        const quantity = Math.ceil((roofArea / 32) * 1.1)
        
        quantities.push({
          id: materialId,
          name: '7/16" OSB',
          quantity,
          unit: 'sheets'
        })
        break
      }

      case 'osb_5/8': {
        // Floor sheathing alternative
        const floorArea = (projectInfo.mainFloorSqFt || 0) + (projectInfo.upperFloorSqFt || 0)
        const quantity = Math.ceil((floorArea / 32) * 1.1)
        
        quantities.push({
          id: materialId,
          name: '5/8" OSB',
          quantity,
          unit: 'sheets'
        })
        break
      }
    }
  })

  return quantities
}