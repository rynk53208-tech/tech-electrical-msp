# Email Troubleshooting Guide

Quick reference for diagnosing and resolving common email issues.

---

## 1. Outlook Issues

### Common Problems & Fixes

| Issue | Likely Cause | Fix |
|-------|--------------|-----|
| **Cannot send/receive** | Corrupt OST/PST file | Repair: `outlook.exe /cleanreminders` or recreate profile |
| **Password prompts keep appearing** | Token expired / corrupted creds | Remove account, re-add |
| **Syncing delays** | Offline mode / exchange throttling | Check connection, toggle cached mode |
| **Search not working** | Index corrupted | Rebuild index: Outlook > File > Options > Search > Indexing Options |
| **Attachments won't open** | Blocked file types | File > Options > Trust Center > Attachment Options |
| **Calendar meetings show as tentitive** | Delegate permissions / delegate sent items | Check delegate settings |

### Commands to Know
- `outlook.exe /cleanreminders` - Clean reminders
- `outlook.exe /resetnavpane` - Reset navigation pane
- `outlook.exe /cleanprofiles` - Remove corrupted profiles
- `outlook.exe /rebuild` - Rebuild search index

### IMAP vs POP vs Exchange
- **IMAP**: Best for multi-device, mail stays on server
- **POP**: Downloads and optionally deletes from server
- **Exchange/365**: Full Outlook features, best for business

---

## 2. Gmail Issues

### Authentication Problems
- **App Passwords**: If 2FA enabled, need app-specific password for IMAP/SMTP
- **Less Secure Apps**: Must enable (deprecated, use App Passwords instead)
- **Account locked**: Check https://accounts.google.com/activity for security alerts

### SMTP/IMAP Settings
```
Incoming (IMAP): imap.gmail.com, port 993, SSL
Outgoing (SMTP): smtp.gmail.com, port 587, TLS
```

### Common Fixes
1. **Enable IMAP** in Gmail Settings > Forwarding and POP/IMAP
2. **Check filters** - Emails might be auto-archived/labels
3. **Check spam** - Sometimes legitimate mail lands there
4. **Check send-as aliases** - Verify "Send mail as" settings

### Business / Google Workspace
- Admin console may block external access
- Check https://admin.google.com for security policies

---

## 3. MX Record Problems

### What Are MX Records?
Mail Exchange records tell senders where to deliver email for your domain.

### Basic Checks
1. **MX priority** - Lower number = higher priority
2. **TTL** - Propagation can take 24-48 hours
3. **A/AAAA records** - MX hostnames must resolve

### Diagnostic Commands
```bash
# Check MX records
dig mx domain.com
nslookup -type=mx domain.com

# Verify MX points to valid mail server
dig mail.domain.com
```

### Common Issues
- **No MX record** → No incoming mail works
- **MX points to hostname that doesn't resolve** → DNS failure
- **MX priority confusion** → Mail goes to wrong server
- **TTL too high** → Changes take forever to propagate

### Fixes
- Ensure domain has at least 2 MX records (primary + backup)
- MX hostname must have A/AAAA record pointing to mail server IP

---

## 4. SPF, DKIM, DMARC

### SPF (Sender Policy Framework)
**Purpose**: Specifies which servers can send mail for your domain.

**DNS Entry Example**:
```
v=spf1 include:_spf.google.com ~all
```

| Qualifier | Meaning |
|-----------|---------|
| `+all` | Allow all (bad) |
| `-all` | Fail (strict) |
| `~all` | Softfail (recommended) |
| `?all` | Neutral |

**Troubleshooting**:
- Too many lookups (>10) causes failures
- IP addresses must be exact (no CNAMEs in include)
- Test at: https://www.mail-tester.com/

### DKIM (DomainKeys Identified Mail)
**Purpose**: Cryptographic signature proving email hasn't been tampered with.

**DNS Entry**:
- Public key published in DNS (selectors._domainkey.yourdomain.com)
- Private key kept on mail server

**Troubleshooting**:
- Selector mismatch = DKIM fail
- Key rotation without updating DNS = fail
- Header mismatch = fail
- Test at: https://dkimvalidator.info/

### DMARC (Domain-based Message Authentication)
**Purpose**: Policy for what happens when SPF/DKIM fail.

**DNS Entry**:
```
v=DMARC1; p=quarantine; rua=mailto:reports@yourdomain.com
```

| Policy | Action |
|--------|--------|
| `none` | Monitor only |
| `quarantine` | Suspicious mail to spam |
| `reject` | Block unauthorized mail |

**Troubleshooting**:
- Requires valid SPF + DKIM for passing
- `rua` collects aggregate reports
- `ruf` collects forensic reports
- Start with `p=none` then tighten up

---

## Quick Diagnostic Flowchart

```
[Email Problem]
       ↓
[Can you send? No] → Check SMTP settings / auth
       ↓
[Can you receive? No] → Check MX records
       ↓
[Delivery fails / goes to spam] → Check SPF/DKIM/DMARC
       ↓
[Client-specific?] → Outlook: repair profile, Gmail: check filters
```

---

## Tools to Use

| Tool | URL | What It Tests |
|------|-----|---------------|
| MXToolbox | mxtoolbox.com | MX, SPF, blacklist checks |
| Mail-Tester | mail-tester.com | Full deliverability score |
| DKIM Validator | dkimvalidator.info | DKIM verification |
| DMARC Inspector | dmarcian.com | DMARC record analysis |
| EmailHeaders | emailheaders.dev | Header analysis |

---

## Need More Help?

Check domain reputation at:
- https://senderscore.org
- https://www.blacklistmonitor.org

Common causes of email going to spam:
1. Low domain reputation
2. High complaint rates (Gmail/Outlook users marking as spam)
3. Missing or broken authentication (SPF/DKIM/DMARC)
4. Bad content (too many links, suspicious keywords)
5. Old domain with no history