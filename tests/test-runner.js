#!/usr/bin/env node

/**
 * test-runner.js - Comprehensive Test Framework
 * 
 * Runs all validators, logs results, and generates reports.
 * Usage: node test-runner.js [tool-name-or-path]
 */

const fs = require('fs');
const path = require('path');
const Validators = require('./validators');
const Logger = require('../logs/lib/logger');

class TestRunner {
  constructor() {
    this.workspaceRoot = path.join(__dirname, '..');
    this.toolsDir = path.join(this.workspaceRoot, 'tools');
    this.testsDir = __dirname;
    this.logsDir = path.join(this.workspaceRoot, 'logs');
    
    this.logger = new Logger({
      baseLogDir: this.logsDir,
      toolName: 'test-runner',
      enableConsole: true,
      enableFile: true,
    });

    this.results = [];
    this.summary = {
      total: 0,
      passed: 0,
      failed: 0,
      errors: [],
      warnings: [],
    };
  }

  /**
   * Find all testable tools in /tools/
   */
  discoverTools() {
    const tools = [];

    if (!fs.existsSync(this.toolsDir)) {
      this.logger.warn('discover-tools', { message: `Tools dir not found: ${this.toolsDir}` });
      return tools;
    }

    const files = fs.readdirSync(this.toolsDir);

    files.forEach(file => {
      const ext = path.extname(file).toLowerCase();
      if (['.html', '.js', '.py'].includes(ext)) {
        tools.push(path.join(this.toolsDir, file));
      }
    });

    this.logger.info('discover-tools', { toolsFound: tools.length, tools: tools.map(t => path.basename(t)) });
    return tools;
  }

  /**
   * Test a single tool
   */
  testTool(filePath) {
    this.logger.debug('test-start', { file: path.basename(filePath) });

    const result = Validators.validate(filePath);
    result.basename = path.basename(filePath);
    result.relativePath = path.relative(this.workspaceRoot, filePath);

    this.results.push(result);
    this.summary.total++;

    if (result.passed) {
      this.summary.passed++;
      this.logger.success('test-complete', { 
        file: result.basename, 
        checks: result.checks 
      });
    } else {
      this.summary.failed++;
      result.errors.forEach(err => this.summary.errors.push(err));
      this.logger.fail('test-complete', { 
        file: result.basename, 
        errors: result.errors 
      });
    }

    if (result.warnings && result.warnings.length > 0) {
      result.warnings.forEach(warn => this.summary.warnings.push(warn));
    }
  }

  /**
   * Test a specific tool by path or name
   */
  testSpecific(toolRef) {
    let filePath;

    // If it looks like a path, use it directly
    if (toolRef.includes('/')) {
      filePath = path.resolve(toolRef);
    } else {
      // Try to find it in tools directory
      filePath = path.join(this.toolsDir, toolRef);
      if (!fs.existsSync(filePath)) {
        // Try with common extensions
        for (const ext of ['.html', '.js', '.py']) {
          const attempt = path.join(this.toolsDir, toolRef + ext);
          if (fs.existsSync(attempt)) {
            filePath = attempt;
            break;
          }
        }
      }
    }

    if (!fs.existsSync(filePath)) {
      this.logger.error('test-specific', { reference: toolRef, error: 'File not found' });
      throw new Error(`Tool not found: ${toolRef}`);
    }

    this.testTool(filePath);
  }

  /**
   * Run all tests
   */
  runAll() {
    this.logger.info('test-run-start', { mode: 'all' });

    const tools = this.discoverTools();

    if (tools.length === 0) {
      this.logger.warn('test-run', { message: 'No tools found to test' });
      return;
    }

    tools.forEach(tool => this.testTool(tool));
    this.logger.info('test-run-complete', this.summary);
  }

  /**
   * Generate console report
   */
  generateReport() {
    const lines = [];

    lines.push('\n' + '='.repeat(70));
    lines.push('                      TEST RUNNER REPORT');
    lines.push('='.repeat(70));

    // Summary
    lines.push(`\n📊 SUMMARY`);
    lines.push(`   Total Tests: ${this.summary.total}`);
    lines.push(`   ✓ Passed:    ${this.summary.passed} (${this.summary.total > 0 ? Math.round(this.summary.passed / this.summary.total * 100) : 0}%)`);
    lines.push(`   ✗ Failed:    ${this.summary.failed}`);

    if (this.summary.warnings.length > 0) {
      lines.push(`   ⚠️  Warnings: ${this.summary.warnings.length}`);
    }

    // Detailed results
    lines.push(`\n📋 DETAILED RESULTS`);
    this.results.forEach(result => {
      lines.push(Validators.reportToString(result));
    });

    // Errors section
    if (this.summary.errors.length > 0) {
      lines.push(`\n❌ ALL ERRORS (${this.summary.errors.length})`);
      this.summary.errors.forEach((err, i) => {
        lines.push(`   ${i + 1}. ${err}`);
      });
    }

    // Warnings section
    if (this.summary.warnings.length > 0) {
      lines.push(`\n⚠️  ALL WARNINGS (${this.summary.warnings.length})`);
      this.summary.warnings.forEach((warn, i) => {
        lines.push(`   ${i + 1}. ${warn}`);
      });
    }

    // Exit status
    lines.push(`\n${'='.repeat(70)}`);
    if (this.summary.failed === 0) {
      lines.push('✓ ALL TESTS PASSED');
    } else {
      lines.push(`✗ ${this.summary.failed} TEST(S) FAILED - See errors above`);
    }
    lines.push('='.repeat(70) + '\n');

    return lines.join('\n');
  }

  /**
   * Write report to file
   */
  saveReport(reportText) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const reportDir = path.join(this.logsDir, today);
      
      if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
      }

      const reportPath = path.join(reportDir, 'test-report.txt');
      fs.writeFileSync(reportPath, reportText, 'utf8');
      
      this.logger.info('report-saved', { path: reportPath });
    } catch (err) {
      this.logger.error('report-save-failed', { error: err.message });
    }
  }

  /**
   * Get exit code (0 = all pass, 1 = any failures)
   */
  getExitCode() {
    return this.summary.failed > 0 ? 1 : 0;
  }
}

/**
 * CLI Entry Point
 */
async function main() {
  const runner = new TestRunner();
  const args = process.argv.slice(2);

  try {
    if (args.length > 0) {
      // Test specific tool(s)
      args.forEach(arg => runner.testSpecific(arg));
    } else {
      // Test all tools
      runner.runAll();
    }

    // Generate and display report
    const report = runner.generateReport();
    console.log(report);

    // Save report to file
    runner.saveReport(report);

    // Exit with appropriate code
    process.exit(runner.getExitCode());
  } catch (err) {
    console.error(`\n❌ Test Runner Error: ${err.message}`);
    process.exit(1);
  }
}

// Export for testing/integration
module.exports = TestRunner;

// Run if executed directly
if (require.main === module) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
