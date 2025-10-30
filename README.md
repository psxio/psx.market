# port444 - Web3 Talent Marketplace

<div align="center">

![port444 Logo](attached_assets/psx_logo_optimized.webp)

**The Premier Marketplace Connecting Elite Web3 Builders with Memecoin & Crypto Projects**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Built on Base](https://img.shields.io/badge/Built%20on-Base-0052FF)](https://base.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb)](https://reactjs.org/)

[**Live Demo**](https://port444.replit.app) • [**Documentation**](./docs) • [**Report Bug**](https://github.com/yourusername/port444/issues) • [**Request Feature**](https://github.com/yourusername/port444/issues)

</div>

---

## 🚀 Overview

port444 is a production-ready Web3 marketplace that connects premium builders with clients in the memecoin and broader crypto ecosystem. Built on Base blockchain, it offers:

- **Dual Token Incentives**: $CREATE and $PSX token holders enjoy reduced fees (2% vs 5%), priority support, and exclusive benefits
- **Smart Contract Escrow**: Secure USDC payments with milestone-based releases on Base
- **AI-Powered Matching**: OpenAI GPT-4o-mini driven builder discovery and recommendations
- **Cross-Platform Integration**: Seamless 2-way account sync with Based Creators
- **Invite-Only Access**: Quality-controlled builder network with peer-to-peer growth

## ✨ Key Features

### For Clients
- 🔍 **Advanced Search & Filtering** - Browse 500+ vetted builders by category, skills, price, and delivery time
- 🤖 **AI Builder Matching** - Get personalized builder recommendations based on project requirements
- 🔐 **Escrow Protection** - Smart contract-based USDC escrow ensures payment security
- ⭐ **Transparent Reviews** - 5-star rating system with verified client feedback
- 💬 **Real-Time Messaging** - WebSocket-powered chat with file attachments and read receipts

### For Builders
- 💰 **Premium Earnings** - Set your own rates, earn 20-50% more than traditional platforms
- 🛡️ **Payment Guarantee** - Smart contract escrow ensures you always get paid
- 🌍 **Global Opportunities** - Access high-quality Web3 projects worldwide
- 📊 **Professional Profiles** - Showcase portfolio, skills, and achievements
- 🎯 **Targeted Projects** - Work with funded memecoin teams and serious crypto clients

### Platform Features
- **Token Gate System**: Benefits tier based on $CREATE or $PSX holdings
- **Builder Invite System**: Each builder receives 5 invite codes for network growth
- **Chapters Integration**: Regional onboarding system for Based Creators chapters
- **Admin Dashboard**: Comprehensive tools for platform management
- **SEO Optimized**: Dynamic meta tags, OpenGraph, and Schema.org structured data
- **Mobile-First Design**: Responsive UI built with Tailwind CSS and Shadcn UI

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript** - Modern UI development
- **Vite** - Lightning-fast build tool and dev server
- **TanStack Query** - Powerful data fetching and caching
- **Tailwind CSS** + **Shadcn UI** - Beautiful, accessible components
- **Wouter** - Lightweight routing
- **RainbowKit** + **wagmi** - Web3 wallet integration
- **Framer Motion** - Smooth animations

### Backend
- **Express** + **TypeScript** - RESTful API server
- **PostgreSQL** + **Drizzle ORM** - Type-safe database operations
- **Express Session** - Secure session management
- **WebSockets (ws)** - Real-time messaging
- **OpenAI GPT-4o-mini** - AI-powered recommendations

### Blockchain
- **Base Network** - Layer 2 Ethereum scaling solution
- **Viem** + **wagmi** - Ethereum interactions
- **USDC** - Stablecoin payments
- **Smart Contracts** - Solidity escrow system with milestone releases

### Infrastructure
- **Replit** - Development and hosting platform
- **Google Cloud Storage** - File upload and object storage
- **Neon PostgreSQL** - Serverless database

## 📦 Installation

### Prerequisites
- Node.js 20+
- PostgreSQL database
- Base network RPC URL
- OpenAI API key
- Google Cloud Storage bucket (optional)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/port444.git
cd port444
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file with the following:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Session
SESSION_SECRET=your-secret-key-here

# OpenAI
OPENAI_API_KEY=sk-...

# Cross-Platform Integration
BASED_CREATORS_API_KEY=your-api-key
BASED_CREATORS_API_URL=https://basedcreators.xyz
PORT444_EXTERNAL_API_KEY=your-external-api-key

# Object Storage (optional)
DEFAULT_OBJECT_STORAGE_BUCKET_ID=your-bucket-id
PUBLIC_OBJECT_SEARCH_PATHS=public/
PRIVATE_OBJECT_DIR=.private/

# Blockchain (optional - for escrow features)
DEPLOYER_PRIVATE_KEY=0x...
BASESCAN_API_KEY=your-basescan-api-key
```

4. **Initialize database**
```bash
npm run db:push
```

5. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 🚢 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Replit Deployment
This project is optimized for Replit deployment. Simply:
1. Fork the Repl
2. Configure secrets in the Replit Secrets panel
3. Click "Run" to start the application
4. Use Replit's built-in deployment to publish

## 📖 Documentation

- [Cross-Platform Integration Guide](./CROSS_PLATFORM_INTEGRATION.md)
- [Design Guidelines](./design_guidelines.md)
- [Social Integration Guide](./SOCIAL_INTEGRATION_GUIDE.md)
- [Taxonomy & Data Model](./TAXONOMY.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SESSION_SECRET` | Secret for session encryption | Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI features | Yes |
| `BASED_CREATORS_API_KEY` | API key for Based Creators integration | No |
| `PORT444_EXTERNAL_API_KEY` | External API authentication key | No |
| `DEFAULT_OBJECT_STORAGE_BUCKET_ID` | GCS bucket ID for file uploads | No |
| `DEPLOYER_PRIVATE_KEY` | Private key for smart contract deployment | No |

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push schema changes to database

### Project Structure

```
port444/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utility functions
│   │   └── hooks/       # Custom React hooks
├── server/              # Express backend
│   ├── routes.ts        # API route handlers
│   ├── storage.ts       # Database operations
│   ├── services/        # Business logic
│   └── middleware/      # Express middleware
├── shared/              # Shared code
│   └── schema.ts        # Database schema & types
├── contracts/           # Solidity smart contracts
└── public/              # Static assets
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details on:

- Code of Conduct
- Development workflow
- Coding standards
- Pull request process

## 🔒 Security

- Smart contract escrow for payment protection
- Session-based authentication with secure cookies
- API key authentication for external integrations
- Input validation with Zod schemas
- Rate limiting on sensitive endpoints
- CSRF protection

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Built on [Base](https://base.org) - Ethereum Layer 2
- Powered by [OpenAI](https://openai.com) - AI matching and recommendations
- UI components from [Shadcn UI](https://ui.shadcn.com)
- Hosted on [Replit](https://replit.com)

## 📞 Support

- **Documentation**: Check our [docs](./docs) folder
- **Issues**: Report bugs via [GitHub Issues](https://github.com/yourusername/port444/issues)
- **Discussions**: Join our [community discussions](https://github.com/yourusername/port444/discussions)

---

<div align="center">

**Built with ❤️ for the Web3 community**

[Website](https://port444.replit.app) • [Twitter](https://twitter.com/port444) • [Discord](https://discord.gg/port444)

</div>
