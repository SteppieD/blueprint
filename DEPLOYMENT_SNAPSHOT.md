# Blueprint Material Analyzer - SEO Powerhouse Deployment Snapshot

**Date**: July 11, 2025
**Version**: v1.0.0-seo-powerhouse
**Git Commit**: 89cdfe4

## Project Overview
This is a comprehensive construction material calculator with SEO optimization, featuring:
- 30+ material types (lumber, concrete, drywall, paint, insulation, etc.)
- Thousands of SEO-optimized pages with ISR
- AI-powered blueprint analysis using OpenRouter API
- Canadian regional pricing
- Project-specific estimators

## Key URLs
- **Production**: https://blueprint-material-analyzer.vercel.app
- **GitHub**: https://github.com/SteppieD/blueprint
- **Git Tag**: v1.0.0-seo-powerhouse

## Environment Variables Required
```
OPENROUTER_API_KEY=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
NEXT_PUBLIC_BASE_URL=https://blueprint-material-analyzer.vercel.app
```

## Key Features Implemented

### 1. Material Database (`lib/materials.ts`)
- 10+ categories: Lumber, Concrete, Drywall, Paint, Insulation, Roofing, etc.
- 30+ specific materials with pricing and waste factors
- Canadian market pricing with regional adjustments

### 2. SEO Page Generation (`lib/seo-pages.ts`)
- Material calculators: `/calculators/[category]/[material]`
- Cost estimators: `/cost-estimators/[category]`
- Project estimators: `/project-estimators/[project]`
- Location pricing: `/pricing/[province]/[city]`
- Dynamic sitemap and robots.txt

### 3. Key Components
- `MaterialCalculator.tsx` - Individual material cost calculations
- `ProjectEstimator.tsx` - Full project cost estimation
- `DonationButton.tsx` - Ko-fi monetization
- `UsageTracker.tsx` - Freemium usage limits
- `PricingSection.tsx` - Subscription pricing

### 4. AI Integration
- OpenRouter API integration in `claudeAnalyzer.ts`
- Claude 3 Haiku model for cost-efficient analysis
- Blueprint PDF analysis with material extraction

## Tech Stack
- Next.js 15.3.5 with App Router
- TypeScript
- Tailwind CSS
- Vercel deployment
- ISR (Incremental Static Regeneration)

## How to Restore This Version

### From Git Tag:
```bash
git checkout v1.0.0-seo-powerhouse
```

### From Specific Commit:
```bash
git checkout 89cdfe4
```

### To Create New Branch from This Version:
```bash
git checkout -b restore-seo-powerhouse v1.0.0-seo-powerhouse
```

## Build and Deploy Commands
```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## Critical Files Structure
```
blueprint-material-analyzer/
├── lib/
│   ├── materials.ts          # Material database
│   └── seo-pages.ts         # SEO page generation
├── src/
│   ├── app/
│   │   ├── page.tsx         # Homepage with material showcase
│   │   ├── calculators/     # Dynamic material calculators
│   │   ├── cost-estimators/ # Category estimators
│   │   ├── project-estimators/ # Project calculators
│   │   └── api/
│   │       ├── analyze/     # AI blueprint analysis
│   │       ├── sitemap/     # Dynamic sitemap
│   │       └── robots/      # SEO robots.txt
│   ├── components/
│   │   ├── MaterialCalculator.tsx
│   │   ├── ProjectEstimator.tsx
│   │   ├── DonationButton.tsx
│   │   └── UsageTracker.tsx
│   └── lib/
│       └── claudeAnalyzer.ts # OpenRouter AI integration
├── next.config.js           # ISR and optimization config
└── package.json

```

## Notes for Future Development
1. The OpenRouter API key is included in this snapshot - consider rotating if compromised
2. ISR is set to 1-hour revalidation for optimal performance
3. Material prices are based on 2025 Canadian market averages
4. Usage tracking uses localStorage - consider database for production
5. Monetization uses Ko-fi for donations and placeholder Stripe integration

This snapshot represents a fully functional SEO powerhouse with thousands of potential pages for construction material calculations.