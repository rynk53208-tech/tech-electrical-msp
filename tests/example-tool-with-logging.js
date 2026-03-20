#!/usr/bin/env node

/**
 * example-tool-with-logging.js
 * 
 * Example tool demonstrating proper logging integration.
 * Copy this pattern when creating new tools.
 */

const fs = require('fs');
const path = require('path');
const Logger = require('../logs/lib/logger');

/**
 * MyTool - Example implementation with logging
 */
class MyTool {
  constructor(options = {}) {
    this.logger = new Logger({
      baseLogDir: path.join(__dirname, '../logs'),
      toolName: options.toolName || 'example-tool',
      enableConsole: options.enableConsole !== false,
      enableFile: options.enableFile !== false,
    });

    this.config = options.config || {};
  }

  /**
   * Initialize tool
   */
  async initialize() {
    this.logger.info('tool-initialize-start', {
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    });

    try {
      // Simulate initialization
      await this.loadConfig();
      this.logger.success('tool-initialize-complete', { configLoaded: true });
    } catch (err) {
      this.logger.error('tool-initialize-failed', {
        error: err.message,
        stack: err.stack,
      });
      throw err;
    }
  }

  /**
   * Load configuration
   */
  async loadConfig() {
    this.logger.debug('config-load-start', { source: 'environment' });

    try {
      // Simulate config loading
      this.config = {
        apiEndpoint: process.env.API_ENDPOINT || 'http://localhost:3000',
        timeout: parseInt(process.env.TIMEOUT || '5000'),
        retries: parseInt(process.env.RETRIES || '3'),
      };

      this.logger.success('config-load-complete', { config: this.config });
    } catch (err) {
      this.logger.error('config-load-failed', { error: err.message });
      throw err;
    }
  }

  /**
   * Perform main operation
   */
  async process(input) {
    const startTime = Date.now();

    this.logger.info('process-start', {
      input,
      config: this.config,
    });

    try {
      // Validate input
      if (!input) {
        throw new Error('Input is required');
      }

      this.logger.debug('input-validated', { inputLength: input.length });

      // Simulate work
      const result = await this.doWork(input);

      const duration = Date.now() - startTime;

      this.logger.success('process-complete', {
        input,
        result,
        durationMs: duration,
      });

      return result;
    } catch (err) {
      const duration = Date.now() - startTime;

      this.logger.error('process-failed', {
        input,
        error: err.message,
        durationMs: duration,
        stack: err.stack,
      });

      throw err;
    }
  }

  /**
   * Simulated work
   */
  async doWork(input) {
    this.logger.debug('work-start', { input });

    // Simulate async work
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.8) {
          this.logger.warn('work-slow', { delayMs: 150 });
        }

        this.logger.success('work-complete', {
          input,
          output: `processed: ${input}`,
        });

        resolve(`Processed: ${input}`);
      }, 100);
    });
  }

  /**
   * Cleanup and shutdown
   */
  async shutdown() {
    this.logger.info('tool-shutdown-start', {});

    try {
      // Cleanup resources
      this.logger.success('tool-shutdown-complete', {
        uptime: process.uptime(),
      });
    } catch (err) {
      this.logger.error('tool-shutdown-failed', { error: err.message });
      throw err;
    }
  }
}

/**
 * CLI Usage
 */
async function main() {
  const tool = new MyTool({
    toolName: 'example-tool',
    enableConsole: true,
    enableFile: true,
  });

  try {
    await tool.initialize();

    // Process some input
    const result = await tool.process('test input data');
    console.log('Result:', result);

    // Simulate multiple operations
    for (let i = 0; i < 3; i++) {
      await tool.process(`operation ${i + 1}`);
    }

    await tool.shutdown();
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
}

// Export for testing
module.exports = MyTool;

// Run if executed directly
if (require.main === module) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
