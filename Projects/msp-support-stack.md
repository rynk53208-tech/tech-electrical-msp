# MSP Support Stack — Complete Technical & Business Requirements

**Purpose:** Comprehensive outline of tools, services, and infrastructure needed to operate a managed service provider (MSP) business. Includes setup recommendations, cost estimates, and integration considerations.

**Prepared:** March 2026 | **For:** Irvin Avitia (DevOps + MSP operations)

---

## 1. RMM (Remote Monitoring & Management)

RMM is the backbone—continuous monitoring, alerting, and remote access to client systems.

### Top Options

| Tool | Strengths | Cost | Best For |
|------|-----------|------|----------|
| **N-able N-central** | Enterprise feature set, multi-tenant, reporting | $60-150/device/month | Large MSPs, complex environments |
| **Kaseya VSA** | Powerful automation, patch management, strong reporting | $50-120/device/month | Mature MSPs, Windows-heavy |
| **ConnectWise Automate** | Tight PSA integration, workflow automation, expansive | $40-100/device/month | Medium-large MSPs, integrated stacks |
| **Syncro** | Modern UI, SMB-friendly, includes PSA + RMM | $149-499/tech/month | Small-medium MSPs, all-in-one preference |
| **Datto RMM** | Ease of use, strong Datto ecosystem tie-in | $35-85/device/month | SMB MSPs, Datto backup users |
| **Tactical RMM** | Open-source, on-premises option, minimal cost | ~$500-2000 setup + hosting | Cost-conscious, technical MSPs |

### Recommendation for Your Stack
**Primary:** ConnectWise Automate (if scaling) or **Syncro** (if speed-to-market matters)
- Syncro wins on time-to-value and integrated PSA—no separate ticketing system needed initially
- ConnectWise Automate offers more control and enterprise features as you scale
- **Cost estimate:** $80-120/device/month at 50-100 devices

### Key Features to Require
- Real-time alerting with customizable thresholds
- Patch management automation
- Remote control & file transfer
- Software deployment
- Script execution engine
- Multi-tenant architecture
- Reporting & dashboards
- Integration with PSA system

---

## 2. PSA (Professional Services Automation)

PSA handles ticketing, time tracking, billing, and CRM. Often bundled with RMM.

### Top Options

| Tool | Strengths | Integration | Cost |
|------|-----------|-------------|------|
| **ConnectWise Manage** | Industry standard, deep automation, reporting | Native with Automate | $50-150/tech/month |
| **Syncro PSA** | Modern design, built-in RMM, simpler workflows | Native (all-in-one) | $149-499/tech/month |
| **Autotask (Datto)** | Strong feature set, good UI, Datto ecosystem | APIs available | $40-100/tech/month |
| **ServiceTitan** | Consumer-facing scheduling, mobile-first | API-based | $70-120/tech/month |
| **HaloPSA** | European-strong, good value, flexible | Wide integrations | $35-80/tech/month |
| **Atera** | All-in-one (RMM + PSA + mobile), startup-friendly | Native | $89-139/tech/month |

### Recommendation for Your Stack
**Primary:** **Syncro** (integrated RMM + PSA) or **ConnectWise Manage** + Automate (if enterprise features needed)
- Syncro: Fastest path to revenue, no integration headaches
- ConnectWise: More flexibility, better for complex billing/multi-tier contracts

**Key PSA Features**
- Ticketing with SLA management
- Time tracking & billing
- Contract management
- Invoice generation & payment processing
- CRM for lead tracking
- Knowledge base integration
- Mobile app for techs
- Reporting on utilization, revenue, profitability
- Approval workflows

---

## 3. Help Desk Tools — Phone, Chat, Ticket Management

Multi-channel support inbound + internal communication.

### Phone Systems
- **RingCentral** ($20-30/user/month): VoIP, call recording, IVR, mobile app
- **Vonage Contact Center** ($25-50/user/month): Contact center features, call routing
- **Twilio** ($0.01-0.05 per minute + setup): DIY approach, integrates with PSA via webhooks
- **Jive Communications** ($15-25/user/month): HIPAA-compliant option
- **Recommendation:** RingCentral for most MSPs—call recording is critical for QA

