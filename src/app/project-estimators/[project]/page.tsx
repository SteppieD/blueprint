import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PROJECT_TYPES } from '../../../../lib/seo-pages';
import { getMaterialById } from '../../../../lib/materials';
import ProjectEstimator from '../../../components/ProjectEstimator';

interface PageProps {
  params: Promise<{
    project: string;
  }>;
}

export async function generateStaticParams() {
  return PROJECT_TYPES.map(project => ({
    project: project.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const project = PROJECT_TYPES.find(p => p.id === resolvedParams.project);
  
  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project estimator was not found.',
    };
  }

  return {
    title: `${project.name} Cost Calculator - Complete Material Estimator`,
    description: `Calculate the complete cost of your ${project.name.toLowerCase()} project. Includes all materials, labor estimates, and regional pricing.`,
    keywords: project.seoKeywords,
    openGraph: {
      title: `${project.name} Cost Calculator`,
      description: `Calculate the complete cost of your ${project.name.toLowerCase()} project.`,
      type: 'website',
    },
    alternates: {
      canonical: `/project-estimators/${resolvedParams.project}`,
    },
  };
}

export default async function ProjectEstimatorPage({ params }: PageProps) {
  const resolvedParams = await params;
  const project = PROJECT_TYPES.find(p => p.id === resolvedParams.project);
  
  if (!project) {
    notFound();
  }

  const projectMaterials = project.materials
    .map(materialId => getMaterialById(materialId))
    .filter(material => material !== undefined);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {project.name} Cost Calculator
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {project.description}. Get a comprehensive estimate for all materials needed for your project.
            </p>

            <ProjectEstimator project={project} materials={projectMaterials} />

            <div className="mt-12 bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">About {project.name}</h2>
              <p className="text-gray-700 mb-4">
                This calculator provides estimates for a typical {project.name.toLowerCase()} project. 
                Actual costs may vary based on specific requirements, local building codes, and material choices.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Included Materials</h3>
                  <ul className="space-y-1">
                    {projectMaterials.map(material => (
                      <li key={material?.id} className="text-sm text-gray-600">
                        • {material?.name}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Cost Factors</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Material quality and grade</li>
                    <li>• Regional pricing variations</li>
                    <li>• Waste and cutting allowances</li>
                    <li>• Seasonal price fluctuations</li>
                  </ul>
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