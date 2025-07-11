import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMaterialById, MATERIALS } from '../../../../../lib/materials';
import { generateSEOPages } from '../../../../../lib/seo-pages';
import MaterialCalculator from '../../../../components/MaterialCalculator';

interface PageProps {
  params: Promise<{
    category: string;
    material: string;
  }>;
}

export async function generateStaticParams() {
  return MATERIALS.map(material => ({
    category: material.category,
    material: material.id.replace(/_/g, '-'),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const materialId = resolvedParams.material.replace(/-/g, '_');
  const material = getMaterialById(materialId);
  
  if (!material) {
    return {
      title: 'Material Not Found',
      description: 'The requested material calculator was not found.',
    };
  }

  const seoPages = generateSEOPages();
  const seoPage = seoPages.find(page => 
    page.slug === `calculators/${resolvedParams.category}/${resolvedParams.material}`
  );

  return {
    title: seoPage?.title || `${material.name} Cost Calculator`,
    description: seoPage?.description || `Calculate the cost of ${material.name} for your construction project.`,
    keywords: seoPage?.keywords || material.keywords,
    openGraph: {
      title: seoPage?.title || `${material.name} Cost Calculator`,
      description: seoPage?.description || `Calculate the cost of ${material.name} for your construction project.`,
      type: 'website',
    },
    alternates: {
      canonical: `/calculators/${resolvedParams.category}/${resolvedParams.material}`,
    },
  };
}

export default async function MaterialCalculatorPage({ params }: PageProps) {
  const resolvedParams = await params;
  const materialId = resolvedParams.material.replace(/-/g, '_');
  const material = getMaterialById(materialId);

  if (!material || material.category !== resolvedParams.category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {material.name} Cost Calculator
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {material.description}
            </p>
            
            <MaterialCalculator material={material} />
            
            <div className="mt-12 grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Applications</h2>
                <ul className="space-y-2">
                  {material.applications.map((app, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {app}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Estimation Notes</h2>
                <p className="text-gray-700">{material.estimationNotes}</p>
                
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Price Range</h3>
                  <p className="text-sm text-gray-600">
                    ${material.priceRange.low.toFixed(2)} - ${material.priceRange.high.toFixed(2)} per {material.unit}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const revalidate = 3600; // Revalidate every hour