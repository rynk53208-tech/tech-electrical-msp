# SSL Certificate Monitor — Integration Guide

**Purpose:** Connect SSL Monitor to your existing MSP workflows, monitoring platforms, and alerting systems.

---

## 🔄 Integration Options

### Option 1: Standalone Browser App (Simplest)
**Setup Time:** 5 minutes  
**Complexity:** Low  
**Real Data:** Simulated (demo mode)

**How:**
1. Open `index.html` in browser
2. Add domains manually
3. Click "Check All" weekly
4. Export reports for tickets

**Pros:**
- No server needed
- Zero dependencies
- Works offline
- Privacy-respecting

**Cons:**
- Can't run headless
- No email alerts
- No API
- Data stuck in browser

---

### Option 2: Automated Batch Checks (Recommended)
**Setup Time:** 15 minutes  
**Complexity:** Low  
**Real Data:** Yes (via openssl)

**How:**

#### 2a. Run check.sh manually
```bash
# Single domain
./check.sh example.com 443 json

# Batch from file
echo "example.com" > domains.txt
echo "api.example.com 8443" >> domains.txt
./check.sh domains.txt json > results.json

# Output certs to CSV
./check.sh domains.txt 443 csv > certs.csv
```

#### 2b. Schedule with cron
```bash
# Every day at 2 AM
0 2 * * * cd /root/.openclaw/workspace/memory/tools/ssl-monitor && bash check.sh /var/local/ssl-domains.txt json > /tmp/ssl-results.json 2>&1

# Every Monday 9 AM
0 9 * * 1 cd /root/.openclaw/workspace/memory/tools/ssl-monitor && bash check.sh /var/local/ssl-domains.txt json > /var/log/ssl-check-$(date +\%Y\%m\%d).json 2>&1
```

#### 2c. Import results into dashboard
```javascript
// Get JSON from check.sh result
const results = fetch('/path/to/results.json').then(r => r.json());

// Merge with existing domains in browser
results.forEach(cert => {
  const domain = domains.find(d => d.domain === cert.domain && d.port === cert.port);
  if (domain) {
    domain.expiry = cert.expiry;
    domain.issued = cert.issued;
    domain.certCA = cert.ca;
    domain.certOrg = cert.issuer;
    domain.lastChecked = cert.checked;
  }
});
// Save to localStorage
localStorage.setItem('ssl_monitor_domains', JSON.stringify(domains));
```

**Workflow:**
```
check.sh (cron) → results.json → import via dashboard → alerts
```

**Pros:**
- Real TLS certificate queries
- Automated scheduling
- Offline processing
- Lightweight

**Cons:**
- Manual import step
- No continuous monitoring
- Cron job to maintain

---

### Option 3: Node.js/Python Backend API
**Setup Time:** 30 minutes  
**Complexity:** Medium  
**Real Data:** Yes

**How:** Deploy a simple proxy server that:
1. Accepts `/api/check?domain=example.com` requests
2. Queries TLS via openssl
3. Returns JSON with cert details
4. Dashboard hits API in real-time

#### Node.js Example
```javascript
const express = require('express');
const { execSync } = require('child_process');
const app = express();

app.get('/api/check', (req, res) => {
  const domain = req.query.domain;
  const port = req.query.port || 443;
  
  try {
    const result = execSync(`./check.sh ${domain} ${port} json`, { 
      cwd: __dirname,
      encoding: 'utf-8'
    });
    res.json(JSON.parse(result));
  } catch (e) {
    res.json({ error: e.message, domain });
  }
});

app.listen(3000, () => console.log('SSL Monitor API running on :3000'));
```

#### Modify Dashboard
```javascript
// In index.html, replace simulateCertCheck() with:
async function checkSingleDomain(id) {
  const idx = domains.findIndex(d => d.id === id);
  if (idx < 0) return;
  domains[idx].checking = true;
  renderAll();
  
  try {
    const res = await fetch(`/api/check?domain=${domains[idx].domain}&port=${domains[idx].port}`);
    const cert = await res.json();
    domains[idx] = { ...domains[idx], ...cert };
  } catch (e) {
    console.error(e);
  }
  
  domains[idx].checking = false;
  saveData();
  renderAll();
}
```

**Workflow:**
```
dashboard → /api/check → openssl → JSON → dashboard
```

**Pros:**
- Real-time checks
- Centralized
- Easy scaling
- No client-side parsing

**Cons:**
- Requires server
- Network overhead
- TLS queries block requests

---

### Option 4: Monitoring Platform Integration
**Setup Time:** 30-60 minutes  
**Complexity:** High  
**Real Data:** Yes

**Supported Platforms:**
- Nagios/Icinga
- Zabbix
- Datadog
- New Relic
- Prometheus
- Grafana

#### Nagios/Icinga Example
```bash
#!/bin/bash
# /usr/lib/nagios/plugins/check_ssl_expiry.sh
DOMAIN=$1
PORT=${2:-443}

JSON=$(timeout 10 openssl s_client -connect $DOMAIN:$PORT </dev/null 2>&1 | \
       openssl x509 -noout -dates -subject 2>/dev/null)

EXPIRY=$(echo "$JSON" | grep notAfter | cut -d= -f2)
DAYS_LEFT=$(echo "$(date -d "$EXPIRY" +%s) - $(date +%s)" | bc | awk '{print int($1/86400)}')

if [ $DAYS_LEFT -lt 7 ]; then
  echo "CRITICAL: $DOMAIN expires in $DAYS_LEFT days | cert_expiry_days=$DAYS_LEFT;7;1"
  exit 2
elif [ $DAYS_LEFT -lt 30 ]; then
  echo "WARNING: $DOMAIN expires in $DAYS_LEFT days | cert_expiry_days=$DAYS_LEFT;30;7"
  exit 1
else
  echo "OK: $DOMAIN expires in $DAYS_LEFT days | cert_expiry_days=$DAYS_LEFT;30;7"
  exit 0
fi
```

