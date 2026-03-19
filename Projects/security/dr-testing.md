# Disaster Recovery Testing Guide

**For:** Irvin's Tech & Electrical Services  
**Purpose:** Ensure business continuity and data protection  
**Last Updated:** 2026-03-18

---

## 1. How Often to Test

### Minimum Testing Schedule

| Test Type | Frequency | Notes |
|-----------|-----------|-------|
| **Full DR Drill** | Quarterly (every 3 months) | Simulate complete system failure |
| **Partial/Funcional Tests** | Monthly | Test individual recovery components |
| **Backup Verification** | Weekly | Confirm backups are completing |
| **Critical Systems** | After any major change | Infrastructure, security tools, client systems |

### Trigger-Based Testing (Beyond Schedule)

- After deploying new infrastructure
- After migrating clients to new systems
- Following a security incident (real or simulated)
- When staffing changes significantly
- Before peak business seasons

---

## 2. What to Test

### Core Systems

- **Client Data Backups** — Verify restore capability for managed clients
- **MSP Monitoring Systems** — Ensure alerts fire correctly during outages
- **Security Tools** — SIEM, endpoint protection, firewall configs
- **Communication Systems** — Phone, messaging, email continuity
- **Documentation Access** — DR runbooks, contact lists, client info

### Business Operations

- **RTO (Recovery Time Objective)** — Can you restore in promised timeframe?
- **RPO (Recovery Point Objective)** — Data loss tolerance met?
- **Customer Notification Process** — Can you reach clients quickly?
- **Internal Communication** — Can team coordinate during outage?
- **Financial/Invoice Systems** — Can you continue billing?

### Your Specific Services

- **Cybersecurity portal access** — Client security dashboards
- **Remote access tools** — VPN, remote desktop, management panels
- **Hardware repair tracking** — Ticket system, customer records
- **Electrical service docs** — Permits, schematics, client info

---

## 3. Test Scenarios

### Scenario A: Complete Data Center Failure
**Objective:** Recover all systems from backup at alternate location

1. Announce test to team (unless doing unannounced)
2. Simulate primary site unreachable
3. Failover to backup/alternate systems
4. Verify client-facing services operational
5. Confirm data integrity (no corruption/loss)
6. Document time to full recovery
7. Failback to primary when resolved

### Scenario B: Ransomware Attack
**Objective:** Validate backup isolation and restore process

1. Isolate a test system from network
2. Simulate ransomware encryption
3. Identify infection (detection working?)
4. Wipe and restore from clean backup
5. Verify no lateral spread
6. Test communication to affected client
7. Document lessons learned

### Scenario C: Loss of Key Personnel
**Objective:** Ensure business continuity if key person unavailable

1. Simulate lead tech unavailable
2. Verify documentation enables others to step in
3. Test access credentials (do others have them?)
4. Check client handoff process
5. Validate emergency contacts current

### Scenario D: Internet/Connectivity Outage
**Objective:** Maintain operations without primary internet

1. Cut primary internet connection
2. Switch to backup ISP or cellular
3. Verify remote access for team
4. Confirm client communication still works
5. Test critical cloud services accessibility

### Scenario E: Physical Office Loss
**Objective:** Full remote operation capability

1. Access all systems remotely
2. Verify team can work from home
3. Test client support via remote tools
4. Confirm phone forwarding works
5. Validate financial systems accessible

---

## 4. Documentation Requirements

### Pre-Test Documentation

- [ ] **Asset Inventory** — All systems, their criticality, owners
- [ ] **RTO/RPO Matrix** — Recovery targets per system
- [ ] **Contact List** — Internal team, vendors, key clients, ISP/utility contacts
- [ ] **Runbooks** — Step-by-step recovery procedures per scenario
- [ ] **Network Diagrams** — Current infrastructure layout
- [ ] **Access Credentials** — Documented (securely stored) access info

### Post-Test Documentation

- [ ] **Test Date & Participants** — Who was involved
- [ ] **Scenario Tested** — What was simulated
- [ ] **Results** — Success/failure, findings
- [ ] **RTO/RPO Achieved** — Actual vs. target times
- [ ] **Issues Found** — What broke, what needs fixing
- [ ] **Action Items** — Fixes to implement before next test
- [ ] **Lessons Learned** — Process improvements

### Documentation Storage

- Keep copies in cloud (not just local)
- Ensure off-site access if office unavailable
- Version control — track changes over time
- Encrypt sensitive credential docs

---

## Quick Reference: Test Checklist

```
□ Schedule test (quarterly full, monthly partial)
□ Notify team (or prepare for unannounced)
□ Select scenario(s) to run
□ Execute test
□ Document start time
□ Complete recovery steps
□ Document completion time
□ Verify all systems operational
□ Test client communication
□ Document findings
□ Create action items
□ Share summary with team
□ Schedule fixes
```

---

## Next Steps

1. **Immediate:** Document your current RTO/RPO for each service
2. **This Week:** Create runbooks for top 3 critical systems
3. **This Month:** Run first partial DR test
4. **Quarterly:** Full DR exercise with entire team

---

*This guide should evolve. Update after each test with lessons learned.*
