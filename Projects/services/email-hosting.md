# Email Hosting Services Guide

> For Irvin's Tech Business | Last Updated: March 2026

This document covers the two main business email hosting platforms: **Microsoft 365** and **Google Workspace**. Both provide professional email with your custom domain, plus productivity suites.

---

## Quick Comparison

| Feature | Microsoft 365 Business Basic | Microsoft 365 Business Standard | Microsoft 365 Business Premium | Google Workspace Starter | Google Workspace Standard | Google Workspace Plus |
|---------|------------------------------|----------------------------------|--------------------------------|--------------------------|---------------------------|----------------------|
| **Price (annual)** | $6/user/mo | $12.50/user/mo | $22/user/mo | $7/user/mo | $14/user/mo | $22/user/mo |
| **Price (monthly)** | $9/user/mo | $15/user/mo | $26/user/mo | $9/user/mo | $18/user/mo | $27/user/mo |
| **Email Storage** | 50 GB | 50 GB | 50 GB | 30 GB | 2 TB | 5 TB |
| **Desktop Apps** | Web/Mobile only | ✅ Full Office suite | ✅ Full Office suite | Web/Mobile only | Web/Mobile only | Web/Mobile only |
| **Cloud Storage** | 1 TB OneDrive | 1 TB OneDrive | 1 TB OneDrive | 30 GB | 2 TB | 5 TB |
| **Video Meetings** | Teams (no recording) | Teams (recording) | Teams (recording) | 100 participants | 150 participants | 500 participants |
| **Security** | Basic | Basic | Advanced (Defender) | Standard | Standard | Vault, DLP |
| **AI Features** | Copilot (add-on $30/mo) | Copilot (add-on $30/mo) | Copilot (add-on $30/mo) | Gemini included | Gemini included | Gemini included |

---

## Microsoft 365 Options

### Plans

| Plan | Best For | Price (Annual) | Price (Monthly) |
|------|----------|----------------|-----------------|
| **Business Basic** | Teams + email + web Office apps | $6/user/mo | $9/user/mo |
| **Business Standard** | Full desktop Office apps needed | $12.50/user/mo | $15/user/mo |
| **Business Premium** | Security-focused, device management | $22/user/mo | $26/user/mo |

### Key Features

- **Business Email**: Custom domain (@yourcompany.com), 50 GB inbox
- **Exchange Online**: Calendar, contacts, tasks, shared mailboxes
- **Microsoft Teams**: Chat, video meetings, channel collaboration
- **Office Apps**: Word, Excel, PowerPoint, Outlook (Desktop = Standard+)
- **OneDrive**: 1 TB cloud storage per user
- **Security**: Exchange Online Protection, anti-phishing, spam filtering
- **Business Premium adds**: Microsoft Defender for Business, Intune device management

### Add-ons

- **Copilot for Microsoft 365**: $30/user/mo (requires Business Standard or Premium)
- **Teams Phone**: $12/user/mo
- **Additional storage**: $2.50/GB/month

---

## Google Workspace Options

### Plans

| Plan | Best For | Price (Annual) | Price (Monthly) |
|------|----------|----------------|-----------------|
| **Starter** | Small teams, basic needs | $7/user/mo | $9/user/mo |
| **Standard** | Growing businesses, more storage | $14/user/mo | $18/user/mo |
| **Plus** | Enterprise features, compliance | $22/user/mo | $27/user/mo |

### Key Features

- **Gmail**: Custom domain, 30 GB - 5 TB storage (plan dependent)
- **Chat & Meet**: Google Chat, video meetings with recording (Standard+)
- **Docs Suite**: Docs, Sheets, Slides, Sheets (web + mobile)
- **Google Drive**: 30 GB - 5 TB pooled storage
- **AI**: Gemini AI assistant included (Starter: Gmail only; Standard+/Plus: full suite)
- **Security**: 2FA, endpoint management, vault (Plus)
- **Plus adds**: eDiscovery, Vault, DLP, S/MIME encryption, 500 participant meetings

### Add-ons

- **Extra Storage**: $3/user/mo for 20 GB (Starter)
- **Cloud Search**: $10/user/mo
- **Vault**: Included in Plus/Enterprise

---

## Setup Process

### Microsoft 365 Setup