### Chat/Messaging
- **Slack** ($8-12.50/user/month): Team chat, integrations, searchable history
- **Microsoft Teams** ($5-15/user/month): Tight Microsoft/Office 365 integration
- **Discord** (Free or $100/month pro): Internal chat only, informal but effective
- **Rocket.Chat** (Open-source, self-hosted): Privacy-focused, zero per-user cost
- **Recommendation:** Slack or Teams depending on your Office 365 footprint

### Ticketing & Ticket Routing
Most MSPs consolidate here via PSA:
- **ConnectWise/Syncro/Autotask:** Built-in email-to-ticket routing
- Incoming support email → auto-creates ticket → assigned to queue
- Public portal for clients to submit tickets
- Phone integration (automated IVR) routing calls to ticket queue

### Estimated Cost (for small MSP, 10 techs)
- Phone system (RingCentral, 10 seats): $250/month
- Chat (Slack, 10 seats): $100/month
- Ticketing: Built into PSA
- **Total: ~$350/month**

---

## 4. Backup and Disaster Recovery Solutions

Critical for MSP liability and client retention. Many MSPs resell these.

### On-Premises Backup (for client servers/NAS)
- **Veeam Backup & Replication** ($2000-5000/license/year): Industry standard, incremental, dedup
- **Acronis Cyber Backup** ($3-8/GB/month): Cloud-enabled, ransomware protection
- **Nakivo Backup** ($1500-4000/license/year): Cost-effective, Hyper-V/VMware
- **Commvault** ($3000+/year): Enterprise, full infrastructure

### Cloud Backup (workstations, endpoints)
- **Backblaze B2 Backup** ($7/month per device): Simple, affordable, cloud-only
- **Carbonite MSP** ($10-20/device/month): Managed service ready
- **Acronis Cloud Backup** ($8-15/device/month): Ransomware detection
- **Datto Backup** ($30-80/device/month): Integrated with Datto RMM/Autotask
- **Wahooli Backup** ($8-12/device/month): Cloud + local hybrid

### Disaster Recovery (DR-as-a-Service)
- **Datto SIRIS** ($3000-8000/month): Integrated backup + local instant recovery
- **Veeam Cloud Connect** ($500-2000/month): Multi-tenant DR
- **Zerto** ($2000-5000/month): Continuous data protection, near-zero RTO/RPO

### Recommendation for Your Stack
**Tiered approach:**
1. **Datto SIRIS** as loss leader for clients (resold at 3-4x cost)
2. **Backblaze B2 Backup** for workstations (cheap, SIMPLE)
3. **Acronis Cloud Backup** as mid-market alternative
4. **Local NAS + Veeam** for larger client servers

**Estimated cost to offer (per client):**
- Small business (10 PCs): $150-250/month
- Mid-market (100 devices + server): $800-1500/month
- Markup: 2.5-3.5x to MSP margin

---

## 5. Security Tools — Antivirus, Patching, Monitoring

Defensive stack to protect client environments + MSP infrastructure.

### Endpoint Protection (EDR/XDR)
- **Microsoft Defender for Business** ($3-6/user/month): Built-in Windows, good value
- **CrowdStrike Falcon** ($150-250/month minimum): Industry-leading, behavioral analytics
- **SentinelOne** ($100-300/device/month): Cloud-native, no agent slowdown
- **Sophos Intercept X** ($8-15/device/month): Behavioral protection, encryption support
- **Trend Micro Maximum Security** ($6-12/device/month): Traditional but reliable

### Patch Management
- **Windows Update for Business** (Included): Group Policy-based
- **Patch My PC** (Free): Third-party app patching
- **Advanced Software Maintenance (ASM)** by Datto ($10-20/device/month): Integrated
- **Kaseya VSA, ConnectWise Automate:** Built-in patch modules
- **WSUS** (Free on-premises): Complex but zero cost
- **Recommendation:** Start with Windows Update + RMM built-in patching, add Patch My PC

