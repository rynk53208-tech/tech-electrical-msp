# Password Policy Examples & Use Cases

## Client Tier Policies

Here are 4 example configurations for different client types (use these to customize your policies):

---

## 1️⃣ Startup / Small Business (5-20 employees)

**Configuration:**
| Setting | Value | Rationale |
|---------|-------|-----------|
| Min Length | 10 chars | Balanced security |
| Complexity | All 4 types | Reasonable for SMB |
| Expiry | 120 days | Quarterly change (not burdensome) |
| History | 3 passwords | Prevent recent reuse |
| Lockout | 5 attempts / 30 min | Balanced |
| MFA | Recommended | Opt-in for critical accounts |
| SSO | Not required | Too early stage |

**Document Output:**
- Professional password policy
- Simple compliance checklist
- Signature block for employee handbook
- Estimated setup time: 1 hour

**Use Case:** Deliverable for new MSP client during onboarding
**Pricing:** Include in MSP base tier (~$500/mo covers policy dev + monitoring)

---

## 2️⃣ Small/Mid-Market (20-100 employees)

**Configuration:**
| Setting | Value | Rationale |
|---------|-------|-----------|
| Min Length | 12 chars | Industry standard |
| Complexity | All 4 types | Required |
| Expiry | 90 days | NIST-aligned |
| History | 5 passwords | Prevent cycling |
| Lockout | 5 attempts / 30 min | Standard |
| MFA | Required for admins | Critical for security |
| SSO | Recommended | Reduces password reuse |

**Document Output:**
- Comprehensive policy (9 sections)
- Compliance mapping (NIST, CIS, PCI)
- Department-specific callouts (Finance, HR, IT)
- Training checklist
- Estimated setup time: 2-3 hours

**Use Case:** Core deliverable for mid-market MSP engagement
**Pricing:** Standalone security assessment + policy bundle (~$1,500-2,000)

---

## 3️⃣ Enterprise / High-Security (100+ employees, sensitive data)

**Configuration:**
| Setting | Value | Rationale |
|---------|-------|-----------|
| Min Length | 16 chars | Enhanced security |
| Complexity | All 4 types | Required |
| Expiry | 60 days | Frequent rotation |
| History | 12 passwords | Prevent any cycling |
| Lockout | 3 attempts / 60 min | Strict |
| MFA | Required for all | Defense in depth |
| SSO | Required | Centralized control |
| Session Timeout | 15 min | Unattended desk protection |

**Document Output:**
- Full enterprise policy (with exemptions for contractors)
- SOC 2 Type II compliance callouts
- Department-specific requirements
- Incident response procedures
- Implementation timeline (phased rollout)
- Estimated setup time: 4-6 hours

**Use Case:** vCISO engagement or annual security review
**Pricing:** Professional services (~$3,000-5,000) + recurring vCISO monitoring

---

## 4️⃣ Regulated Industry (Healthcare, Finance, Legal)

**Configuration:**
| Setting | Value | Rationale |
|---------|-------|-----------|
| Min Length | 16+ chars | HIPAA/PCI compliance |
| Complexity | All 4 types | Required |
| Expiry | 90 days | NIST 800-63 aligned |
| History | 8 passwords | Regulatory requirement |
| Lockout | 5 attempts / 30 min | Standard |
| MFA | Required (hardware key preferred) | Defense in depth |
| SSO | Required | Audit trail |
| Session Timeout | 15 min | Unattended workstation protection |

**Document Output:**
- HIPAA-specific callouts (if healthcare)
- PCI-DSS references (if payment processing)
- SOX compliance notes (if finance/public)
- Audit logging requirements
- Breach notification procedures
- Legal attestation language
- Estimated setup time: 6-8 hours

**Use Case:** Compliance consulting engagement (audit prep, remediation)
**Pricing:** Consulting + audit + remediation (~$5,000-10,000)

---

## Real-World Implementation Examples

### Example 1: Desert Dental (Client Tier: Mid-Market)

**Scenario:** New MSP onboarding of local dental office (25 employees)

**Step 1: Configure Policy (in tool)**
```
Organization: Desert Dental PC
Min Length: 12 characters
Complexity: All 4 types required
Expiry: 90 days
History: 5 passwords
Lockout: 5 attempts / 30 min
MFA: Required for admin accounts
SSO: Enable (integrate with Azure AD)
```

**Step 2: Generate Document**
- Click "Generate Policy Document"
- Review 9 sections (customized for dental office)

**Step 3: Customize for Compliance**
- Add HIPAA references (compliance checklist auto-includes)
- Add note about patient data access controls
- Add specific roles: Office Manager, IT Admin, Hygienists, Dentists

**Step 4: Export as PDF**
- Print/Save as PDF
- Have Dr. Smith sign

**Step 5: Implementation**
- Export JSON config
- Import into Azure AD Group Policy
- Train staff (use Best Practices tab)
- Monitor compliance (quarterly audits)

**Deliverable Timeline:**
- Day 1: Generate + customize policy (1 hour)
- Day 2: Client review & sign-off (30 min)
- Day 3: System deployment (2 hours)
- Ongoing: Monthly compliance checks (15 min)

**Revenue Model:**
- Initial policy dev: $500 (included in discovery)
- MSP monitoring: $750/mo includes quarterly audits
- Compliance reporting: $200/quarter

---

### Example 2: Barney's Tire Shop (Client Tier: Startup)

**Scenario:** Post-network-rebuild password policy establishment