1. **Purchase License**
   - Go to [microsoft.com/microsoft-365/business](https://www.microsoft.com/en-us/microsoft-365/business)
   - Choose plan, create Microsoft account
   - Enter business info and payment

2. **Add Domain**
   - In Microsoft 365 admin center → Setup → Domains
   - Enter your domain (e.g., yourcompany.com)
   - Verify ownership via TXT record or HTML file upload
   - Add DNS records for email (MX, CNAME, TXT)

3. **Create User Accounts**
   - Admin center → Users → Add user
   - Assign licenses (Basic/Standard/Premium)
   - Set passwords (force change on first login)

4. **Configure DNS Records** (at your domain registrar)
   ```
   MX:   @ → yourdomain-com.mail.protection.outlook.com
   TXT:  v=spf1 include:spf.protection.outlook.com -all
   CNAME:autodiscover → autodiscover.outlook.com
   ```

5. **Configure Client Apps** (optional)
   - Outlook desktop: File → Add Account → enter email
   - Mobile: Download Outlook app, sign in

### Google Workspace Setup

1. **Purchase Subscription**
   - Go to [workspace.google.com](https://workspace.google.com)
   - Select plan → Create account
   - Enter business details

2. **Verify Domain**
   - Admin console → Domains → Add domain
   - Choose verification method (TXT record or HTML upload)
   - Add verification record at registrar

3. **Add Users**
   - Admin console → Users → Add user
   - Enter name, email (you@yourcompany.com), assign plan

4. **Configure DNS** (at registrar)
   ```
   MX:   @ → aspmx.l.google.com (priority 1)
         @ → alt1.aspmx.l.google.com (priority 5)
   TXT:  v=spf1 include:_spf.google.com ~all
   ```

5. **Client Setup**
   - Gmail: Add account in Gmail app or desktop
   - Mobile: Download Gmail, Google Drive, Meet apps

---

## Migration Tips

### Pre-Migration Checklist

- [ ] Audit current email volume and storage needs
- [ ] Create inventory of all mailboxes (accounts, aliases, distribution lists)
- [ ] Inform users of migration timeline
- [ ] Set up new accounts and test before migrating
- [ ] Back up critical emails locally (PST/local files)

### Migration Methods

#### Option 1: IMAP Migration (DIY)
**Best for**: Small volumes, migrating from most email providers

1. **In destination (M365/Google)**:
   - Enable IMAP access for accounts
   
2. **Tools to use**:
   - **Google Workspace Migrate**: Free tool from Google (supports M365 → Google)
   - **MigrationWiz**: Paid, handles large migrations, $10+/user
   - **IMAP Sync**: Open-source CLI tool

3. **Process**:
   ```
   Source (old) → IMAP → Destination (new)
   ```

#### Option 2: Direct Migration (Managed)
**Best for**: Moving from another cloud provider

**Microsoft 365**:
- Use [Microsoft Migration Center](https://admin.microsoft.com/#/migration)
- Supports: IMAP, PST files, Google Workspace, Exchange

**Google Workspace**:
- Use [Google Workspace Migration (GWM)](https://admin.google.com/ac/migration)
- Supports: IMAP, PST, Exchange, Office 365

#### Option 3: Third-Party Tools
- **BitTitan MigrationWiz**: Industry standard, ~$15/user
- **SkyKick**: Partner-provided, white-glove migration
- **CloudM**: $12/user, supports complex migrations

### Migration Best Practices

1. **Phased Rollout**: Migrate in batches (IT → execs → departments)
2. **Delta Sync**: Do final sync just before cutover to catch new emails
3. **Keep old system running**: 2-4 weeks parallel operation
4. **Update DNS**: Change MX records last, after confirming migration
5. **Test thoroughly**: Send/receive from both platforms during parallel period
6. **Document settings**: Save old configuration for rollback if needed

### Post-Migration

- Verify all emails, calendar, contacts transferred
- Update email signatures
- Reconfigure email clients for users
- Set up mobile device management (if applicable)
- Monitor for 1-2 weeks, address issues

---

## Recommendations for Irvin's Business

| Scenario | Recommendation |
|----------|----------------|
| **Needs desktop Office apps** | Microsoft 365 Business Standard |
| **Heavy Google ecosystem user** | Google Workspace Standard |
| **Security/compliance priority** | Microsoft 365 Business Premium or Google Workspace Plus |
| **Budget-constrained startup** | Google Workspace Starter or M365 Basic |
| **Client prefers specific platform** | Match client (some enterprises require M365) |

### For Selling to Clients

- **Microsoft 365** is often preferred by enterprise clients and those already using Windows/Office
- **Google Workspace** often preferred by startups, tech-forward teams, and those using Mac/iOS
- Both are profitable to provision and manage — pick based on client needs, not personal preference
- Consider offering **managed services**: include setup, migration, ongoing support in your pricing

---

## Sources

- Microsoft 365 Business Plans: https://www.microsoft.com/en-us/microsoft-365/business
- Google Workspace Pricing: https://workspace.google.com/pricing
- Pricing current as of March 2026 (annual billing shown; monthly ~50% more)
