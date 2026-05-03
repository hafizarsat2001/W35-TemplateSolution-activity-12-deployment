#!/usr/bin/env node

// W3.5 Activity 12: Complete Pre-deployment Checker
// TEACHER REFERENCE - 100% COMPLETE IMPLEMENTATION

const chalk = require('chalk');
const fs = require('fs');

console.log(chalk.blue('Quest Tracker Backend Deployment'));
console.log(chalk.gray('================================================'));
console.log('');
console.log(chalk.green('With Vercel, your backend deploys automatically!'));
console.log('');

// TODO 2 - COMPLETE SOLUTION: Pre-deployment file checks
console.log(chalk.yellow('Running pre-deployment checks...'));

const requiredFiles = [
  { path: 'package.json', desc: 'Project manifest' },
  { path: 'vercel.json', desc: 'Vercel configuration' },
  { path: 'api/index.js', desc: 'Serverless function entry' },
  { path: 'frontend/server.js', desc: 'Express application' }
];

let allPresent = true;

for (const file of requiredFiles) {
  if (fs.existsSync(file.path)) {
    console.log(chalk.green(`  ${file.desc}: ${file.path}`));
  } else {
    console.log(chalk.red(`  MISSING: ${file.path} (${file.desc})`));
    allPresent = false;
  }
}

// Check Node.js version
const nodeVersion = parseInt(process.version.slice(1));
if (nodeVersion >= 18) {
  console.log(chalk.green(`  Node.js: ${process.version}`));
} else {
  console.log(chalk.red(`  Node.js ${process.version} is too old. Need 18+`));
  allPresent = false;
}

if (allPresent) {
  console.log(chalk.green('\nAll checks passed!'));
} else {
  console.log(chalk.red('\nSome checks failed. Fix the issues above before deploying.'));
  process.exit(1);
}

console.log('');
console.log(chalk.gray('How Vercel deployment works:'));
console.log(chalk.gray('  1. Your Express server is in frontend/server.js'));
console.log(chalk.gray('  2. api/index.js exports it as a Vercel serverless function'));
console.log(chalk.gray('  3. vercel.json routes all requests to it'));
console.log(chalk.gray('  4. When you deploy, both frontend and backend go live together'));
console.log('');
console.log(chalk.yellow('To deploy: npm run deploy'));
