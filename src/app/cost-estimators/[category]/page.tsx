import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MATERIAL_CATEGORIES, getMaterialsByCategory } from '../../../../lib/materials';
import { generateSEOPages } from '../../../../lib/seo-pages';

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  return Object.keys(MATERIAL_CATEGORIES).map(category => ({
    category,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const category = MATERIAL_CATEGORIES[resolvedParams.category as keyof typeof MATERIAL_CATEGORIES];
  
  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested material category was not found.',
    };
  }

  const seoPages = generateSEOPages();
  const seoPage = seoPages.find(page => 
    page.slug === `cost-estimators/${resolvedParams.category}`
  );

  return {
    title: seoPage?.title || category.seoTitle,
    description: seoPage?.description || category.description,
    keywords: seoPage?.keywords || category.keywords,
    openGraph: {
      title: seoPage?.title || category.seoTitle,
      description: seoPage?.description || category.description,
      type: 'website',
    },
    alternates: {
      canonical: `/cost-estimators/${resolvedParams.category}`,
    },
  };
}

export default async function CategoryEstimatorPage({ params }: PageProps) {
  const resolvedParams = await params;
  const category = MATERIAL_CATEGORIES[resolvedParams.category as keyof typeof MATERIAL_CATEGORIES];
  
  if (!category) {
    notFound();
  }

  const materials = getMaterialsByCategory(resolvedParams.category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {category.name} Cost Estimator
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {category.description}. Calculate material costs, compare prices, and estimate your project budget.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map(material => (
                <Link
                  key={material.id}
                  href={`/calculators/${resolvedParams.category}/${material.id.replace(/_/g, '-')}`}
                  className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-6 transition-colors"
                >
                  <h3 className="text-lg font-semibold mb-2">{material.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{material.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      ${material.priceRange.low.toFixed(2)} - ${material.priceRange.high.toFixed(2)} per {material.unit}
                    </span>
                    <span className="text-blue-600 font-medium">Calculate →</span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 bg-blue-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Why Use Our {category.name} Calculator?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Accurate Estimates</h3>
                  <p className="text-gray-700">
                    Our calculators include waste factors and regional pricing adjustments for the most accurate estimates.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Canadian Pricing</h3>
                  <p className="text-gray-700">
                    All prices are based on current Canadian market rates with location-specific adjustments.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Professional Quality</h3>
                  <p className="text-gray-700">
                    Used by contractors and DIY enthusiasts across Canada for reliable project planning.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Comprehensive Coverage</h3>
                  <p className="text-gray-700">
                    From basic materials to specialized products, we cover everything you need for your project.
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