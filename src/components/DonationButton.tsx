'use client'

import { useState } from 'react'

export default function DonationButton() {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <a
        href="https://ko-fi.com/I2I8YCWXD"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Tooltip */}
        <div className={`absolute bottom-full right-0 mb-2 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}>
          <div className="bg-gray-900 text-white text-sm rounded-lg py-2 px-4 whitespace-nowrap">
            <p className="font-semibold">Enjoying Blueprint Analyzer?</p>
            <p className="text-gray-300">Support development with a coffee ☕</p>
            <div className="absolute bottom-0 right-8 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
          </div>
        </div>
        
        {/* Button */}
        <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 21h18v-2H2v2zm18-11c0-3.31-2.69-6-6-6s-6 2.69-6 6c0 2.97 2.16 5.44 5 5.92V19H8v2h8v-2h-5v-3.08c2.84-.48 5-2.95 5-5.92z"/>
          </svg>
          Buy me a coffee
        </button>
      </a>
    </div>
  )
}

// Alternative: Stripe Payment Link (no backend needed)
export function StripeQuickPay() {
  return (
    <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        🚀 Unlock Pro Features
      </h3>
      <p className="text-gray-600 mb-4">
        Get unlimited analyses, AI insights, and priority support
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="https://buy.stripe.com/test_XXXXX" // Replace with your Stripe payment link
          className="btn-primary text-center"
        >
          Go Pro - $29/month
        </a>
        <button className="text-purple-600 hover:text-purple-700 font-medium">
          Learn more →
        </button>
      </div>
    </div>
  )
}