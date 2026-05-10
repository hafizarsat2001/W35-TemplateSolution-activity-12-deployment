#!/usr/bin/env node

const chalk = require('chalk');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log(chalk.blue('Quest Tracker Deployment Script'));
console.log(chalk.gray('================================================'));

async function deploy() {
  try {
    // Step 1: Check prerequisites
    console.log(chalk.yellow('\nStep 1: Checking prerequisites...'));

    if (!fs.existsSync('vercel.json')) {
      throw new Error('vercel.json not found. Run this script from the project root.');
    }

    console.log(chalk.green('vercel.json found'));

    // Check if Vercel CLI is available
    try {
      execSync('vercel --version', { stdio: 'pipe' });
      console.log(chalk.green('Vercel CLI found'));
    } catch (error) {
      console.log(chalk.red('Vercel CLI not found'));
      console.log(chalk.gray('Install it with: npm install -g vercel'));
      console.log(chalk.gray('Or deploy at https://vercel.com/new'));
      return;
    }

    // Step 2: Pre-deployment checks (TODO 3 - COMPLETE SOLUTION)
    console.log(chalk.yellow('\nStep 2: Running pre-deployment checks...test'));

    // Log git info
    try {
      const commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
      const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
      console.log(chalk.gray(`  Git commit: ${commitHash}`));
      console.log(chalk.gray(`  Branch: ${branch}`));

      // Check for uncommitted changes
      const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
      if (status) {
        console.log(chalk.yellow('  Warning: You have uncommitted changes'));
        console.log(chalk.gray('  Consider committing before deploying'));
      } else {
        console.log(chalk.green('  Working tree clean'));
      }
    } catch (error) {
      console.log(chalk.gray('  Could not check git status'));
    }

    // Log deployment metadata
    const deploymentLog = {
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      platform: 'vercel'
    };

    try {
      deploymentLog.gitCommit = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
      deploymentLog.gitBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    } catch (error) {
      // Not a git repo, skip
    }

    // Save deployment log
    const logsDir = path.join(__dirname, '../deployments');
    fs.mkdirSync(logsDir, { recursive: true });
    const logFile = path.join(logsDir, `deploy-${Date.now()}.json`);
    fs.writeFileSync(logFile, JSON.stringify(deploymentLog, null, 2));
    console.log(chalk.green('  Deployment metadata saved'));

    // Step 3: Deploy to Vercel
    console.log(chalk.yellow('\nStep 3: Deploying to Vercel...'));

    try {
      execSync('vercel --prod --yes', { stdio: 'inherit' });
      console.log(chalk.green('Deployed to Vercel successfully!'));
    } catch (error) {
      console.log(chalk.red('Deployment failed'));
      console.log(chalk.gray('Check the error above, or deploy manually at vercel.com'));

      // Update log with failure
      deploymentLog.status = 'failed';
      deploymentLog.error = error.message;
      fs.writeFileSync(logFile, JSON.stringify(deploymentLog, null, 2));
      return;
    }

    // Update log with success
    deploymentLog.status = 'success';
    fs.writeFileSync(logFile, JSON.stringify(deploymentLog, null, 2));

    // Step 4: Post-deployment verification
    console.log(chalk.yellow('\nStep 4: Verifying deployment...'));
    console.log(chalk.gray('  Check your Vercel dashboard for the live URL'));
    console.log(chalk.gray('  Run: npm run health-check https://your-app.vercel.app'));

    console.log(chalk.green('\nDeployment complete!'));
    console.log(chalk.gray('================================================'));

  } catch (error) {
    console.log(chalk.red('\nDeployment failed:'));
    console.log(chalk.red(error.message));
    process.exit(1);
  }
}

if (require.main === module) {
  deploy();
}

module.exports = { deploy };
