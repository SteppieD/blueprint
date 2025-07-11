'use client'

import { AnalysisResult } from '@/types/analysis'

interface ResultsDisplayProps {
  result: AnalysisResult
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  const downloadCSV = () => {
    const csv = [
      ['Material', 'Quantity', 'Unit', 'Unit Price', 'Total Cost'],
      ...result.materials.map(m => [
        m.name,
        m.quantity.toString(),
        m.unit,
        `$${m.unitPrice.toFixed(2)}`,
        `$${m.totalCost.toFixed(2)}`
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `material-estimate-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="glass-card rounded-3xl p-8 border-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h3 className="text-3xl font-bold gradient-text mb-2">Analysis Results</h3>
          <p className="text-gray-600">Your comprehensive material breakdown</p>
        </div>
        <button
          onClick={downloadCSV}
          className="mt-4 md:mt-0 btn-primary flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download CSV
        </button>
      </div>

      {/* Project Info Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center mb-3">
            <span className="text-3xl mr-3">📐</span>
            <h4 className="text-lg font-semibold text-gray-800">Project Scale</h4>
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {result.projectInfo.totalSqFt.toLocaleString()} sq ft
          </div>
          <div className="text-gray-600">Total Square Footage</div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center mb-3">
            <span className="text-3xl mr-3">🏢</span>
            <h4 className="text-lg font-semibold text-gray-800">Building Levels</h4>
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-1">
            {result.projectInfo.floors}
          </div>
          <div className="text-gray-600">Number of Floors</div>
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Material
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Quantity
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Unit Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Total Cost
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {result.materials.map((material, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      <span className="text-lg mr-3">
                        {material.name.includes('Stud') ? '🪵' : '📋'}
                      </span>
                      {material.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="font-semibold">{material.quantity}</span> {material.unit}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    ${material.unitPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    ${material.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cost Summary */}
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
          <span className="text-lg font-medium text-gray-700">Subtotal:</span>
          <span className="text-lg font-semibold text-gray-900">
            ${result.summary.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
          <span className="text-lg font-medium text-gray-700">
            Tax ({(result.summary.taxRate * 100).toFixed(0)}%):
          </span>
          <span className="text-lg font-semibold text-gray-900">
            ${result.summary.tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
          <span className="text-2xl font-bold text-gray-800">Total Project Cost:</span>
          <span className="text-3xl font-bold gradient-text">
            ${result.summary.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl">
        <div className="flex items-start">
          <span className="text-2xl mr-3 flex-shrink-0">⚠️</span>
          <div>
            <h5 className="font-semibold text-amber-800 mb-2">Important Disclaimer</h5>
            <p className="text-sm text-amber-700 leading-relaxed">
              These estimates are based on standard construction practices and current market prices. 
              Actual material quantities may vary depending on specific architectural details, local building codes, 
              and construction methods. Always verify calculations with detailed plans and consult with your contractor 
              before making purchasing decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}