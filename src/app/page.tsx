'use client'

import { useState } from 'react'
import FileUpload from '@/components/FileUpload'
import MaterialSelector from '@/components/MaterialSelector'
import ResultsDisplay from '@/components/ResultsDisplay'
import DonationButton from '@/components/DonationButton'
import UsageTracker, { useTrackUsage } from '@/components/UsageTracker'
import PricingSection from '@/components/PricingSection'
import { AnalysisResult } from '@/types/analysis'

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState('')
  const { incrementUsage, checkLimit } = useTrackUsage()

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile)
    setAnalysisResult(null)
  }

  const handleMaterialSelection = (materials: string[]) => {
    setSelectedMaterials(materials)
  }

  const handleAnalyze = async () => {
    if (!file || selectedMaterials.length === 0) return

    // Check usage limit
    if (checkLimit()) {
      alert('You\'ve reached your free analysis limit. Please upgrade to Pro for unlimited analyses!')
      window.location.href = '#pricing'
      return
    }

    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setProgressMessage('Starting analysis...')
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('materials', JSON.stringify(selectedMaterials))

      // Use Vercel-optimized endpoint in production
      const endpoint = process.env.NEXT_PUBLIC_VERCEL_URL 
        ? '/api/analyze/vercel'
        : '/api/analyze'
      
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data = await response.json()
      
      // Check if it's a job response or direct result
      if (data.jobId) {
        // Development mode with job queue
        const pollInterval = setInterval(async () => {
          try {
            const statusResponse = await fetch(`/api/analyze/status/${data.jobId}`)
            const status = await statusResponse.json()
            
            if (status.progress) {
              setAnalysisProgress(status.progress.progress)
              setProgressMessage(status.progress.message)
            }
            
            if (status.status === 'completed') {
              clearInterval(pollInterval)
              setAnalysisResult(status.result)
              setIsAnalyzing(false)
              setProgressMessage('Analysis complete!')
            } else if (status.status === 'failed') {
              clearInterval(pollInterval)
              alert(status.error || 'Analysis failed. Please try again.')
              setIsAnalyzing(false)
              setProgressMessage('')
            }
          } catch (error) {
            console.error('Poll error:', error)
            clearInterval(pollInterval)
            setIsAnalyzing(false)
            setProgressMessage('')
          }
        }, 1000)
      } else {
        // Vercel mode - direct result
        setAnalysisResult(data)
        setIsAnalyzing(false)
        setProgressMessage('Analysis complete!')
        
        // Track usage
        const { limitReached, remaining } = incrementUsage()
        if (limitReached) {
          setTimeout(() => {
            alert('That was your last free analysis! Upgrade to Pro for unlimited analyses.')
          }, 2000)
        } else if (remaining === 1) {
          setTimeout(() => {
            alert('Only 1 free analysis remaining this month!')
          }, 2000)
        }
      }
    } catch (error) {
      console.error('Analysis error:', error)
      alert('Failed to analyze blueprint. Please try again.')
      setIsAnalyzing(false)
      setProgressMessage('')
    }
  }

  return (
    <>
      <UsageTracker />
      <DonationButton />
      
      {/* Hero Section */}
      <section className="hero-bg min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white bg-opacity-10 rounded-3xl floating-element"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-white bg-opacity-10 rounded-full floating-element" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-white bg-opacity-5 rounded-2xl floating-element" style={{animationDelay: '4s'}}></div>
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="slide-up">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Smart Construction
              <span className="block bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                Material Calculator
              </span>
            </h1>
          </div>
          
          <div className="slide-up stagger-1">
            <p className="text-xl md:text-2xl text-white text-opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Revolutionary AI-powered blueprint analysis that calculates lumber, plywood, and material quantities 
              in seconds. Save hours of manual calculations and get accurate cost estimates instantly.
            </p>
          </div>
          
          <div className="slide-up stagger-2 flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a href="#calculator" className="btn-primary text-lg">
              Start Free Trial 🚀
            </a>
            <a href="#pricing" className="btn-secondary text-lg">
              View Pricing
            </a>
          </div>
          
          <div className="slide-up stagger-3 mt-16">
            <div className="glass-card rounded-2xl p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">⚡</div>
                  <div className="text-2xl font-bold text-gray-800">99%</div>
                  <div className="text-gray-600">Accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">🕐</div>
                  <div className="text-2xl font-bold text-gray-800">&lt;30s</div>
                  <div className="text-gray-600">Analysis Time</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">💰</div>
                  <div className="text-2xl font-bold text-gray-800">$0</div>
                  <div className="text-gray-600">Free to Start</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">📊</div>
                  <div className="text-2xl font-bold text-gray-800">1000+</div>
                  <div className="text-gray-600">Happy Users</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold gradient-text mb-6">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Upload your blueprint, select materials, and get instant professional calculations
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div className="glass-card rounded-3xl p-8 card-hover">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Upload Your Blueprint</h3>
              </div>
              <FileUpload onFileUpload={handleFileUpload} />
              {process.env.NEXT_PUBLIC_VERCEL_URL && (
                <p className="text-sm text-gray-600 mt-4">
                  <span className="font-semibold">Note:</span> On Vercel, max file size is 4.5MB and analysis is simplified.
                </p>
              )}
              {file && (
                <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-green-700 font-medium">File uploaded: {file.name}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="glass-card rounded-3xl p-8 card-hover">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Select Materials</h3>
              </div>
              <MaterialSelector onMaterialSelect={handleMaterialSelection} />
            </div>
          </div>

          <div className="text-center mb-12">
            <button
              onClick={handleAnalyze}
              disabled={!file || selectedMaterials.length === 0 || isAnalyzing}
              className={`btn-primary text-xl px-12 py-5 ${
                (!file || selectedMaterials.length === 0 || isAnalyzing) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:scale-110'
              }`}
            >
              {isAnalyzing ? (
                <div className="flex flex-col items-center">
                  <div className="flex items-center mb-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                    {progressMessage || 'Analyzing Blueprint...'}
                  </div>
                  {analysisProgress > 0 && (
                    <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                      <div 
                        className="bg-white rounded-full h-2 transition-all duration-300"
                        style={{ width: `${analysisProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="mr-2">🎯</span>
                  Analyze Blueprint
                </div>
              )}
            </button>
          </div>

          {analysisResult && (
            <div className="mt-16">
              <ResultsDisplay result={analysisResult} />
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 hero-bg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">How It Works</h2>
            <p className="text-xl text-white text-opacity-90 max-w-2xl mx-auto">
              Advanced AI technology meets construction expertise
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="glass-card w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">📄</span>
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">Smart PDF Analysis</h4>
              <p className="text-white text-opacity-80 leading-relaxed">
                Our AI scans your construction documents and extracts square footage, floor plans, and structural details with precision.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="glass-card w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">🧮</span>
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">Instant Calculations</h4>
              <p className="text-white text-opacity-80 leading-relaxed">
                Professional-grade algorithms calculate exact material quantities based on industry standards and construction best practices.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="glass-card w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">💼</span>
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">Professional Reports</h4>
              <p className="text-white text-opacity-80 leading-relaxed">
                Get detailed cost breakdowns with current market prices, tax calculations, and exportable CSV reports for your projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold gradient-text mb-6">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for accurate construction material estimation
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '🎯', title: 'Precision Accuracy', desc: '99%+ accurate calculations based on industry standards' },
              { icon: '⚡', title: 'Lightning Fast', desc: 'Get results in under 30 seconds, not hours' },
              { icon: '📊', title: 'Detailed Reports', desc: 'Comprehensive breakdowns with current market pricing' },
              { icon: '💰', title: 'Cost Optimization', desc: 'Save thousands on material costs with smart calculations' },
              { icon: '📱', title: 'Mobile Ready', desc: 'Works perfectly on desktop, tablet, and mobile devices' },
              { icon: '🔒', title: 'Secure & Private', desc: 'Your blueprints and data are completely secure' }
            ].map((feature, index) => (
              <div key={index} className="glass-card rounded-2xl p-8 text-center card-hover">
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />
    </>
  )
}