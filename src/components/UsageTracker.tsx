'use client'

import { useEffect, useState } from 'react'

interface UsageData {
  used: number
  limit: number
  plan: 'free' | 'pro' | 'business'
}

export default function UsageTracker() {
  const [usage, setUsage] = useState<UsageData>({
    used: 0,
    limit: 3,
    plan: 'free'
  })

  useEffect(() => {
    // Get usage from localStorage (for MVP)
    const storedUsage = localStorage.getItem('analysisUsage')
    if (storedUsage) {
      const data = JSON.parse(storedUsage)
      // Reset monthly
      const lastReset = new Date(data.lastReset)
      const now = new Date()
      if (lastReset.getMonth() !== now.getMonth()) {
        data.used = 0
        data.lastReset = now.toISOString()
      }
      setUsage({
        used: data.used,
        limit: data.limit,
        plan: data.plan as 'free' | 'pro' | 'business'
      })
    } else {
      // Initialize
      const initialData: UsageData & { lastReset: string } = {
        used: 0,
        limit: 3,
        plan: 'free' as const,
        lastReset: new Date().toISOString()
      }
      localStorage.setItem('analysisUsage', JSON.stringify(initialData))
      setUsage({
        used: initialData.used,
        limit: initialData.limit,
        plan: initialData.plan
      })
    }
  }, [])

  const remaining = usage.limit - usage.used
  const percentage = (usage.used / usage.limit) * 100

  if (usage.plan === 'pro' || usage.plan === 'business') {
    return null // Don't show for paid users
  }

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="bg-white rounded-2xl shadow-lg p-4 min-w-[200px]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Free Analyses</span>
          <span className="text-sm font-bold text-gray-800">
            {remaining} left
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              percentage > 66 ? 'bg-red-500' : percentage > 33 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {remaining <= 1 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-600">
              {remaining === 0 
                ? 'No free analyses left this month' 
                : 'Only 1 analysis remaining!'}
            </p>
            <a 
              href="#pricing"
              className="block w-full text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:shadow-md transition-all duration-300"
            >
              Upgrade to Pro
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

// Hook to track usage
export function useTrackUsage() {
  const incrementUsage = () => {
    const stored = localStorage.getItem('analysisUsage')
    if (stored) {
      const data = JSON.parse(stored)
      data.used += 1
      localStorage.setItem('analysisUsage', JSON.stringify(data))
      
      // Check if limit reached
      if (data.used >= data.limit) {
        return { limitReached: true, remaining: 0 }
      }
      return { limitReached: false, remaining: data.limit - data.used }
    }
    return { limitReached: false, remaining: 3 }
  }

  const checkLimit = (): boolean => {
    const stored = localStorage.getItem('analysisUsage')
    if (stored) {
      const data = JSON.parse(stored)
      return data.used >= data.limit
    }
    return false
  }

  return { incrementUsage, checkLimit }
}