# Password Policy Guide
## Irvin's Tech Services — Security Best Practices

---

## 1. Best Password Practices

### Password Requirements
- **Minimum 16 characters** (longer is better — passphrase style)
- Use **passphrases**: 4+ random words combined (e.g., `correct-horse-battery-staple`)
- Never reuse passwords across accounts
- Never use personal info (birthdays, names, pet names)
- Never use common words or patterns (password, 123456, qwerty)

### What to Avoid
- Dictionary words alone
- Keyboard patterns (`asdf`, `1qaz2wsx`)
- Sequential numbers/letters
- Credential stuffing (hackers try leaked credentials across sites)
- Writing passwords on sticky notes or in unencrypted files

### Rotation Policy
- Rotate **immediately** if compromise is suspected
- Otherwise, rotate **annually** for high-value accounts
- Use password change as opportunity to upgrade to passkeys where possible

---

## 2. Password Manager Recommendations

| Manager | Best For | Notes |
|---------|----------|-------|
| **1Password** | Business/SMB | Excellent Teams/Families plans, secure sharing, travel mode |
| **Bitwarden** | Self-hosted / Budget | Open source, affordable, optional self-hosting |
| **Dashlane** | Ease of use | Good UI, built-in VPN, dark web monitoring |
| **KeePassXC** | Offline-first | Free, open source, local database, manual sync |

### Recommendation for Irvin's Business
**1Password Business** or **Bitwarden Teams** — both offer:
- Secure sharing between team members
- Admin controls & audit logs
- MFA enforcement options

### Setup Essentials
- Master password: 20+ character passphrase, never reused anywhere
- Enable MFA on the password manager itself (critical!)
- Use secure sharing features — never email passwords
- Emergency access / recovery plan for owner accounts

---

## 3. MFA Implementation

### Priority Order (Best to Least Best)
1. **Passkeys (FIDO2/WebAuthn)** — Best. Phishing-resistant, no secret to steal
2. **Hardware Keys** (YubiKey, Google Titan) — Excellent. Physical device required
3. **Authenticator Apps** (1Password, Authy, Aegis) — Good. TOTP codes
4. **SMS/Email** — Avoid. SIM swapping and interception risks

### Where to Enforce MFA
- ✅ All cloud admin accounts (AWS, Azure, Google Workspace, etc.)
- ✅ Password managers
- ✅ Banking & financial accounts
- ✅ VPN & remote access
- ✅ GitHub, GitLab, bitbucket
- ✅ Email (especially if using catch-all or business email)

### Rollout Strategy
1. **Phase 1** — Enable on password manager + critical admin accounts (week 1)
2. **Phase 2** — Roll out to team (week 2-3)
3. **Phase 3** — Audit and enforce policies (week 4)

### Backup Codes
- Generate and store securely (encrypted password manager)
- Never reuse the same code twice
- Consider printed copy in secure location (safe)

---

## 4. Company Policy Template

```markdown
# Password & Access Security Policy
## [Company Name] | Effective Date: [Date]

---

### 1. Purpose
This policy establishes requirements for creating, managing, and protecting passwords and authentication credentials used within the company.

---

### 2. Scope
Applies to all employees, contractors, and third parties with access to company systems, data, or networks.

---

### 3. Password Requirements

| Requirement | Standard |
|-------------|----------|
| Minimum Length | 16 characters |
| Complexity | Passphrase (4+ random words) OR complex string |
| Reuse | Never reuse across different accounts |
| Sharing | Prohibited — use secure sharing features in password manager |
| Storage | Password manager ONLY — no spreadsheets, notes, email |

---

### 4. Multi-Factor Authentication (MFA)

**Required** for:
- Password manager
- Cloud service admin consoles (AWS, Azure, Google, etc.)
- Email accounts
- VPN and remote access
- Source control (GitHub, GitLab)
- Banking/financial tools

**Acceptable MFA Methods** (in order of preference):
1. Passkey / Hardware security key (YubiKey)
2. Authenticator app (1Password, Authy, Aegis)
3. SMS (last resort — avoid where possible)

---

### 5. Account Lifecycle

| Event | Action |
|-------|--------|
| New employee | Provision account, set temporary password, require MFA setup on first login |
| Password reset | User initiates via password manager or IT admin; full verification required |
| Termination | Revoke access immediately; disable account within 24 hours |
| Suspected compromise | Reset password + rotate MFA immediately; investigate |

---

### 6. Prohibited Practices

- Writing passwords on paper, whiteboards, or unencrypted files
- Sharing passwords via email, chat, or verbal
- Using personal accounts for business data
- Saving passwords in browser autofill
- Using the same password across work and personal accounts
- Clicking password reset links from unknown sources (phishing)

---

### 7. Incident Reporting

**Immediately report**:
- Suspected password compromise
- Lost/stolen device with password manager access
- Phishing attempts
- Unauthorized access attempts

**Contact**: [IT Security Contact]

---

### 8. Compliance & Enforcement

- First violation: Verbal warning + retraining
- Second violation: Written warning
- Third violation: Disciplinary action up to termination

Violations involving data breach or client compromise may result in immediate termination.

---

### 9. Policy Review

Reviewed annually or after any significant security incident.

**Approved by**: _________________ | **Date**: _____________
```

---

## Quick Wins Checklist

- [ ] Set up 1Password Business or Bitwarden Teams
- [ ] Enable MFA on password manager first (most critical)
- [ ] Generate 16+ character passphrases for all accounts
- [ ] Audit: Which accounts still lack MFA? Prioritize by risk
- [ ] Document account inventory (who has access to what)
- [ ] Set up emergency access for business-critical accounts

---

*For questions or help implementing this policy, contact Irvin's Tech Services.*
