# Logging Best Practices Guide

**For:** Irvin's Tech & Electrical Services Business  
**Purpose:** Security & operational logging framework  
**Author:** Axiom (TechSupport)

---

## 1. What to Log

### Authentication & Access
- **Login attempts** — success/failure, timestamp, source IP, username
- **Password changes** — who, when, from where
- **SSH connections** — key-based vs password, interactive vs command
- **VPN connections** — connect/disconnect events, IP allocation
- **MFA events** — enrollment, verification failures

### System Events
- **Service start/stop/restart** — especially critical services (nginx, sshd, docker, databases)
- **System boot/shutdown** — unexpected reboots are red flags
- **Cron job execution** — success/failure with output capture
- **Package updates** — what changed, when
- **Configuration changes** — especially firewall rules, user additions

### Network
- **Firewall blocks** — dropped packets, rejected connections (log the attempt, not every packet)
- **DNS queries** — from internal clients (useful for incident response)
- **Unusual outbound connections** — data exfiltration detection
- **Port scans** — inbound

### Security Events
- **Failed authentication** — repeated failures = potential brute force
- **Privilege escalation** — sudo usage, su attempts
- **File integrity changes** — /etc/passwd, /etc/shadow, config files
- **Malware/prevention events** — from antivirus, fail2ban, OSSEC
- **Kernel module loading** — unexpected kernel modules

### Application Logs
- **Errors and exceptions** — stack traces, error codes
- **Business events** — client interactions, transactions (if applicable)
- **API calls** — especially if exposing external APIs for clients
- **Database queries** — slow queries, failed connections

### For Client Work (MSP/MSSP)
- **Client system access** — who accessed what, when
- **Changes made** — documented in ticketing, linked in logs
- **Data handled** — backups, transfers, client data access

---

## 2. Log Retention

### Minimum Retention Policy

| Log Type | Short-Term (Hot) | Medium-Term (Warm) | Long-Term (Cold/Archive) |
|----------|------------------|--------------------|--------------------------|
| Security events | 30 days | 12 months | 2 years |
| Authentication | 30 days | 12 months | 2 years |
| Network flow | 7 days | 90 days | 1 year |
| System logs | 30 days | 6 months | 1 year |
| Application logs | 14 days | 90 days | 6 months |
| Backups | N/A | 30 days | 90 days (offsite) |

### Storage Sizing Estimate

**Rule of thumb:** Plan for 1-5GB/day for a small business with 10-50 systems. Adjust based on:
- Log volume (more systems = more logs)
- Verbosity level (debug vs error only)
- Compression (typically 10:1 ratio)

### Where to Store

- **Hot (local):** SSD/NVMe — for real-time analysis
- **Warm (network):** NAS/SAN — indexed, searchable
- **Cold (offsite):** Cloud storage (S3, B2) or cold storage — cheap, immutable

### Critical Rules

1. **Immutable logs** — once written, logs should be append-only. Use WORM (write once, read many) where possible
2. **Integrity verification** — hash logs at write time, verify regularly
3. **Offsite copy** — critical logs should exist in two physical locations
4. **Clock sync** — all systems NTP-synced to same time source (UTC preferred, convert for display)

---

## 3. Tools to Use

### Centralized Logging (The Stack)

| Tool | Use Case | Complexity |
|------|----------|------------|
| **Linux: journald + rsyslog** | Native, low-overhead local logging | Low |
| **Loki + Grafana** | Modern, lightweight, excellent visualizations | Medium |
| **ELK Stack (Elasticsearch, Logstash, Kibana)** | Full-featured, scales well | High |
| **Wazuh** | Security-focused, includes SIEM capabilities | Medium-High |
| **Splunk** | Enterprise, but expensive | High |

**Recommendation for small-to-medium:**
- **Primary:** Loki + Grafana (cost-effective, good enough)
- **Security add-on:** Wazuh (free, powerful)
- **Cloud alternative:** AWS CloudWatch, Datadog

### Log Collection Agents

