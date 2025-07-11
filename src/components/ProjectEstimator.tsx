'use client';

import { useState } from 'react';
import { Material } from '../../lib/materials';

interface ProjectType {
  id: string;
  name: string;
  description: string;
  materials: string[];
  seoKeywords: string[];
}

interface ProjectEstimatorProps {
  project: ProjectType;
  materials: Material[];
}

interface ProjectInputs {
  squareFootage?: number;
  linearFeet?: number;
  roomCount?: number;
  height?: number;
}

export default function ProjectEstimator({ project, materials }: ProjectEstimatorProps) {
  const [inputs, setInputs] = useState<ProjectInputs>({
    squareFootage: 500,
    height: 8,
  });
  const [includeLabor, setIncludeLabor] = useState(false);
  const [location, setLocation] = useState('average');

  const locationMultipliers: { [key: string]: number } = {
    'vancouver': 1.15,
    'toronto': 1.12,
    'calgary': 1.08,
    'montreal': 1.05,
    'average': 1.0,
    'rural': 0.95,
  };

  const calculateMaterialQuantities = () => {
    const quantities: { [materialId: string]: number } = {};
    const sqft = inputs.squareFootage || 0;
    const height = inputs.height || 8;

    materials.forEach(material => {
      if (!material) return;

      switch (material.id) {
        case '2x4_studs':
        case '2x6_studs':
          // Studs: approximately 1 per 16" on center plus extras
          quantities[material.id] = Math.ceil((sqft / 100) * 12); // Rough estimate
          break;
        case 'drywall_1_2':
        case 'drywall_5_8':
          // Drywall: sq ft / 32 (sheet coverage)
          quantities[material.id] = Math.ceil(sqft / 32);
          break;
        case 'insulation':
        case 'fiberglass_r13':
        case 'fiberglass_r21':
          // Insulation: matches wall area
          quantities[material.id] = sqft;
          break;
        case 'interior_paint':
        case 'exterior_paint':
          // Paint: coverage per gallon
          const coverage = material.coverage || 350;
          quantities[material.id] = Math.ceil(sqft / coverage);
          break;
        case 'concrete_mix':
          // Concrete: for slabs at 4" thick
          quantities[material.id] = Math.ceil(sqft / 81); // cubic yards
          break;
        case 'flooring':
          // Flooring: direct sq ft
          quantities[material.id] = sqft;
          break;
        default:
          // Default estimation
          quantities[material.id] = Math.ceil(sqft / 100);
      }
    });

    return quantities;
  };

  const materialQuantities = calculateMaterialQuantities();
  const locationMultiplier = locationMultipliers[location] || 1.0;

  const calculateMaterialCosts = () => {
    let totalCost = 0;
    const itemizedCosts: Array<{ material: Material; quantity: number; cost: number }> = [];

    materials.forEach(material => {
      if (!material) return;

      const quantity = materialQuantities[material.id] || 0;
      const adjustedQuantity = quantity * (1 + material.wasteFactor);
      const unitCost = material.averagePrice * locationMultiplier;
      const totalMaterialCost = adjustedQuantity * unitCost;

      totalCost += totalMaterialCost;
      itemizedCosts.push({
        material,
        quantity: adjustedQuantity,
        cost: totalMaterialCost,
      });
    });

    return { totalCost, itemizedCosts };
  };

  const { totalCost, itemizedCosts } = calculateMaterialCosts();
  const laborCost = includeLabor ? totalCost * 1.5 : 0; // Rough 150% labor multiplier
  const grandTotal = totalCost + laborCost;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Project Estimator</h2>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Square Footage
            </label>
            <input
              type="number"
              value={inputs.squareFootage || ''}
              onChange={(e) => setInputs(prev => ({
                ...prev,
                squareFootage: parseFloat(e.target.value) || 0
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter square footage"
              min="0"
            />
          </div>

          {(project.id === 'basement-renovation' || project.id === 'home-addition') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ceiling Height (feet)
              </label>
              <input
                type="number"
                value={inputs.height || ''}
                onChange={(e) => setInputs(prev => ({
                  ...prev,
                  height: parseFloat(e.target.value) || 8
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="8"
                min="7"
                max="12"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="average">Average Canadian Price</option>
              <option value="vancouver">Vancouver, BC (+15%)</option>
              <option value="toronto">Toronto, ON (+12%)</option>
              <option value="calgary">Calgary, AB (+8%)</option>
              <option value="montreal">Montreal, QC (+5%)</option>
              <option value="rural">Rural Areas (-5%)</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeLabor"
              checked={includeLabor}
              onChange={(e) => setIncludeLabor(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="includeLabor" className="ml-2 block text-sm text-gray-700">
              Include estimated labor costs
            </label>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Cost Breakdown</h3>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {itemizedCosts.map(({ material, quantity, cost }) => (
              <div key={material.id} className="flex justify-between text-sm">
                <div>
                  <div className="font-medium">{material.name}</div>
                  <div className="text-gray-500">
                    {quantity.toFixed(1)} {material.unit}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${cost.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>

          <hr className="my-4" />
          
          <div className="space-y-2">
            <div className="flex justify-between font-semibold">
              <span>Materials Subtotal:</span>
              <span>${totalCost.toFixed(2)}</span>
            </div>
            
            {includeLabor && (
              <div className="flex justify-between">
                <span>Estimated Labor:</span>
                <span>${laborCost.toFixed(2)}</span>
              </div>
            )}
            
            <hr className="my-2" />
            
            <div className="flex justify-between text-lg font-bold">
              <span>Total Project Cost:</span>
              <span className="text-blue-600">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-xs text-blue-700">
              This is an estimate based on average material costs and standard construction practices. 
              Actual costs may vary significantly based on specific requirements, local codes, and contractor rates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}