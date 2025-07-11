# Blueprint Material Analyzer

A web application that analyzes construction blueprints (PDF files) and automatically calculates material quantities and cost estimates for lumber and plywood.

## Features

- **PDF Upload**: Drag-and-drop or click to upload construction blueprint PDFs
- **Material Selection**: Choose which materials to calculate (2x4s, 2x6s, plywood, OSB, etc.)
- **Automatic Extraction**: Extracts square footage and floor information from blueprints
- **Cost Estimation**: Provides current market prices and total cost calculations
- **Export Results**: Download results as CSV for further analysis

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **PDF Processing**: pdf-parse
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/blueprint-material-analyzer.git
cd blueprint-material-analyzer
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How It Works

1. **Upload Blueprint**: Upload a PDF file containing construction documents
2. **Select Materials**: Choose which materials you want to calculate
3. **Analysis**: The system extracts square footage and calculates material quantities
4. **Results**: View detailed breakdown with quantities and estimated costs

## Material Calculations

The system calculates materials based on standard construction practices:

- **2x6 Studs**: Exterior walls at 24" on center
- **2x4 Studs**: Interior walls at 16" on center  
- **Plywood**: Wall sheathing based on exterior wall area
- **OSB**: Roof sheathing based on roof area

All calculations include a 10% waste factor.

## Pricing

Prices are based on current Canadian lumber market rates (July 2025) and include:
- Base material cost
- 12% tax (GST + PST for BC)

## Future Enhancements

- [ ] User authentication and saved projects
- [ ] Integration with lumber supplier APIs for real-time pricing
- [ ] Support for more file formats (DWG, DXF)
- [ ] Advanced material options (insulation, drywall, etc.)
- [ ] Historical price tracking
- [ ] Mobile app version

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)