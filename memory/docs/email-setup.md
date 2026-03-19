# Email Setup Guide

> For Irvin's Tech Business — Quick reference for setting up business email with Microsoft 365 and Google Workspace.

---

## 1. Microsoft 365 Setup

### Step 1: Sign Up
1. Go to [microsoft.com/business](https://www.microsoft.com/business) or [admin.microsoft.com](https://admin.microsoft.com)
2. Choose a plan (Business Basic, Standard, or Premium)
3. Sign up with a new domain or add your existing domain

### Step 2: Add Your Domain
1. In Admin Center → **Settings** → **Domains**
2. Click **Add domain** and enter your domain (e.g., `yourcompany.com`)
3. Verify ownership via DNS TXT record (provided by Microsoft)

### Step 3: Create User Accounts
1. **Users** → **Add user**
2. Fill in name, username (e.g., `john@yourcompany.com`), password
3. Assign license (Business Basic/Standard/Premium)

### Step 4: Configure DNS Records
Microsoft will provide records to add to your DNS provider:

| Type | Host | Value | Priority |
|------|------|-------|----------|
| TXT | @ | `MS=msXXXXXXXX` | - |
| MX | @ | `yourdomain-com.mail.protection.outlook.com` | 0 |
| CNAME | autodiscover | `autodiscover.outlook.com` | - |
| CNAME | msoid | `clientconfig.microsoftonline-p.net` | - |

### Step 5: Set Up Outlook
- Download Outlook app or use webmail at [outlook.office.com](https://outlook.office.com)
- Sign in with your Microsoft 365 credentials

---

## 2. Google Workspace Setup

### Step 1: Sign Up
1. Go to [workspace.google.com](https://workspace.google.com)
2. Click **Get Started**
3. Enter your business name, number of employees
4. Choose a domain (buy one through Google or use existing)

### Step 2: Verify Domain Ownership
1. Google will ask to verify — typically via **TXT record** method
2. Add the TXT record at your domain registrar
3. Click "Verify" in Google Workspace

### Step 3: Add Users
1. Go to **Admin Console** → **Users**
2. Click **Add new user**
3. Enter first name, last name, email (e.g., `john@yourcompany.com`)

### Step 4: Configure DNS Records
Add these records at your DNS provider:

| Type | Host | Value |
|------|------|-------|
| MX | @ | `aspmx.l.google.com` | 1 |
| MX | @ | `alt1.aspmx.l.google.com` | 5 |
| MX | @ | `alt2.aspmx.l.google.com` | 5 |
| MX | @ | `alt3.aspmx.l.google.com` | 10 |
| MX | @ | `alt4.aspmx.l.google.com` | 10 |
| TXT | @ | `v=spf1 include:_spf.google.com ~all` | - |
| CNAME | mail | `ghs.googlehosted.com` | - |
| CNAME | calendar | `calendar.googlehosted.com` | - |

### Step 5: Set Up Gmail
- Access at [mail.google.com](https://mail.google.com)
- Or use Gmail app on mobile

---

## 3. DNS Records Needed (Summary)

### MX Records (Mail Exchange)
- **Purpose:** Routes incoming email to your mail server
- **Priority:** Lower number = higher priority
- Multiple MX records provide redundancy

### SPF Record (TXT)
- **Purpose:** Authorizes which servers can send email for your domain
- **Example:** `v=spf1 include:_spf.google.com ~all`
- Replace with your provider's SPF include

### DKIM Record (TXT/CNAME)
- **Purpose:** Cryptographic signature to verify email authenticity
- Microsoft 365: Auto-configures after verification
- Google Workspace: Found in Admin Console → Security → DKIM

### DMARC Record (TXT)
- **Purpose:** Policy for handling SPF/DKIM failures
- **Example:** `v=DMARC1; p=none; rua=mailto:dmarc-reports@yourdomain.com`

### CNAME Records
- **Purpose:** Helps mail clients auto-discover your server settings
- `autodiscover` → Microsoft
- `mail` or `msoid` → Google

### Records Summary Table

| Provider | MX Priority | SPF Include | Auto-Discover |
|----------|-------------|-------------|---------------|
| Microsoft 365 | 0 | `spf.protection.outlook.com` | autodiscover.outlook.com |
| Google Workspace | 1, 5, 5, 10, 10 | `_spf.google.com` | ghs.googlehosted.com |

---

## 4. Common Issues & Fixes

### Email Not Arriving
- **Check MX records:** Run `dig MX yourdomain.com` or check DNS provider
- **Check spam folder:** Sometimes flagged incorrectly
- **Verify SPF/DKIM:** Use [mail-tester.com](https://www.mail-tester.com) or [dkimvalidator.com](https://dkimvalidator.com)
- **Wait for propagation:** DNS can take 24-48 hours (usually 5-30 min)

### "Server Not Found" / Cannot Connect
- **Verify CNAME records** are correct
- **Check URL:** Use correct webmail URL (outlook.com vs mail.google.com)
- **Clear DNS cache:** `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)

### Domain Verification Failed
- **Check TXT record format:** Ensure no extra spaces or quotes
- **Wait for propagation:** May take up to 24 hours
- **Use alternative method:** Some registrars offer HTML meta tag verification

### SPF/DKIM Failures
- **SPF too strict:** Ensure all email sending services are included (e.g., marketing tools, CRM)
- **DKIM not enabled:** Enable in provider admin panel
- **Alignment issues:** Domain in "From" must match SPF/DKIM

### Password Reset / Locked Out
- **Microsoft 365:** Admin can reset via Admin Center → Users
- **Google Workspace:** Admin can reset via Admin Console → Users

### SMTP/IMAP Not Working
- **Check port settings:**
  - SMTP: 587 (TLS) or 465 (SSL)
  - IMAP: 993 (SSL)
  - POP3: 995 (SSL)
- **Enable app passwords:** Some providers require app-specific passwords for third-party clients

### Business Email on iPhone/Android
- **iOS:** Settings → Mail → Accounts → Add Account → Microsoft/Google
- **Android:** Use Gmail app → Add Account, or use Outlook app
- **Auto-config:** Most providers auto-detect settings via domain

### Dual/Multi-Provider Setup (Split Delivery)
- If using both Microsoft and Google, you'll need routing rules
- **Recommended:** Use one provider for primary, forward secondary
- Alternatively, use catch-all with external forwarding (watch for loops)

---

## Quick Checklist

- [ ] Domain purchased/owned
- [ ] Provider account created
- [ ] Domain verified (TXT record)
- [ ] MX records added
- [ ] SPF record added
- [ ] CNAME records added (autodiscover/mail)
- [ ] Users created
- [ ] Tested sending/receiving email
- [ ] Tested from external email (Gmail, Yahoo, etc.)

---

## Need Help?

If issues persist, check:
- Provider's status page: [Microsoft 365 Status](https://status.office.com) | [Google Workspace Status](https://status.cloud.google.com)
- DNS propagation: [dnschecker.org](https://dnschecker.org)
- Email deliverability: [mail-tester.com](https://www.mail-tester.com)

---

*Last updated: 2025-03-18*
