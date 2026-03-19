# Tech Onboarding Guide
## Welcome to the Team! ⚡

This guide covers everything you need to get started at our tech and electrical services company. We're a small, high-caliber team delivering enterprise-grade cybersecurity, software development, MSP/MSSP services, and hardware repair—including rare board-level micro soldering work.

---

## First Day Tasks

### 🔐 Access & Security Setup
- [ ] Get credentials for internal systems (Slack, email, CRM)
- [ ] Set up 2FA on all company accounts (authenticator app preferred)
- [ ] Review and sign employee agreement & NDA
- [ ] Get access to ticket system (ConnectWise, Autotask, or equivalent)
- [ ] Set up VPN access for remote work

### 🖥️ Machine Setup
- [ ] Configure your work machine with required software
- [ ] Install: VS Code, Git, Docker, terminal tools (Oh My Zsh, starship)
- [ ] Set up password manager (1Password or Bitwarden company vault)
- [ ] Configure email client and calendar sync
- [ ] Join relevant Slack/Teams channels

### 📋 Orientation
- [ ] Meet your direct manager for role overview
- [ ] Get brief on current active projects
- [ ] Review company service offerings and standard processes
- [ ] Schedule 1:1s with team members

---

## First Week Tasks

### 📚 Learning the Stack
- [ ] Review our [Tech Quick Ref](./tech-quick-ref.md) for common tools
- [ ] Go through [Runbooks](./runbooks.md) for standard procedures
- [ ] Study [MSP Service Sheet](./msp-service-sheet.md) for service definitions
- [ ] Review recent tickets to understand common issues

### 🛠️ Shadowing & Practice
- [ ] Shadow a senior tech on 2-3 support tickets
- [ ] Observe a client onboarding call
- [ ] Run through a basic remote access setup ([Remote Access Guide](./remote-access-guide.md))
- [ ] Practice RMM tool usage in test environment

### 📝 Documentation
- [ ] Read [Client Onboarding](./client-onboarding.md) process
- [ ] Study [Onsite Checklist](./onsite-checklist.md) procedures
- [ ] Review [Email Troubleshooting](./email-troubleshooting.md) guide
- [ ] Understand [WiFi Troubleshooting](./wifi-troubleshooting.md) fundamentals

---

## Tools to Learn

### Core IT & Support
| Tool | Purpose | Priority |
|------|---------|----------|
| RMM (e.g., Syncro, NinjaOne, ConnectWise) | Remote monitoring & management | 🔴 High |
| PSA (e.g., Syncro, ConnectWise Automate) | Professional services automation / ticketing | 🔴 High |
| Remote Access (TeamViewer, AnyDesk, RustDesk) | Client remote support | 🔴 High |
| Password Manager | Company/client credential storage | 🔴 High |
| VPN (WireGuard, OpenVPN) | Secure remote access | 🟠 Medium |

### Security
| Tool | Purpose | Priority |
|------|---------|----------|
| EDR (CrowdStrike, SentinelOne, Defender) | Endpoint detection & response | 🔴 High |
| SIEM (Splunk, Wazuh, Microsoft Sentinel) | Log aggregation & threat detection | 🟠 Medium |
| Vulnerability Scanner (Nessus, OpenVAS) | Network vulnerability assessment | 🟠 Medium |
| Firewall (pfSense, OPNsense, UniFi) | Network security | 🟠 Medium |
| M365 Security / Google Workspace Admin | Cloud tenant security | 🔴 High |

### Development & Automation
| Tool | Purpose | Priority |
|------|---------|----------|
| Git / GitHub / GitLab | Version control | 🔴 High |
| Docker | Containerization | 🟠 Medium |
| Python / Bash | Scripting & automation | 🔴 High |
| Infrastructure as Code (Terraform, Ansible) | Cloud/infra automation | 🟡 Low |
| CI/CD (GitHub Actions, GitLab CI) | Automated pipelines | 🟡 Low |

### Hardware & Electrical
| Tool | Purpose | Priority |
|------|---------|----------|
| Multimeter / Oscilloscope | Circuit diagnostics | 🔴 High |
| Soldering station (with hot air) | Micro soldering / board repair | 🔴 High |
| Thermal imaging camera | Heat issues, board faults | 🟠 Medium |
| LAN tester / cable certifier | Network cable verification | 🟠 Medium |

---

## Documentation to Read

### Essential Reading
1. **[Runbooks](./runbooks.md)** — Standard procedures for common tasks
2. **[Tech Quick Ref](./tech-quick-ref.md)** — Quick reference for tools and commands
3. **[MSP Service Sheet](./msp-service-sheet.md)** — Our service offerings and SLAs
4. **[Remote Access Guide](./remote-access-guide.md)** — How to access client systems securely

### Client-Facing
5. **[Client Onboarding](./client-onboarding.md)** — Complete onboarding workflow
6. **[Client Onboarding Checklist](./client-onboarding-checklist.md)** — Step-by-step checklist
7. **[Onsite Checklist](./onsite-checklist.md)** — On-site visit procedures

### Troubleshooting
8. **[Email Troubleshooting](./email-troubleshooting.md)** — Common email issues
9. **[WiFi Troubleshooting](./wifi-troubleshooting.md)** — Wireless network fixes
10. **[FAQ](./faq.md)** — Answers to common client questions

### Business Processes
11. **[Client Intake Form](./client-intake-form.md)** — New client information gathering
12. Check `/memory/services/` for service-specific documentation

---

## Key Contacts

| Role | Who | When to Contact |
|------|-----|-----------------|
| Lead Tech | Irvin | Escalations, complex issues, hardware repair questions |
| Security | Irvin | Incident response, security concerns |
| Sales/PM | Irvin | Client communications, scope changes |

---

## Pro Tips

- **Document everything** — If you solve a problem, document it for the runbook
- **Ask questions** — Better to ask than to guess and cause issues
- **Think like the client** — They care about uptime and security, not tech jargon
- **Security first** — When in doubt, don't click, don't share, don't install
- **We do board-level repair** — This is rare. If you're interested in micro soldering, let Irvin know

---

*Last updated: 2026-03-18*
