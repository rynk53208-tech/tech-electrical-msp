# Testing & Logging Framework - Setup Guide

## Overview

This guide walks you through setting up and using the Testing and Logging Framework for your tools.

## What You Get

✅ **Test Framework** (Node.js & Bash)
- Validates HTML, JavaScript, and Python files
- Comprehensive error checking
- Pass/fail reporting with detailed output
- JSON logs for analysis

✅ **Logging Framework** (Multi-language)
- Unified logging across all tools
- Structured JSON output
- Automatic daily log rotation
- Console + file output

## Installation

The framework is already installed! No additional setup needed.

### Directory Layout

```
/root/.openclaw/workspace/
├── tests/
│   ├── README.md                        ← Test framework guide
│   ├── SETUP.md                         ← This file
│   ├── test-runner.js                   ← Node.js test runner
│   ├── test-runner.sh                   ← Bash test runner
│   ├── validators.js                    ← Validation logic
│   ├── example-tool-with-logging.js     ← Example with logging
│   └── integration-test.js               ← Integration tests (future)
│
├── logs/
│   ├── README.md                        ← Logging framework guide
│   ├── lib/
│   │   └── logger.js                    ← Core logger (Node.js)
│   ├── references/
│   │   └── LOGGER-INTEGRATION.md         ← Integration examples
│   └── YYYY-MM-DD/                      ← Daily log folders
│       ├── YYYY-MM-DD-general.log
│       ├── YYYY-MM-DD-error.log
│       └── test-report.txt
│
└── tools/
    ├── launcher.html                     ← Tools to be tested
    ├── network-mapper.html
    ├── onboarding-form.html
    └── network-scanner.py
```

## Quick Start

### 1. Run All Tests

```bash
cd /root/.openclaw/workspace

# Using Node.js
node tests/test-runner.js

# Using Bash (no Node.js required)
bash tests/test-runner.sh
```

### 2. Test Specific Tools

```bash
# Test by name
node tests/test-runner.js launcher.html
node tests/test-runner.js network-scanner.py

# Test by path
node tests/test-runner.js /root/.openclaw/workspace/tools/launcher.html

# Test multiple
node tests/test-runner.js launcher.html network-mapper.html network-scanner.py
```

### 3. View Test Results

```bash
# Console output (from test run above)
# Shows summary, detailed results, and any warnings

# Detailed report in file
cat logs/$(date +%Y-%m-%d)/test-report.txt

# View raw logs
cat logs/$(date +%Y-%m-%d)/*.log

# View only errors
cat logs/$(date +%Y-%m-%d)/*-error.log
```

## Using the Logger in Your Tools

### Option A: New Tool - Start with Logging

Copy the example:
```bash
cp tests/example-tool-with-logging.js your-new-tool.js
```

Then modify for your needs. The logger is already integrated!

### Option B: Existing Tool - Add Logging

#### For Node.js Tools

```javascript
const Logger = require('../logs/lib/logger');
const path = require('path');

// At the start of your tool
const logger = new Logger({
  baseLogDir: path.join(__dirname, '../logs'),
  toolName: 'my-tool-name',
  enableConsole: true,
  enableFile: true,
});

// Use throughout your code
logger.info('operation-start', { userId: 123 });
logger.success('operation-complete', { result: 'data' });
logger.error('operation-failed', { error: err.message });
```

#### For Python Tools

Create a `logger.py` in your tool directory:

```python
import json
import os
from datetime import datetime
from pathlib import Path

class Logger:
    def __init__(self, tool_name):
        self.tool_name = tool_name
        self.base_log_dir = os.path.join(
            os.path.dirname(__file__), 
            '../../logs'
        )
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
        
        with open(os.path.join(log_dir, f'{today}-general.log'), 'a') as f:
            f.write(json.dumps(entry) + '\n')
        
        if status == 'error':
            with open(os.path.join(log_dir, f'{today}-error.log'), 'a') as f:
                f.write(json.dumps(entry) + '\n')
        
        print(f"[{self.tool_name}] {action}: {status}", details or "")

# In your tool
logger = Logger('my-tool-name')
logger.log('tool-started', 'success', {'version': '1.0'})
```

#### For HTML/Browser Tools

Add to your HTML's `<script>` section:

```javascript
class BrowserLogger {
  constructor(toolName) {
    this.toolName = toolName;
  }

  log(action, status, details = {}) {
    console.log(`[${this.toolName}] ${action}: ${status}`, details);
    // Optionally send to backend endpoint if available
  }

  success(action, details) { return this.log(action, 'success', details); }
  error(action, details) { return this.log(action, 'error', details); }
  info(action, details) { return this.log(action, 'info', details); }
}

const logger = new BrowserLogger('launcher-tool');
logger.info('page-loaded', { version: '1.0' });
```

## Understanding Test Results

### Test Output Example

```
🧪 Test Runner Starting...
🔍 Discovering tools in /root/.openclaw/workspace/tools...

📄 Testing HTML: launcher.html
✓ OK     launcher.html

📄 Testing Python: network-scanner.py
✓ OK     network-scanner.py

📊 SUMMARY
   Total Tests: 4
   ✓ Passed:    4 (100%)
   ✗ Failed:    0
   ⚠️  Warnings: 0

✓ ALL TESTS PASSED
```

### Interpreting Results

- ✓ **PASS** - Tool passed all checks
- ✗ **FAIL** - Tool has errors that must be fixed
- ⚠️ **WARN** - Tool has warnings but still passes
- Exit code `0` - All tests passed
- Exit code `1` - One or more tests failed

## Log Files & Analysis

