# 🛡️ Compliance Audit Tool

**Tech & Electrical Services LLC**  
Version: 1.0 | Built: 2026-03-19

---

## Overview

Single-file HTML compliance audit tool for cybersecurity baseline assessments and SOC 2 readiness reviews. No server, no dependencies — just open `index.html` in any browser.

## Features

### Audit Categories (6 domains, ~60+ questions)
| Category | Weight | Focus |
|---|---|---|
| 🌐 Network Security | 18% | Firewall, VPN, segmentation, monitoring |
| 💻 Endpoint Protection | 16% | AV/EDR, patching, encryption, UAC |
| 🔐 Access Control | 18% | MFA, passwords, RBAC, offboarding |
| 💾 Data Protection | 18% | Backups, encryption, DLP, retention |
| 🏢 Physical Security | 10% | Access control, cameras, clean desk |
| 📋 Policies & Documentation | 10% | ISP, IRP, BCP/DR, training |
| 📊 SOC 2 Readiness | 10% | TSC, controls mapping, audit evidence |

### Scoring
- Each question weighted by severity (critical = 15pts, high = 12pts, medium = 8pts, low = 6pts)
- Category scores: weighted by answered questions
- Overall score: weighted average across all categories
- Status thresholds:
  - **Compliant**: ≥80%
  - **Partial**: 50–79%
  - **Non-Compliant**: <50%

### Report Features
- Client information form (company, contact, industry, audit type)
- Category scorecard with progress bars
- Findings table sorted by priority (Critical → High → Medium → Low)
- Prioritized recommendations with detailed remediation guidance
- Auditor notes per section
- Signature/attestation block
- **Export to HTML** (self-contained file with embedded CSS)
- **Print to PDF** via browser print

## Use Cases
- **Initial Assessment** — Baseline at client onboarding
- **Quarterly Review** — Track improvement over time
- **SOC 2 Preparation** — Gap assessment readiness
- **Cyber Insurance** — Evidence for underwriters

## How to Use
1. Open `index.html` in Chrome, Firefox, or Edge
2. Fill out Client Info tab (optional but recommended)
3. Work through each audit section (Yes / Partial / No / N/A)
4. Add section notes as needed
5. Click **Generate Report**
6. Print or export HTML

## File Location
`/root/.openclaw/workspace/memory/tools/compliance-audit/index.html`

---

*Confidential — Tech & Electrical Services LLC*
