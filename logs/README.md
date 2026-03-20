# Logging Framework

Unified, structured logging system for all tools in the workspace.

## Overview

The logging framework provides:
- **Timestamp-aware logging** with millisecond precision
- **Structured JSON output** for easy parsing and analysis
- **Separate error logs** for quick troubleshooting
- **Daily log rotation** (automatic)
- **Console + file output** simultaneously
- **Multi-language support** (Node.js, Python, Browser/JavaScript)

## Directory Structure

```
logs/
├── README.md                    ← You are here
├── lib/
│   └── logger.js                ← Core logging library (Node.js)
├── references/
│   └── LOGGER-INTEGRATION.md     ← Integration guides for all languages
└── YYYY-MM-DD/                  ← Daily log folders
    ├── YYYY-MM-DD-general.log
    ├── YYYY-MM-DD-error.log
    └── test-report.txt          ← Test results summary
```

## Log Files

### General Log
**File:** `logs/YYYY-MM-DD/YYYY-MM-DD-general.log`

Contains all events: info, debug, warnings, and successes. One JSON entry per line.

```json
{"timestamp":"2026-03-20T01:34:45.123Z","toolName":"launcher","level":"info","action":"user-clicked-button","status":"success","details":{"buttonId":"submit","userId":42},"pid":12345}
{"timestamp":"2026-03-20T01:34:46.456Z","toolName":"launcher","level":"warn","action":"network-slow","status":"warn","details":{"latency":2500},"pid":12345}
```

### Error Log
**File:** `logs/YYYY-MM-DD/YYYY-MM-DD-error.log`

Contains only errors for quick scanning. Same JSON format as general log.

```json
{"timestamp":"2026-03-20T01:35:10.789Z","toolName":"network-scanner","level":"error","action":"scan-failed","status":"error","details":{"error":"Connection timeout","retries":3},"pid":12356}
```

### Test Report
**File:** `logs/YYYY-MM-DD/test-report.txt`

Human-readable summary of all tests that ran on that day.

## Using the Logger

### Node.js

```javascript
const Logger = require('../logs/lib/logger');
const path = require('path');

// Create a logger instance
const logger = new Logger({
  baseLogDir: path.join(__dirname, '../logs'),
  toolName: 'my-awesome-tool',
  enableConsole: true,
  enableFile: true,
  level: 'info',
});

// Log events
logger.info('tool-started', { version: '1.0', config: 'production' });
logger.success('user-logged-in', { userId: 123, method: 'oauth' });
logger.warn('rate-limit-approaching', { used: 95, limit: 100 });
logger.error('database-connection-failed', { error: 'ECONNREFUSED', host: 'db.local' });
logger.debug('cache-hit', { key: 'user:123', ttl: 3600 });
```

### Python

```python
import json
import os
from datetime import datetime
from pathlib import Path

class Logger:
    def __init__(self, tool_name, base_log_dir=None):
        self.tool_name = tool_name
        self.base_log_dir = base_log_dir or os.path.join(os.path.dirname(__file__), '../logs')
        self.ensure_dirs()
    
    def ensure_dirs(self):
        Path(self.base_log_dir).mkdir(parents=True, exist_ok=True)
    
    def log(self, action, status, details=None):
        today = datetime.now().strftime('%Y-%m-%d')
        log_dir = os.path.join(self.base_log_dir, today)
        Path(log_dir).mkdir(parents=True, exist_ok=True)
        
        entry = {
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'toolName': self.tool_name,
            'action': action,
            'status': status,
            'details': details or {},
            'pid': os.getpid(),
        }
        
        # Write to general log
        with open(os.path.join(log_dir, f'{today}-general.log'), 'a') as f:
            f.write(json.dumps(entry) + '\n')
        
        # Write to error log if error
        if status == 'error':
            with open(os.path.join(log_dir, f'{today}-error.log'), 'a') as f:
                f.write(json.dumps(entry) + '\n')
        
        # Console output
        print(f"[{self.tool_name}] {action}: {status}", details or "")

# Usage
logger = Logger('network-scanner')
logger.log('scan-started', 'info', {'target': '192.168.1.0/24'})
logger.log('hosts-found', 'success', {'count': 42})
logger.log('timeout', 'error', {'error': 'Scan exceeded 5 minute limit'})
```

### Browser/HTML

