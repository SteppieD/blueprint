export interface MaterialItem {
  name: string
  quantity: number
  unit: string
  unitPrice: number
  totalCost: number
}

export interface ProjectInfo {
  totalSqFt: number
  floors: number
  basementSqFt?: number
  mainFloorSqFt?: number
  upperFloorSqFt?: number
}

export interface AnalysisResult {
  projectInfo: ProjectInfo
  materials: MaterialItem[]
  summary: {
    subtotal: number
    taxRate: number
    tax: number
    total: number
  }
}