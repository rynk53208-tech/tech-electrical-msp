# Monitoring & Alerting Guide

**For Irvin's Tech Business (MSP/MSSP Services)**  
*Internal Guide for Client Security Operations*

---

## Overview

This guide establishes monitoring and alerting standards for managed clients. Effective monitoring = early threat detection + faster response = fewer incidents & higher client retention.

**Target Audience:** Internal security operations, tier 1/2 support technicians

---

## 1. What to Monitor

### 1.1 Network Layer

| Asset | What to Monitor | Why It Matters |
|-------|-----------------|----------------|
| **Firewall** | Connection counts, blocked attempts, bandwidth, CPU/memory | Detect DDoS, brute force, policy violations |
| **VPN** | Concurrent connections, failed auth, session duration | Identify unauthorized access attempts |
| **Wi-Fi** | Client count, rogue APs, throughput | Spot unauthorized devices, performance issues |
| **DNS** | Query volume, blocked domains, resolution failures | Detect data exfiltration, malware callbacks |
| **Switch/Router** | Port status, VLAN changes, broadcast storms | Hardware issues, unauthorized changes |

### 1.2 Endpoint Layer

| Asset | What to Monitor | Why It Matters |
|-------|-----------------|----------------|
| **Workstations** | CPU, disk, memory utilization; process anomalies; USB inserts | Resource issues, cryptominers, data theft |
| **Servers** | All above + service status, event logs, login attempts | System health, unauthorized access |
| **Antivirus/EDR** | Threat detections, quarantine actions, signature age | Active malware, outdated protection |
| **Patch Status** | Missing updates by severity, compliance % | Exploit prevention, compliance |

### 1.3 Cloud/SaaS (If Applicable)

| Asset | What to Monitor | Why It Matters |
|-------|-----------------|----------------|
| **Microsoft 365** | Failed logins, privileged role changes, mail forwarding rules | Account compromise, data exfiltration |
| **Google Workspace** | Same as M365 + suspicious OAuth grants | Same |
| **AWS/Azure** | API calls, IAM changes, unusual traffic, cost anomalies | Misconfigurations, compromise |
| **SaaS Apps** | Login anomalies, data exports, permission changes | Shadow IT, insider threat |

### 1.4 Security Tools

| Asset | What to Monitor | Why It Matters |
|-------|-----------------|----------------|
| **SIEM** | Ingestion rate, rule matches, alert fatigue metrics | Tool health, threat trends |
| **Backup System** | Job success/failure, backup age, restore test results | Ransomware recovery readiness |
| **Authentication** | Lockouts, password resets, MFA bypass attempts | Account takeover attempts |

---

## 2. Alert Thresholds

### 2.1 Severity Tiers

| Severity | Definition | Response Time |
|----------|------------|---------------|
| **CRITICAL** | Active breach, ransomware, data exfiltration, service down | **Immediate** (<15 min) |
| **HIGH** | Malware detected, multiple failed logins, suspicious process | **Within 1 hour** |
| **MEDIUM** | Missing critical patches, unusual network traffic, failed backup | **Within 4 hours** |
| **LOW** | Minor policy violation, minor performance degradation | **Next business day** |

### 2.2 Specific Thresholds

#### Network Alerts

| Metric | Warning | Critical |
|--------|---------|----------|
| Firewall blocked attempts | >100/min | >500/min |
| VPN failed auth | 5 failed in 10 min | 15 failed in 10 min |
| DNS query volume spike | >2x baseline | >5x baseline |
| Bandwidth utilization | >80% sustained | >95% |
| New unknown device on network | 1 detection | N/A |

#### Endpoint Alerts

| Metric | Warning | Critical |
|--------|---------|----------|
| CPU usage | >90% for 5+ min | >95% for 2+ min |
| Disk usage | >85% | >95% |
| Failed login attempts (local) | 10 in 30 min | 30 in 30 min |
| New service installed | N/A | Any new service |
| PowerShell execution | N/A | >5 scripts/min |
| USB device inserted | 1 on sensitive system | Any USB |
| Antivirus disabled | N/A | Any disable |

#### Cloud Alerts

| Metric | Warning | Critical |
|--------|---------|----------|
| Failed M365 logins | 10 in 15 min | 25 in 15 min |
| New global admin added | N/A | Any new global admin |
| Mail forwarding created | N/A | Any auto-forward |
| Password changed (privileged) | N/A | After hours |
| Impossible travel | N/A | Any detection |
| Data bulk download | N/A | >1GB in 1 hour |

#### Backup Alerts

| Metric | Warning | Critical |
|--------|---------|----------|
| Backup job failed | Any failure | N/A |
| Last successful backup | >48 hours | >72 hours |
| Restore test | N/A | Any failed test |

---

## 3. Tools to Use

### 3.1 Recommended Tool Stack

| Category | Tool | Use Case | Notes |
|----------|------|----------|-------|
| **SIEM** | Microsoft Sentinel / Splunk / Wazuh | Centralized log aggregation & correlation | Wazuh = open-source, budget-friendly |
| **EDR** | Microsoft Defender for Endpoint / CrowdStrike / SentinelOne | Endpoint detection & response | MDE included in M365 Business Premium |
| **NDR** | Zeek / NetworkMiner / Graylog | Network traffic analysis | Open-source options available |
| **Vulnerability Scanner** | OpenVAS / Qualys / Tenable | Automated vulnerability scanning | OpenVAS = free |
| **Backup Monitoring** | Veeam / Acronis / Duplicati | Backup job monitoring | Most have built-in alerting |
| **Cloud Monitoring** | Native cloud tools + CloudTrail | Cloud posture & activity | Enable logging everywhere |
| **Password Monitoring** | HaveIBeenPwned API | Check client domains for breaches | Free tier available |
| **Uptime Monitoring** | UptimeRobot / Pingdom | External service availability | Free tier works for small ops |