```javascript
// Simple browser logger (send to backend if available)
class BrowserLogger {
  constructor(toolName, apiEndpoint = null) {
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

    // Log to console
    console.log(`[${this.toolName}] ${action}: ${status}`, details);

    // Send to server if available
    if (this.apiEndpoint) {
      try {
        await fetch(this.apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
        });
      } catch (err) {
        console.error('Failed to send log to server:', err);
      }
    }
  }

  success(action, details) { return this.log(action, 'success', details); }
  error(action, details) { return this.log(action, 'error', details); }
  info(action, details) { return this.log(action, 'info', details); }
}

// Usage
const logger = new BrowserLogger('launcher-tool', '/api/logs');
logger.info('page-loaded', { userAgent: navigator.userAgent });

document.getElementById('submit-btn').addEventListener('click', async () => {
  try {
    const result = await submitForm();
    logger.success('form-submitted', result);
  } catch (err) {
    logger.error('form-submission-failed', { error: err.message });
  }
});
```

## Log Entry Format

All logs follow the same JSON structure:

```json
{
  "timestamp": "2026-03-20T01:34:45.123Z",  // UTC ISO format
  "toolName": "launcher",                    // Tool that generated log
  "level": "info",                          // debug, info, warn, error
  "action": "user-action",                  // What happened
  "status": "success",                      // success, error, info, warn
  "details": {                              // Additional context
    "userId": 42,
    "result": "data"
  },
  "pid": 12345                              // Process ID
}
```

## Reading & Querying Logs

### Shell Commands

```bash
# View all logs from today
cat logs/$(date +%Y-%m-%d)/*.log

# View only errors
cat logs/$(date +%Y-%m-%d)/*-error.log

# View logs for specific tool
grep '"toolName":"launcher"' logs/$(date +%Y-%m-%d)/*.log

# Count successful operations
grep '"status":"success"' logs/$(date +%Y-%m-%d)/*.log | wc -l

# Find all failures
grep '"status":"error"' logs/$(date +%Y-%m-%d)/*.log | jq '.details'

# Watch logs in real-time
tail -f logs/$(date +%Y-%m-%d)/*.log
```

### Node.js

```javascript
const fs = require('fs');
const path = require('path');

function readLogs(date, toolName = null, isError = false) {
  const logDir = `logs/${date}`;
  const filename = isError ? `${date}-error.log` : `${date}-general.log`;
  const filePath = path.join(logDir, filename);

  if (!fs.existsSync(filePath)) return [];

  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .filter(line => line.trim())
    .map(line => {
      try {
        const entry = JSON.parse(line);
        return !toolName || entry.toolName === toolName ? entry : null;
      } catch {
        return null;
      }
    })
    .filter(e => e !== null);
}

// Usage
const logs = readLogs('2026-03-20', 'launcher');
logs.forEach(entry => {
  console.log(`${entry.timestamp}: ${entry.action} → ${entry.status}`);
});

// Filter specific action
const failedScans = readLogs('2026-03-20', 'network-scanner', true)
  .filter(e => e.action === 'scan-failed');
```

### Python

```python
import json
import os
from datetime import datetime

def read_logs(date, tool_name=None, is_error=False):
    """Read log entries from a specific date"""
    log_dir = f'logs/{date}'
    filename = f'{date}-error.log' if is_error else f'{date}-general.log'
    file_path = os.path.join(log_dir, filename)
    
    if not os.path.exists(file_path):
        return []
    
    entries = []
    with open(file_path, 'r') as f:
        for line in f:
            if line.strip():
                try:
                    entry = json.loads(line)
                    if not tool_name or entry['toolName'] == tool_name:
                        entries.append(entry)
                except json.JSONDecodeError:
                    pass
    
    return entries

# Usage
today = datetime.now().strftime('%Y-%m-%d')
logs = read_logs(today, 'launcher')

for entry in logs:
    print(f"{entry['timestamp']}: {entry['action']} → {entry['status']}")

# Analyze errors
errors = read_logs(today, is_error=True)
for error in errors:
    print(f"ERROR: {error['action']}", error['details'])
```

## Log Rotation

Logs are automatically rotated **daily**. Each day gets its own folder:

```
logs/
├── 2026-03-18/
│   ├── 2026-03-18-general.log
│   ├── 2026-03-18-error.log
│   └── test-report.txt
├── 2026-03-19/
│   ├── 2026-03-19-general.log
│   ├── 2026-03-19-error.log
│   └── test-report.txt
└── 2026-03-20/
    ├── 2026-03-20-general.log
    ├── 2026-03-20-error.log
    └── test-report.txt
```

### Cleanup Old Logs

```javascript
// Node.js - remove logs older than 30 days
const Logger = require('./lib/logger');
Logger.cleanupOldLogs('./logs', 30);
```

```bash
# Shell - remove directories older than 30 days
find logs -type d -mtime +30 -exec rm -rf {} \;

# Or archive them first
tar -czf logs-archive-$(date +%Y-%m).tar.gz logs/2026-03-*/
rm -rf logs/2026-03-*/
```

## Best Practices

### 1. Log User Actions
```javascript
logger.info('user-action', { action: 'clicked-button', buttonId: 'submit' });
```

### 2. Log Errors with Context
```javascript
logger.error('api-request-failed', { 
  endpoint: '/api/users', 
  status: 500, 
  error: 'Internal Server Error' 
});
```

### 3. Don't Log Sensitive Data
```javascript
// ❌ BAD - logs password
logger.info('user-login', { username, password, token });

// ✓ GOOD - only logs identifier
logger.info('user-login', { userId, method: 'oauth', success: true });
```

### 4. Use Consistent Action Names
```javascript
// Prefix with what happened
logger.info('user-created', { userId: 123 });
logger.info('user-deleted', { userId: 456 });
logger.info('scan-started', { target: '192.168.1.0/24' });
logger.info('scan-completed', { hostsFound: 42 });
```

### 5. Include Relevant Details
```javascript
logger.info('network-request', { 
  method: 'POST',
  endpoint: '/api/data',
  durationMs: 245,
  statusCode: 200,
  size: 1024
});
```

## Integration with CI/CD

### GitHub Actions

```yaml
name: Monitor Logs

on:
  workflow_run:
    workflows: ["Test Tools"]
    types: [completed]

jobs:
  check-logs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check for errors
        run: |
          ERROR_COUNT=$(grep -c '"status":"error"' logs/$(date +%Y-%m-%d)/*-error.log || echo 0)
          if [ $ERROR_COUNT -gt 0 ]; then
            echo "Found $ERROR_COUNT errors"
            cat logs/$(date +%Y-%m-%d)/*-error.log | jq '.details'
            exit 1
          fi
```

### Monitoring Script

```bash
#!/bin/bash
# Monitor logs and alert on errors

while true; do
  ERROR_COUNT=$(grep -c '"status":"error"' logs/$(date +%Y-%m-%d)/*-error.log 2>/dev/null || echo 0)
  
  if [ $ERROR_COUNT -gt 0 ]; then
    echo "Alert: $ERROR_COUNT errors detected"
    mail -s "🚨 Tool Error Alert" admin@example.com < <(
      cat logs/$(date +%Y-%m-%d)/*-error.log | jq '.'
    )
  fi
  
  sleep 60
done
```

## Performance Metrics

- **Log entry size:** ~200-500 bytes (JSON)
- **Write speed:** < 1ms per entry
- **Daily typical volume:** 100-1000 entries
- **Disk usage:** ~5-50MB per month

## Troubleshooting

### Logs not appearing
```bash
# Check directory permissions
ls -la logs/
chmod 755 logs/

# Verify today's folder exists
ls logs/$(date +%Y-%m-%d)/

# Check if tool is writing to logs
grep "tool-name" logs/$(date +%Y-%m-%d)/*.log
```

### Logs too large
```bash
# Archive and compress old logs
tar -czf logs-2026-01.tar.gz logs/2026-01-01 logs/2026-01-02 ...
rm -rf logs/2026-01-*

# Or remove logs older than 60 days
find logs -type d -mtime +60 -exec rm -rf {} \;
```

### Parse errors when reading logs
```bash
# Validate JSON in logs
jq -c . logs/$(date +%Y-%m-%d)/*.log

# Find malformed lines
grep -v '^{' logs/$(date +%Y-%m-%d)/*.log
```

## See Also

- `references/LOGGER-INTEGRATION.md` - Detailed integration examples
- `../tests/README.md` - Test framework documentation
- Tool-specific logs are prefixed with `toolName` field for easy filtering
