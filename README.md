# Replay Radar

Replay Radar is a Next.js application that tracks your Spotify listening history, analyzes your top artists and tracks, and visualizes trends over time.

## Features

- 🔐 Spotify OAuth authentication via NextAuth
- 📊 Track your top artists and tracks with customizable time ranges
- 📈 Visualize trends and changes in your music preferences
- 🎵 View recently played tracks
- 📉 Trend analysis with charts and graphs
- 🔄 Automated daily snapshots via cron jobs

## Prerequisites

Before deploying, ensure you have:

- A [Spotify Developer Account](https://developer.spotify.com/dashboard) with a registered app
- A MongoDB database (MongoDB Atlas recommended for production)
- A [Vercel account](https://vercel.com) (recommended for deployment)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Spotify OAuth
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_URL=http://localhost:3000  # For development, use your production URL in production
NEXTAUTH_SECRET=your_nextauth_secret_key  # Generate a random secret: openssl rand -base64 32
```

### Generating NEXTAUTH_SECRET

You can generate a secure secret using:

```bash
openssl rand -base64 32
```

## Local Development

1. Clone the repository:

```bash
git clone <your-repo-url>
cd replay-radar
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables (see above)

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Testing

The project uses Playwright for testing. Run tests with:

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run e2e tests only
npm run test:e2e

# Run tests with UI
npm run test:ui
```

## Building for Production

```bash
# Type check and build
npm run build:check

# Or build only
npm run build
```

## Deployment

### Deploying to Vercel

1. **Push your code to GitHub**

2. **Import your project to Vercel**:

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your GitHub repository

3. **Configure Environment Variables**:
   In Vercel project settings, add all required environment variables:

   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
   - `MONGODB_URI`
   - `NEXTAUTH_URL` - **Must be set to your production URL** (e.g., `https://your-app.vercel.app`)
     - This is used as the static callback URL for Spotify OAuth
     - Preview deployments will automatically redirect back to their original URL after authentication
   - `NEXTAUTH_SECRET`

4. **Configure Spotify OAuth Redirect URI**:

   - Go to your [Spotify App Settings](https://developer.spotify.com/dashboard)
   - Add **only one redirect URI**:
     - `https://your-production-domain.vercel.app/api/auth/callback/spotify`
   - **Important**: Spotify doesn't support wildcard URLs, so you only need this one static URL
   - The code automatically handles redirecting back to preview URLs after authentication completes

5. **Deploy**:
   - Vercel will automatically deploy on every push to your main branch
   - Or trigger a manual deployment from the dashboard

### Cron Jobs

The application includes a cron job that runs daily at midnight UTC to capture snapshots of top data. This is configured in `vercel.json` and will automatically work when deployed to Vercel.

### MongoDB Setup

For production, we recommend using [MongoDB Atlas](https://www.mongodb.com/cloud/atlas):

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist Vercel IP addresses or use `0.0.0.0/0` (for all IPs) during setup
5. Get your connection string and add it as `MONGODB_URI`

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Vercel Deployment Documentation](https://vercel.com/docs)
