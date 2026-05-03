# Activity 12: Deployment and Going Live

Complete deployment configuration for deploying the Quest Tracker app to production using Vercel.

## Quick Start

1. Run `npm start` to view the deployment guide locally
2. Follow the step-by-step instructions to deploy
3. Your app will be live at `https://your-app.vercel.app`

## Project Structure

```
activity-12-deployment/
├── api/
│   └── index.js              # Vercel serverless entry point
├── frontend/
│   ├── server.js             # Express app (deployment guide)
│   └── .env.example          # Environment variable template
├── backend/
│   └── .env.example          # Backend env template
├── scripts/
│   ├── deploy-frontend.js    # CLI deployment with logging
│   ├── deploy-backend.js     # Pre-deployment checker
│   ├── health-check.js       # Post-deployment testing
│   ├── deploy-orchestrator.js# Advanced: full deployment pipeline
│   └── monitoring-dashboard.js# Advanced: production monitoring
├── config/
│   ├── deploy-production.json# Production config
│   └── deploy-staging.json   # Staging config
├── vercel.json               # Vercel configuration
├── package.json              # Scripts and dependencies
└── README.md                 # This file
```

## How It Works

Vercel handles everything in one platform:

1. **Your Express app** (`frontend/server.js`) serves the deployment guide
2. **`api/index.js`** exports the Express app as a Vercel serverless function
3. **`vercel.json`** routes all traffic to the serverless function
4. **Push to GitHub** → Vercel automatically builds and deploys

No separate frontend/backend deployment needed.

## Deployment Steps

### Option A: Vercel Dashboard (Easiest)
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Click Deploy
4. Done — live in ~30 seconds

### Option B: Vercel CLI
```bash
npm install -g vercel
npm run deploy
```

### Option C: Deployment Script
```bash
node scripts/deploy-frontend.js
```

## Available Scripts

```bash
npm start              # View deployment guide locally
npm run deploy         # Deploy to production (Vercel CLI)
npm run deploy:preview # Preview deploy (staging)
npm run health-check   # Run health checks
npm run monitor        # Start monitoring dashboard
```

## Configuration

### `vercel.json`
```json
{
  "version": 2,
  "rewrites": [
    { "source": "/(.*)", "destination": "/api" }
  ]
}
```

This tells Vercel to route all requests to the Express serverless function.

### Environment Variables
Set in Vercel dashboard (Settings > Environment Variables):
- `NODE_ENV` = `production`
- Add any API keys your app needs

## Testing

```bash
# Health check against deployed app
npm run health-check https://your-app.vercel.app
```

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Express.js on Vercel](https://vercel.com/guides/using-express-with-vercel)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
