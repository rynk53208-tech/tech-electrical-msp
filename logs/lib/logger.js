#!/usr/bin/env node

/**
 * logger.js - Unified Logging Framework
 * 
 * Provides timestamp-aware, structured logging for all tools.
 * Supports console + file output, separate error logs, and daily log rotation.
 */

const fs = require('fs');
const path = require('path');

class Logger {
  constructor(options = {}) {
    this.baseLogDir = options.baseLogDir || path.join(__dirname, '../../logs');
    this.toolName = options.toolName || 'unknown-tool';
    this.level = options.level || 'info'; // 'debug', 'info', 'warn', 'error'
    this.enableConsole = options.enableConsole !== false;
    this.enableFile = options.enableFile !== false;
    
    this.ensureLogDirs();
  }

  /**
   * Ensure log directory structure exists (YYYY-MM-DD subdirs)
   */
  ensureLogDirs() {
    try {
      if (!fs.existsSync(this.baseLogDir)) {
        fs.mkdirSync(this.baseLogDir, { recursive: true });
      }
      
      // Create today's log directory
      const today = this.getDateFolder();
      const todayLogDir = path.join(this.baseLogDir, today);
      
      if (!fs.existsSync(todayLogDir)) {
        fs.mkdirSync(todayLogDir, { recursive: true });
      }
    } catch (err) {
      console.error(`Failed to create log directories: ${err.message}`);
    }
  }

  /**
   * Get today's date folder name (YYYY-MM-DD)
   */
  getDateFolder() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Get current timestamp (ISO format with milliseconds)
   */
  getTimestamp() {
    const now = new Date();
    return now.toISOString();
  }

  /**
   * Format a log entry
   */
  formatEntry(level, action, status, details = {}) {
    return {
      timestamp: this.getTimestamp(),
      toolName: this.toolName,
      level,
      action,
      status,
      details,
      pid: process.pid,
    };
  }

  /**
   * Write to file
   */
  writeToFile(entry, isError = false) {
    try {
      const today = this.getDateFolder();
      const logDir = path.join(this.baseLogDir, today);
      
      // Determine filename based on log level
      const filename = isError 
        ? `${today}-error.log` 
        : `${today}-general.log`;
      
      const filePath = path.join(logDir, filename);
      
      // Format: JSON per line for easy parsing
      const line = JSON.stringify(entry) + '\n';
      
      fs.appendFileSync(filePath, line, 'utf8');
    } catch (err) {
      console.error(`Failed to write to log file: ${err.message}`);
    }
  }

  /**
   * Output to console
   */
  writeToConsole(entry) {
    if (!this.enableConsole) return;
    
    const { timestamp, toolName, level, action, status, details } = entry;
    const levelEmoji = {
      debug: '🔍',
      info: 'ℹ️ ',
      warn: '⚠️ ',
      error: '❌'
    }[level] || '○';
    
    const statusLabel = status === 'success' ? '✓' : status === 'error' ? '✗' : '○';
    
    let msg = `${levelEmoji} [${level.toUpperCase()}] ${toolName} @ ${action} ${statusLabel}`;
    
    if (Object.keys(details).length > 0) {
      msg += ` | ${JSON.stringify(details)}`;
    }
    
    console[level === 'error' ? 'error' : 'log'](msg);
  }

  /**
   * Log an event (main method)
   */
  log(level, action, status, details = {}) {
    const entry = this.formatEntry(level, action, status, details);
    const isError = level === 'error' || status === 'error';
    
    if (this.enableFile) {
      this.writeToFile(entry, isError);
    }
    
    if (this.enableConsole) {
      this.writeToConsole(entry);
    }
    
    return entry;
  }

  /**
   * Convenience methods
   */
  debug(action, details = {}) {
    return this.log('debug', action, 'info', details);
  }

  info(action, details = {}) {
    return this.log('info', action, 'info', details);
  }

  warn(action, details = {}) {
    return this.log('warn', action, 'warn', details);
  }

  error(action, details = {}) {
    return this.log('error', action, 'error', details);
  }

  success(action, details = {}) {
    return this.log('info', action, 'success', details);
  }

  fail(action, details = {}) {
    return this.log('error', action, 'error', details);
  }

  /**
   * Get all logs for a specific tool on a date
   */
  static readLogs(baseLogDir, date, toolName, isErrorLog = false) {
    try {
      const filename = isErrorLog ? `${date}-error.log` : `${date}-general.log`;
      const filePath = path.join(baseLogDir, date, filename);
      
      if (!fs.existsSync(filePath)) {
        return [];
      }
      
      const content = fs.readFileSync(filePath, 'utf8');
      return content
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          try {
            const entry = JSON.parse(line);
            if (!toolName || entry.toolName === toolName) {
              return entry;
            }
          } catch (e) {
            // Skip malformed lines
          }
          return null;
        })
        .filter(e => e !== null);
    } catch (err) {
      console.error(`Failed to read logs: ${err.message}`);
      return [];
    }
  }

  /**
   * Cleanup old logs (older than X days)
   */
  static cleanupOldLogs(baseLogDir, daysToKeep = 30) {
    try {
      const cutoff = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
      const entries = fs.readdirSync(baseLogDir);
      
      entries.forEach(entry => {
        const fullPath = path.join(baseLogDir, entry);
        const stat = fs.statSync(fullPath);
        
        // If directory and older than cutoff, remove it
        if (stat.isDirectory() && stat.mtimeMs < cutoff) {
          fs.rmSync(fullPath, { recursive: true });
        }
      });
    } catch (err) {
      console.error(`Failed to cleanup old logs: ${err.message}`);
    }
  }
}

module.exports = Logger;
