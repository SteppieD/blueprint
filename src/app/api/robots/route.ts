export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://blueprint-material-analyzer.vercel.app';

  const robots = `User-agent: *
Allow: /

# SEO-optimized calculator pages
Allow: /calculators/
Allow: /cost-estimators/
Allow: /how-to-calculate/
Allow: /project-estimators/
Allow: /pricing/
Allow: /compare/
Allow: /suppliers/

# API routes
Disallow: /api/

# Admin and private areas
Disallow: /_next/
Disallow: /admin/

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800'
    },
  });
}