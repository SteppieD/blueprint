/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  
  // ISR Configuration for SEO powerhouse
  experimental: {
    staleTimes: {
      dynamic: 300, // 5 minutes for dynamic pages
      static: 3600, // 1 hour for static pages
    },
  },


  // Image optimization for performance
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year cache
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Headers for SEO and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=600'
          }
        ],
      },
      {
        source: '/(calculators|cost-estimators|how-to-calculate)/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400'
          }
        ],
      }
    ]
  },

  // SEO redirects for better ranking
  async redirects() {
    return [
      {
        source: '/blueprint/:slug*',
        destination: '/calculators/lumber/:slug*',
        permanent: true,
      },
      {
        source: '/calculate/:material',
        destination: '/calculators/:material',
        permanent: true,
      },
      {
        source: '/pricing',
        destination: '/cost-estimators',
        permanent: true,
      },
    ]
  },

  // Clean URLs for SEO
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
    ]
  },

  trailingSlash: true,
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer && config.optimization?.splitChunks?.cacheGroups?.commons) {
      config.optimization.splitChunks.cacheGroups.commons.minChunks = 2;
    }
    return config;
  },
}

module.exports = nextConfig