### Network Monitoring & SIEM (light)
- **Graylog** (Open-source, $0): Self-hosted log aggregation
- **Splunk** ($0.15-0.50/GB/day): Industry standard, expensive at scale
- **Elastic Stack** (Free/open): ELK stack, moderate complexity
- **Datadog** ($15-50/host/month): SaaS SIEM, good for cloud workloads
- **Wazuh** (Open-source, free): Lightweight HIDS, decent for SMBs
- **Recommendation for MSPs:** Start with Wazuh (free), Recommended PSA integration

### Firewall Management (if offering managed networks)
- **Fortinet FortiGate** ($300-1000+ hardware): Perimeter firewall
- **Ubiquiti UniFi** ($200-500 hardware): SMB networks, cloud management
- **Palo Alto Networks** ($1000-3000+ hardware): Enterprise, requires expertise
- **Meraki SD-WAN** ($200-500/month): Cloud-managed branch offices

### Vulnerability Scanning
- **Qualys VMDR** ($3000-8000/month minimum): Cloud-based, continuous
- **Greenbone Vulnerability Manager** ($3000-10000/year): Self-hosted, open-source base
- **Nessus Professional** ($2400/year): On-premises, gold standard
- **OpenVAS** (Free): Community edition, rough but free

### Estimated Security Stack Cost (per MSP, 50 clients avg 20 devices each = 1000 endpoints)
- EDR (Sophos @ $10/device/month): $10,000/month
- Patch management (included in RMM): $0
- SIEM (Wazuh, self-hosted): $500/month (infrastructure)
- Quarterly vuln scans (Greenbone): $800/month avg
- **Total: ~$11,300/month baseline** → Resell at 2-3x = $25k-35k/month revenue

---

## 6. Remote Access Solutions

Essential for support + admin access to client systems.

### Built-In Options (via RMM)
- **ConnectWise Automate, Syncro, Kaseya:** Remote control included
- **N-able N-central:** Built-in remote support
- Strengths: Single pane of glass, audit trails, session recording

### Stand-Alone Solutions (backup/specialized)
- **TeamViewer** ($49-200/month): Industry standard, easy user side, client-friendly
- **AnyDesk** ($100-249/month): Fast, modern, better performance
- **Chrome Remote Desktop** (Free): Lightweight, Chromebook-friendly
- **Microsoft Remote Desktop** (Included in Windows): Built-in, basic
- **Splashtop Business** ($5-25/user/month): Affordable, good for lab access
- **Zoho Assist** ($20-100/month): Team licensing, affordable

### VPN (for admin access to MSP infrastructure)
- **Wireguard** (Free, self-hosted): Modern, fast, minimal overhead
- **OpenVPN** (Free, self-hosted): Mature, widely supported
- **Tailscale** ($10-30/user/month): Managed Wireguard, zero-trust
- **Cloudflare Warp+** ($9.99/month personal): No-setup VPN for remote techs
- **Recommendation:** Tailscale for MSP tech access, TeamViewer for client-facing support

### Estimated Cost (per MSP, 10 techs)
- TeamViewer Business (concurrent users): $200/month
- Tailscale (10 team members): $300/month
- **Total: ~$500/month**

---

## 7. Documentation & Knowledge Base

Critical for consistency, onboarding, and reducing support volume.

### Internal Documentation
- **Confluence** ($70-130/month): Team wiki, excellent search, good for procedures
- **Notion** ($10-20/user/month): Modern, flexible, good for internal docs
- **GitBook** ($0-40/month): Developer-focused docs, git-synced
- **MediaWiki** (Free, self-hosted): Wikipedia-style, mature
- **Obsidian + Git** ($0): Local markdown, self-versioned
- **Recommendation:** Confluence for teams, Notion for SMB MSPs

