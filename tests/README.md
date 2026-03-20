# Testing Framework

Comprehensive testing framework for all tools in the workspace.

## Quick Start

### Run All Tests

Using Node.js:
```bash
node /root/.openclaw/workspace/tests/test-runner.js
```

Using Bash:
```bash
bash /root/.openclaw/workspace/tests/test-runner.sh
```

### Test Specific Tools

```bash
# Node.js
node tests/test-runner.js launcher.html
node tests/test-runner.js network-mapper.html network-scanner.py

# Bash
bash tests/test-runner.sh launcher.html
bash tests/test-runner.sh network-mapper.html network-scanner.py

# By full path
node tests/test-runner.js /root/.openclaw/workspace/tools/launcher.html
```

## What Gets Tested

### HTML Files
- ✓ File exists and is readable
- ✓ Has DOCTYPE declaration
- ✓ Has required tags (`<html>`, `<head>`, `<body>`, `<title>`)
- ✓ Tag balance detection (opens vs closes)
- ⚠️ Warns about potential error logging

### JavaScript Files
- ✓ File exists and is readable
- ✓ Valid JavaScript syntax (using Node.js parser)
- ✓ Detects require/import statements
- ✓ Checks for exports

### Python Files
- ✓ File exists and is readable
- ✓ Valid Python syntax (using py_compile)
- ✓ Checks for shebang line
- ✓ Detects imports and main guard

## Test Results

Tests output results in multiple formats:

### 1. Console Output
```
📊 SUMMARY
   Total Tests: 4
   ✓ Passed:    4 (100%)
   ✗ Failed:    0
   ⚠️  Warnings: 4

📋 DETAILED RESULTS
📄 /path/to/file.html
   Status: ✓ PASS
   Checks:
     fileSize: 34153
     lines: 983
   ⚠️  Warnings:
     - Tag mismatch detected: 93 opening, 81 closing
```

### 2. Log Files

Tests generate structured JSON logs in:
- `logs/YYYY-MM-DD/YYYY-MM-DD-general.log` - All test events
- `logs/YYYY-MM-DD/YYYY-MM-DD-error.log` - Errors only
- `logs/YYYY-MM-DD/test-report.txt` - Human-readable report

**Log Entry Format:**
```json
{
  "timestamp": "2026-03-20T01:34:45.123Z",
  "toolName": "test-runner",
  "level": "info",
  "action": "validate-html",
  "status": "success",
  "details": { "file": "launcher.html", "warnings": 1 },
  "pid": 12345
}
```

### 3. Exit Code
- `0` = All tests passed
- `1` = One or more tests failed

## File Structure

```
tests/
├── README.md                    ← You are here
├── test-runner.js               ← Node.js test runner
├── test-runner.sh               ← Bash test runner
├── validators.js                ← Validation logic (HTML, JS, Python)
└── integration-test.js           ← Integration tests (optional)

logs/
├── lib/
│   └── logger.js                ← Logging framework
├── references/
│   └── LOGGER-INTEGRATION.md     ← How to use logger in tools
└── YYYY-MM-DD/                  ← Daily log directories
    ├── YYYY-MM-DD-general.log
    ├── YYYY-MM-DD-error.log
    └── test-report.txt
```

## Using the Logging Framework in Your Tools

See `/root/.openclaw/workspace/logs/references/LOGGER-INTEGRATION.md` for detailed instructions.

### Quick Example (Node.js)

```javascript
const Logger = require('../logs/lib/logger');
const path = require('path');

const logger = new Logger({
  baseLogDir: path.join(__dirname, '../logs'),
  toolName: 'my-tool',
});

logger.success('tool-started', { version: '1.0' });
logger.error('operation-failed', { reason: 'timeout' });
```

### Quick Example (Python)

```python
import json
import os
from datetime import datetime

class Logger:
    def __init__(self, tool_name):
        self.tool_name = tool_name
        self.base_log_dir = os.path.join(os.path.dirname(__file__), '../logs')
    
    def log(self, action, status, details=None):
        entry = {
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'toolName': self.tool_name,
            'action': action,
            'status': status,
            'details': details or {},
        }
        print(f"[{self.tool_name}] {action}: {status}")

logger = Logger('my-tool')
logger.log('tool-started', 'success', {'version': '1.0'})
```

## Analyzing Logs

### View all test logs
```bash
cat logs/2026-03-19/*.log
```

### View only errors
```bash
cat logs/2026-03-19/*-error.log
```

### Count test results
```bash
grep '"status":"success"' logs/2026-03-19/*.log | wc -l
grep '"status":"error"' logs/2026-03-19/*.log | wc -l
```

### Parse logs as JSON
```javascript
const fs = require('fs');
const logs = fs.readFileSync('logs/2026-03-19/2026-03-19-general.log', 'utf8')
  .split('\n')
  .filter(line => line.trim())
  .map(line => JSON.parse(line));

console.log(logs);
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Test Tools

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: apt-get install -y python3
      - run: node tests/test-runner.js
      - name: Upload test logs
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-logs
          path: logs/
```

### Cron Job Example

```bash
#!/bin/bash
# Run tests daily and email results

cd /root/.openclaw/workspace

node tests/test-runner.js > /tmp/test-results.txt 2>&1
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  mail -s "⚠️ Tool Tests Failed" admin@example.com < /tmp/test-results.txt
fi

exit $EXIT_CODE
```

## Troubleshooting

### Tests won't run
```bash
# Check Node.js is installed
node --version

# Check Python is installed
python3 --version

# Check permissions
ls -l tests/test-runner.*
chmod +x tests/test-runner.sh
```

### Logs not appearing
```bash
# Check log directory exists
ls -la logs/

# Check today's date format
date +%Y-%m-%d

# Ensure write permissions
touch logs/test.txt && rm logs/test.txt
```

### False positives on HTML tag warnings
The tag validator counts opening vs closing tags. Self-closing tags like `<br>`, `<img>`, `<input>` won't be counted as closing tags, so you may see warnings. This is expected behavior and not a failure.

## Development

### Add a new validator

Edit `tests/validators.js`:

```javascript
static validateNewFormat(filePath) {
  const results = {
    file: filePath,
    passed: true,
    errors: [],
    warnings: [],
    checks: {},
  };

  // Your validation logic here

  return results;
}

// Update auto-detect
static validate(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  if (ext === '.xyz') {
    return this.validateNewFormat(filePath);
  }
  // ...
}
```

### Run integration tests (Node.js only)

```bash
node tests/integration-test.js
```

## Performance

- Testing 4 tools typically takes **< 500ms**
- Log rotation is automatic (daily)
- Old logs (>30 days) can be cleaned up: `Logger.cleanupOldLogs(logDir, 30)`

## Best Practices

1. **Run tests before deployment**
   ```bash
   node tests/test-runner.js || exit 1
   git push
   ```

2. **Add logging to all new tools**
   - See LOGGER-INTEGRATION.md for examples
   - Log user actions and errors
   - Don't log sensitive data

3. **Monitor logs regularly**
   ```bash
   tail -f logs/$(date +%Y-%m-%d)/*-general.log
   ```

4. **Archive old logs**
   ```bash
   tar -czf logs-archive-2026-01.tar.gz logs/2026-01-*/
   rm -rf logs/2026-01-*/
   ```

## Support

For issues:
1. Check test-report.txt in the logs directory
2. Review individual tool error logs
3. Run tests with verbose output: `DEBUG=* node tests/test-runner.js`