### 3.2 Budget Options (SMB Clients)

| Category | Free/Tier-1 Option |
|----------|---------------------|
| SIEM | Wazuh (self-hosted), Splunk Free (500MB/day) |
| EDR | Microsoft Defender for Business |
| Vulnerability | OpenVAS, Nmap scripts |
| Backup | Duplicati, Windows Server Backup |
| Monitoring | Zabbix (open-source), Prometheus + Grafana |
| Logging | Graylog (free tier), ELK (self-hosted) |

### 3.3 Tool Configuration Priorities

1. **Must have:** EDR + Backup monitoring + Firewall logs + Cloud audit logs
2. **Should have:** SIEM for correlation, vulnerability scanning (monthly)
3. **Nice to have:** NDR, dedicated logging infrastructure, SOAR

---

## 4. Response Procedures

### 4.1 Incident Response Workflow

```
┌─────────────────────────────────────────────────────────────┐
│  ALERT TRIGGERED                                            │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  1. TRIAGE (5 min)                                          │
│  • Verify alert is real (not false positive)                │
│  • Determine severity                                       │
│  • Identify affected systems/users                          │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  2. CONTAIN (Immediate if critical)                         │
│  • Isolate affected endpoint (network disable)              │
│  • Disable compromised account                              │
│  • Block malicious IP/domain at firewall                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  3. INVESTIGATE                                             │
│  • Review logs (SIEM, EDR, firewall)                        │
│  • Determine scope (what else is affected?)                 │
│  • Identify root cause                                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  4. ERADICATE & RECOVER                                     │
│  • Remove malware / reimage if needed                       │
│  • Reset compromised passwords                              │
│  • Restore from clean backup if needed                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  5. DOCUMENT & COMMUNICATE                                  │
│  • Document timeline, actions, findings                     │
│  • Notify client (per SLA)                                  │
│  • Provide recommendations                                  │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Severity-Specific Procedures

#### CRITICAL (Active Incident)

1. **Call** the client immediately (not just email)
2. Isolate affected systems from network immediately
3. Disable compromised accounts
4. Document everything in real-time
5. Engage external help if needed (forensics, legal)
6. Post-incident: Full report within 48 hours

#### HIGH (Suspected Incident)

1. Notify client within 1 hour via email + call
2. Begin investigation immediately
3. Prepare containment actions
4. Monitor for spread while investigating

#### MEDIUM (Policy Violation/Issue)

1. Log in ticketing system
2. Investigate during business hours
3. Notify client within 4 hours
4. Provide resolution plan

#### LOW (Warning)

1. Add to weekly report
2. Address during next business day
3. No immediate client notification required

### 4.3 Common Response Playbooks

| Scenario | Immediate Actions |
|----------|-------------------|
| **Ransomware detected** | Isolate endpoint → disable user account → check backup status → escalate to critical |
| **Phishing reported** | Block sender domain → search for other recipients → check for credential use → notify users |
| **Brute force attempt** | Block source IP at firewall → check for successful login → force password reset if compromised |
| **Malware detected** | Quarantine via EDR → analyze hash → check spread → reimage if needed |
| **Data exfiltration** | Identify data → block destination → assess scope → notify client + legal |
| **Insider threat** | Preserve evidence → disable account → review logs → involve management |

### 4.4 Communication Templates

#### Initial Client Notification (Critical)

> "We've detected [issue type] on [system name] at [time]. We've taken immediate action to contain it by [actions taken]. We're currently investigating the scope. We'll provide updates every [30 min / 1 hour]. Please don't log into affected systems until we confirm it's safe."

#### Incident Resolution Report

> **Incident Summary:** [Brief description]  
> **Timeline:** [When detected → contained → resolved]  
> **Impact:** [Systems/users affected, data exposure]  
> **Root Cause:** [What caused it]  
> **Actions Taken:** [Steps to resolve]  
> **Recommendations:** [How to prevent recurrence]  

---

## 5. Monitoring Checklist (Weekly/Monthly)

### Weekly

- [ ] Review all HIGH/CRITICAL alerts from past week
- [ ] Verify backup jobs completed successfully
- [ ] Check patch compliance percentage
- [ ] Review new user accounts (legitimate?)
- [ ] Check SIEM ingestion is healthy

### Monthly

- [ ] Review vulnerability scan results
- [ ] Verify all monitoring tools are collecting data
- [ ] Test at least one backup restore
- [ ] Review firewall rule changes
- [ ] Update alert thresholds based on baselines

---

## 6. Client Reporting

Provide clients with:

| Report | Frequency | Contents |
|--------|-----------|----------|
| **Executive Summary** | Monthly | High-level metrics, incidents, recommendations |
| **Security Posture** | Quarterly | Risk assessment, compliance status |
| **Incident Report** | As-needed | For any significant event |

---

## Quick Reference Card

| Severity | Response Time | Contact Method | Examples |
|----------|---------------|----------------|----------|
| CRITICAL | <15 min | Phone + Email | Ransomware, active breach |
| HIGH | 1 hour | Email + Phone | Malware, brute force |
| MEDIUM | 4 hours | Email | Missing patches, failed backup |
| LOW | Next day | Ticket | Minor issues |

**Emergency Contact:** [Your phone number]  
**Non-Emergency:** [Support email/ticket system]

---

*Document version: 1.0 | Created: 2026-03-18 | For: Irvin's Tech Business*
