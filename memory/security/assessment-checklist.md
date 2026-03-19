# Cybersecurity Assessment Checklist

**For Prospective MSP Clients**  
*Complimentary Assessment — Identify Your Security Gaps*

---

## Overview

Use this checklist to evaluate a prospect's security posture. Each gap you find is an opportunity to demonstrate value and propose solutions.

**Estimated Assessment Value:** $500–$1,500 (depending on organization size)

---

## 1. Password Policies ☐

| Assessment Point | Questions to Ask | Red Flag Indicators |
|------------------|------------------|---------------------|
| **Password Length** | "What's your minimum password length policy?" | Less than 12 characters |
| **Complexity Requirements** | "Do you require uppercase, lowercase, numbers, and symbols?" | No complexity requirements |
| **Password Expiration** | "How often must employees change passwords?" | Expiring every <30 days (causes weak passwords) or never |
| **Password History** | "Can employees reuse previous passwords?" | No history enforcement |
| **Account Lockout** | "What happens after failed login attempts?" | No lockout policy or locks reset immediately |
| **Shared Accounts** | "Are there any shared login credentials?" | Any shared accounts found |
| **Password Manager** | "Do you provide a company password manager?" | No password manager in use |

**Pain Point Opportunities:** Weak passwords → propose password manager + policy enforcement

---

## 2. Multi-Factor Authentication (MFA) ☐

| Assessment Point | Questions to Ask | Red Flag Indicators |
|------------------|------------------|---------------------|
| **MFA Coverage** | "What percentage of accounts have MFA enabled?" | <100% on critical systems |
| **MFA Methods** | "What authentication methods do you use?" | SMS-only (vulnerable to SIM swapping) |
| **MFA Exceptions** | "Are any accounts or services exempt from MFA?" | Any exemptions = vulnerability |
| **Conditional Access** | "Do you enforce MFA based on location/device?" | No conditional access policies |
| **Backup Codes** | "How are backup codes stored?" | Stored in plain text / shared |

**Pain Point Opportunities:** No MFA → propose MFA rollout, Azure AD/Google Workspace conditional policies

---

## 3. Backup & Recovery ☐

| Assessment Point | Questions to Ask | Red Flag Indicators |
|------------------|------------------|---------------------|
| **Backup Solution** | "What backup solution do you use?" | No dedicated backup solution |
| **Backup Scope** | "What data is backed up (workstations, servers, cloud)?" | Incomplete coverage |
| **Backup Frequency** | "How often are backups performed?" | Less than daily |
| **Offsite/Cloud Backup** | "Are backups stored offsite or in the cloud?" | No offsite copies |
| **Backup Testing** | "When did you last test a restore?" | Never tested or >6 months ago |
| **Ransomware Protection** | "Are backups isolated from the network?" | Backups on same network |
| **Recovery Time Objective (RTO)** | "What's your target recovery time?" | Unknown or undefined |
| **Recovery Point Objective (RPO)** | "How much data loss is acceptable?" | Unknown or >24 hours |

**Pain Point Opportunities:** No tested backups → propose managed backup solution with regular restore tests

---

## 4. Patch Management ☐

| Assessment Point | Questions to Ask | Red Flag Indicators |
|------------------|------------------|---------------------|
| **Patch Schedule** | "How often do you apply security patches?" | No set schedule / ad hoc |
| **Patch Testing** | "Do you test patches before deployment?" | No testing (breaks production) |
| **Deployment Speed** | "How quickly are critical patches deployed?" | >7 days for critical CVEs |
| **End-of-Life Software** | "Are any systems running unsupported software?" | Windows 7/Server 2008, old routers, etc. |
| **Automatic Updates** | "Are automatic updates enabled?" | Disabled by policy |
| **Patch Reporting** | "Do you have visibility into patch compliance?" | No reporting/dashboard |
| **Third-Party Apps** | "How do you handle patching for non-Microsoft software?" | No third-party patching |

**Pain Point Opportunities:** Outdated systems → propose patch management solution + EOL replacement plan

---

## 5. Endpoint Protection ☐

| Assessment Point | Questions to Ask | Red Flag Indicators |
|------------------|------------------|---------------------|
| **Antivirus Solution** | "What endpoint protection do you use?" | Free/consumer-grade or none |
| **Signature Updates** | "How often are virus definitions updated?" | Manual updates or >24 hours |
| **Real-Time Protection** | "Is real-time scanning enabled?" | Disabled |
| **Endpoint Detection & Response (EDR)** | "Do you have EDR or MDR?" | No EDR capability |
| **Device Encryption** | "Are hard drives encrypted?" | No BitLocker/FileVault |
| **Mobile Device Management (MDM)** | "How do you manage mobile devices?" | No MDM |
| **Lost/Stolen Response** | "Can you remotely wipe devices?" | No remote wipe capability |
| **Application Whitelisting** | "Do you control what software can run?" | No application control |

**Pain Point Opportunities:** Consumer AV / no EDR → propose managed endpoint protection with EDR

---

## 6. Network Security ☐

| Assessment Point | Questions to Ask | Red Flag Indicators |
|------------------|------------------|---------------------|
| **Firewall** | "What firewall do you use?" | Consumer-grade router or none |
| **Firewall Rules** | "When were firewall rules last reviewed?" | Never or >1 year ago |
| **VPN** | "How do remote employees access the network?" | No VPN or consumer VPN |
| **Wi-Fi Security** | "What's your Wi-Fi security configuration?" | WEP/WPA2-Personal or open networks |
| **Guest Network** | "Do you have a separate guest network?" | No network segmentation |
| **Network Monitoring** | "Do you monitor network traffic for anomalies?" | No monitoring |
| **DNS Protection** | "Do you use DNS filtering?" | No DNS security |
| **Port Security** | "Are unused ports disabled?" | Unknown / default config |
| **Physical Security** | "How is server room/access controlled?" | Unlocked/unchecked |

**Pain Point Opportunities:** Weak network security → propose firewall, VPN, segmentaton, DNS filtering

---

## Scoring Summary

Rate each category 1–5:

| Category | Score (1-5) | Priority |
|----------|-------------|----------|
| Password Policies | | |
| MFA | | |
| Backups | | |
| Patching | | |
| Endpoint Protection | | |
| Network Security | | |
| **TOTAL** | /30 | |

**Score Interpretation:**
- 25–30: Strong posture — upsell monitoring/optimization
- 18–24: Moderate — standard MSP package addresses gaps
- 12–17: Weak — significant opportunity, bundle services
- <12: Critical — urgent remediation, premium pricing

---

## Follow-Up Questions to Identify Budget Authority

1. "Who handles IT decisions here?"
2. "What's your current IT budget/spend?"
3. "Have you had any security incidents in the past?"
4. "What would a data breach cost your business?"

---

## Next Steps (Script)

> "We can provide a detailed report with prioritized recommendations. Would you like us to present findings and a remediation plan? We offer this assessment complimentary — our detailed report and 30-minute consultation is ours to show value. From there, we can propose a customized security roadmap that fits your budget."

---

*Assessment conducted by: _________________ | Date: _________________*  
*Prospect company: _________________ | Contact: _________________*