#### Datadog Example
```yaml
# /etc/datadog-agent/conf.d/ssl_check.yaml
instances:
  - domains:
      - example.com:443
      - api.example.com:8443
    collect_certificate_details: true
    days_warning: 30
    days_critical: 7
```

**Workflow:**
```
monitoring agent → check.sh/plugin → metrics → dashboard → alerts
```

**Pros:**
- Unified monitoring
- Advanced alerting
- Historical trends
- Team collaboration

**Cons:**
- Platform-specific
- Requires licensing
- More complex setup

---

### Option 5: CI/CD Pipeline Integration
**Setup Time:** 20 minutes  
**Complexity:** Low-Medium

#### GitHub Actions Example
```yaml
name: SSL Certificate Check
on:
  schedule:
    - cron: '0 2 * * *'  # Daily 2 AM
  workflow_dispatch:

jobs:
  check-certs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run SSL checks
        run: |
          for domain in example.com api.example.com; do
            openssl s_client -connect $domain:443 -showcerts < /dev/null 2>/dev/null | \
            openssl x509 -noout -dates
          done > certs-$(date +%Y%m%d).txt
      
      - name: Archive results
        uses: actions/upload-artifact@v3
        with:
          name: ssl-checks
          path: certs-*.txt
```

#### GitLab CI Example
```yaml
ssl_check:
  schedule:
    - cron: "0 2 * * *"
  script:
    - bash check.sh domains.txt json > results.json
    - curl -X POST https://webhook.example.com -d @results.json
```

**Workflow:**
```
scheduled pipeline → check.sh → webhook → Slack/email
```

---

### Option 6: Webhook Alerting
**Setup Time:** 10 minutes  
**Complexity:** Low

#### Slack Integration
```bash
#!/bin/bash
# When cert enters critical status, post to Slack

DOMAIN="example.com"
EXPIRY=$(openssl s_client -connect $DOMAIN:443 </dev/null 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2)
DAYS_LEFT=$(echo "$(date -d "$EXPIRY" +%s) - $(date +%s)" | bc | awk '{print int($1/86400)}')

if [ $DAYS_LEFT -le 7 ]; then
  curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL \
    -H 'Content-Type: application/json' \
    -d "{\"text\":\"🔴 SSL CRITICAL: $DOMAIN expires in $DAYS_LEFT days ($EXPIRY)\"}"
fi
```

#### Email Notification
```bash
#!/bin/bash
# Email when critical
if [ $DAYS_LEFT -le 7 ]; then
  echo "Critical: $DOMAIN expires in $DAYS_LEFT days" | \
  mail -s "SSL Alert: $DOMAIN" ops@company.com
fi
```

#### PagerDuty
```bash
curl -X POST https://events.pagerduty.com/v2/enqueue \
  -H 'Content-Type: application/json' \
  -d '{
    "routing_key": "YOUR_KEY",
    "event_action": "trigger",
    "payload": {
      "summary": "SSL Certificate Critical",
      "severity": "critical",
      "source": "'$DOMAIN'",
      "custom_details": {"expires": "'$EXPIRY'", "days_left": '$DAYS_LEFT'}
    }
  }'
```

---

## 🔗 Recommended Architecture

### For MSP Operations
```
check.sh (daily cron)
    ↓
results.json
    ↓
dashboard (import + display)
    ↓
team review (weekly)
    ↓
renewal actions
```

### For Enterprise
```
monitoring platform (Datadog/Zabbix)
    ↓
check plugin (openssl)
    ↓
metrics + alerts
    ↓
dashboards
    ↓
Slack/PagerDuty escalation
    ↓
runbook + remediation
```

### For Development
```
CI/CD pipeline (GitHub/GitLab)
    ↓
schedule check.sh
    ↓
webhook → Slack
    ↓
auto-update DNS / rotate certs
    ↓
verification
```

---

## 📋 Deployment Checklist

- [ ] Choose integration option (1-6 above)
- [ ] Deploy backend (if needed)
- [ ] Test single domain check
- [ ] Configure cron/scheduler
- [ ] Set up alerting (Slack, email, PagerDuty)
- [ ] Import initial domain list
- [ ] Run first check manually
- [ ] Verify dashboard updates
- [ ] Document runbook (who gets alerted, remediation steps)
- [ ] Train team on tool
- [ ] Monitor logs for errors (1 week)
- [ ] Automate renewal process (optional)

---

## 🎯 Next Steps

1. **Start simple:** Option 1 (browser) for first week
2. **Add automation:** Option 2 (check.sh + cron) after proving value
3. **Scale up:** Option 4 (monitoring platform) if >50 domains
4. **Alert team:** Option 6 (webhooks) for notifications

---

**Status:** ✅ Integration Ready  
**Supported Platforms:** Nagios, Zabbix, Datadog, GitHub, GitLab, Slack, email, PagerDuty