**Step 1: Quick Configuration**
```
Organization: Barney's Tire Shop
Min Length: 10 characters
Complexity: Uppercase, lowercase, numbers (symbols optional)
Expiry: 120 days
History: 3 passwords
Lockout: 5 attempts / 30 min
MFA: Recommended for POS
SSO: Not required yet
```

**Step 2: Generate + Customize**
- Add note about POS system integration
- Add note about physical workstation access (tire bays)
- Simplify language for technical staff

**Step 3: Export & Deploy**
- HTML export for email to Barney
- Print PDF for shop bulletin board
- Deploy AD GPO for network workstations

**Implementation:**
- Deploy on Day 1 (post-firewall install)
- 30-min staff training
- Post policy on network drive

**Revenue Model:**
- Included in network stabilization ($2,500 project)
- Follow-up security audit: $800 (upsell to full MSP)

---

### Example 3: Law Firm (Client Tier: Enterprise)

**Scenario:** Security audit finding: "Inadequate password policies"

**Step 1: Discovery Assessment**
- Interview office manager, IT lead, partners
- Review current system (legacy AD, no MFA)
- Identify compliance gaps (attorney confidentiality, client data)

**Step 2: Configure Target Policy**
```
Organization: [Law Firm Name] PLLC
Min Length: 14 characters
Complexity: All 4 types required
Expiry: 60 days
History: 8 passwords
Lockout: 3 attempts / 60 min
MFA: Required (hardware keys for partners)
SSO: Required (integrate with Azure AD)
Session Timeout: 15 min
Additional: "Workstation locks automatically after 15 min. All passwords stored in approved vault."
```

**Step 3: Generate Professional Policy**
- Full 12-section document
- Callouts for legal compliance (attorney-client privilege, confidentiality)
- Signature blocks for partners + IT director
- Attestation language for malpractice insurance requirements

**Step 4: Implementation Plan**
- Week 1: Policy finalization + partner sign-off
- Week 2-3: System setup (Azure AD, hardware keys, SSO)
- Week 4: Staff training (1 hr for each department)
- Week 5: Compliance verification + audit report

**Step 5: Export & Archive**
- Export as PDF (signed) → audit trail
- Export as JSON → AD deployment config
- Compliance checklist → audit file

**Deliverable Package:**
1. Security assessment report (findings + recommendations)
2. Password policy document (signed)
3. Implementation timeline (phased, low disruption)
4. Compliance checklist (NIST 800-63B, state bar requirements)
5. 6-month monitoring plan (quarterly audits)

**Revenue Model:**
- Security assessment: $2,500
- Policy development: $1,500
- Implementation & training: $3,000
- 6-month vCISO monitoring: $800/mo = $4,800
- **Total engagement: $11,800**

---

## Compliance Mapping Examples

### NIST SP 800-63B Alignment

Your policy auto-generates these NIST references:

| NIST Requirement | Your Policy Maps To | Configuration |
|------------------|-------------------|---------------|
| 5.1.4.2 - Memorized Secret Strength | Min Length (12+ chars) | ✓ Slider set to 12 |
| 5.2.1 - Complexity Requirement | 4 character types | ✓ All checked |
| 5.2.2 - Entropy | Use passphrase approach | ✓ Best Practices tab |
| 6.2.2 - Expiry | 90-day rotation | ✓ Slider set to 90 |
| 6.3 - Compromise of Authentication Secret | MFA required | ✓ Toggle ON |
| 7.1 - Binding Authenticators | Hardware keys for admin | ✓ Additional notes |

---

## Pricing Your Policy Generator Service

### Standalone Policy Service

- **Starter Policy:** $300-500
  - 1-2 hours work
  - For SMB (10-50 employees)
  - Includes document + training checklist

- **Standard Policy:** $800-1,200
  - 2-4 hours work
  - For mid-market (50-200 employees)
  - Includes document + compliance checklist + implementation plan

- **Enterprise Policy:** $2,000-3,500
  - 4-8 hours work
  - For large org (200+ employees)
  - Includes document + compliance checklist + implementation + vCISO reviews

### Recurring vCISO Bundle

- **Quarterly Compliance Reviews:** $300-500/quarter
  - Review policy adherence
  - Update for regulatory changes
  - Incident response plan updates

- **Annual Security Audit:** $1,500-2,500
  - Full compliance assessment
  - Policy effectiveness review
  - Remediation recommendations

---

## What to Include in Your Pitch

### To SMB Prospects
> "We'll create your custom password policy document, NIST-aligned, with staff training materials. Includes setup on your server in one day."

### To Mid-Market
> "Professional password policy + compliance documentation (NIST/CIS aligned) + quarterly audits. Protects your business, satisfies cyber insurance requirements, and proves due diligence."

### To Enterprise
> "Password policy + SSO/MFA implementation + vCISO monitoring. Ensures SOC 2 compliance, reduces breach risk by 70%, passes auditor requirements."

---

## Export Templates for Client Deliverables

When exporting to clients, include:

1. **Executive Summary** (1 page)
   - Policy purpose
   - Compliance standards met
   - Implementation timeline

2. **Policy Document** (Auto-generated, 9-12 pages)
   - All sections from tool
   - Signature blocks

3. **Compliance Checklist** (2-3 pages)
   - What's implemented
   - What's outstanding
   - Risk assessment

4. **Implementation Guide** (2-4 pages)
   - Step-by-step rollout plan
   - Training schedule
   - Monitoring procedures

5. **FAQ & Support** (1-2 pages)
   - Common questions
   - Contact info
   - Incident reporting procedure

---

**Tip:** Save each policy version with date stamp (e.g., `Password-Policy-Barney's-2026-03-19.pdf`). This creates audit trail for compliance reviews.
