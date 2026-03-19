# Disaster Recovery Plan Template

**Client:** [Client Name]  
**Created By:** [Your Company]  
**Date:** [Date]  
**Last Updated:** [Date]

---

## 🚨 Emergency Contacts

| Role | Name | Phone | Email |
|------|------|-------|-------|
| Primary IT Contact | | | |
| Secondary IT Contact | | | |
| MSP On-Call | | | |
| Insurance Claim | | | |
| Internet Provider | | | |
| Hosting Provider | | | |
| Legal / Compliance | | | |
| Law Enforcement (Cyber) | | | |

---

## 1. RANSOMWARE RESPONSE

### Immediate Actions (First 15 Minutes)

1. **ISOLATE** — Disconnect affected systems from network (unplug Ethernet, disable WiFi)
2. **ASSESS** — Identify scope: how many machines affected? What servers encrypted?
3. **DO NOT PAY** — Contact us before taking any action
4. **DOCUMENT** — Note ransomware variant if visible, timestamp of discovery

### Recovery Steps

1. Identify backup integrity (are backups clean? When was last successful backup?)
2. Determine if decryption tools exist for the variant
3. Restore from clean backup if available
4. Rebuild affected systems from scratch if needed
5. Restore data after verifying no lingering malware
6. Post-incident: conduct security review

### Prevention Measures

- Ensure backups are offline/air-gapped
- Maintain updated endpoint protection
- Regular security awareness training
- Network segmentation

---

## 2. HARDWARE FAILURE RESPONSE

### Immediate Actions

1. **ASSESS** — Identify failed component (server, storage, workstation, network gear)
2. **DOCUMENT** — Note any error messages, LED indicators, unusual sounds
3. **NOTIFY** — Contact us immediately — same day response available
4. **CHECK BACKUPS** — Verify backup status before any hardware work

### Recovery Steps

1. Replace failed hardware (onsite spare or overnight shipment)
2. Restore from latest verified backup
3. Test critical systems before returning to production
4. Document failure for warranty/insurance claims

### Critical Systems Priority

1. Domain Controller / Authentication
2. File Servers / Data Storage
3. Email / Communication
4. Business Applications

---

## 3. FIRE / FLOOD RESPONSE

### Immediate Actions

1. **SAFETY FIRST** — Do not enter building if unsafe
2. **NOTIFY** — Call emergency services (911)
3. **DISCONNECT** — If safe, cut power to servers/equipment
4. **DOCUMENT** — Photo/video damage for insurance

### Recovery Steps

1. Assess water/fire damage extent
2. Dry equipment in controlled environment (do NOT power on wet hardware)
3. Contact data recovery specialists if needed (drives may be recoverable)
4. Provision temporary replacement hardware
5. Restore from offsite backups
6. Relocate to temporary office if needed

### Prevention Measures

- Offsite backups (cloud or remote location)
- Surge protectors / UPS units
- Fire suppression systems
- Keep critical data replicated

---

## 4. DATA BREACH RESPONSE

### Immediate Actions

1. **CONTAIN** — Isolate affected systems
2. **PRESERVE** — Do not delete logs, don't wipe systems (evidence)
3. **NOTIFY** — Contact us AND legal counsel immediately
4. **ASSESS** — What data was compromised? (PII, financial, health, credentials)
5. **DOCUMENT** — Timeline of discovery, what you noticed

### Recovery Steps

1. Identify attack vector and close vulnerability
2. Reset all potentially compromised credentials
3. Engage forensic specialist if needed
4. Determine notification requirements (48-72 hour window may apply)
5. File law enforcement report
6. Credit monitoring services if personal data exposed

### Compliance Considerations

- **California (CCPA):** 30 days to notify residents
- **HIPAA:** 60 days to notify HHS and affected individuals
- **PCI-DSS:** Immediate notification to card brands
- Document everything for potential litigation

---

## 5. BACKUP VERIFICATION CHECKLIST

| Item | Frequency | Status | Last Verified |
|------|-----------|--------|---------------|
| Backup completion alerts | Daily | ☐ | |
| Backup restoration test | Monthly | ☐ | |
| Offsite/Cloud backup | Daily | ☐ | |
| Backup encryption | N/A | ☐ | |
| Backup access permissions | Quarterly | ☐ | |

---

## 6. RECOVERY TIME OBJECTIVES (RTO)

| System | Max Downtime | Recovery Priority |
|--------|--------------|-------------------|
| Email/Communication | 4 hours | 1 |
| Core Business Apps | 8 hours | 2 |
| File Servers | 24 hours | 3 |
| Development/Testing | 72 hours | 4 |
| Archive Data | 1 week | 5 |

---

## 7. POST-INCIDENT REVIEW

After any incident, complete this:

- **Date of Incident:** 
- **Type:** 
- **Downtime Duration:** 
- **Data Lost:** 
- **Root Cause:** 
- **Lessons Learned:** 
- **Actions to Prevent Recurrence:** 

---

## 📋 Client Agreement

By signing, the client acknowledges:

- They understand this DR plan exists
- They will contact [Your Company] immediately in an emergency
- They understand backups are THEIR responsibility to verify
- They understand paying ransoms is discouraged without consulting professionals

**Client Signature:** ____________________  
**Date:** ______________

---

*Template created for [Your Company] — Contact for custom implementation*
