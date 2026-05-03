// Simple development server for the deployment template
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Main deployment interface
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quest Tracker - Deploy to Vercel</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #000 0%, #111 100%);
            color: #333;
            min-height: 100vh;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            margin-bottom: 20px;
        }
        h1 { color: #000; text-align: center; font-size: 2.5em; }
        .step {
            background: #f8f9fa;
            border-left: 4px solid #000;
            padding: 20px;
            margin: 20px 0;
            border-radius: 6px;
        }
        .code {
            background: #1a1a1a;
            color: #e0e0e0;
            padding: 15px;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            overflow-x: auto;
            margin: 10px 0;
        }
        .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 10px 0;
            border-radius: 6px;
        }
        .success {
            background: #d4edda;
            border-left: 4px solid #28a745;
            padding: 15px;
            margin: 10px 0;
            border-radius: 6px;
        }
        ul { line-height: 1.8; }
        a { color: #0070f3; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .badge {
            display: inline-block;
            background: #000;
            color: white;
            padding: 3px 10px;
            border-radius: 4px;
            font-size: 0.85em;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>&#9650; Deploy Quest Tracker to Vercel</h1>
        <p style="text-align: center; color: #666; font-size: 1.1em;">
            Go from code to live website in 3 steps
        </p>

        <div class="step">
            <h2>What You Need</h2>
            <ul>
                <li><strong>GitHub Account</strong> - To store your code (<a href="https://github.com" target="_blank">github.com</a>)</li>
                <li><strong>Vercel Account</strong> - To deploy your app (<a href="https://vercel.com" target="_blank">vercel.com</a>, free tier)</li>
                <li><strong>Node.js 18+</strong> - Installed on your computer</li>
            </ul>
            <p><span class="badge">TIP</span> Sign up for Vercel using your GitHub account - it connects automatically.</p>
        </div>

        <div class="step">
            <h2>Step 1: Push Your Code to GitHub</h2>
            <p>If your code is not on GitHub yet, create a new repository and push it:</p>
            <div class="code">
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/quest-tracker.git
git push -u origin main
            </div>
        </div>

        <div class="step">
            <h2>Step 2: Import Project on Vercel</h2>
            <ol>
                <li>Go to <a href="https://vercel.com/new" target="_blank">vercel.com/new</a></li>
                <li>Click <strong>"Import Git Repository"</strong></li>
                <li>Select your <code>quest-tracker</code> repository</li>
                <li>Click <strong>"Deploy"</strong></li>
                <li>Wait about 30 seconds - Vercel builds and deploys automatically!</li>
            </ol>

            <div class="warning">
                <strong>Environment Variables (if needed):</strong>
                <p>Go to your project on Vercel &rarr; Settings &rarr; Environment Variables, then add:</p>
                <ul>
                    <li><code>NODE_ENV</code> = <code>production</code></li>
                </ul>
            </div>
        </div>

        <div class="step">
            <h2>Step 3: Your App is Live!</h2>
            <div class="success">
                <strong>That's it!</strong> Vercel gives you a URL like:
                <br><br>
                <code>https://quest-tracker-abc123.vercel.app</code>
                <br><br>
                Open it in your browser to see your live app.
            </div>
            <p><strong>Bonus:</strong> Every time you push new code to GitHub, Vercel automatically redeploys. No extra steps needed.</p>
        </div>

        <div class="step">
            <h2>Test Your Deployment</h2>
            <p>Check that everything works:</p>
            <ul>
                <li>Open your Vercel URL in a browser</li>
                <li>Check the browser console for errors (F12 &rarr; Console)</li>
                <li>Try all the features of your app</li>
            </ul>
            <div class="code">
# Run the health check script
npm run health-check https://your-app.vercel.app
            </div>
        </div>

        <div class="step">
            <h2>Next Steps</h2>
            <ul>
                <li><strong>Custom Domain:</strong> Add your own domain in Vercel &rarr; Settings &rarr; Domains</li>
                <li><strong>HTTPS:</strong> Vercel provides free SSL automatically</li>
                <li><strong>Preview Deploys:</strong> Every pull request gets its own preview URL</li>
                <li><strong>Analytics:</strong> Enable Vercel Analytics in your dashboard</li>
            </ul>
        </div>

        <div class="step">
            <h2>Troubleshooting</h2>
            <ul>
                <li><strong>Build fails?</strong> Check the build logs in your Vercel dashboard</li>
                <li><strong>Page not loading?</strong> Make sure <code>vercel.json</code> exists in your project root</li>
                <li><strong>Environment variables?</strong> Add them in Vercel dashboard, then redeploy</li>
                <li><strong>Need help?</strong> Check <a href="https://vercel.com/docs" target="_blank">Vercel Docs</a></li>
            </ul>
        </div>
    </div>
</body>
</html>
  `);
});

// Only listen when run directly (not when imported by Vercel serverless)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Deployment guide server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} to view the deployment guide`);
  });
}

module.exports = app;
