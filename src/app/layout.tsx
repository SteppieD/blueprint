import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Blueprint Material Analyzer - Construction Cost Calculator',
  description: 'Upload construction blueprints and get instant material quantities and cost estimates for lumber, plywood, and more.',
  keywords: 'construction, blueprint analyzer, material calculator, lumber calculator, construction cost estimator',
  openGraph: {
    title: 'Blueprint Material Analyzer',
    description: 'Calculate construction materials from blueprints instantly',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-inter">
        <nav className="glass-card fixed top-0 left-0 right-0 z-50 border-0 border-b border-white border-opacity-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">📐</span>
                </div>
                <h1 className="text-2xl font-bold gradient-text">Blueprint Analyzer</h1>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <a href="#features" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Features</a>
                <a href="#how-it-works" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">How It Works</a>
                <a href="https://github.com/SteppieD/blueprint" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">GitHub</a>
              </div>
            </div>
          </div>
        </nav>
        
        <main className="pt-20">
          {children}
        </main>
        
        <footer className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-16">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">📐</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Blueprint Material Analyzer</h3>
              <p className="text-gray-300 mb-8">Revolutionizing construction material calculations</p>
              <div className="flex justify-center space-x-6 mb-8">
                <a href="https://github.com/SteppieD/blueprint" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
              <p className="text-gray-400 text-sm">&copy; 2025 Blueprint Material Analyzer. Built with ❤️ for the construction industry.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}