# FinSight AI

A comprehensive financial risk analysis and fraud detection platform powered by AI. FinSight provides real-time monitoring, intelligent alerts, and detailed reporting for financial institutions and risk management teams.

## 🚀 Features

### AI-Powered Analysis
- **Intelligent Copilot**: Natural language queries for financial analysis
- **Risk Scoring**: Multi-factor risk assessment using Altman Z-Score, Ohlson O-Score, and proprietary models
- **Fraud Detection**: Advanced fraud signal screening with Beneish M-Score and custom indicators
- **Peer Benchmarking**: Industry comparison and competitive analysis

### Comprehensive Monitoring
- **Real-time Alerts**: Configurable risk threshold alerts and notifications
- **Trend Analysis**: Historical risk score trends and predictive insights
- **Company Profiles**: Detailed financial health analysis with key metrics
- **Sector Analysis**: Cross-industry risk distribution and benchmarking

### Advanced Reporting
- **Risk Summary Reports**: Portfolio-wide risk assessment
- **Fraud Analysis Reports**: Detailed fraud signal investigation
- **Benchmark Reports**: Peer comparison and industry analysis
- **Trend Analysis Reports**: Historical performance and projections

### Data Management
- **File Upload**: Support for CSV, Excel, PDF, and text file uploads
- **Data Processing**: Automated data extraction and normalization
- **API Integration**: RESTful APIs for programmatic access
- **Export Capabilities**: Multiple export formats (JSON, PDF, Excel)

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI Components**: Radix UI, Tailwind CSS, Lucide Icons
- **Charts**: Recharts
- **State Management**: Zustand
- **Styling**: Tailwind CSS with CSS Variables
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── analyze/             # Company analysis endpoint
│   │   ├── copilot/             # AI copilot chat endpoint
│   │   ├── reports/             # Report generation endpoint
│   │   └── upload/              # File upload endpoint
│   ├── dashboard/               # Dashboard pages
│   │   ├── alerts/              # Alerts management
│   │   ├── companies/           # Company listings
│   │   ├── copilot/             # AI copilot interface
│   │   ├── reports/             # Reports dashboard
│   │   ├── settings/            # User settings
│   │   └── upload/              # File upload interface
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
├── components/                  # Reusable components
│   ├── ui/                      # UI components (shadcn/ui)
│   ├── charts/                  # Chart components
│   └── dashboard/               # Dashboard-specific components
├── hooks/                       # Custom React hooks
├── lib/                         # Utility libraries
│   ├── mock/                    # Mock data
│   └── utils/                   # Helper functions
├── types/                       # TypeScript type definitions
└── public/                      # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/finsight-ai.git
cd finsight-ai
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📊 API Endpoints

### Copilot Chat
```http
POST /api/copilot
Content-Type: application/json

{
  "message": "Analyze risk for Apple Inc",
  "companyId": "AAPL",
  "sessionId": "session_123"
}
```

### Company Analysis
```http
POST /api/analyze
Content-Type: application/json

{
  "companyId": "AAPL",
  "analysisType": "comprehensive"
}
```

### Generate Reports
```http
POST /api/reports
Content-Type: application/json

{
  "type": "risk-summary",
  "companyIds": ["AAPL", "MSFT"],
  "format": "pdf"
}
```

### File Upload
```http
POST /api/upload
Content-Type: multipart/form-data

files: [File]
```

## 🎨 UI Components

The project uses shadcn/ui components with a custom design system:

- **Color Scheme**: Neutral base with emerald/amber/red accents for risk levels
- **Typography**: Geist font family
- **Spacing**: Consistent 4px grid system
- **Components**: Fully accessible with keyboard navigation

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://..."

# API Keys
OPENAI_API_KEY="sk-..."
FINANCIAL_DATA_API_KEY="..."

# Authentication
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### Tailwind Configuration

The design system is configured in `tailwind.config.js` with custom colors and spacing.

## 🧪 Testing

```bash
# Run tests
npm run test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📈 Performance

- **Lighthouse Score**: 95+ on all metrics
- **Core Web Vitals**: All green
- **Bundle Size**: < 200KB gzipped
- **First Contentful Paint**: < 1.5s

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Recharts](https://recharts.org/) - Chart library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

## 📞 Support

For support, email support@finsight.ai or join our [Discord community](https://discord.gg/finsight).

---

**FinSight AI** - Transforming financial risk management with artificial intelligence.
