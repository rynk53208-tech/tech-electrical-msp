# Patch Management Guide

**For:** Irvin's Tech & Electrical Services  
**Owner:** Irvin Avitia  
**Last Updated:** 2026-03-18

---

## 1. What to Patch

### 1.1 Operating Systems
- **Windows** (Workstations & Servers)
  - Windows 10/11 End-of-Life tracking
  - Windows Server 2019/2022
  - Patch Tuesday releases + out-of-band patches

- **Linux/Unix**
  - Distribution kernels and system packages
  - Ubuntu, Debian, CentOS, RHEL
  - Container images

- **macOS**
  - macOS clients and Server

### 1.2 Applications
- **Browser-based:** Chrome, Firefox, Edge
- **Productivity:** Microsoft 365, LibreOffice, Adobe Acrobat
- **Remote Access:** AnyDesk, TeamViewer, VPN clients
- **Development Tools:** IDEs, compilers, runtime environments (Node, Python, Java)
- **Business Applications:** CRM, accounting, PSA tools

### 1.3 Firmware & Hardware
- **Network Equipment:** Routers, switches, firewalls, access points
- **Server Hardware:** iDRAC, iLO, BMC firmware
- **Endpoint Firmware:** BIOS/UEFI on workstations
- **IoT/Smart Devices:** Cameras, door controllers, access control panels

### 1.4 Security Infrastructure
- **Antivirus/EDR:** Signature updates, engine versions
- **Firewalls:** Appliance firmware, rule updates
- **IDS/IPS:** Rule sets, detection engines

---

## 2. When to Patch

### 2.1 Patch Classification & Response Times

| Severity | Definition | Response Time |
|----------|------------|---------------|
| **Critical** | Active exploitation, remote code execution, data breach risk | 24-72 hours |
| **High** | Proof-of-concept exploit, privilege escalation | 7 days |
| **Medium** | Denial of service, information disclosure | 30 days |
| **Low** | Bug fixes, functionality improvements | Next maintenance window |

### 2.2 Maintenance Windows

- **Standard:** 2nd Tuesday of each month (Patch Tuesday + 3 days for rollout)
- **Emergency:** On-call basis for 0-day vulnerabilities
- **Client Systems:** Coordinate with client SLAs; typically off-hours (nights/weekends)

### 2.3 Pre-Patch Checklist
- [ ] Review patch notes and known issues
- [ ] Backup critical systems (servers, databases)
- [ ] Test in staging/dev environment first
- [ ] Notify stakeholders of maintenance window
- [ ] Verify rollback capability

---

## 3. Tools to Use

### 3.1 Enterprise Patch Management
| Tool | Use Case | Notes |
|------|----------|-------|
| **Microsoft Intune** | Windows/macOS devices | Azure AD integration, MDM |
| **WSUS** | On-premise Windows updates | Free, manual control |
| **ManageEngine Patch Manager Plus** | Multi-OS patching | Good for mixed environments |
| **GFI LanGuard** | Vulnerability scanning + patching | SMB-focused |

### 3.2 Linux/Unix
| Tool | Use Case |
|------|----------|
| **Ansible** | Configuration management + patching |
| **Chef Inspec** | Compliance + patching |
| **Apt/Yum/DNF** | Native package managers |
| **Greenbone/OpenVAS** | Vulnerability scanning |

### 3.3 Vulnerability Scanning
- **Nessus** (Tenable) - Commercial, comprehensive
- **OpenVAS** - Open-source, solid for SMB
- **Qualys Cloud Agent** - Agent-based, continuous

### 3.4 Firmware Management
- Vendor-specific tools (Dell Update Packages, HP Smart Update, etc.)
- Network device CLI/SNMP automation
- Document in asset inventory

---

## 4. Policies

### 4.1 Patch Management Policy

**Purpose:** Ensure all systems under management receive timely security updates to reduce vulnerabilities.

**Scope:** All systems owned or managed by Irvin's Tech Services (including client systems under MSP contract).

**Responsibilities:**
- **Tech:** Execute patching, document in PSA, report failures
- **Account Manager:** Communicate maintenance windows to clients
- **Owner (Irvin):** Approve emergency patching, policy exceptions

### 4.2 Standards

1. **All production systems must be patched within SLA timeframes**
2. **Staging/testing required for major updates** (Windows feature updates, kernel upgrades)
3. **No patching during business hours** without approval
4. **Rollback plan required** before patching production systems
5. **Firmware updates require change request** in PSA system
6. **Documentation:** Log all patch activities with date, systems, results

### 4.3 Exceptions

- Systems in extended support (e.g., legacy apps requiring old OS)
- Systems scheduled for decommissioning (document end date)
- Client-owned systems where client declines patching (written approval required)

### 4.4 Compliance

- **NIST CSF** alignment: PR.IP-12 (Vulnerability Management)
- **CIS Controls:** V8 Asset Management, Enterprise patch lifecycle
- Document exceptions for audits

---

## 5. Quick Reference

### Emergency Patch Process
1. Assess severity & exploitation status
2. Notify stakeholders
3. Pull fix into test environment
4. Deploy to production (accelerated window)
5. Monitor for issues
6. Document in ticket

### Patch Reporting (Monthly)
- Systems patched count
- Failed patches + root cause
- Exceptions documented
- Upcoming EOL systems

---

**Questions?** Contact Irvin Avitia — he's the final authority on patch exceptions and emergency procedures.
