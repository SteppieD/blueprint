'use client'

import { useState } from 'react'

interface MaterialSelectorProps {
  onMaterialSelect: (materials: string[]) => void
}

const AVAILABLE_MATERIALS = [
  { id: '2x4_studs', name: '2x4 Studs', description: 'Standard framing lumber', icon: '🪵', category: 'lumber' },
  { id: '2x6_studs', name: '2x6 Studs', description: 'Exterior wall framing', icon: '🏗️', category: 'lumber' },
  { id: '2x8_studs', name: '2x8 Studs', description: 'Floor joists and headers', icon: '🏢', category: 'lumber' },
  { id: '2x10_studs', name: '2x10 Studs', description: 'Floor joists and beams', icon: '🏗️', category: 'lumber' },
  { id: '2x12_studs', name: '2x12 Studs', description: 'Heavy duty beams', icon: '🏢', category: 'lumber' },
  { id: 'plywood_3/8', name: '3/8" Plywood', description: 'Wall sheathing', icon: '📋', category: 'panel' },
  { id: 'plywood_1/2', name: '1/2" Plywood', description: 'Wall and floor sheathing', icon: '📋', category: 'panel' },
  { id: 'plywood_3/4', name: '3/4" Plywood', description: 'Subfloor', icon: '📋', category: 'panel' },
  { id: 'osb_7/16', name: '7/16" OSB', description: 'Roof and wall sheathing', icon: '🔳', category: 'panel' },
  { id: 'osb_5/8', name: '5/8" OSB', description: 'Floor sheathing', icon: '🔳', category: 'panel' },
]

export default function MaterialSelector({ onMaterialSelect }: MaterialSelectorProps) {
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])

  const handleMaterialToggle = (materialId: string) => {
    const updated = selectedMaterials.includes(materialId)
      ? selectedMaterials.filter(id => id !== materialId)
      : [...selectedMaterials, materialId]
    
    setSelectedMaterials(updated)
    onMaterialSelect(updated)
  }

  const selectAll = () => {
    const allIds = AVAILABLE_MATERIALS.map(m => m.id)
    setSelectedMaterials(allIds)
    onMaterialSelect(allIds)
  }

  const clearAll = () => {
    setSelectedMaterials([])
    onMaterialSelect([])
  }

  const selectByCategory = (category: string) => {
    const categoryIds = AVAILABLE_MATERIALS.filter(m => m.category === category).map(m => m.id)
    const updated = [...new Set([...selectedMaterials, ...categoryIds])]
    setSelectedMaterials(updated)
    onMaterialSelect(updated)
  }

  const lumberMaterials = AVAILABLE_MATERIALS.filter(m => m.category === 'lumber')
  const panelMaterials = AVAILABLE_MATERIALS.filter(m => m.category === 'panel')

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={selectAll}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium hover:scale-105 transition-transform duration-200"
        >
          Select All
        </button>
        <button
          onClick={() => selectByCategory('lumber')}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium hover:scale-105 transition-transform duration-200"
        >
          All Lumber
        </button>
        <button
          onClick={() => selectByCategory('panel')}
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl text-sm font-medium hover:scale-105 transition-transform duration-200"
        >
          All Panels
        </button>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
        >
          Clear All
        </button>
      </div>

      {/* Lumber Section */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="text-2xl mr-2">🪵</span>
          Lumber & Framing
        </h4>
        <div className="grid gap-3">
          {lumberMaterials.map((material) => (
            <label
              key={material.id}
              className={`group flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                selectedMaterials.includes(material.id)
                  ? 'border-purple-300 bg-purple-50 shadow-lg scale-102'
                  : 'border-gray-200 hover:border-purple-200 hover:bg-purple-25 hover:scale-102'
              }`}
            >
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={selectedMaterials.includes(material.id)}
                  onChange={() => handleMaterialToggle(material.id)}
                />
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                  selectedMaterials.includes(material.id)
                    ? 'border-purple-500 bg-purple-500'
                    : 'border-gray-300 group-hover:border-purple-400'
                }`}>
                  {selectedMaterials.includes(material.id) && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              
              <div className="flex items-center flex-1 ml-4">
                <span className="text-2xl mr-4">{material.icon}</span>
                <div>
                  <div className="font-semibold text-gray-900">{material.name}</div>
                  <div className="text-sm text-gray-500">{material.description}</div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Panels Section */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="text-2xl mr-2">📋</span>
          Panels & Sheathing
        </h4>
        <div className="grid gap-3">
          {panelMaterials.map((material) => (
            <label
              key={material.id}
              className={`group flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                selectedMaterials.includes(material.id)
                  ? 'border-purple-300 bg-purple-50 shadow-lg scale-102'
                  : 'border-gray-200 hover:border-purple-200 hover:bg-purple-25 hover:scale-102'
              }`}
            >
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={selectedMaterials.includes(material.id)}
                  onChange={() => handleMaterialToggle(material.id)}
                />
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                  selectedMaterials.includes(material.id)
                    ? 'border-purple-500 bg-purple-500'
                    : 'border-gray-300 group-hover:border-purple-400'
                }`}>
                  {selectedMaterials.includes(material.id) && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              
              <div className="flex items-center flex-1 ml-4">
                <span className="text-2xl mr-4">{material.icon}</span>
                <div>
                  <div className="font-semibold text-gray-900">{material.name}</div>
                  <div className="text-sm text-gray-500">{material.description}</div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
      
      {/* Selection Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl mr-2">📋</span>
            <span className="font-medium text-gray-800">
              {selectedMaterials.length} material{selectedMaterials.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          {selectedMaterials.length > 0 && (
            <div className="flex items-center text-green-600">
              <span className="text-sm font-medium">Ready to analyze!</span>
              <span className="ml-1">✓</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}