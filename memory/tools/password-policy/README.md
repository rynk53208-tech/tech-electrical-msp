# Password Policy Generator v1.0

**Tech & Electrical Services LLC** | Generate compliant password policies for your clients

## Quick Start (5 Minutes)

1. **Open** `index.html` in any modern browser
2. **Configure** settings on the "Configuration" tab
3. **Select** compliance standards (HIPAA, PCI-DSS, GDPR, etc.) on "Compliance" tab
4. **Preview** the generated policy on "Preview" tab
5. **Export** as PDF, Text, Word, or JSON

**No server needed. No data sent externally. 100% browser-based.**

---

## Features

### ⚙️ Configuration Tab
Complete policy customization:
- **Client/Organization Name** — Personalize for each customer
- **Password Creation Requirements** — Set minimum/maximum length, character complexity
  - Uppercase, lowercase, numbers, special symbols (all optional)
  - Visual sliders for length (8–32 min, 16–128 max)
- **Password Lifecycle** — Configure expiration and rotation
  - Expiration in days (0 = no expiration, NIST recommended for modern setups)
  - Password history (prevent reusing last N passwords, typically 5–12)
- **Account Lockout** — Brute-force protection
  - Failed attempt threshold (typical: 5–6 attempts)
  - Lockout duration in minutes (typical: 30 min)
- **Advanced Options**
  - Multi-Factor Authentication (MFA) — CRITICAL for modern security
  - Single Sign-On (SSO) — Enterprise integration
  - Common password blocking — Prevents "P@ssw0rd123" patterns
  - Biometric support — Modern authentication methods

### ✓ Compliance Tab
Six major compliance frameworks with auto-tailored requirements:
- **HIPAA** — Healthcare data protection (medical offices, clinics)
- **PCI-DSS** — Payment card security (retail, restaurants, auto shops)
- **SOX** — Financial reporting compliance
- **GDPR** — EU privacy regulation (international data handling)
- **NIST 800-63** — US cybersecurity standards (government, defense contractors)
- **ISO 27001** — Information security management

Each standard has built-in requirements checklist. Click cards to view details.

Compliance Checklist:
- ✓ Policy documented and distributed
- ✓ User acknowledgment signed
- ✓ Technical controls enforced in systems (AD, SSO, etc.)
- ✓ Audit logging enabled
- ✓ Annual user training completed
- ✓ Annual policy review completed

### 💡 Best Practices Tab
10 security best practices for your client:
1. **Use Passphrases** — "BlueSky!Coffee@Sunrise" vs. "B7d$Qk9m"
2. **Never Share Passwords** — Even IT staff shouldn't ask
3. **Password Managers** — Bitwarden, 1Password, LastPass recommended
4. **Multi-Factor Authentication** — 90% of breaches could be prevented
5. **NIST 2017 Guidance** — No forced expiration, breach-triggered reset instead
6. **Avoid Complexity Overload** — Quality > quantity (prevents weak patterns)
7. **Account Lockout** — 5–6 attempts, 30-min lockout
8. **Monitor Compromised Passwords** — Check "Have I Been Pwned" on resets
9. **Regular Audits** — Quarterly review of failed attempts & privilege accounts
10. **User Training** — Annual security awareness, phishing simulations

### 📄 Preview Tab
- Live policy preview (first 20 lines)
- **Compliance Level %** — Automatic calculation based on settings
  - 15 points: Min length ≥12 chars
  - 20 points: MFA enabled
  - 15 points: Common password blocking
  - 10 points each: Documented, technical controls, audit logging, user training
- Refresh to recalculate
- Copy preview to clipboard

### 📥 Export Tab
Four export formats, all generated locally:

**📄 PDF Document**
- Professional printable format
- Ready for client handoff
- Includes compliance badge

**📝 Word (.docx)**
- Editable in Microsoft Word
- Share with legal/compliance teams
- Client can customize further

**📋 Plain Text**
- Quick reference format
- Easy to email
- Copy-paste into any document

**⚙️ JSON Config**
- For automation & system integration
- Import into password managers
- Machine-readable policy
- Perfect for API integration

**Print Option** — Browser print-to-PDF for advanced formatting

---

## Use Cases

### 1. **New MSP Client Onboarding**
Generate a baseline policy during discovery:
1. Interview client about their risk tolerance
2. Select applicable compliance standards
3. Customize based on their infrastructure (Windows/Mac/Linux)
4. Export to PDF → client signs → implement
5. Saves 2–3 hours per client vs. custom writing

### 2. **Compliance Audit / Security Assessment**
Demonstrate gaps in existing policy:
1. Import current policy settings
2. Compare to NIST/HIPAA/PCI-DSS
3. Highlight missing requirements
4. Export gap analysis
5. Quote remediation work

### 3. **Annual Policy Review**
Refresh policy with latest standards:
1. Load previous year's settings (JSON import)
2. Update expiration/lockout thresholds
3. Review compliance checkboxes
4. Export v2.0
5. Distribute to all users for re-acknowledgment

### 4. **Team Member Training**
Show best practices to technicians:
1. Review "Best Practices" tab content
2. Use as training material in staff meetings
3. Distribute as reference document
4. Quiz team on NIST vs. legacy guidance

### 5. **Proposal / Quote Generation**
Include in MSP proposal:
1. Generate custom policy for prospect
2. Attach to proposal as "Included in SOW"
3. Demonstrates thoroughness during sales
4. Shortens negotiation cycle

---

## Compliance Standard Details

### 🏥 HIPAA (Healthcare)
**Required for:** Medical offices, dental clinics, healthcare providers

