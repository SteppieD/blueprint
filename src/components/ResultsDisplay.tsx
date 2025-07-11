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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold">Analysis Results</h3>
        <button
          onClick={downloadCSV}
          className="btn-secondary text-sm"
        >
          Download CSV
        </button>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-medium mb-2">Project Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Square Footage:</span>
            <span className="ml-2 font-medium">{result.projectInfo.totalSqFt} sq ft</span>
          </div>
          <div>
            <span className="text-gray-600">Floors:</span>
            <span className="ml-2 font-medium">{result.projectInfo.floors}</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Material
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Cost
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {result.materials.map((material, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {material.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {material.quantity} {material.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${material.unitPrice.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${material.totalCost.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50">
              <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                Subtotal:
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                ${result.summary.subtotal.toFixed(2)}
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                Tax ({(result.summary.taxRate * 100).toFixed(0)}%):
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                ${result.summary.tax.toFixed(2)}
              </td>
            </tr>
            <tr className="bg-blue-50">
              <td colSpan={3} className="px-6 py-4 text-lg font-medium text-gray-900 text-right">
                Total:
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-blue-600">
                ${result.summary.total.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> These are estimates based on typical construction patterns and current market prices. 
          Actual quantities may vary based on specific architectural details. Please verify with detailed plans and consult with your contractor.
        </p>
      </div>
    </div>
  )
}