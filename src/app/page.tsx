'use client'

import { useState } from 'react'
import FileUpload from '@/components/FileUpload'
import MaterialSelector from '@/components/MaterialSelector'
import ResultsDisplay from '@/components/ResultsDisplay'
import { AnalysisResult } from '@/types/analysis'

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile)
    setAnalysisResult(null)
  }

  const handleMaterialSelection = (materials: string[]) => {
    setSelectedMaterials(materials)
  }

  const handleAnalyze = async () => {
    if (!file || selectedMaterials.length === 0) return

    setIsAnalyzing(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('materials', JSON.stringify(selectedMaterials))

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const result = await response.json()
      setAnalysisResult(result)
    } catch (error) {
      console.error('Analysis error:', error)
      alert('Failed to analyze blueprint. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Construction Material Calculator
        </h2>
        <p className="text-xl text-gray-600">
          Upload your blueprints and get instant material quantities and cost estimates
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-2xl font-semibold mb-4">Step 1: Upload Blueprint</h3>
          <FileUpload onFileUpload={handleFileUpload} />
          {file && (
            <p className="mt-4 text-sm text-gray-600">
              Selected: {file.name}
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-2xl font-semibold mb-4">Step 2: Select Materials</h3>
          <MaterialSelector onMaterialSelect={handleMaterialSelection} />
        </div>
      </div>

      <div className="text-center mb-8">
        <button
          onClick={handleAnalyze}
          disabled={!file || selectedMaterials.length === 0 || isAnalyzing}
          className={`btn-primary ${
            (!file || selectedMaterials.length === 0 || isAnalyzing) 
              ? 'opacity-50 cursor-not-allowed' 
              : ''
          }`}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Blueprint'}
        </button>
      </div>

      {analysisResult && (
        <ResultsDisplay result={analysisResult} />
      )}

      <div className="mt-16 bg-blue-50 rounded-lg p-8">
        <h3 className="text-2xl font-semibold mb-4">How It Works</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h4 className="font-semibold mb-2">Upload Blueprint</h4>
            <p className="text-gray-600">Upload your construction documents in PDF format</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h4 className="font-semibold mb-2">Select Materials</h4>
            <p className="text-gray-600">Choose which materials you want to calculate</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h4 className="font-semibold mb-2">Get Results</h4>
            <p className="text-gray-600">Receive detailed quantities and cost estimates</p>
          </div>
        </div>
      </div>
    </div>
  )
}