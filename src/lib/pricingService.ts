// Current lumber prices (CAD) - July 2025 estimates
const MATERIAL_PRICES: Record<string, number> = {
  '2x4_studs': 8.00,      // 2x4x8' SPF stud
  '2x6_studs': 12.50,     // 2x6x8' SPF stud
  '2x8_studs': 18.00,     // 2x8x8' SPF
  '2x10_studs': 25.00,    // 2x10x8' SPF
  '2x12_studs': 35.00,    // 2x12x8' SPF
  'plywood_3/8': 45.00,   // 3/8" plywood 4x8 sheet
  'plywood_1/2': 55.00,   // 1/2" plywood 4x8 sheet
  'plywood_3/4': 75.00,   // 3/4" plywood 4x8 sheet
  'osb_7/16': 38.00,      // 7/16" OSB 4x8 sheet
  'osb_5/8': 48.00,       // 5/8" OSB 4x8 sheet
}

export async function getCurrentPrices(materials: string[]): Promise<Record<string, number>> {
  // In a real application, this would fetch from an API or database
  // For now, return static prices
  
  const prices: Record<string, number> = {}
  
  materials.forEach(materialId => {
    prices[materialId] = MATERIAL_PRICES[materialId] || 0
  })
  
  return prices
}

// Future enhancement: integrate with supplier APIs
export async function fetchLivePrices(location: string = 'BC'): Promise<Record<string, number>> {
  // This would connect to lumber supplier APIs like:
  // - Rona API
  // - Home Depot API
  // - Local lumber yard APIs
  
  // For now, return static prices with small random variation
  const prices: Record<string, number> = {}
  
  Object.entries(MATERIAL_PRICES).forEach(([key, basePrice]) => {
    // Add ±5% variation to simulate market fluctuation
    const variation = basePrice * 0.05
    const randomFactor = (Math.random() - 0.5) * 2
    prices[key] = basePrice + (variation * randomFactor)
  })
  
  return prices
}