### Client-Facing Knowledge Base
- **Zendesk Guide** ($50-150/month): Polished, searchable
- **Freshdesk Knowledge Base** ($15-65/month): Built-in to PSA
- **Document360** ($25-70/month): Modern, git-synced
- **Confluence Public Space** ($70/month base): Can expose specific spaces
- **Custom Portal** (via PSA): Most PSAs have built-in client portals
- **Recommendation:** PSA-built-in portal for simplicity, Document360 as upgrade

### Visual Runbooks & Screenshots
- **Snagit** ($50/one-time or subscription): Screenshot + editing
- **Loom** ($60-150/month): Video recording, great for demos
- **OBS Studio** (Free): Powerful video recording
- **Asciidoc/Sphinx** (Free): Markdown-based docs as code

### Estimated Cost (per MSP)
- Confluence team: $130/month
- Snagit: $50/month
- Loom: $20/month (personal tier, upgrade as needed)
- **Total: ~$200/month**

---

## 8. Monitoring and Alerting Setup

Beyond RMM monitoring—network health, infrastructure, SLAs.

### IT Infrastructure Monitoring
- **RMM Alerting** (built-in): Disk, CPU, memory, temp, services
- **PRTG Network Monitor** ($1400-3500/year): On-premises, expansive
- **Datadog** ($15-50/host/month): SaaS, excellent for cloud-native
- **New Relic** ($50-250/month): Application performance, infrastructure
- **Zabbix** (Free, self-hosted): Enterprise-grade, complex setup
- **Prometheus + Grafana** (Free, self-hosted): Metrics collection + visualization

### Uptime Monitoring (external)
- **Uptime Robot** (Free-$480/year): Simple, excellent for SMBs
- **Pingdom** ($99-300/month): Network testing, API monitoring
- **StatusCake** ($20-100/month): Endpoint monitoring, SEO checks
- **Synthetic Monitoring** (Site24x7, Datadog): API + load testing

### Alert Routing & Incident Management
- **PagerDuty** ($25-40/user/month): On-call scheduling, alert routing
- **Opsgenie** ($18-29/user/month): On-call, alert aggregation
- **Incident.io** ($50-150/month): Incident response workflows
- **Slack integrations** (most RMMs + monitoring tools): Direct alerts to Slack

### SLA Monitoring & Reporting
- **Most PSAs include:** Built-in SLA dashboards
- **Custom dashboards:** PRTG, Datadog, Grafana
- **Recommendation:** Start with RMM built-in, add PRTG if you need advanced network telemetry

### Estimated Cost (per MSP)
- RMM alerting: $0 (included)
- PRTG Network Monitor: $3000/year (~$250/month)
- Uptime Robot: $300/year (~$25/month)
- Slack routing: $0 (included in Slack cost)
- **Total: ~$275/month**

---

## 9. Suggested Tech Stack — Small to Mid-Market MSP

### Stack Recommendation: Fast-Growing Startup MSP (100 devices across 20+ clients)

**Tier 1: All-in-One Foundation**
| Category | Tool | Cost | Reasoning |
|----------|------|------|-----------|
| RMM + PSA | **Syncro** | $300-500/month | Fastest time-to-value, integrated, good reporting |
| Backup/DR | **Backblaze B2** | $7/device/month | Cheap, reliable cloud backup for workstations |
| EDR | **Sophos Intercept X** | $10/device/month | Price/performance best, integrates with backup |
| Phone | **RingCentral** | $250/month | Call recording, IVR, mobile app |
| Chat | **Slack** | $100/month | Team communication, searchable history |
| Remote Access | **TeamViewer** | $200/month | Client-facing gold standard |
| VPN (tech access) | **Tailscale** | $300/month | Zero-trust, modern, simple |
| Knowledge Base | **Confluence** | $130/month | Internal procedures + client documentation |
| Monitoring | PRTG | $250/month | Network visibility beyond RMM |
| **SUBTOTAL** | | **~$2,000-2,300/month** | Fixed costs per MSP |