- **Filebeat** — lightweight, ships to Elasticsearch/Loki
- **Fluentd/Fluent Bit** — container-friendly
- **Syslog** — classic, reliable

### Analysis & Search

- **grep/awk/sed** — CLI for quick local analysis
- **Kibana/Grafana** — visual exploration
- **Rapid7 InsightIDR** — managed SIEM (if budget allows)

### For Client Systems (MSP)

- **Tactical RMM** or **Syncro** — remote monitoring with logging
- **Horizon** or **Atera** — similar RMM platforms
- **Custom:** Loki on a central collector + Grafana dashboards

### Log Shipping to Cloud (If Applicable)

```bash
# Example: Ship logs to Loki via Filebeat
filebeat.inputs:
  - type: log
    paths:
      - /var/log/auth.log
    fields:
      type: auth

output.logstash:
  hosts: ["loki.internal:5044"]
```

---

## 4. Alerting

### What to Alert On (Prioritized)

#### Critical (Immediate Notification)
- **Successful root/sudo login** from unexpected source
- **Multiple failed logins** (5+ in 10 minutes) from same IP
- **Firewall rule deleted** — especially default-deny rules
- **Malware detected** — any detection
- **Unusual outbound traffic** — large data transfers, unexpected destinations
- **Backup failure** — especially if not caught for 24h+

#### High (Within 1 Hour)
- **Service down** — critical services (nginx, databases, VPN)
- **Disk space critical** — >90% on any monitored system
- **New user account created** — especially privileged accounts
- **SSH key added** to authorized_keys
- **Certificate expiring** — within 14 days

#### Medium (Daily Digest OK)
- **Failed cron jobs** — repeated failures
- **Repeated authentication failures** — same user, not quite brute force
- **Unusual login times** — outside business hours (configurable)
- **Password approaching expiration** — for service accounts

### Alerting Tools

| Tool | Best For | Cost |
|------|----------|------|
| **Alertmanager (Prometheus)** | Metrics-based alerts | Free |
| **Grafana Alerting** | Visual, flexible, integrates with Loki | Free |
| **PagerDuty** | On-call rotation, escalations | Paid (free tier exists) |
| **OpsGenie** | Similar to PagerDuty | Paid |
| **Telegram/Slack webhooks** | Free, simple notification | Free |
| **Email** | Basic, but often ignored | Free |
| **SMS (Twilio)** | Urgent when email won't cut it | Paid |

### Recommended Setup

1. **Primary:** Grafana Alerting → Telegram/Slack channel
2. **Escalation:** PagerDuty for critical (if 24/7 support)
3. **Keep it simple:** Over-alerting causes fatigue. Start with critical only, expand as you tune.

### Example Alert Rule (Grafana + Loki)

```yaml
groups:
  - name: security_alerts
    rules:
      - alert: MultipleFailedLogins
        expr: count_over_time({job="sshd"} |= "Failed password" [5m]) > 5
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Multiple SSH login failures detected"
          description: "More than 5 failed attempts in 5 minutes from {{ $labels.source_ip }}"
```

---

## Quick Start Checklist

- [ ] Enable auth/log/messages logging on all systems
- [ ] Configure NTP on all systems (UTC)
- [ ] Ship logs to central collector (Loki recommended)
- [ ] Set up Grafana dashboards for visibility
- [ ] Configure alerts for critical events (start small)
- [ ] Document log retention policy
- [ ] Test alerting (don't wait for a real incident)
- [ ] Review logs weekly (even briefly)

---

## Irvin's Business Context

Given your combo of cybersecurity + DevOps + electrical services:

- **For client MSP work:** Use a centralized RMM with built-in logging (Tactical RMM, Syncro)
- **For your own infrastructure:** Loki + Grafana + Wazuh gives enterprise-grade at free cost
- **For client MSSP:** Consider Wazuh as your backbone — it's free and full-featured

This guide scales from solo operation to 50+ client environments. Adjust verbosity and retention based on compliance requirements (HIPAA, PCI-DSS, etc.) if handling regulated data.

---

*Last updated: 2026-03-18*
