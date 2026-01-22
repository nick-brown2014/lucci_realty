# Real Estate Property Search Platform - Setup Guide

This is a Next.js-based real estate search platform with user authentication, saved searches, favorites, and automated property alerts.

## Features

- Real estate listing search with map integration
- Advanced filtering (price, beds, baths, property type)
- Save favorite listings
- Email alerts for new listings matching saved searches
- User authentication and profile management
- Responsive design

## Prerequisites

- Node.js 20.x or higher
- npm, yarn, pnpm, or bun
- A PostgreSQL database
- Accounts for the following services:
  - Bridge Data Output (MLS data provider)
  - Google Maps Platform
  - Resend (email service)
  - Vercel (for deployment and cron jobs)

## Step-by-Step Setup

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd realty_boilerplate
npm install
```

### 2. Database Setup (PostgreSQL)

**Option A: Vercel Postgres (Recommended)**

1. Create a Vercel account if you don't have one
2. Create a new Postgres database in your Vercel dashboard
3. Copy the `DATABASE_URL` and `POSTGRES_URL_NON_POOLING` connection strings

**Option B: Self-hosted PostgreSQL**

1. Set up a PostgreSQL database (locally or on a cloud provider)
2. Create connection strings in the format:
   - `DATABASE_URL`: `postgresql://user:password@host:port/database?pgbouncer=true`
   - `POSTGRES_URL_NON_POOLING`: `postgresql://user:password@host:port/database`

### 3. Bridge Data Output API Setup

1. Sign up for a Bridge Data Output account at https://bridgedataoutput.com
2. Subscribe to an MLS data feed (ensure you have access to the `iresds` endpoint)
3. Generate an API access token from your dashboard
4. Save this token for the `NEXT_PUBLIC_BROWSER_TOKEN` environment variable

### 4. Google Maps Platform Setup

1. Go to https://console.cloud.google.com
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API (optional, for better place search)
4. Create an API key under "Credentials"
5. Restrict the API key:
   - Application restrictions: HTTP referrers (add your domain)
   - API restrictions: Select only the APIs listed above
6. Save this API key for `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

### 5. Resend Email Service Setup

1. Sign up at https://resend.com
2. Verify your domain:
   - Go to "Domains" in the Resend dashboard
   - Add your domain (e.g., `yourdomain.com`)
   - Add the required DNS records (SPF, DKIM, DMARC)
   - Wait for verification (usually a few minutes)
3. Create an API key from the dashboard
4. Set up your sender email address:
   - Use format: `Company Name <noreply@alerts.yourdomain.com>`
   - Ensure the domain is verified

### 6. Environment Variables Configuration

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database (Vercel Postgres or your own PostgreSQL)
DATABASE_URL="postgresql://user:password@host:port/database?pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgresql://user:password@host:port/database"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"  # Change to your production URL when deploying
NEXTAUTH_SECRET="<generate-a-random-secret>"  # Generate with: openssl rand -base64 32

# Bridge Data Output API
NEXT_PUBLIC_BROWSER_TOKEN="your-bridge-api-token"

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# Resend Email Service
RESEND_API_KEY="re_your_resend_api_key"
RESEND_FROM_EMAIL="Your Company <noreply@alerts.yourdomain.com>"

# Cron Job Security
CRON_SECRET="<generate-another-random-secret>"  # Generate with: openssl rand -base64 32

# Node Environment
NODE_ENV="development"
```

**To generate secure secrets:**
```bash
openssl rand -base64 32
```

### 7. Database Migration

Run Prisma migrations to set up the database schema:

```bash
npx prisma migrate deploy
npx prisma generate
```

### 8. Customize Branding

Update the following files with your company information:

1. **src/app/layout.tsx** (Lines 7-8, 10):
   - Change "Your App Name" to your company name
   - Update description and OpenGraph metadata

2. **src/app/api/send-property-alerts/route.ts** (Line 129):
   - Change `TODO: NAME` to your company name

