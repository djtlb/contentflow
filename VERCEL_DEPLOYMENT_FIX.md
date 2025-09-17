# Vercel Deployment Fix Guide

## Common Issues Fixed

### 1. CSS Build Errors ✅ FIXED
- **Issue**: `@import must precede all other statements`
- **Solution**: Moved `@import` statements to the top of `src/styles/viral-brand.css`

### 2. CORS Issues ✅ FIXED
- **Issue**: API not accessible from deployed frontend
- **Solution**: Updated CORS configuration to dynamically allow Vercel domains

### 3. Environment Variables ✅ IMPROVED
- **Issue**: Missing or placeholder environment variables
- **Solution**: Added validation and better error messages

### 4. Vercel Configuration ✅ IMPROVED
- **Issue**: Inconsistent build settings
- **Solution**: Updated vercel.json files with proper framework settings

## Required Environment Variables

### Frontend (vercel.com dashboard)
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_... (or pk_test_...)
```

### API (separate vercel project)
```
OPENAI_API_KEY=sk-...
VITE_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
STRIPE_SECRET_KEY=sk_live_... (or sk_test_...)
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CREATOR_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
FRONTEND_URL=https://your-frontend-domain.vercel.app
NODE_ENV=production
```

## Deployment Steps

### 1. Frontend Deployment
1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Framework will auto-detect as "Vite"
4. Build command: `pnpm build` (auto-detected)
5. Output directory: `dist` (auto-detected)
6. Add environment variables in Vercel dashboard
7. Deploy

### 2. API Deployment
1. Create new Vercel project
2. Connect to same GitHub repo
3. Set root directory to `api`
4. Framework will auto-detect as "Node.js"
5. Add ALL API environment variables
6. Deploy

### 3. Connect Frontend to API
1. Update `FRONTEND_URL` in API environment variables to your frontend URL
2. Redeploy API
3. Test connection

## Verification Steps

1. **Frontend Build**: No CSS warnings during build
2. **API Health**: `https://your-api-domain.vercel.app/api/health` returns JSON
3. **CORS**: Frontend can make requests to API
4. **Environment**: No missing environment variable errors

## Troubleshooting

### Build Fails with CSS Errors
- ✅ Fixed: CSS imports now at top of file

### API Returns CORS Errors
- ✅ Fixed: Dynamic CORS configuration

### "Environment variable not defined" errors
- Check Vercel dashboard environment variables
- Ensure no placeholder values like "your-key-here"
- Redeploy after adding variables

### Functions timeout
- ✅ Added: 30-second timeout for API functions
- Consider upgrading Vercel plan for longer timeouts

## Success Indicators

- ✅ Frontend builds without warnings
- ✅ API deploys and health endpoint responds
- ✅ No CORS errors in browser console
- ✅ Environment variables properly configured