**Tier 2: Per-Device/Client Recurring Revenue (at 100 devices, 20 clients)**
| Service | Unit Cost | Volume | Monthly Revenue | MSP Margin |
|---------|-----------|--------|-----------------|-----------|
| RMM/PSA (Syncro) | $20/device | 100 | $500 (clients billed $1500) | 67% |
| Managed Antivirus | $10/device | 100 | $300 (clients billed $800) | 63% |
| Cloud Backup | $7/device | 100 | $200 (clients billed $600) | 67% |
| Monitoring (PRTG) | Flat $250 | 1 | $250 (billed $600) | 58% |
| **Expected MSP Revenue** | | | **~$9,000-12,000/month** | Average 63% |

**Grand Total MSP Infrastructure Cost: $2,000-2,300/month fixed + per-device costs (~$37/device variable budget)**

---

## Implementation Roadmap

### Phase 1: Foundation (Month 1, ~$1,500/month investment)
- [ ] Syncro (RMM + PSA)
- [ ] Backblaze B2 (cloud backup for clients)
- [ ] RingCentral (phone system)
- [ ] Slack (team chat)
- [ ] TeamViewer (remote support, backup)

**Go-to-market:** Support 10-20 clients, 50-100 devices

### Phase 2: Security & Monitoring (Month 2-3, +$1,200/month)
- [ ] Sophos Intercept X (EDR)
- [ ] PRTG Network Monitor (advanced monitoring)
- [ ] Tailscale (tech VPN access)
- [ ] Confluence (documentation)

**Target:** 30-50 clients, 200+ devices; increased margin

### Phase 3: Scale & Enterprise (Month 4+, conditional on revenue)
- [ ] Datto SIRIS (high-margin DR for enterprise clients)
- [ ] Greenbone Vulnerability Manager (continuous scanning)
- [ ] PagerDuty (on-call for 24/7 operations, if offered)
- [ ] Custom portal / advanced PSA reporting
- [ ] Potentially upgrade to ConnectWise Automate (if > 300 devices)

**Target:** 100+ clients, 500+ devices; establish enterprise presence

---

## Cost Model for Different MSP Sizes

### **Scenario A: Solo Tech (5 clients, ~20 devices)**
| Item | Cost |
|------|------|
| Syncro | $50/month |
| Phone | $50/month |
| Backup (Backblaze) | $10/month |
| Monitoring (built-in) | $0 |
| **Total: $110/month** | Client billing: $500-800/month → ~$500/month profit |

### **Scenario B: Small Team (20 clients, ~100 devices, 2 techs)**
| Item | Cost |
|------|------|
| Syncro + chat + phone | $500/month |
| Backup | $70/month |
| EDR | $100/month |
| Monitoring + VPN | $550/month |
| Documentation | $130/month |
| **Total: $1,350/month** | Client billing: $8,000-12,000/month → ~$8,000-10,000/month profit |

### **Scenario C: Mid-Market MSP (100 clients, ~500 devices, 5 techs, 24/7 on-call)**
| Item | Cost |
|------|------|
| ConnectWise Manage + Automate | $2,000/month |
| Phone system (multi-line) | $500/month |
| Backup (hybrid: Backblaze + Datto) | $1,500/month |
| EDR/security suite | $1,500/month |
| Monitoring, SIEM, vuln scanning | $1,500/month |
| Colocation/hosting (3x dedicated support servers) | $1,000/month |
| Documentation + training | $300/month |
| PagerDuty + incident response | $600/month |
| **Total: $9,300/month** | Client billing: $60,000-90,000/month → ~$40,000-60,000/month profit |

---

## Integration Map: How Data Flows

```
┌─────────────────────────────────────────────────────────────────┐
│                      PSA (Syncro) — Hub                         │
│                  Ticketing | Billing | Contracts               │
└────────────────────────────────────────────────────────────────┐
        ↓                    ↓                    ↓                 ↓
   [RMM Alerts]        [Support Channels]   [Client Portal]    [Billing/AR]
   - Issues detected   - Phone → ticket      - Knowledge       - Invoices
   - Auto-escalate     - Email → ticket      - Ticket status   - Payment processing
   - Resolution        - Chat → ticket       - RC approval
   
        ↓
   [Remote Control]
   - TeamViewer
   - Session auth
   - Logging to ticket

        ↓
   [Backup Monitoring]
   - Backblaze status
   - Alert if backup fails
   - Ticket auto-create

        ↓
   [Security/Monitoring]
   - EDR alerts → PSA ticket
   - PRTG performance → dashboard
   - Vuln scan scheduled
```