3. **src/app/api/auth/forgot-password/route.ts** (Lines 61, 76, 106-107):
   - Update email subject and branding text
   - Add your company title and tagline

### 9. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

### 10. Create Initial Admin User (Optional)

You can create an admin user directly in the database or through the signup flow, then update the `isAdmin` field:

```sql
UPDATE "User" SET "isAdmin" = true WHERE email = 'your-admin@email.com';
```

### 11. Deployment Setup (Vercel)

1. Push your code to GitHub, GitLab, or Bitbucket
2. Import your project in Vercel
3. Add all environment variables from `.env.local` in the Vercel dashboard
4. Update `NEXTAUTH_URL` to your production URL (e.g., `https://yourdomain.com`)
5. Deploy the application

### 12. Configure Cron Job for Property Alerts

In your Vercel dashboard:

1. Go to your project settings
2. Navigate to "Cron Jobs"
3. Add a new cron job:
   - **Schedule**: `0 9 * * *` (runs daily at 9 AM UTC)
   - **URL**: `/api/send-property-alerts`
   - **Method**: GET
   - **Headers**: Add `Authorization: Bearer <your-CRON_SECRET>`

Or create a `vercel.json` file in your root directory:

```json
{
  "crons": [
    {
      "path": "/api/send-property-alerts",
      "schedule": "0 9 * * *"
    }
  ]
}
```

## Testing the Setup

### Test API Connection
```bash
node check-listings.js
```

This script will verify your Bridge API connection and show sample listings.

### Test Email Alerts
Visit: `https://yourdomain.com/api/send-property-alerts?secret=<your-CRON_SECRET>&test=true`

This will send a test email to users with `emailOptIn` enabled.

## Project Structure

- `/src/app` - Next.js app directory (pages, API routes, components)
- `/prisma` - Database schema and migrations
- `/emails` - Email templates (React Email)
- `/src/lib` - Shared utilities (Prisma client, auth configuration)
- `/src/contexts` - React context providers

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Environment-Specific Notes

**Development:**
- Use `http://localhost:3000` for `NEXTAUTH_URL`
- Cookies will not use the `__Secure-` prefix

**Production:**
- Use your actual domain for `NEXTAUTH_URL` (e.g., `https://yourdomain.com`)
- Ensure all API keys are production-ready
- Enable secure cookies automatically

## Troubleshooting

**Database connection issues:**
- Verify your database URL is correct
- Check that the database is accessible from your network
- For Vercel Postgres, ensure you're using the pooled connection for `DATABASE_URL`

**Email not sending:**
- Verify your domain is properly verified in Resend
- Check that DNS records are correctly configured
- Ensure `RESEND_FROM_EMAIL` uses a verified domain

**Map not loading:**
- Verify Google Maps API key is valid
- Check that required APIs are enabled in Google Cloud Console
- Review browser console for specific error messages

**Property alerts not running:**
- Verify cron job is configured in Vercel
- Check that `CRON_SECRET` matches between environment variables and cron configuration
- Review function logs in Vercel dashboard

## Security Notes

- Never commit `.env.local` to version control
- Rotate secrets regularly
- Use environment-specific API keys
- Enable API key restrictions on Google Maps
- Restrict database access to known IP addresses when possible

## Support

For issues related to external services:
- Bridge Data Output: https://bridgedataoutput.com/support
- Google Maps Platform: https://console.cloud.google.com/support
- Resend: https://resend.com/docs

---

## Notes

This boilerplate application is designed for real estate professionals who need a complete property search platform with automated daily alerts. The app integrates with Bridge Data Output for MLS listing data, uses Google Maps for location-based search, and sends email notifications via Resend when new properties match users' saved searches.

Key architectural decisions:
- Uses Prisma ORM with PostgreSQL for reliable data persistence
- NextAuth for authentication with credentials provider
- Server-side rendering with Next.js 15
- Google Maps integration for interactive property search
- Automated email alerts via Vercel Cron jobs

The application is production-ready once all environment variables are configured and branding is customized. The database schema supports user management, favorites, saved searches, and session handling out of the box.
