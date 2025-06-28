# Vercel Deployment Guide for Artist Array

## 🚀 Quick Deployment Steps

### 1. Environment Variables Setup

In your Vercel dashboard, add these environment variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Cloudflare R2 Configuration (for image uploads)
R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=your_r2_bucket_name
```

### 2. Deploy from GitHub

1. Connect your GitHub repository to Vercel
2. Vercel will auto-detect Next.js and deploy
3. Make sure all environment variables are set before deployment

## 🔧 Troubleshooting Common Issues

### Issue: "Application error: a server-side exception has occurred"

**Solution 1: Check Environment Variables**
Visit: `https://your-domain.vercel.app/api/health`
This endpoint will show you:

- Which environment variables are missing
- Database connection status
- Overall system health

**Solution 2: Verify Supabase Connection**
Ensure your Supabase project:

- Has RLS policies enabled
- Database tables are created correctly
- NEXT_PUBLIC_SUPABASE_URL points to the correct project

**Solution 3: Check Database Schema**
Run the SQL commands from `schema.sql` and `database-policies.sql` in your Supabase SQL editor.

### Issue: Images not uploading

**Check:**

1. R2 bucket exists and is configured
2. R2 API tokens have correct permissions
3. CORS is configured on your R2 bucket

### Issue: Authentication not working

**Check:**

1. Supabase Auth is enabled
2. Site URL is set correctly in Supabase (your Vercel domain)
3. Redirect URLs include your Vercel domain

## 📊 Health Check Endpoint

Access `/api/health` to verify:

- ✅ Environment variables
- ✅ Database connectivity
- ✅ System status

Example response:

```json
{
  "status": "healthy",
  "envVars": {
    "NEXT_PUBLIC_SUPABASE_URL": true,
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": true,
    "R2_ACCOUNT_ID": true
  },
  "database": "Connected (5 prompts)"
}
```

## 🔄 Redeployment Steps

If you're getting errors after deployment:

1. **Check Environment Variables**: Ensure all required vars are set in Vercel dashboard
2. **Redeploy**: Go to Vercel dashboard → Deployments → Redeploy latest
3. **Clear Cache**: Sometimes Vercel needs cache clearing for environment changes
4. **Check Logs**: View function logs in Vercel dashboard for specific errors

## 🛠️ Local Development vs Production

**Local Development:**

- Uses `http://localhost:3000` for API calls
- Development Supabase project (optional)

**Production (Vercel):**

- Uses direct database queries (no HTTP self-calls)
- Production Supabase project
- Must have all environment variables set

## 📝 Post-Deployment Checklist

- [ ] Homepage loads without errors
- [ ] User registration works
- [ ] User login works
- [ ] Image upload works (requires R2 setup)
- [ ] Like/comment functionality works
- [ ] Prompt deletion works (for owners)
- [ ] Model dropdown shows options

## 🆘 Still Having Issues?

1. Check the health endpoint: `/api/health`
2. Review Vercel function logs
3. Verify all environment variables are correctly set
4. Ensure Supabase RLS policies are active
5. Check if your database has the correct schema
