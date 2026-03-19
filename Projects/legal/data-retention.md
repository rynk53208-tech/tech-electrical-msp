# Client Data Retention Policy

**Last Updated:** 2026-03-18  
**Applies To:** Irvin's Tech & Electrical Services

---

## 1. What to Archive

### Client Personal Data
| Category | Examples | Priority |
|----------|----------|----------|
| Identity | Name, DOB, SSN (if collected), photo ID copies | High |
| Contact | Address, phone, email, emergency contact | High |
| Financial | Payment info, invoicing, receipts, tax IDs | High |
| Contractual | Signed agreements, SOWs, change orders | High |
| Technical | Device specs, network diagrams, credentials (encrypted) | Medium |
| Support Records | Ticket history, diagnostics, communications | Medium |

### Business Records
- Invoices and payment history (7 years minimum)
- Quote/estimate archives (2 years after last activity)
- Project documentation and deliverables
- Correspondence (email/chat logs related to services)
- Employee/contractor records (if applicable)

### Exclusions (Do NOT archive)
- Passwords in plain text
- Sensitive credentials without encryption
- Personal data beyond scope of service
- Temporary/cache files

---

## 2. Retention Periods

### Minimum Requirements
| Record Type | Retention Period | Reason |
|-------------|------------------|--------|
| Tax/Financial (IRS) | **7 years** | IRS audit window |
| Contracts | **7 years** post-termination | Liability window |
| Invoices | **7 years** | Tax compliance |
| Client PII | **3 years** post-relationship end | General liability |
| Support Tickets | **3 years** post-closure | Support disputes |
| Employment Records | **4 years** (EEOC) | Legal compliance |
| Marketing Lists | Until consent withdrawn | Privacy laws |

### Recommended (Best Practice)
- Keep financial records 7+ years
- Retain client contracts 10 years (extended liability protection)
- Archive deleted client data for 30-90 days before permanent deletion (recovery buffer)

### Deletion Procedures
1. **Automated deletion** after retention period expires
2. **Secure wipe** (NIST 800-88 compliant) for hardware
3. **Documentation** of deletion date and method

---

## 3. Storage Recommendations

### Tiered Storage Model
| Tier | What | Location | Cost |
|------|------|----------|------|
| **Hot** (0-90 days) | Active client data, recent projects | Local SSD/NVMe | High |
| **Warm** (90 days-1 yr) | Closed projects, recent invoices | External SSD/HDD | Medium |
| **Cold** (1-7+ years) | Archives, financial records | Cloud (encrypted) | Low |

### Specific Recommendations
- **Primary:** Local encrypted storage (BitLocker/VeraCrypt)
- **Backup:** Cloud storage with client-side encryption (Sync.com, Tresorit, or Backblaze B2)
- **Hardware:** Dedicated archive drive (encrypted), separate from daily systems
- **Redundancy:** 3-2-1 rule — 3 copies, 2 media types, 1 offsite

### Encryption Requirements
- AES-256 minimum for stored data
- TLS 1.2+ for data in transit
- Client credentials MUST be encrypted at rest
- Use password managers for sensitive access creds

---

## 4. Compliance Requirements

### Applicable Regulations (US-Focused)

| Regulation | Applies If | Key Requirements |
|------------|------------|------------------|
| **GDPR** | EU clients | Consent, right to erasure, data portability |
| **CCPA/CPRA** | CA clients | Opt-out, disclosure, deletion rights |
| **HIPAA** | Healthcare clients | PHI protection, BAA required |
| **PCI-DSS** | Payment processing | Cardholder data security |
| **SOX** | Public companies | Financial record integrity |

### General Compliance Checklist
- [ ] Privacy policy posted and updated
- [ ] Client consent obtained for data collection
- [ ] Data subject access request (DSAR) process defined
- [ ] Breach notification procedure in place
- [ ] Vendor/contractor data handling agreements
- [ ] Employee training on data handling
- [ ] Annual policy review scheduled

### Incident Response
1. **Detect** — Identify breach
2. **Contain** — Limit damage
3. **Notify** — Client/authorities within 72 hours (GDPR/CCPA)
4. **Document** — Incident log
5. **Remediate** — Fix vulnerabilities

---

## 5. Quick Reference Summary

| Action | Frequency |
|--------|-----------|
| Review retention periods | Annually |
| Test backup restores | Quarterly |
| Update encryption keys | Annually (or on personnel change) |
| Purge expired records | Monthly automated |
| Audit access logs | Monthly |
| Employee training | Annually |

---

**Disclaimer:** This policy is a starting point. Consult a qualified attorney for legal advice specific to your jurisdiction and business model.
