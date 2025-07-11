'use client'

import { useState } from 'react'

interface MaterialSelectorProps {
  onMaterialSelect: (materials: string[]) => void
}

const AVAILABLE_MATERIALS = [
  { id: '2x4_studs', name: '2x4 Studs', description: 'Standard framing lumber' },
  { id: '2x6_studs', name: '2x6 Studs', description: 'Exterior wall framing' },
  { id: '2x8_studs', name: '2x8 Studs', description: 'Floor joists and headers' },
  { id: '2x10_studs', name: '2x10 Studs', description: 'Floor joists and beams' },
  { id: '2x12_studs', name: '2x12 Studs', description: 'Heavy duty beams' },
  { id: 'plywood_3/8', name: '3/8" Plywood', description: 'Wall sheathing' },
  { id: 'plywood_1/2', name: '1/2" Plywood', description: 'Wall and floor sheathing' },
  { id: 'plywood_3/4', name: '3/4" Plywood', description: 'Subfloor' },
  { id: 'osb_7/16', name: '7/16" OSB', description: 'Roof and wall sheathing' },
  { id: 'osb_5/8', name: '5/8" OSB', description: 'Floor sheathing' },
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

  return (
    <div>
      <div className="flex justify-between mb-4">
        <button
          onClick={selectAll}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Select All
        </button>
        <button
          onClick={clearAll}
          className="text-sm text-gray-600 hover:text-gray-700"
        >
          Clear All
        </button>
      </div>
      
      <div className="space-y-2">
        {AVAILABLE_MATERIALS.map((material) => (
          <label
            key={material.id}
            className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={selectedMaterials.includes(material.id)}
              onChange={() => handleMaterialToggle(material.id)}
            />
            <div className="ml-3">
              <div className="font-medium text-gray-900">{material.name}</div>
              <div className="text-sm text-gray-500">{material.description}</div>
            </div>
          </label>
        ))}
      </div>
      
      <p className="mt-4 text-sm text-gray-600">
        Selected: {selectedMaterials.length} material{selectedMaterials.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}