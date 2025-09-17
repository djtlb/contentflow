# ContentFlow - AI Content Repurposing Tool

ContentFlow is a powerful AI-driven SaaS application that transforms long-form content into multiple social media formats. Built with React, Node.js, Supabase, and OpenAI, it helps content creators save hours of work by automatically generating Twitter threads, LinkedIn posts, email newsletters, and video scripts from blog posts, videos, and podcasts.

## 🚀 Features

- **AI-Powered Content Repurposing**: Transform any URL into multiple content formats
- **Multi-Platform Support**: Generate content for Twitter, LinkedIn, newsletters, and video scripts
- **Subscription Management**: Integrated Stripe billing with Creator ($29/month) and Pro ($59/month) plans
- **Usage Tracking**: Monitor monthly content processing limits
- **Content History**: Browse and manage all previously processed content
- **Professional UI**: Modern, responsive design built with shadcn/ui components

## 💰 Business Model

- **Creator Plan**: $29/month - 10 content pieces, Twitter & LinkedIn generation
- **Pro Plan**: $59/month - 30 content pieces, all platforms, priority support
- **Target**: $1,200 MRR within 6 months (21 Pro subscribers)

## 🛠 Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router** for navigation
- **Supabase** for authentication
- **Stripe** for payments

### Backend
- **Node.js** with Express
- **OpenAI GPT-4** for content generation
- **Supabase** for database and auth
- **Stripe** for subscription management
- **Cheerio** for web scraping

### Database
- **Supabase (PostgreSQL)** with Row Level Security
- User management and subscriptions
- Content processing history
- Usage analytics

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm
- Supabase account and project
- OpenAI API key
- Stripe account for payments

## 🔧 Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd content-repurposer

# Install frontend dependencies
pnpm install

# Install backend dependencies
cd api
npm install
cd ..
```

### 2. Environment Configuration

Create `.env.local` in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CREATOR_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...

# API Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### 3. Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `database/schema.sql` in the Supabase SQL editor
3. Configure Row Level Security policies
4. Enable email authentication

### 4. Stripe Setup

1. Create Stripe products and prices for Creator and Pro plans
2. Set up webhook endpoint for subscription events
3. Configure webhook secret in environment variables

### 5. Development

```bash
# Start the frontend (Terminal 1)
pnpm run dev

# Start the backend API (Terminal 2)
cd api
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 🚀 Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend API (Vercel Functions)

1. Deploy the `api` directory as a separate Vercel project
2. Configure environment variables
3. Update CORS settings for production domain

### Database (Supabase)

1. Supabase handles hosting automatically
2. Configure production environment variables
3. Set up database backups and monitoring

## 📊 Database Schema

### Tables

- `content_submissions`: Stores processed content and generated outputs
- `user_subscriptions`: Manages user subscription plans and billing
- `auth.users`: Supabase authentication (built-in)

### Key Features

- Row Level Security for data isolation
- Automatic subscription creation for new users
- Usage tracking and analytics
- Content history and metadata

## 🔐 Security Features

- JWT-based authentication with Supabase
- Row Level Security on all database tables
- API rate limiting and usage quotas
- Secure webhook signature verification
- Environment variable protection

## 📈 Analytics & Monitoring

- User subscription tracking
- Content processing analytics
- Usage limit enforcement
- Error logging and monitoring
- Performance metrics

## 🧪 Testing

```bash
# Run frontend tests
npm run test

# Run backend tests
cd api
npm run test

# Build for production
npm run build
```

## 📝 API Documentation

### Authentication
All API endpoints require Bearer token authentication except webhooks.

### Endpoints

- `POST /api/content/process` - Process content from URL
- `GET /api/content/history` - Get user's content history
- `GET /api/content/usage/stats` - Get usage statistics
- `POST /api/payments/create-checkout-session` - Create Stripe checkout
- `GET /api/payments/subscription` - Get subscription details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Contact support at support@contentflow.com

## 🎯 Roadmap

- [ ] Bulk content processing
- [ ] Custom tone adjustment
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard
- [ ] Mobile app
- [ ] API access for developers

---

Built with ❤️ by the ContentFlow team
