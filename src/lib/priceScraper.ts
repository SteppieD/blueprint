import puppeteer from 'puppeteer-core'
import Redis from 'ioredis'

// Initialize Redis for caching (optional)
let redis: Redis | null = null
if (process.env.REDIS_URL && process.env.REDIS_URL !== 'redis://localhost:6379') {
  redis = new Redis(process.env.REDIS_URL)
}

export interface MaterialPrice {
  id: string
  name: string
  price: number
  unit: string
  supplier: string
  sku?: string
  inStock?: boolean
  lastUpdated: Date
}

/**
 * Material name mappings for Rona searches
 */
const MATERIAL_SEARCH_TERMS: Record<string, string> = {
  '2x4_studs': '2x4x8 stud lumber',
  '2x6_studs': '2x6x8 stud lumber',
  '2x8_studs': '2x8x8 lumber',
  '2x10_studs': '2x10x8 lumber',
  '2x12_studs': '2x12x8 lumber',
  'plywood_3/8': '3/8 plywood 4x8',
  'plywood_1/2': '1/2 plywood 4x8',
  'plywood_3/4': '3/4 plywood 4x8',
  'osb_7/16': '7/16 OSB 4x8',
  'osb_5/8': '5/8 OSB 4x8'
}

/**
 * Fallback prices when scraping fails (July 2025 estimates)
 */
const FALLBACK_PRICES: Record<string, number> = {
  '2x4_studs': 8.00,
  '2x6_studs': 12.50,
  '2x8_studs': 18.00,
  '2x10_studs': 25.00,
  '2x12_studs': 35.00,
  'plywood_3/8': 45.00,
  'plywood_1/2': 55.00,
  'plywood_3/4': 75.00,
  'osb_7/16': 38.00,
  'osb_5/8': 48.00
}

/**
 * Get current prices for materials
 * This is a simplified version - in production you'd use real scraping or APIs
 */
export async function getCurrentPrices(materials: string[]): Promise<Record<string, number>> {
  const prices: Record<string, number> = {}
  
  for (const materialId of materials) {
    // Check cache first
    if (redis) {
      const cached = await redis.get(`price:${materialId}`)
      if (cached) {
        prices[materialId] = parseFloat(cached)
        continue
      }
    }
    
    // Try to get live price
    try {
      const price = await scrapeLivePrice(materialId)
      prices[materialId] = price
      
      // Cache for 1 hour
      if (redis) {
        await redis.setex(`price:${materialId}`, 3600, price.toString())
      }
    } catch (error) {
      console.warn(`Failed to get live price for ${materialId}, using fallback:`, error)
      prices[materialId] = FALLBACK_PRICES[materialId] || 0
    }
  }
  
  return prices
}

/**
 * Scrape live price from Rona (simplified for development)
 * In production, this would actually scrape or use an API
 */
async function scrapeLivePrice(materialId: string): Promise<number> {
  // For development, simulate price variations
  const basePrice = FALLBACK_PRICES[materialId] || 10
  const variation = basePrice * 0.1 // ±10% variation
  const randomFactor = (Math.random() - 0.5) * 2
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  return Number((basePrice + (variation * randomFactor)).toFixed(2))
}

/**
 * Get detailed price information for materials
 * This would be used for a more detailed pricing display
 */
export async function getDetailedPrices(materials: string[]): Promise<MaterialPrice[]> {
  const detailedPrices: MaterialPrice[] = []
  
  for (const materialId of materials) {
    const searchTerm = MATERIAL_SEARCH_TERMS[materialId] || materialId
    const price = await scrapeLivePrice(materialId)
    
    detailedPrices.push({
      id: materialId,
      name: searchTerm,
      price,
      unit: materialId.includes('studs') ? 'each' : 'sheet',
      supplier: 'Rona',
      inStock: Math.random() > 0.1, // 90% chance of being in stock
      lastUpdated: new Date()
    })
  }
  
  return detailedPrices
}

/**
 * Production-ready Rona scraper (commented out for development)
 * Uncomment and modify when ready for production
 */
/*
export async function scrapeRonaPrice(materialId: string): Promise<MaterialPrice> {
  const searchTerm = MATERIAL_SEARCH_TERMS[materialId] || materialId
  
  // Launch browser
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  try {
    const page = await browser.newPage()
    
    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
    
    // Navigate to Rona search
    await page.goto(`https://www.rona.ca/en/search?q=${encodeURIComponent(searchTerm)}`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    })
    
    // Wait for products to load
    await page.waitForSelector('.product-tile', { timeout: 10000 })
    
    // Extract first product details
    const productData = await page.evaluate(() => {
      const firstProduct = document.querySelector('.product-tile')
      if (!firstProduct) return null
      
      const priceElement = firstProduct.querySelector('.price-now, .product-price')
      const nameElement = firstProduct.querySelector('.product-title')
      const skuElement = firstProduct.querySelector('.product-sku')
      const stockElement = firstProduct.querySelector('.availability')
      
      return {
        price: priceElement ? parseFloat(priceElement.textContent.replace(/[$,]/g, '')) : 0,
        name: nameElement ? nameElement.textContent.trim() : '',
        sku: skuElement ? skuElement.textContent.trim() : '',
        inStock: stockElement ? !stockElement.textContent.includes('out of stock') : true
      }
    })
    
    if (!productData) {
      throw new Error('No product found')
    }
    
    return {
      id: materialId,
      name: productData.name,
      price: productData.price,
      unit: materialId.includes('studs') ? 'each' : 'sheet',
      supplier: 'Rona',
      sku: productData.sku,
      inStock: productData.inStock,
      lastUpdated: new Date()
    }
  } finally {
    await browser.close()
  }
}
*/

/**
 * Calculate total cost with tax
 */
export function calculateTotalCost(
  materials: { id: string; quantity: number }[],
  prices: Record<string, number>,
  taxRate: number = 0.12 // BC tax rate
): {
  subtotal: number
  tax: number
  total: number
  breakdown: { name: string; quantity: number; unitPrice: number; total: number }[]
} {
  const breakdown = materials.map(item => {
    const unitPrice = prices[item.id] || 0
    return {
      name: MATERIAL_SEARCH_TERMS[item.id] || item.id,
      quantity: item.quantity,
      unitPrice,
      total: item.quantity * unitPrice
    }
  })
  
  const subtotal = breakdown.reduce((sum, item) => sum + item.total, 0)
  const tax = subtotal * taxRate
  const total = subtotal + tax
  
  return {
    subtotal,
    tax,
    total,
    breakdown
  }
}