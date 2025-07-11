import { NextResponse } from 'next/server'

export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: {
      hasAIKey: !!process.env.OPENROUTER_API_KEY || !!process.env.ANTHROPIC_API_KEY,
      aiProvider: process.env.OPENROUTER_API_KEY ? 'OpenRouter' : (process.env.ANTHROPIC_API_KEY ? 'Anthropic' : 'None'),
      hasRedis: !!process.env.REDIS_URL,
      hasS3: !!process.env.AWS_ACCESS_KEY_ID,
      useLocalStorage: process.env.USE_LOCAL_STORAGE === 'true'
    }
  }
  
  return NextResponse.json(health)
}