---

## Hidden Costs & Gotchas

### Often Overlooked
- **Cloud storage infrastructure** ($300-500/month for dedicated backup storage)
- **Office 365 licensing for MSP demo tenants** ($100-300/month)
- **Mobile device management (MDM)** if offering mobile support ($20-50/user/month)
- **DLP (Data Loss Prevention)** for regulated clients ($5-15/device/month)
- **Training & certifications** for staff ($2,000-5,000/year per tech)
- **Insurance (E&O, cyber liability)** ($2,000-8,000/year depending on revenue)
- **Compliance (SOC 2 audit, if applicable)** ($5,000-15,000 one-time, $2,000/year maintenance)
- **API rate limits & custom integrations** (budget $500-2,000/month developer time)

### Common MSP Mistakes
- **Over-investing in enterprise tools too early:** Syncro beats ConnectWise Manage until you hit 300+ devices
- **Underselling services:** Tech labor is your margin—charge 3-4x hosting/tool costs
- **Overcomplicating alerting:** Most MSPs alert on too much, causing alert fatigue
- **Not investing in documentation:** Payback in reduced support tickets within 3 months
- **Mixing open-source with SaaS:** Pick a consistency model—hybrid is drain

---

## Comparison Table: Pre-Built MSP Platforms vs. Best-of-Breed Stack

| Aspect | Pre-Built (Syncro) | Best-of-Breed (ConnectWise + Best Tools) |
|--------|-------------------|------------------------------------------|
| **Time to first client** | 1-2 weeks | 4-6 weeks |
| **Integration headaches** | Minimal | Moderate (API-dependent) |
| **Monthly cost (100 devices)** | $2,000-2,500 | $3,500-5,000 |
| **Feature depth** | Good | Excellent |
| **Customization** | Limited | Extensive |
| **Scaling (1000+ devices)** | Starts to strain | Unlimited |
| **Best for** | Startups, quick scaling | Established MSPs, complexity |

**Recommendation:** Start with Syncro for speed/simplicity. Migrate to ConnectWise + specialized tools only after proving the business model (~$10k/month recurring revenue).

---

## Financial Model: 12-Month Projection (Scenario B expansion)

**Starting Point: Month 1 (Solo operator, 5 clients, 20 devices)**
- Tool costs: $110/month ($1,320/year)
- Time investment: 80 hours/month setup + support
- Revenue (conservative): $500/month = $6,000/year
- **Profit: $4,680/year** (reinvest it)

**By Month 12 (Team of 2, 40 clients, 150 devices)**
- Tool costs: $2,000/month ($24,000/year)
- Time investment: 400 hours/month (2 FT techs)
- Revenue (conservative): $15,000/month = $180,000/year
- **Profit: $156,000/year** (before owner salary, overhead)

**Critical milestone:** Month 4-5, break-even on full team + expand tool stack

---

## Next Steps for Irvin

1. **Validate your target market:** Which vertical? (Small law firm, medical, manufacturing, etc.) Tailor tool selection (e.g., HIPAA for medical).
2. **Start with Syncro (fastest bootstrap):** Get first 10 clients onboarded in month 1.
3. **Add backup & EDR by month 2:** Margin multiplier—resell at 2.5-3x cost.
4. **Invest in documentation immediately:** Onboarding quality → referrals → exponential growth.
5. **Track your numbers:** Tool cost vs. client revenue in a simple spreadsheet. You'll see the margin story fast.
6. **Plan compliance early:** E&O insurance, data security practices—table stakes for MSP credibility.

---

**Document Version:** 1.0 | **Last Updated:** March 2026