**Key requirements:**
- Min 8 characters, complexity required
- 90-day expiration
- Track last 5 passwords (no reuse)
- Audit logging of all access
- Breach notification within 60 days

**Policy recommendation:** Moderate enforcement, HIPAA tier

### 💳 PCI-DSS (Payment Cards)
**Required for:** Retail, restaurants, auto repair, any business accepting cards

**Key requirements:**
- Min 7 characters, complexity required
- 90-day expiration
- Track last 4 passwords
- 6-attempt lockout
- MFA mandatory for admin accounts
- Quarterly penetration testing

**Policy recommendation:** Strict enforcement, PCI tier

### 📊 SOX (Financial Reporting)
**Required for:** Publicly-traded companies, financial services

**Key requirements:**
- Min 10 characters, high complexity
- 60-day expiration
- Track last 12 passwords
- Strong audit trail
- MFA for administrator accounts
- Annual compliance certification

**Policy recommendation:** Enterprise enforcement, SOX tier

### 🔐 GDPR (EU Privacy)
**Required for:** Any company processing EU resident data (international exposure)

**Key requirements:**
- Min 12 characters, complexity required
- MFA mandatory
- Secure storage (salted hash)
- Access logging for 3+ years
- 30-day breach notification
- Privacy policy alignment

**Policy recommendation:** Enterprise enforcement, GDPR tier

### 🛡️ NIST 800-63B (US Cybersecurity)
**Recommended for:** Government, defense contractors, critical infrastructure

**Key requirements (modern guidance):**
- Min 12 characters (no expiration!)
- Breach-triggered reset (not time-based)
- MFA for sensitive systems
- Rate limiting on failed attempts
- Salted/hashed password storage
- Check against "Have I Been Pwned" database

**Policy recommendation:** Strict enforcement, NIST tier
*Note: NIST deprecated 90-day rotation in 2017. This tool uses current guidance.*

### 🎯 ISO 27001 (Information Security)
**Recommended for:** Enterprise, security-conscious organizations

**Key requirements:**
- Min 12 characters, complexity required
- 120-day expiration
- Track last 10 passwords
- MFA for critical systems
- Written policy documentation
- Annual review and update

**Policy recommendation:** Enterprise enforcement, ISO tier

---

## Implementation Guide for MSP Clients

### Step 1: Distribute Policy
1. Export as PDF
2. Email to all users with cover letter
3. Request acknowledgment (signature or email reply)
4. File signed copies in compliance folder

### Step 2: Configure Active Directory / SSO
If using Windows domain or OKTA/Azure AD:

**Windows Group Policy:**
```
Computer Configuration → Policies → Windows Settings → Security Settings
  → Account Policies → Password Policy
    - Minimum password length: [Set from policy]
    - Password must meet complexity: [Enable]
    - Maximum password age: [Set from policy]
    - Minimum password age: 1 day
    - Enforce password history: [Set from policy]
```

**Account Lockout:**
```
Account lockout threshold: [Set from policy]
Account lockout duration: [Set from policy]
Reset account lockout counter: 30 minutes
```

**OKTA / Azure AD:**
- Use policy settings to enforce in SSO
- Enable MFA/push notifications
- Set password expiration rules
- Enable breach detection

### Step 3: Enable Auditing
Configure log collection:
- **Windows:** Enable security event logging (Event Viewer)
- **Linux:** Configure auditd, syslog
- **Cloud:** Enable CloudTrail (AWS), Activity Log (Azure), Audit Log (GCP)

**Monitor for:**
- Repeated failed login attempts
- Unusual account activity
- Privilege escalation
- After-hours access

### Step 4: User Training
- Annual security awareness training
- Password manager onboarding
- Phishing simulation campaigns
- Privileged access management (PAM) training for admins

### Step 5: Quarterly Reviews
- Audit failed login attempts
- Review new user accounts
- Check for stale accounts (>60 days inactive)
- Update policy as needed

---

## FAQ

**Q: Should I set password expiration to 90 days?**
A: Only if required by your compliance framework (HIPAA, PCI-DSS, SOX). NIST 2017+ recommends NO expiration, with breach-triggered resets instead. This tool defaults to 90 days (conservative) but you can set to 0 (modern).

**Q: Is MFA really necessary?**
A: Yes. 90% of breaches could be prevented with MFA. It's the single most effective security control. Require it for all admin accounts, email, and cloud services.

**Q: What's the difference between NIST and ISO 27001?**
A: NIST is US government standard (recommended for all). ISO 27001 is international standard with similar goals. Use both if your client is global.

**Q: Can I import/export settings?**
A: Yes! Export as JSON to save a template. Reimport JSON on next client. This tool stores settings in browser localStorage too.

**Q: What about password managers?**
A: Strongly recommend enterprise password managers (Bitwarden, 1Password) for clients. They eliminate the need for weak passwords written down.

**Q: How often should I update the policy?**
A: Annually minimum. Update if compliance requirements change, or if breach trends suggest tighter controls needed.

---

## Technical Details

- **File size:** 46 KB (single HTML file)
- **Browser support:** Chrome 60+, Firefox 55+, Safari 15+, Edge 79+
- **Dependencies:** None (vanilla JavaScript, no libraries)
- **Data storage:** Browser localStorage only (no external servers)
- **Privacy:** All data generated locally; nothing sent externally
- **Export formats:** Text, PDF (via print), JSON, HTML (Word-compatible)

---

## Support & Updates

Built for **Tech & Electrical Services LLC**

For questions or feature requests:
- Review "Best Practices" tab for common questions
- Export as JSON for custom integrations
- Print/PDF export for client handoff

---

**Last updated:** 2026-03-19  
**Version:** 1.0  
**Status:** Production Ready
