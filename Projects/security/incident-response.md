# Incident Response Plan
## TechSupport - Irvin's Tech Business

**Last Updated:** 2026-03-18  
**Plan Owner:** Irvin Avitia  
**Version:** 1.0

---

## 1. What Constitutes an Incident

An incident is any event that threatens the confidentiality, integrity, or availability of systems, data, or client services. Classify incidents into categories:

### Severity Levels

| Level | Classification | Examples |
|-------|---------------|----------|
| **P1 - Critical** | Active breach, data exfiltration, ransomware, service down affecting multiple clients | Malware outbreak, hacked client systems, leaked credentials, DDoS |
| **P2 - High** | Single client impacted, potential data exposure, system compromise | Phishing leading to compromised account, infected workstation, unauthorized access attempt |
| **P3 - Medium** | Minor security event, configuration issue, failed login attempts | Failed brute-force attempts, minor misconfiguration, suspicious but blocked activity |
| **P4 - Low** | Policy violations, informational alerts | Failed backups (non-critical), unusual but benign activity |

### Triggers (Always Treat as Incident)

- **Security:** Malware detection, unauthorized access, credential compromise, data breach, suspicious network traffic
- **Availability:** System outages, service degradation, connectivity loss
- **Client Systems:** Client-reported issues involving data loss, security concerns, or service interruption
- **Physical:** Unauthorized facility access, hardware theft, power/electrical issues affecting operations

---

## 2. Response Steps

### Initial Response (All Severities)

1. **Identify & Contain** (Immediate - < 15 min)
   - Isolate affected systems (disconnect network, disable accounts)
   - Document what was affected (hosts, data, clients)
   - Preserve evidence (screenshot, logs, memory dumps)

2. **Assess Severity** (Within 30 min)
   - Determine P1-P4 classification
   - Identify scope (single system vs. network-wide, single client vs. multiple)

3. **Escalate** Based on severity:
   - **P1/P2:** Notify Irvin immediately (phone/text)
   - **P3:** Notify within 2 hours
   - **P4:** Log for review during business hours

### Detailed Response by Severity

#### P1 - Critical Response (< 1 hour response time)

1. Activate incident response team
2. Isolate all affected systems from network
3. Engage external resources if needed (forensic specialist, legal counsel)
4. Begin evidence preservation
5. Notify affected clients immediately
6. Consider breach notification requirements

#### P2 - High Response (< 4 hour response time)

1. Isolate affected system(s)
2. Reset compromised credentials
3. Scan for lateral movement
4. Review access logs for scope
5. Notify affected client within 4 hours

#### P3 - Medium Response (< 24 hour response time)

1. Investigate root cause
2. Apply remediation
3. Document findings
4. Notify client during next business day if relevant

#### P4 - Low Response (Within 48 hours)

1. Log event
2. Monitor for recurrence
3. Document in weekly review

---

## 3. Communication Plan

### Internal Communication

| Scenario | Who Notifies | Channel | Timeline |
|----------|--------------|---------|----------|
| P1/P2 Incident | First responder | Phone → Slack/Text | Immediate |
| P3 Incident | First responder | Slack/Email | Within 2 hours |
| All Incidents | Irvin decides | As appropriate | Document all comms |

**Escalation Contact (Irvin):**
- Primary: Phone call for P1/P2
- Secondary: Text/Slack for P3

### Client Communication

| Severity | Who Communicates | Method | Template |
|----------|-------------------|--------|----------|
| P1 | Irvin + Tech | Phone + Email | **Urgent:** Security Incident Notification |
| P2 | Assigned Tech + Irvin | Phone + Email | **Important:** Security Event Notification |
| P3 | Assigned Tech | Email | Incident Update |
| P4 | Assigned Tech | Email/Portal | Resolution Note |

### External Communication (If Required)

- **Law Enforcement:** Irvin must approve before contacting
- **Legal Counsel:** Consult for data breaches
- **Insurance:** Notify carrier per policy requirements
- **Regulatory Bodies:** Consult legal for breach notification laws

### Communication Guidelines

- Never disclose full technical details to clients
- State facts only, avoid speculation
- Provide clear next steps and ETA for updates
- Document all client communications

---

## 4. Post-Incident Review

### Timeline

- **P1/P2:** Conduct review within 72 hours of resolution
- **P3:** Conduct review within 1 week
- **P4:** Document in monthly security review

### Review Process

1. **Incident Summary**
   - What happened (timeline)
   - Systems/data affected
   - Root cause (if known)
   - How it was resolved

2. **What Went Well**
   - Detection time
   - Response speed
   - Communication effectiveness

3. **What Could Be Improved**
   - Process gaps
   - Tooling issues
   - Training needs

4. **Action Items**
   - Specific fixes to implement
   - Who owns each item
   - Target completion date

5. **Lessons Learned**
   - Update detection rules
   - Update runbooks/procedures
   - Additional training requirements
   - Update this plan as needed

### Documentation Requirements

- Store all incident reports in: `/memory/security/incidents/`
- Naming convention: `YYYY-MM-DD_incident_summary.md`
- Retain records for minimum 2 years (or per compliance requirements)

---

## Quick Reference

| Action | Contact | When |
|--------|---------|------|
| Security Alert | Irvin | Immediate (P1/P2) |
| Client Down | Irvin | Immediate |
| Data Breach | Irvin + Legal | Immediate |
| Police/Law Enforcement | Irvin Only | Do not contact |

---

*This plan should be reviewed quarterly and updated after any major incident or change in services.*
