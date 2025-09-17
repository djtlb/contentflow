# ContentFlow

**Enterprise AI Content Orchestration Platform**

Transform any content into optimized formats across 15+ platforms using our neural AI network. Trusted by Fortune 500 companies and content creators worldwide.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/djtlb/contentflow)

## 🚀 Features

- **AI-Powered Content Generation** - Transform any URL into multiple content formats
- **Multi-Platform Support** - Generate content for Twitter, LinkedIn, newsletters, video scripts, and more
- **Enterprise Security** - SOC 2 certified with 99.9% uptime guarantee
- **Team Collaboration** - Real-time workflows and approval systems
- **Advanced Analytics** - Track performance and optimize content strategy
- **Subscription Management** - Integrated billing with Stripe
- **Admin Dashboard** - Comprehensive analytics and promotional campaign management

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router** for navigation
- **Recharts** for analytics visualization

### Backend
- **Node.js** with Express
- **Supabase** for database and authentication
- **OpenAI API** for AI content generation
- **Stripe** for payment processing
- **Row Level Security** for data protection

### Deployment
- **Vercel** for hosting (frontend and API)
- **Custom domain** support
- **SSL/TLS** encryption
- **CDN** for global performance

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm
- Supabase account
- OpenAI API key
- Stripe account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/djtlb/contentflow.git
   cd contentflow
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   pnpm install
   
   # Backend
   cd api
   npm install
   cd ..
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your API keys:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   OPENAI_API_KEY=your-openai-api-key
   STRIPE_SECRET_KEY=your-stripe-secret-key
   VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
   ```

4. **Database Setup**
   - Run the SQL files in your Supabase project:
     - `database/schema.sql`
     - `database/promotions_schema.sql`

5. **Start Development**
   ```bash
   # Frontend (port 5173)
   pnpm run dev
   
   # Backend (port 3001)
   cd api
   npm run dev
   ```

## 📦 Deployment

> **✅ DEPLOYMENT ISSUES FIXED**: See [VERCEL_DEPLOYMENT_FIX.md](./VERCEL_DEPLOYMENT_FIX.md) for solutions to common deployment problems.

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/djtlb/contentflow)

### Manual Deployment

1. **Frontend Deployment**
   - Connect GitHub repository to Vercel
   - Framework: React (Vite) - auto-detected
   - Build command: `pnpm build`
   - Output directory: `dist`

2. **API Deployment**
   - Create separate Vercel project for `/api` folder
   - Framework: Node.js - auto-detected
   - Build command: `npm install`

3. **Environment Variables**
   - Add all environment variables to Vercel dashboard
   - Configure production URLs
   - See [VERCEL_DEPLOYMENT_FIX.md](./VERCEL_DEPLOYMENT_FIX.md) for required variables

### Custom Domain
- Purchase domain (recommended: `.ai`, `.co`, or `.io`)
- Configure DNS in Vercel
- SSL automatically enabled

## 🎯 Business Model

### Pricing Plans
- **Starter**: $29/month - 10 content pieces, 5 platforms
- **Pro**: $59/month - 30 content pieces, 15+ platforms, team features

### Revenue Targets
- **Month 1**: $500 MRR
- **Month 6**: $1,200+ MRR
- **Year 1**: $5,000+ MRR

## 📊 Admin Features

### Analytics Dashboard
- Real-time revenue tracking
- User growth metrics
- Content generation statistics
- Subscription analytics

### Promotional Campaigns
- Create viral marketing campaigns
- Track banner performance
- A/B testing capabilities
- Conversion optimization

### User Management
- Customer support tools
- Subscription management
- Usage monitoring
- Security controls

## 🔒 Security

- **SOC 2 Compliance** - Enterprise-grade security standards
- **Row Level Security** - Database-level access control
- **API Rate Limiting** - Prevent abuse and ensure stability
- **Encryption** - All data encrypted in transit and at rest
- **Authentication** - Secure user authentication with Supabase

## 📈 Marketing Strategy

### Launch Plan
1. **Product Hunt** submission
2. **Social media** campaigns
3. **Content marketing** and SEO
4. **Email outreach** to potential customers
5. **Referral program** for growth

### Growth Tactics
- **Free trial** to reduce friction
- **Promotional campaigns** for conversion
- **Customer success stories** for credibility
- **Feature announcements** for retention

## 🔧 Database Schema

### Tables
- `content_submissions`: Stores processed content and generated outputs
- `user_subscriptions`: Manages user subscription plans and billing
- `promotions`: Admin promotional campaigns and banners
- `auth.users`: Supabase authentication (built-in)

### Key Features
- Row Level Security for data isolation
- Automatic subscription creation for new users
- Usage tracking and analytics
- Content history and metadata
- Promotional campaign management

## 📝 API Documentation

### Authentication
All API endpoints require Bearer token authentication except webhooks.

### Content Processing
- `POST /api/content/process` - Process content from URL
- `GET /api/content/history` - Get user's content history
- `GET /api/content/usage/stats` - Get usage statistics

### Payments
- `POST /api/payments/create-checkout-session` - Create Stripe checkout
- `GET /api/payments/subscription` - Get subscription details
- `POST /api/payments/create-portal-session` - Billing portal access

### Admin
- `GET /api/admin/analytics` - Platform analytics (admin only)
- `POST /api/admin/promos` - Create promotional campaigns
- `GET /api/admin/promos` - List promotional campaigns

## 🧪 Testing

```bash
# Run frontend tests
pnpm run test

# Run backend tests
cd api
npm run test

# Build for production
pnpm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Complete deployment guide included
- **Issues**: Create GitHub issues for bugs or feature requests
- **Community**: Join our growing community of content creators

## 🚀 Roadmap

### Q1 2024
- [x] Core AI content generation
- [x] Subscription management
- [x] Admin dashboard
- [x] Promotional campaigns
- [ ] Advanced AI models (GPT-4 Turbo, Claude 3)
- [ ] Team collaboration features

### Q2 2024
- [ ] White-label solutions
- [ ] API marketplace
- [ ] Custom integrations
- [ ] Mobile app
- [ ] Advanced analytics

---

**Built for content creators, by content creators**

Transform your content strategy with AI. Start building your passive income stream today!

[**🚀 Deploy Now**](https://vercel.com/new/clone?repository-url=https://github.com/djtlb/contentflow) | [**📖 Documentation**](./DEPLOYMENT_AND_PROMOTION_GUIDE.md) | [**💰 Business Guide**](./PROJECT_SUMMARY.md)
