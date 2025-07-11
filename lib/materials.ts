// Comprehensive material database for construction estimation

export interface Material {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  unit: string;
  averagePrice: number; // Base price in CAD
  priceRange: {
    low: number;
    high: number;
  };
  coverage?: number; // Coverage per unit (e.g., sq ft per gallon)
  wasteFactor: number; // Percentage of waste to account for
  description: string;
  applications: string[];
  keywords: string[]; // For SEO
  relatedMaterials: string[];
  estimationNotes: string;
}

export const MATERIAL_CATEGORIES = {
  lumber: {
    name: 'Lumber & Framing',
    description: 'Structural wood materials for framing and construction',
    seoTitle: 'Lumber Cost Calculator - Framing Material Estimator',
    keywords: ['lumber cost calculator', 'framing lumber prices', 'wood cost estimator']
  },
  concrete: {
    name: 'Concrete & Masonry',
    description: 'Concrete, cement, and masonry materials',
    seoTitle: 'Concrete Cost Calculator - Cement & Masonry Estimator',
    keywords: ['concrete cost calculator', 'cement price estimator', 'masonry cost']
  },
  drywall: {
    name: 'Drywall & Finishing',
    description: 'Drywall sheets, compound, and finishing materials',
    seoTitle: 'Drywall Cost Calculator - Sheetrock Material Estimator',
    keywords: ['drywall cost calculator', 'sheetrock estimator', 'drywall material cost']
  },
  insulation: {
    name: 'Insulation',
    description: 'Thermal and sound insulation materials',
    seoTitle: 'Insulation Cost Calculator - Material Estimator',
    keywords: ['insulation cost calculator', 'insulation material estimator']
  },
  roofing: {
    name: 'Roofing Materials',
    description: 'Shingles, underlayment, and roofing components',
    seoTitle: 'Roofing Cost Calculator - Shingle & Material Estimator',
    keywords: ['roofing cost calculator', 'shingle estimator', 'roof material cost']
  },
  siding: {
    name: 'Siding & Exterior',
    description: 'Exterior siding and cladding materials',
    seoTitle: 'Siding Cost Calculator - Exterior Material Estimator',
    keywords: ['siding cost calculator', 'exterior material estimator']
  },
  flooring: {
    name: 'Flooring',
    description: 'Hardwood, laminate, tile, and carpet flooring',
    seoTitle: 'Flooring Cost Calculator - Material Estimator',
    keywords: ['flooring cost calculator', 'flooring material estimator']
  },
  paint: {
    name: 'Paint & Finishes',
    description: 'Interior and exterior paints, primers, and finishes',
    seoTitle: 'Paint Cost Calculator - Paint & Primer Estimator',
    keywords: ['paint cost calculator', 'paint estimator', 'painting cost calculator']
  },
  electrical: {
    name: 'Electrical',
    description: 'Wiring, outlets, switches, and electrical components',
    seoTitle: 'Electrical Cost Calculator - Wiring Material Estimator',
    keywords: ['electrical cost calculator', 'wiring estimator', 'electrical material cost']
  },
  plumbing: {
    name: 'Plumbing',
    description: 'Pipes, fittings, fixtures, and plumbing supplies',
    seoTitle: 'Plumbing Cost Calculator - Pipe & Fixture Estimator',
    keywords: ['plumbing cost calculator', 'pipe cost estimator', 'plumbing material cost']
  }
};

