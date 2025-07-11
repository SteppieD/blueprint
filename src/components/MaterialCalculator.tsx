'use client';

import { useState } from 'react';
import { Material } from '../../lib/materials';

interface MaterialCalculatorProps {
  material: Material;
}

export default function MaterialCalculator({ material }: MaterialCalculatorProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [includeWaste, setIncludeWaste] = useState<boolean>(true);
  const [location, setLocation] = useState<string>('average');

  const calculateCost = () => {
    let baseQuantity = quantity;
    
    if (includeWaste) {
      baseQuantity = quantity * (1 + material.wasteFactor);
    }
    
    let unitPrice = material.averagePrice;
    
    // Location-based pricing adjustments
    const locationMultipliers: { [key: string]: number } = {
      'vancouver': 1.15,
      'toronto': 1.12,
      'calgary': 1.08,
      'montreal': 1.05,
      'average': 1.0,
      'rural': 0.95,
    };
    
    unitPrice *= locationMultipliers[location] || 1.0;
    
    return baseQuantity * unitPrice;
  };

  const totalCost = calculateCost();
  const wasteQuantity = includeWaste ? quantity * material.wasteFactor : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Calculate Your {material.name} Cost</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity ({material.unit})
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Enter ${material.unit}`}
              min="0"
              step="0.1"
            />
          </div>

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
              id="includeWaste"
              checked={includeWaste}
              onChange={(e) => setIncludeWaste(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="includeWaste" className="ml-2 block text-sm text-gray-700">
              Include waste factor ({(material.wasteFactor * 100).toFixed(0)}%)
            </label>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Cost Breakdown</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Base quantity:</span>
              <span>{quantity.toFixed(2)} {material.unit}</span>
            </div>
            
            {includeWaste && wasteQuantity > 0 && (
              <div className="flex justify-between">
                <span>Waste allowance:</span>
                <span>{wasteQuantity.toFixed(2)} {material.unit}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span>Total quantity:</span>
              <span>{(includeWaste ? quantity * (1 + material.wasteFactor) : quantity).toFixed(2)} {material.unit}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Unit price:</span>
              <span>${(material.averagePrice * (location === 'vancouver' ? 1.15 : location === 'toronto' ? 1.12 : location === 'calgary' ? 1.08 : location === 'montreal' ? 1.05 : location === 'rural' ? 0.95 : 1.0)).toFixed(2)}</span>
            </div>
            
            <hr className="my-2" />
            
            <div className="flex justify-between font-bold text-lg">
              <span>Total Cost:</span>
              <span className="text-blue-600">${totalCost.toFixed(2)}</span>
            </div>
          </div>

          {material.coverage && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">
                <strong>Coverage:</strong> {material.coverage} sq ft per {material.unit}
              </p>
              <p className="text-sm text-blue-700">
                Total coverage: {(quantity * material.coverage).toFixed(0)} sq ft
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Prices are estimates based on Canadian averages and may vary by supplier, 
          season, and specific product specifications. Always get quotes from local suppliers for accurate pricing.
        </p>
      </div>
    </div>
  );
}