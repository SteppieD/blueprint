import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Blueprint Material Analyzer</h1>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen" style={{backgroundColor: '#f9fafb'}}>
          {children}
        </main>
        <footer className="bg-gray-800 text-white py-8 mt-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p>&copy; 2025 Blueprint Material Analyzer. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}