export const MATERIALS: Material[] = [
  // LUMBER & FRAMING
  {
    id: '2x4_studs',
    name: '2x4 Studs (8ft)',
    category: 'lumber',
    subcategory: 'framing',
    unit: 'pieces',
    averagePrice: 8.50,
    priceRange: { low: 7.00, high: 12.00 },
    wasteFactor: 0.10,
    description: 'Standard 2x4 dimensional lumber studs for wall framing',
    applications: ['Interior walls', 'Non-load bearing walls', 'Partition walls'],
    keywords: ['2x4 stud cost', '2x4 lumber price', 'framing lumber cost', 'wall stud estimator'],
    relatedMaterials: ['2x6_studs', 'top_plates', 'bottom_plates'],
    estimationNotes: 'Calculate 1 stud per 16" on center plus extras for corners and openings'
  },
  {
    id: '2x6_studs',
    name: '2x6 Studs (8ft)',
    category: 'lumber',
    subcategory: 'framing',
    unit: 'pieces',
    averagePrice: 12.50,
    priceRange: { low: 10.00, high: 18.00 },
    wasteFactor: 0.10,
    description: 'Premium 2x6 dimensional lumber studs for exterior walls',
    applications: ['Exterior walls', 'Load-bearing walls', 'Insulated walls'],
    keywords: ['2x6 stud cost', '2x6 lumber price', 'exterior wall studs', '2x6 framing cost'],
    relatedMaterials: ['2x4_studs', 'top_plates_2x6', 'bottom_plates_2x6'],
    estimationNotes: 'Standard for exterior walls, provides better insulation space'
  },
  {
    id: 'plywood_3_4',
    name: '3/4" Plywood (4x8)',
    category: 'lumber',
    subcategory: 'sheathing',
    unit: 'sheets',
    averagePrice: 75.00,
    priceRange: { low: 65.00, high: 95.00 },
    wasteFactor: 0.08,
    description: 'Premium grade 3/4 inch plywood for subflooring',
    applications: ['Subflooring', 'Structural sheathing', 'Cabinet construction'],
    keywords: ['3/4 plywood cost', 'subfloor plywood price', 'structural plywood cost'],
    relatedMaterials: ['plywood_5_8', 'osb_3_4', 'construction_adhesive'],
    estimationNotes: '32 sq ft coverage per sheet, ideal for subflooring'
  },

  // CONCRETE & MASONRY
  {
    id: 'concrete_mix',
    name: 'Ready-Mix Concrete',
    category: 'concrete',
    subcategory: 'concrete',
    unit: 'cubic yards',
    averagePrice: 150.00,
    priceRange: { low: 120.00, high: 200.00 },
    wasteFactor: 0.05,
    description: 'Standard ready-mix concrete for foundations and slabs',
    applications: ['Foundation slabs', 'Driveways', 'Sidewalks', 'Basement floors'],
    keywords: ['concrete cost per yard', 'ready mix concrete price', 'concrete slab cost calculator'],
    relatedMaterials: ['rebar', 'concrete_forms', 'vapor_barrier'],
    estimationNotes: '1 cubic yard covers 81 sq ft at 4" thick'
  },
  {
    id: 'concrete_bags',
    name: 'Concrete Mix (80lb bags)',
    category: 'concrete',
    subcategory: 'concrete',
    unit: 'bags',
    averagePrice: 6.50,
    priceRange: { low: 5.50, high: 8.00 },
    wasteFactor: 0.10,
    description: 'Bagged concrete mix for small projects',
    applications: ['Small slabs', 'Post holes', 'Small repairs', 'DIY projects'],
    keywords: ['bagged concrete cost', 'concrete bag price', 'small concrete projects'],
    relatedMaterials: ['concrete_mix', 'rebar', 'concrete_sealer'],
    estimationNotes: '1 bag covers about 0.6 cubic feet, 45 bags per cubic yard'
  },
  {
    id: 'rebar',
    name: '#4 Rebar (20ft)',
    category: 'concrete',
    subcategory: 'reinforcement',
    unit: 'pieces',
    averagePrice: 25.00,
    priceRange: { low: 20.00, high: 35.00 },
    wasteFactor: 0.05,
    description: 'Steel reinforcement bars for concrete reinforcement',
    applications: ['Concrete slabs', 'Foundation walls', 'Footings'],
    keywords: ['rebar cost', 'concrete reinforcement cost', 'steel rebar price'],
    relatedMaterials: ['concrete_mix', 'rebar_ties', 'concrete_forms'],
    estimationNotes: 'Typically spaced 12-18 inches on center in both directions'
  },

  // DRYWALL & FINISHING
  {
    id: 'drywall_1_2',
    name: '1/2" Drywall (4x8)',
    category: 'drywall',
    subcategory: 'panels',
    unit: 'sheets',
    averagePrice: 18.00,
    priceRange: { low: 15.00, high: 25.00 },
    wasteFactor: 0.15,
    description: 'Standard 1/2 inch gypsum drywall sheets',
    applications: ['Interior walls', 'Ceilings', 'Standard residential construction'],
    keywords: ['drywall cost per sheet', 'sheetrock price', 'drywall material cost'],
    relatedMaterials: ['drywall_compound', 'drywall_tape', 'drywall_screws'],
    estimationNotes: '32 sq ft per sheet, allow extra for waste and cuts'
  },
  {
    id: 'drywall_5_8',
    name: '5/8" Drywall (4x8)',
    category: 'drywall',
    subcategory: 'panels',
    unit: 'sheets',
    averagePrice: 22.00,
    priceRange: { low: 18.00, high: 30.00 },
    wasteFactor: 0.15,
    description: 'Fire-rated 5/8 inch gypsum drywall sheets',
    applications: ['Fire-rated walls', 'Ceilings below garage', 'Commercial applications'],
    keywords: ['5/8 drywall cost', 'fire rated drywall price', 'type X drywall cost'],
    relatedMaterials: ['drywall_1_2', 'drywall_compound', 'fire_rated_tape'],
    estimationNotes: 'Required for fire-rated assemblies, heavier than 1/2 inch'
  },
  {
    id: 'drywall_compound',
    name: 'Drywall Compound (5 gallon)',
    category: 'drywall',
    subcategory: 'finishing',
    unit: 'buckets',
    averagePrice: 35.00,
    priceRange: { low: 28.00, high: 45.00 },
    wasteFactor: 0.05,
    description: 'Joint compound for taping and finishing drywall',
    applications: ['Taping joints', 'Covering screws', 'Texturing', 'Repairs'],
    keywords: ['drywall mud cost', 'joint compound price', 'drywall finishing cost'],
    relatedMaterials: ['drywall_tape', 'primer', 'sandpaper'],
    estimationNotes: '1 bucket covers approximately 400-500 sq ft of drywall'
  },

  // INSULATION
  {
    id: 'fiberglass_r13',
    name: 'Fiberglass Insulation R-13',
    category: 'insulation',
    subcategory: 'batts',
    unit: 'sq ft',
    averagePrice: 1.25,
    priceRange: { low: 1.00, high: 1.75 },
    wasteFactor: 0.10,
    description: 'R-13 fiberglass batt insulation for 2x4 walls',
    applications: ['2x4 wall cavities', 'Interior walls', 'Sound dampening'],
    keywords: ['R13 insulation cost', 'fiberglass insulation price', 'wall insulation cost'],
    relatedMaterials: ['fiberglass_r21', 'vapor_barrier', 'insulation_supports'],
    estimationNotes: 'Standard for 2x4 walls, covers wall cavity area'
  },
  {
    id: 'fiberglass_r21',
    name: 'Fiberglass Insulation R-21',
    category: 'insulation',
    subcategory: 'batts',
    unit: 'sq ft',
    averagePrice: 1.75,
    priceRange: { low: 1.40, high: 2.25 },
    wasteFactor: 0.10,
    description: 'R-21 fiberglass batt insulation for 2x6 walls',
    applications: ['2x6 wall cavities', 'Exterior walls', 'Energy efficiency'],
    keywords: ['R21 insulation cost', '2x6 wall insulation price', 'exterior wall insulation'],
    relatedMaterials: ['fiberglass_r13', 'vapor_barrier', 'insulation_supports'],
    estimationNotes: 'Higher R-value for 2x6 exterior walls'
  },

  // PAINT & FINISHES
  {
    id: 'interior_paint',
    name: 'Interior Paint (1 gallon)',
    category: 'paint',
    subcategory: 'interior',
    unit: 'gallons',
    averagePrice: 65.00,
    priceRange: { low: 45.00, high: 95.00 },
    coverage: 350,
    wasteFactor: 0.05,
    description: 'Premium interior latex paint',
    applications: ['Interior walls', 'Ceilings', 'Trim', 'Doors'],
    keywords: ['interior paint cost', 'wall paint price', 'interior paint calculator'],
    relatedMaterials: ['primer', 'exterior_paint', 'paint_brushes'],
    estimationNotes: '1 gallon covers approximately 350-400 sq ft per coat'
  },
  {
    id: 'exterior_paint',
    name: 'Exterior Paint (1 gallon)',
    category: 'paint',
    subcategory: 'exterior',
    unit: 'gallons',
    averagePrice: 85.00,
    priceRange: { low: 60.00, high: 120.00 },
    coverage: 300,
    wasteFactor: 0.08,
    description: 'High-quality exterior acrylic paint',
    applications: ['Exterior siding', 'Trim', 'Doors', 'Windows'],
    keywords: ['exterior paint cost', 'house paint price', 'exterior paint calculator'],
    relatedMaterials: ['primer', 'interior_paint', 'caulking'],
    estimationNotes: '1 gallon covers 300-350 sq ft, may need 2 coats'
  },
  {
    id: 'primer',
    name: 'Paint Primer (1 gallon)',
    category: 'paint',
    subcategory: 'primer',
    unit: 'gallons',
    averagePrice: 45.00,
    priceRange: { low: 35.00, high: 65.00 },
    coverage: 400,
    wasteFactor: 0.05,
    description: 'High-quality paint primer and sealer',
    applications: ['New drywall', 'Bare wood', 'Color changes', 'Stain blocking'],
    keywords: ['primer cost', 'paint primer price', 'wall primer calculator'],
    relatedMaterials: ['interior_paint', 'exterior_paint', 'sandpaper'],
    estimationNotes: 'Essential for new surfaces and dramatic color changes'
  },

  // ROOFING
  {
    id: 'asphalt_shingles',
    name: 'Asphalt Shingles',
    category: 'roofing',
    subcategory: 'shingles',
    unit: 'squares',
    averagePrice: 150.00,
    priceRange: { low: 120.00, high: 250.00 },
    wasteFactor: 0.10,
    description: 'Standard 3-tab asphalt roofing shingles',
    applications: ['Residential roofing', 'Shed roofing', 'Garage roofing'],
    keywords: ['shingle cost per square', 'asphalt shingles price', 'roofing cost calculator'],
    relatedMaterials: ['underlayment', 'ridge_shingles', 'roofing_nails'],
    estimationNotes: '1 square covers 100 sq ft of roof area'
  },

  // Add more materials as needed...
];

// Helper functions for material calculations
export function getMaterialsByCategory(category: string): Material[] {
  return MATERIALS.filter(material => material.category === category);
}

export function getMaterialById(id: string): Material | undefined {
  return MATERIALS.find(material => material.id === id);
}

export function calculateMaterialCost(
  materialId: string, 
  quantity: number, 
  includeWaste: boolean = true
): number {
  const material = getMaterialById(materialId);
  if (!material) return 0;
  
  const adjustedQuantity = includeWaste 
    ? quantity * (1 + material.wasteFactor) 
    : quantity;
    
  return adjustedQuantity * material.averagePrice;
}

export function getAllMaterialKeywords(): string[] {
  return MATERIALS.flatMap(material => material.keywords);
}

export function getRelatedMaterials(materialId: string): Material[] {
  const material = getMaterialById(materialId);
  if (!material) return [];
  
  return material.relatedMaterials
    .map(id => getMaterialById(id))
    .filter((mat): mat is Material => mat !== undefined);
}