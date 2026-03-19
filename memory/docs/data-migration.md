# Client Data Migration Checklist

Standard operating procedure for client data migrations. Adjust scope based on client size and complexity.

---

## 1. Pre-Migration Steps

### Discovery & Assessment
- [ ] **Initial client interview** — Understand what systems they use, what data matters, timeline expectations
- [ ] **Inventory current systems** — Hardware, software, cloud services, network topology
- [ ] **Identify data owners** — Who owns what data, access credentials, responsible parties
- [ ] **Document current state** — Screenshot configs, export current settings where possible
- [ ] **Assess data volume** — Total size, types (files, databases, emails, configs)
- [ ] **Identify dependencies** — What systems/services rely on what data

### Planning
- [ ] **Define migration scope** — What's moving, what's staying, what's being retired
- [ ] **Choose migration method** — Lift-and-shift, re-platform, hybrid, phased rollout
- [ ] **Schedule maintenance window** — Notify client of downtime, set realistic expectations
- [ ] **Assign roles** — Who handles what (you, client IT, third parties)
- [ ] **Plan rollback procedure** — How to revert if things go sideways

### Preparation
- [ ] **Backup everything** — Full backup of source systems before touching anything
- [ ] **Verify backup integrity** — Test restores on a subset to confirm viability
- [ ] **Prepare destination environment** — New server/cloud instance, permissions, network access
- [ ] **Gather credentials** — Service accounts, API keys, admin passwords (stored securely)
- [ ] **Prepare migration tools** — Scripts, transfer utilities, conversion tools ready
- [ ] **Pre-stage large transfers** — If possible, start bulk transfers before cutover

### Client Communication
- [ ] **Send pre-migration notification** — Timeline, expected downtime, contact info
- [ ] **Confirm change approval** — Get written sign-off on migration plan
- [ ] **Establish communication channel** — How to reach each other during migration

---

## 2. Data to Migrate

### Core Business Data
- [ ] **User files** — Documents, spreadsheets, presentations, PDFs
- [ ] **Email** — Mailboxes, archives, signatures, rules (PST/Exchange/Google)
- [ ] **Contacts** — Address books, CRM data
- [ ] **Calendar** — Events, recurring meetings, shared calendars

### System & Configuration
- [ ] **User profiles** — Desktop settings, favorites, shortcuts
- [ ] **Application settings** — Config files, registries, preferences
- [ ] **Browser data** — Bookmarks, saved passwords, history (if requested)
- [ ] **Windows/machine settings** — Domain joins, mapped drives, VPN configs

### Databases & Applications
- [ ] **Database exports** — MySQL, PostgreSQL, SQL Server, SQLite
- [ ] **Application data** — ERP, CRM, accounting software databases
- [ ] **Custom configurations** — Any software the client depends on

### Security & Access
- [ ] **User accounts** — AD accounts, groups, permissions
- [ ] **SSL certificates** — Valid certs for new environment
- [ ] **Firewall rules** — If moving networks/hosting
- [ ] **VPN configurations** — Client access setup
- [ ] **Backup schedules** — Replicate existing backup jobs

### Infrastructure
- [ ] **DNS records** — Zone transfers, record updates
- [ ] **DHCP scopes** — If inheriting network
- [ ] **Certificates & keys** — Any PKI materials

---

## 3. Post-Migration Verification

### Functional Testing
- [ ] **User access test** — All users can log in with proper permissions
- [ ] **File access test** — Users can open/edit/save files in shared locations
- [ ] **Email flow test** — Send/receive internally and externally
- [ ] **Application test** — Critical apps launch and connect to data
- [ ] **Database connectivity** — Apps can reach migrated databases

### Data Integrity
- [ ] **File count match** — Compare source vs destination file counts
- [ ] **Sample file verification** — Spot-check file integrity (hash check)
- [ ] **Email count verification** — Confirm all mailboxes migrated completely
- [ ] **Database record counts** — Verify row counts match pre-migration

### Network & Security
- [ ] **DNS resolution** — Internal and external names resolve correctly
- [ ] **Firewall logs** — Check for blocked traffic, adjust rules as needed
- [ ] **VPN connectivity** — Remote access works for all users
- [ ] **Backup verification** — First post-migration backup completes successfully

### Performance
- [ ] **Application response time** — Within acceptable thresholds
- [ ] **File transfer speeds** — Test network throughput to new location
- [ ] **Database query times** — No significant degradation

### Client Sign-Off
- [ ] **User acceptance testing** — Key users confirm everything works
- [ ] **Document issues** — Note any discrepancies or complaints
- [ ] **Get written approval** — Client confirms migration complete and acceptable

---

## 4. Common Issues

### Data Loss or Corruption
- **Cause:** Incomplete transfer, interrupted sync, bad sectors on source
- **Fix:** Restore from pre-migration backup; re-run transfer with verification

### Permission Problems
- **Cause:** ACLs not preserved, new domain SID mismatches
- **Fix:** Run permission audit script post-migration; map old SIDs to new accounts

### Email Migration Gaps
- **Cause:** Large mailboxes timing out, PST corruption, shared mailboxes missed
- **Fix:** Split large PSTs, use staged migration, verify delegate access

### Application Connectivity
- **Cause:** Hardcoded connection strings, old server names in configs
- **Fix:** Update config files, use DNS CNAMEs for flexibility, test before cutover

### Downtime Exceeded
- **Cause:** Underestimated transfer time, unforeseen issues
- **Fix:** Better estimation with test runs; keep rollback plan ready

### User Profile Issues
- **Cause:** Roaming profiles too large, incompatible profile versions
- [ ] **Fix:** Exclude large local caches (Chrome temp, OneDrive cache), migrate selectively

### DNS Propagation Delays
- **Cause:** TTL too high, ISP caching
- **Fix:** Lower TTL 24h before migration; use hosts file for testing

### SSL Certificate Errors
- **Cause:** Cert not installed, wrong hostname, expired
- **Fix:** Import certs to new server, use Let's Encrypt for quick temp certs

### Database Migration Failures
- **Cause:** Version incompatibility, syntax differences, encoding issues
- **Fix:** Test on staging environment first; export with compatibility settings

---

## Quick Reference

| Phase | Key Action | Red Flag |
|-------|-----------|----------|
| Pre-Migration | Full backup | No verified backup = don't proceed |
| Migration | Test transfer | Test fails = fix before full run |
| Post-Migration | UAT sign-off | Client unhappy = not done |

**Timeline Estimate:**
- Small (<50GB): 2-4 hours
- Medium (50-500GB): 1-3 days
- Large (500GB+): 1+ week

---

*Document version: 1.0 | Created for Irvin's Tech Services*