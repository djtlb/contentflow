# Vercel Deployment Setup Guide

## 🚨 Fix for Environment Variable Error

If you see the error: **"Environment Variable 'VITE_SUPABASE_URL' references Secret 'supabase_url', which does not exist"**

Follow these steps to fix it:

## Step 1: Remove Environment Variables from vercel.json

The `vercel.json` file has been updated to remove environment variable references that cause conflicts.

## Step 2: Add Environment Variables in Vercel Dashboard

### **Frontend Deployment:**

1. **Go to your Vercel project dashboard**
2. **Click "Settings" tab**
3. **Click "Environment Variables" in the sidebar**
4. **Add these variables one by one:**

```
Name: VITE_SUPABASE_URL
Value: https://your-project.supabase.co
Environment: Production, Preview, Development

Name: VITE_SUPABASE_ANON_KEY  
Value: your-supabase-anon-key-here
Environment: Production, Preview, Development

Name: VITE_STRIPE_PUBLISHABLE_KEY
Value: pk_test_your-stripe-publishable-key
Environment: Production, Preview, Development
```

### **API Deployment (Separate Project):**

Create a second Vercel project for the `/api` folder with these variables:

```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: your-supabase-service-role-key
Environment: Production, Preview, Development

Name: OPENAI_API_KEY
Value: your-openai-api-key
Environment: Production, Preview, Development

Name: STRIPE_SECRET_KEY
Value: sk_test_your-stripe-secret-key
Environment: Production, Preview, Development

Name: NODE_ENV
Value: production
Environment: Production, Preview, Development
```

## Step 3: Get Your API Keys

### **Supabase Setup:**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → API
4. Copy:
   - Project URL (for VITE_SUPABASE_URL)
   - Anon public key (for VITE_SUPABASE_ANON_KEY)
   - Service role key (for SUPABASE_SERVICE_ROLE_KEY)

### **OpenAI Setup:**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create account
3. Go to API Keys
4. Create new secret key
5. Add $20+ credit to your account

### **Stripe Setup:**
1. Go to [stripe.com](https://stripe.com)
2. Create account
3. Go to Developers → API Keys
4. Copy:
   - Publishable key (starts with pk_test_)
   - Secret key (starts with sk_test_)

## Step 4: Database Setup

1. **In Supabase SQL Editor, run these files:**
   - Copy content from `database/schema.sql`
   - Copy content from `database/promotions_schema.sql`

## Step 5: Redeploy

1. **After adding all environment variables**
2. **Go to Deployments tab in Vercel**
3. **Click "Redeploy" on the latest deployment**
4. **Or push a new commit to trigger deployment**

## Step 6: Test Your Deployment

1. **Visit your Vercel URL**
2. **Try to sign up with your admin email: sallykamari61@gmail.com**
3. **Access admin panel at: your-url.vercel.app/admin**

## 🚀 Quick Fix Commands

If you need to update and redeploy:

```bash
# Update the repository
git add .
git commit -m "Fix Vercel environment variables"
git push origin main
```

## ✅ Success Checklist

- [ ] Environment variables added to Vercel dashboard
- [ ] Supabase project created and configured
- [ ] OpenAI API key added with billing
- [ ] Stripe account set up with test keys
- [ ] Database schemas applied in Supabase
- [ ] Deployment successful without errors
- [ ] Admin login working
- [ ] Content processing functional

## 🆘 Still Having Issues?

1. **Check Vercel Function Logs** in the dashboard
2. **Verify all environment variables** are set correctly
3. **Make sure API keys are valid** and have proper permissions
4. **Check Supabase logs** for database connection issues

Your ContentFlow platform will be live and generating revenue once these steps are complete!
