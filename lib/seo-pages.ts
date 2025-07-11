// SEO Powerhouse: Generate thousands of targeted pages for maximum search visibility

import { MATERIALS, MATERIAL_CATEGORIES, Material } from './materials';

// Core page types for SEO domination
export const SEO_PAGE_TYPES = {
  // Material-specific calculators
  MATERIAL_CALCULATOR: 'calculator',
  // Cost estimation pages
  COST_ESTIMATOR: 'cost-estimator', 
  // How-to guides
  HOW_TO_CALCULATE: 'how-to-calculate',
  // Material comparison pages
  MATERIAL_COMPARISON: 'comparison',
  // Project-specific estimators
  PROJECT_ESTIMATOR: 'project-estimator',
  // Location-based pricing
  LOCATION_PRICING: 'location-pricing',
  // Supplier-specific pages
  SUPPLIER_PRICING: 'supplier-pricing'
};

// Canadian provinces and major cities for location-based SEO
export const CANADIAN_LOCATIONS = {
  provinces: [
    { code: 'BC', name: 'British Columbia', major_cities: ['Vancouver', 'Victoria', 'Burnaby', 'Richmond'] },
    { code: 'AB', name: 'Alberta', major_cities: ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge'] },
    { code: 'SK', name: 'Saskatchewan', major_cities: ['Saskatoon', 'Regina', 'Prince Albert'] },
    { code: 'MB', name: 'Manitoba', major_cities: ['Winnipeg', 'Brandon', 'Steinbach'] },
    { code: 'ON', name: 'Ontario', major_cities: ['Toronto', 'Ottawa', 'Hamilton', 'London', 'Kitchener', 'Windsor'] },
    { code: 'QC', name: 'Quebec', major_cities: ['Montreal', 'Quebec City', 'Laval', 'Gatineau'] },
    { code: 'NB', name: 'New Brunswick', major_cities: ['Saint John', 'Moncton', 'Fredericton'] },
    { code: 'PE', name: 'Prince Edward Island', major_cities: ['Charlottetown', 'Summerside'] },
    { code: 'NS', name: 'Nova Scotia', major_cities: ['Halifax', 'Sydney', 'Truro'] },
    { code: 'NL', name: 'Newfoundland and Labrador', major_cities: ['St. Johns', 'Corner Brook'] },
    { code: 'YT', name: 'Yukon', major_cities: ['Whitehorse'] },
    { code: 'NT', name: 'Northwest Territories', major_cities: ['Yellowknife'] },
    { code: 'NU', name: 'Nunavut', major_cities: ['Iqaluit'] }
  ]
};

// Popular home improvement projects for project-specific SEO
export const PROJECT_TYPES = [
  {
    id: 'basement-renovation',
    name: 'Basement Renovation',
    description: 'Complete basement finishing and renovation',
    materials: ['2x4_studs', 'drywall_1_2', 'insulation', 'flooring', 'electrical'],
    seoKeywords: ['basement renovation cost', 'basement finishing cost', 'basement remodel estimator']
  },
  {
    id: 'kitchen-renovation',
    name: 'Kitchen Renovation',
    description: 'Kitchen remodeling and renovation',
    materials: ['drywall_1_2', 'paint', 'electrical', 'plumbing', 'flooring'],
    seoKeywords: ['kitchen renovation cost', 'kitchen remodel cost calculator', 'kitchen renovation estimator']
  },
  {
    id: 'bathroom-renovation',
    name: 'Bathroom Renovation',
    description: 'Bathroom remodeling and renovation',
    materials: ['drywall_1_2', 'tile', 'plumbing', 'electrical', 'waterproofing'],
    seoKeywords: ['bathroom renovation cost', 'bathroom remodel estimator', 'bathroom renovation calculator']
  },
  {
    id: 'home-addition',
    name: 'Home Addition',
    description: 'Adding rooms or extending existing home',
    materials: ['2x6_studs', 'concrete', 'roofing', 'siding', 'insulation', 'drywall_1_2'],
    seoKeywords: ['home addition cost', 'room addition cost calculator', 'house addition estimator']
  },
  {
    id: 'deck-construction',
    name: 'Deck Construction',
    description: 'Building outdoor decks and platforms',
    materials: ['pressure_treated_lumber', 'deck_screws', 'concrete', 'railings'],
    seoKeywords: ['deck building cost', 'deck construction cost calculator', 'deck material estimator']
  },
  {
    id: 'garage-construction',
    name: 'Garage Construction',
    description: 'Building detached or attached garages',
    materials: ['2x6_studs', 'concrete', 'roofing', 'siding', 'garage_doors'],
    seoKeywords: ['garage construction cost', 'garage building cost calculator', 'garage cost estimator']
  },
  {
    id: 'fence-installation',
    name: 'Fence Installation',
    description: 'Installing wooden, vinyl, or metal fencing',
    materials: ['fence_posts', 'fence_boards', 'concrete', 'fence_hardware'],
    seoKeywords: ['fence installation cost', 'fence cost calculator', 'fencing material estimator']
  },
  {
    id: 'roof-replacement',
    name: 'Roof Replacement',
    description: 'Complete roof replacement and repair',
    materials: ['asphalt_shingles', 'underlayment', 'roofing_nails', 'ridge_vents'],
    seoKeywords: ['roof replacement cost', 'roofing cost calculator', 'roof repair estimator']
  }
];

// Major suppliers for supplier-specific SEO
export const SUPPLIERS = [
  { id: 'home-depot', name: 'Home Depot', seoName: 'home-depot' },
  { id: 'lowes', name: 'Lowes', seoName: 'lowes' },
  { id: 'rona', name: 'Rona', seoName: 'rona' },
  { id: 'canadian-tire', name: 'Canadian Tire', seoName: 'canadian-tire' },
  { id: 'totem', name: 'Totem Building Supplies', seoName: 'totem' },
  { id: 'windsor-plywood', name: 'Windsor Plywood', seoName: 'windsor-plywood' },
  { id: 'timber-mart', name: 'Timber Mart', seoName: 'timber-mart' },
  { id: 'kent', name: 'Kent Building Supplies', seoName: 'kent' }
];

// Generate SEO page configurations
export function generateSEOPages() {
  const pages: Array<{
    type: string;
    slug: string;
    title: string;
    description: string;
    keywords: string[];
    priority: number;
  }> = [];

  // 1. Individual Material Calculator Pages
  MATERIALS.forEach(material => {
    pages.push({
      type: SEO_PAGE_TYPES.MATERIAL_CALCULATOR,
      slug: `calculators/${material.category}/${material.id.replace(/_/g, '-')}`,
      title: `${material.name} Cost Calculator - Estimate ${material.name} Prices`,
      description: `Calculate the exact cost of ${material.name} for your construction project. Get accurate pricing with waste factors and regional adjustments.`,
      keywords: [...material.keywords, `${material.name} calculator`, `${material.name} estimator`],
      priority: 0.8
    });
  });

  // 2. Category-based Cost Estimators
  Object.entries(MATERIAL_CATEGORIES).forEach(([categoryId, category]) => {
    pages.push({
      type: SEO_PAGE_TYPES.COST_ESTIMATOR,
      slug: `cost-estimators/${categoryId}`,
      title: category.seoTitle,
      description: `${category.description}. Calculate material costs, compare prices, and estimate your project budget.`,
      keywords: category.keywords,
      priority: 0.9
    });
  });

  // 3. How-to Calculate Pages (SEO Gold Mine)
  MATERIALS.forEach(material => {
    pages.push({
      type: SEO_PAGE_TYPES.HOW_TO_CALCULATE,
      slug: `how-to-calculate/${material.id.replace(/_/g, '-')}-cost`,
      title: `How to Calculate ${material.name} Cost - Step by Step Guide`,
      description: `Learn how to calculate ${material.name} costs for your project. Includes formulas, examples, and cost-saving tips.`,
      keywords: [
        `how to calculate ${material.name.toLowerCase()} cost`,
        `${material.name.toLowerCase()} calculation formula`,
        `${material.name.toLowerCase()} cost estimation guide`
      ],
      priority: 0.7
    });
  });

  // 4. Location-based Pricing Pages
  CANADIAN_LOCATIONS.provinces.forEach(province => {
    // Province-level pages
    pages.push({
      type: SEO_PAGE_TYPES.LOCATION_PRICING,
      slug: `pricing/${province.code.toLowerCase()}`,
      title: `Construction Material Prices in ${province.name} - ${new Date().getFullYear()} Cost Guide`,
      description: `Current construction material prices in ${province.name}. Compare costs across suppliers and get accurate estimates for your project.`,
      keywords: [
        `construction material prices ${province.name.toLowerCase()}`,
        `building supplies cost ${province.name.toLowerCase()}`,
        `${province.name.toLowerCase()} construction cost`
      ],
      priority: 0.6
    });

    // City-level pages for major cities
    province.major_cities.forEach(city => {
      pages.push({
        type: SEO_PAGE_TYPES.LOCATION_PRICING,
        slug: `pricing/${province.code.toLowerCase()}/${city.toLowerCase().replace(/\s+/g, '-')}`,
        title: `Construction Material Prices in ${city}, ${province.code} - Local Cost Guide`,
        description: `Local construction material prices in ${city}, ${province.name}. Find the best deals on building supplies near you.`,
        keywords: [
          `construction material prices ${city.toLowerCase()}`,
          `building supplies ${city.toLowerCase()}`,
          `${city.toLowerCase()} construction cost`
        ],
        priority: 0.5
      });
    });
  });

  // 5. Project-specific Estimators
  PROJECT_TYPES.forEach(project => {
    pages.push({
      type: SEO_PAGE_TYPES.PROJECT_ESTIMATOR,
      slug: `project-estimators/${project.id}`,
      title: `${project.name} Cost Calculator - Complete Material Estimator`,
      description: `Calculate the complete cost of your ${project.name.toLowerCase()} project. Includes all materials, labor estimates, and regional pricing.`,
      keywords: project.seoKeywords,
      priority: 0.8
    });
  });

  // 6. Supplier-specific Pages
  SUPPLIERS.forEach(supplier => {
    Object.keys(MATERIAL_CATEGORIES).forEach(categoryId => {
      const category = MATERIAL_CATEGORIES[categoryId as keyof typeof MATERIAL_CATEGORIES];
      pages.push({
        type: SEO_PAGE_TYPES.SUPPLIER_PRICING,
        slug: `suppliers/${supplier.seoName}/${categoryId}`,
        title: `${category.name} Prices at ${supplier.name} - Cost Comparison`,
        description: `Compare ${category.name.toLowerCase()} prices at ${supplier.name}. Find the best deals and calculate your project costs.`,
        keywords: [
          `${supplier.name.toLowerCase()} ${category.name.toLowerCase()} prices`,
          `${supplier.name.toLowerCase()} construction materials`,
          `${category.name.toLowerCase()} cost ${supplier.name.toLowerCase()}`
        ],
        priority: 0.4
      });
    });
  });

  // 7. Material Comparison Pages
  const materialPairs = generateMaterialComparisons();
  materialPairs.forEach(pair => {
    pages.push({
      type: SEO_PAGE_TYPES.MATERIAL_COMPARISON,
      slug: `compare/${pair.material1.replace(/_/g, '-')}-vs-${pair.material2.replace(/_/g, '-')}`,
      title: `${pair.name1} vs ${pair.name2} - Cost Comparison and Guide`,
      description: `Compare ${pair.name1} vs ${pair.name2}. See cost differences, pros and cons, and which is best for your project.`,
      keywords: [
        `${pair.name1.toLowerCase()} vs ${pair.name2.toLowerCase()}`,
        `${pair.name1.toLowerCase()} ${pair.name2.toLowerCase()} comparison`,
        `${pair.name1.toLowerCase()} or ${pair.name2.toLowerCase()}`
      ],
      priority: 0.6
    });
  });

  return pages;
}

// Generate material comparison pairs
function generateMaterialComparisons() {
  const comparisons: Array<{
    material1: string;
    material2: string;
    name1: string;
    name2: string;
  }> = [];

  // Common comparisons that people search for
  const commonComparisons = [
    { m1: '2x4_studs', m2: '2x6_studs', n1: '2x4 Studs', n2: '2x6 Studs' },
    { m1: 'drywall_1_2', m2: 'drywall_5_8', n1: '1/2" Drywall', n2: '5/8" Drywall' },
    { m1: 'interior_paint', m2: 'exterior_paint', n1: 'Interior Paint', n2: 'Exterior Paint' },
    { m1: 'fiberglass_r13', m2: 'fiberglass_r21', n1: 'R-13 Insulation', n2: 'R-21 Insulation' },
    { m1: 'concrete_mix', m2: 'concrete_bags', n1: 'Ready-Mix Concrete', n2: 'Bagged Concrete' }
  ];

  commonComparisons.forEach(comp => {
    comparisons.push({
      material1: comp.m1,
      material2: comp.m2,
      name1: comp.n1,
      name2: comp.n2
    });
  });

  return comparisons;
}

// Calculate total potential pages
export function getTotalSEOPages(): number {
  return generateSEOPages().length;
}

// Get high-priority pages for initial static generation
export function getHighPriorityPages() {
  return generateSEOPages()
    .filter(page => page.priority >= 0.7)
    .sort((a, b) => b.priority - a.priority);
}

// Generate sitemap entries
export function generateSitemapEntries() {
  return generateSEOPages().map(page => ({
    url: `/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: page.priority
  }));
}