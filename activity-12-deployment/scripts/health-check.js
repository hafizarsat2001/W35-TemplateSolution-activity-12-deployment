#!/usr/bin/env node

// W3.5 Activity 12: Complete Health Check Implementation
// TEACHER REFERENCE - 100% COMPLETE IMPLEMENTATION

const chalk = require('chalk');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

console.log(chalk.blue('Quest Tracker Health Check'));
console.log(chalk.gray('============================'));

class HealthChecker {
  constructor() {
    this.appUrl = process.env.APP_URL || 'https://your-app.vercel.app';
    this.apiKey = process.env.API_KEY || 'demo_key_12345';
    this.results = [];
  }

  async checkFrontend() {
    console.log(chalk.yellow('\nChecking Frontend...'));

    try {
      const startTime = Date.now();
      const response = await fetch(this.appUrl, { timeout: 10000 });
      const responseTime = Date.now() - startTime;

      if (response.ok) {
        console.log(chalk.green('  Frontend is accessible'));
        console.log(chalk.gray(`  Status: ${response.status}`));
        console.log(chalk.gray(`  Response time: ${responseTime}ms`));
        this.results.push({ check: 'frontend', status: 'pass', responseTime });
        return true;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.log(chalk.red('  Frontend check failed'));
      console.log(chalk.red(`  Error: ${error.message}`));
      this.results.push({ check: 'frontend', status: 'fail', error: error.message });
      return false;
    }
  }

  async checkAPIHealth() {
    console.log(chalk.yellow('\nChecking API Health...'));

    try {
      const startTime = Date.now();
      const response = await fetch(`${this.appUrl}/health`, { timeout: 10000 });
      const responseTime = Date.now() - startTime;
      const data = await response.json();

      if (response.ok && data.status === 'healthy') {
        console.log(chalk.green('  API is healthy'));
        console.log(chalk.gray(`  Response time: ${responseTime}ms`));
        this.results.push({ check: 'apiHealth', status: 'pass', responseTime });
        return true;
      } else {
        throw new Error(`Health check failed: ${data.status || 'unknown'}`);
      }
    } catch (error) {
      console.log(chalk.red('  API health check failed'));
      console.log(chalk.red(`  Error: ${error.message}`));
      this.results.push({ check: 'apiHealth', status: 'fail', error: error.message });
      return false;
    }
  }

  async checkAPIEndpoints() {
    console.log(chalk.yellow('\nChecking API Endpoints...'));

    const endpoints = [
      { path: '/api/quests', description: 'Quest list' },
      { path: '/api/quests/1', description: 'Quest details' },
      { path: '/api/players/alex', description: 'Player profile' },
      { path: '/api/categories', description: 'Categories list' }
    ];

    let passedCount = 0;

    for (const endpoint of endpoints) {
      try {
        const url = `${this.appUrl}${endpoint.path}?api_key=${this.apiKey}`;
        const startTime = Date.now();
        const response = await fetch(url, { method: 'GET', timeout: 10000 });
        const responseTime = Date.now() - startTime;

        if (response.ok) {
          console.log(chalk.green(`  ${endpoint.description} (${responseTime}ms)`));
          passedCount++;
        } else {
          console.log(chalk.red(`  ${endpoint.description}: ${response.status}`));
        }
      } catch (error) {
        console.log(chalk.red(`  ${endpoint.description}: ${error.message}`));
      }
    }

    const success = passedCount === endpoints.length;
    this.results.push({ check: 'apiEndpoints', status: success ? 'pass' : 'fail', passed: passedCount, total: endpoints.length });
    return success;
  }

  // TODO 4 - COMPLETE SOLUTION: Performance monitoring
  async checkPerformance() {
    console.log(chalk.yellow('\nChecking Performance...'));

    const timings = [];
    const testUrls = [this.appUrl, `${this.appUrl}/health`];

    for (const url of testUrls) {
      try {
        const startTime = Date.now();
        await fetch(url, { timeout: 10000 });
        const responseTime = Date.now() - startTime;
        timings.push({ url, responseTime });

        if (responseTime > 2000) {
          console.log(chalk.yellow(`  SLOW: ${url} (${responseTime}ms)`));
        } else {
          console.log(chalk.green(`  OK: ${url} (${responseTime}ms)`));
        }
      } catch (error) {
        console.log(chalk.red(`  FAIL: ${url} (${error.message})`));
        timings.push({ url, responseTime: -1, error: error.message });
      }
    }

    const avgTime = timings
      .filter(t => t.responseTime > 0)
      .reduce((sum, t) => sum + t.responseTime, 0) / timings.length;

    console.log(chalk.gray(`  Average response time: ${Math.round(avgTime)}ms`));

    this.results.push({ check: 'performance', status: avgTime < 2000 ? 'pass' : 'warn', avgTime: Math.round(avgTime) });
    return avgTime < 2000;
  }

  async runAllChecks() {
    console.log(chalk.white('\nRunning health checks...\n'));

    const checks = {
      frontend: await this.checkFrontend(),
      apiHealth: await this.checkAPIHealth(),
      apiEndpoints: await this.checkAPIEndpoints(),
      performance: await this.checkPerformance()
    };

    const totalChecks = Object.keys(checks).length;
    const passedChecks = Object.values(checks).filter(Boolean).length;

    console.log(chalk.blue('\nHealth Check Summary'));
    console.log(chalk.gray('========================'));

    Object.entries(checks).forEach(([check, passed]) => {
      const icon = passed ? 'PASS' : 'FAIL';
      const color = passed ? chalk.green : chalk.red;
      console.log(color(`${icon} - ${check}`));
    });

    console.log(chalk.blue(`\nScore: ${passedChecks}/${totalChecks} checks passed`));

    // Save results to file
    this.saveResults(checks);

    if (passedChecks === totalChecks) {
      console.log(chalk.green('All systems working! Your app is ready.'));
      return true;
    } else {
      console.log(chalk.red('Some issues found. Review the failed checks above.'));
      return false;
    }
  }

  saveResults(checks) {
    try {
      const historyDir = path.join(__dirname, '..');
      const historyFile = path.join(historyDir, 'health-history.json');

      let history = [];
      if (fs.existsSync(historyFile)) {
        history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
      }

      history.push({
        timestamp: new Date().toISOString(),
        url: this.appUrl,
        checks,
        details: this.results
      });

      // Keep last 50 entries
      if (history.length > 50) {
        history = history.slice(-50);
      }

      fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
      console.log(chalk.gray('\nResults saved to health-history.json'));
    } catch (error) {
      // Silent fail for history saving
    }
  }
}

async function main() {
  const checker = new HealthChecker();

  if (process.argv[2]) checker.appUrl = process.argv[2];

  const success = await checker.runAllChecks();
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('Health check failed:', error));
    process.exit(1);
  });
}

module.exports = { HealthChecker };