### Log File Locations

Logs are created in: `/root/.openclaw/workspace/logs/YYYY-MM-DD/`

- **General Log:** Contains all events (info, debug, success, errors, warnings)
- **Error Log:** Contains only errors (quick scanning)
- **Test Report:** Human-readable summary

### Reading Logs

#### View all events from today
```bash
cat logs/$(date +%Y-%m-%d)/*-general.log
```

#### View only errors
```bash
cat logs/$(date +%Y-%m-%d)/*-error.log
```

#### Find specific tool's logs
```bash
grep '"toolName":"launcher"' logs/$(date +%Y-%m-%d)/*.log
```

#### Count successes/failures
```bash
grep '"status":"success"' logs/$(date +%Y-%m-%d)/*.log | wc -l
grep '"status":"error"' logs/$(date +%Y-%m-%d)/*.log | wc -l
```

#### Parse and display errors nicely
```bash
cat logs/$(date +%Y-%m-%d)/*-error.log | jq '.action, .details'
```

### Log Entry Format

Each log line is JSON:

```json
{
  "timestamp": "2026-03-20T01:34:45.123Z",
  "toolName": "launcher",
  "level": "info",
  "action": "user-clicked-button",
  "status": "success",
  "details": { "buttonId": "submit" },
  "pid": 12345
}
```

## Common Workflows

### Workflow 1: Before Deployment

```bash
cd /root/.openclaw/workspace

# Run all tests
node tests/test-runner.js

# Check for errors
if [ $? -eq 0 ]; then
  echo "✓ All tests passed - safe to deploy"
  git push
else
  echo "✗ Tests failed - fix issues first"
  exit 1
fi
```

### Workflow 2: Continuous Testing

```bash
# Run tests every 5 minutes
while true; do
  node tests/test-runner.js > /dev/null 2>&1
  if [ $? -ne 0 ]; then
    echo "🚨 Tests failed at $(date)"
    mail -s "Tool Test Failure" admin@example.com
  fi
  sleep 300
done
```

### Workflow 3: Log Analysis

```bash
#!/bin/bash
# Daily error report

TODAY=$(date +%Y-%m-%d)
ERRORS=$(grep '"status":"error"' logs/$TODAY/*-error.log 2>/dev/null | wc -l)

if [ $ERRORS -gt 0 ]; then
  echo "Daily Error Report - $TODAY"
  echo "Total Errors: $ERRORS"
  echo ""
  cat logs/$TODAY/*-error.log | jq '.action, .details' | head -20
else
  echo "✓ No errors today!"
fi
```

### Workflow 4: Performance Monitoring

```bash
# Monitor tool performance over time
TODAY=$(date +%Y-%m-%d)

# Average response time
cat logs/$TODAY/*-general.log | \
  jq 'select(.action | contains("complete")) | .details.durationMs' | \
  jq -s 'add/length'

# Slowest operations
cat logs/$TODAY/*-general.log | \
  jq 'select(.details.durationMs > 1000)' | \
  jq '{action, durationMs: .details.durationMs}' | \
  sort -k2 -nr | head -5
```

## Troubleshooting

### Tests won't run

```bash
# Check Node.js
node --version

# Check Python
python3 --version

# Check permissions
ls -l tests/test-runner.*
chmod +x tests/test-runner.sh
```

### No log files created

```bash
# Check directory exists
ls -la logs/

# Create if missing
mkdir -p logs/$(date +%Y-%m-%d)

# Check write permissions
touch logs/test.txt && rm logs/test.txt
```

### Logs not appearing in tool

```bash
# Check logger is initialized
grep "baseLogDir\|toolName" your-tool.js

# Check log directory in logs/
ls -la logs/$(date +%Y-%m-%d)/

# Manually verify logging works
node -e "
  const Logger = require('./logs/lib/logger');
  const logger = new Logger({baseLogDir: './logs', toolName: 'test'});
  logger.success('test', {status: 'ok'});
"
```

### Want to clean up old logs?

```bash
# Remove logs older than 30 days
find logs -type d -mtime +30 -exec rm -rf {} \;

# Archive first week of month
tar -czf logs-archive-2026-03-1to7.tar.gz logs/2026-03-0{1..7}
rm -rf logs/2026-03-0{1..7}
```

## Next Steps

1. ✅ **Review the frameworks**
   - `tests/README.md` - Testing details
   - `logs/README.md` - Logging details
   - `logs/references/LOGGER-INTEGRATION.md` - Integration examples

2. ✅ **Run your first tests**
   ```bash
   node tests/test-runner.js
   ```

3. ✅ **Add logging to your tools**
   - Use `tests/example-tool-with-logging.js` as a template
   - Follow patterns in `logs/references/LOGGER-INTEGRATION.md`

4. ✅ **Set up monitoring**
   - Create a cron job to run tests
   - Alert on test failures
   - Archive logs regularly

5. ✅ **Integrate with CI/CD**
   - GitHub Actions workflow
   - Pre-deployment tests
   - Automated log analysis

## Support

For detailed information:
- **Testing:** See `tests/README.md`
- **Logging:** See `logs/README.md`
- **Integration:** See `logs/references/LOGGER-INTEGRATION.md`
- **Example:** See `tests/example-tool-with-logging.js`

## Summary

- 📝 **Tests** validate HTML, JS, Python syntax and structure
- 📊 **Logs** track all tool events with timestamps and context
- 🔄 **Rotation** happens automatically (daily)
- ✅ **Exit codes** make it CI/CD friendly
- 📈 **Analysis** is easy with JSON format

You're ready to go! 🚀
