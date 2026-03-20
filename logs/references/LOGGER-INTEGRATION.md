# Logger Integration Guide

This guide shows how to integrate the logging framework into your tools.

## For Node.js Tools

### 1. Import the Logger

```javascript
const Logger = require('../logs/lib/logger');

// Create a logger instance
const logger = new Logger({
  baseLogDir: path.join(__dirname, '../logs'),
  toolName: 'my-tool-name',
  enableConsole: true,
  enableFile: true,
});
```

### 2. Use logging methods

```javascript
// Success
logger.success('tool-action', { result: 'data', count: 42 });

// Info
logger.info('user-action', { userId: 123 });

// Warning
logger.warn('potential-issue', { message: 'something odd happened' });

// Error
logger.error('operation-failed', { reason: 'connection timeout', retries: 3 });

// Debug
logger.debug('internal-state', { state: 'processing', queue: 5 });
```

### 3. Full Example

```javascript
const path = require('path');
const Logger = require('../logs/lib/logger');

class MyTool {
  constructor() {
    this.logger = new Logger({
      baseLogDir: path.join(__dirname, '../logs'),
      toolName: 'my-awesome-tool',
      enableConsole: true,
      enableFile: true,
    });
  }

  async doSomething(input) {
    this.logger.info('operation-start', { input, timestamp: new Date().toISOString() });
    
    try {
      // Do work
      const result = await this.processInput(input);
      
      this.logger.success('operation-complete', { 
        input, 
        output: result, 
        duration: 'X ms' 
      });
      
      return result;
    } catch (error) {
      this.logger.error('operation-failed', { 
        input, 
        error: error.message,
        stack: error.stack 
      });
      
      throw error;
    }
  }
}
```

## For HTML/Browser Tools

### 1. Create a Logger Bridge

Add this to your HTML tool's JavaScript section:

```javascript
class BrowserLogger {
  constructor(toolName, apiEndpoint) {
    this.toolName = toolName;
    this.apiEndpoint = apiEndpoint;
  }

  async log(action, status, details = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      toolName: this.toolName,
      action,
      status,
      details,
    };

    try {
      // Send to logging backend (if available)
      if (this.apiEndpoint) {
        await fetch(this.apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
        });
      }

      // Also log to console
      console.log(`[${this.toolName}] ${action}: ${status}`, details);
    } catch (err) {
      console.error('Logging failed:', err);
    }
  }

  success(action, details) { return this.log(action, 'success', details); }
  error(action, details) { return this.log(action, 'error', details); }
  info(action, details) { return this.log(action, 'info', details); }
}

// Usage
const logger = new BrowserLogger('launcher-tool', '/api/logs');
logger.info('tool-loaded', { version: '1.0' });
```

### 2. Log Important Events

```javascript
document.addEventListener('DOMContentLoaded', async () => {
  logger.info('page-loaded', { userAgent: navigator.userAgent });
});

button.addEventListener('click', async () => {
  try {
    await performAction();
    logger.success('action-completed', { action: 'user-clicked-button' });
  } catch (err) {
    logger.error('action-failed', { error: err.message });
  }
});
```

## For Python Tools

### 1. Create a Python Logger Wrapper

```python
import json
import os
from datetime import datetime
from pathlib import Path

class Logger:
    def __init__(self, tool_name, log_dir=None):
        self.tool_name = tool_name
        self.base_log_dir = log_dir or os.path.join(os.path.dirname(__file__), '../logs')
        self.ensure_dirs()
    
    def ensure_dirs(self):
        Path(self.base_log_dir).mkdir(parents=True, exist_ok=True)
    
    def get_log_file(self, is_error=False):
        today = datetime.now().strftime('%Y-%m-%d')
        log_dir = os.path.join(self.base_log_dir, today)
        Path(log_dir).mkdir(parents=True, exist_ok=True)
        
        filename = f'{today}-error.log' if is_error else f'{today}-general.log'
        return os.path.join(log_dir, filename)
    
    def log(self, action, status, details=None):
        entry = {
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'toolName': self.tool_name,
            'action': action,
            'status': status,
            'details': details or {},
            'pid': os.getpid(),
        }
        
        is_error = status == 'error'
        log_file = self.get_log_file(is_error)
        
        with open(log_file, 'a') as f:
            f.write(json.dumps(entry) + '\n')
        
        print(f"[{self.tool_name}] {action}: {status}", details or "")
    
    def success(self, action, details=None):
        self.log(action, 'success', details)
    
    def error(self, action, details=None):
        self.log(action, 'error', details)
    
    def info(self, action, details=None):
        self.log(action, 'info', details)

# Usage
logger = Logger('network-scanner')
logger.info('scan-start', {'target': '192.168.1.0/24'})

try:
    result = perform_scan()
    logger.success('scan-complete', {'hosts_found': len(result)})
except Exception as e:
    logger.error('scan-failed', {'error': str(e)})
```

## Log Output Format

All logs are JSON per line for easy parsing:

```json
{
  "timestamp": "2026-03-19T18:33:45.123Z",
  "toolName": "my-tool",
  "level": "info",
  "action": "user-clicked-button",
  "status": "success",
  "details": { "buttonId": "submit-btn", "userId": 42 },
  "pid": 12345
}
```

## Reading Logs

### Node.js
```javascript
const logs = Logger.readLogs(logDir, '2026-03-19', 'my-tool');
logs.forEach(entry => console.log(entry));
```

### Shell
```bash
# View all logs for today
cat logs/2026-03-19/*.log

# View only errors
cat logs/2026-03-19/*-error.log

# View logs for specific tool
grep "my-tool" logs/2026-03-19/*.log

# Count successes
grep '"status":"success"' logs/2026-03-19/*.log | wc -l
```

### Python
```python
import json

def read_logs(log_dir, date, is_error=False):
    filename = f'{date}-error.log' if is_error else f'{date}-general.log'
    log_file = os.path.join(log_dir, date, filename)
    
    if not os.path.exists(log_file):
        return []
    
    entries = []
    with open(log_file, 'r') as f:
        for line in f:
            if line.strip():
                entries.append(json.loads(line))
    
    return entries
```

## Best Practices

1. **Always log tool startup and shutdown**
   ```javascript
   logger.info('tool-start', { version: '1.0', config: 'prod' });
   // ... tool runs ...
   logger.info('tool-shutdown', { uptime: duration });
   ```

2. **Log user actions**
   ```javascript
   logger.info('user-action', { action: 'save', userId: 123 });
   ```

3. **Log errors with context**
   ```javascript
   logger.error('database-query-failed', { 
     query: 'SELECT ...', 
     error: err.message,
     retries: 3 
   });
   ```

4. **Don't log sensitive data**
   ```javascript
   // ❌ BAD
   logger.info('user-login', { username, password });
   
   // ✓ GOOD
   logger.info('user-login', { userId, success: true });
   ```

5. **Use consistent action names**
   ```javascript
   // Prefix with entity type
   logger.info('user-created', { userId: 123 });
   logger.info('user-deleted', { userId: 456 });
   logger.info('api-request-sent', { endpoint: '/api/users' });
   logger.info('api-request-received', { status: 200 });
   ```

## Log Retention

The logger includes cleanup utilities:

```javascript
// Keep logs for 30 days
Logger.cleanupOldLogs('/logs', 30);
```

```bash
# Manual cleanup (older than 30 days)
find /logs -type d -mtime +30 -exec rm -rf {} \;
```
