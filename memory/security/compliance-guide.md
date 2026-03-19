# Compliance Guide for Irvin's Tech Business

> Quick reference for cybersecurity, MSP/MSSP, and IT services

---

## 1. HIPAA Basics

**What it is:** Health Insurance Portability and Accountability Act — protects PHI (Protected Health Information).

### Who Needs It?
- Healthcare providers (doctors, clinics)
- Health plans (insurance)
- Healthcare clearinghouses
- **Business associates** that handle PHI on behalf of the above (IT MSPs serving healthcare = potential business associates)

### Key Requirements
| Requirement | What It Means |
|--------------|---------------|
| Privacy Rule | Controls who can access PHI |
| Security Rule | Requires safeguards for ePHI (electronic PHI) |
| Breach Notification | Notify HHS & affected individuals within 60 days |
| Business Associate Agreements (BAA) | Required before handling PHI |

### Technical Safeguards (What Clients Need)
- Access controls (unique user IDs, auto-logoff)
- Encryption for ePHI at rest and in transit
- Audit controls (logging access)
- Integrity controls (protect ePHI from alteration)
- Transmission security (TLS, VPN)

### Irvin's Take
If you're handling IT for healthcare clients, **get a BAA signed** before touching any systems with patient data. Don't assume — if you touch their EHR, billing, or patient portals, you're a business associate.

---

## 2. PCI Compliance

**What it is:** Payment Card Industry Data Security Standard — protects cardholder data.

### Who Needs It?
- Any business that accepts, processes, stores, or transmits credit card data
- Level depends on annual transaction volume (Level 1 = >6M transactions)

### Key Requirements
| Requirement | Description |
|-------------|-------------|
| Install & Maintain Firewall | Configured to protect cardholder data |
| Encrypt Transmission | TLS for data in transit |
| Keep Software Updated | Patches, anti-virus |
| Restrict Access | Need-to-know basis for cardholder data |
| Log & Monitor | Track access to network & cardholder data |
| Test Regularly | Vulnerability scans, penetration tests |
| Maintain Policy | Information security policy document |

### Merchant Levels (Quick Reference)
- **Level 1:** >6M transactions/year — annual SAQ-D, quarterly scans, annual penetration test
- **Level 2:** 1M-6M transactions — annual SAQ-C, quarterly scans
- **Level 3:** 20K-1M e-commerce — annual SAQ-A-EP, quarterly scans
- **Level 4:** <20K e-commerce or <1M card-present — annual SAQ, quarterly scans recommended

### Irvin's Take
For most small/medium clients, they just need to **not store cardholder data** (use a compliant payment processor like Stripe/PayPal). If they're storing it — that's a problem. Push them to tokenize.

---

## 3. SOC 2 Basics

**What it is:** Service Organization Control 2 — audits how you handle client data. Type II is the gold standard.

### SOC 2 Trust Service Criteria (TSC)
5 criteria (you can choose which apply):
1. **Security** — Protection against unauthorized access (required)
2. **Availability** — System operational as committed
3. **Processing Integrity** — Complete, accurate, timely processing
4. **Confidentiality** — Data classified as confidential stays protected
5. **Privacy** — Personal information handled per privacy notice

### SOC 2 Type I vs Type II
| Type | What It Is | Timeframe |
|------|------------|-----------|
| Type I | Point-in-time audit | Snapshot |
| Type II | Operating effectiveness over time | 6-12 months |

### What It Looks Like
- Report issued by CPA firm
- Independent verification of controls
- Shows clients you're trustworthy for handling their data

### Irvin's Take
If you're pitching to enterprise or regulated clients (healthcare, finance), **SOC 2 Type II** is a differentiator. It proves you take security seriously. Start building documentation now — it takes time.

---

## 4. What Irvin Needs

### Quick Decision Matrix

| Client Type | Must Have | Nice to Have |
|-------------|-----------|--------------|
| Healthcare provider | BAA, basic security | SOC 2 |
| Healthcare MSP (you) | BAA, HIPAA policies | SOC 2 |
| Retail/e-commerce | PCI compliance | SOC 2 |
| Financial services | SOC 2, encryption | PCI if handling cards |
| General business | Basic security (NIST) | SOC 2 for enterprise deals |

### Immediate Action Items

1. **If serving healthcare:**
   - Draft a Business Associate Agreement template
   - Document your security practices
   - Consider HIPAA awareness training

2. **If handling payments:**
   - Ensure clients use tokenized payment processors
   - Never store cardholder data yourself

3. **For credibility:**
   - Start a SOC 2 gap assessment (or hire to do it)
   - Document your security policies
   - Get a penetration test done annually

### Bottom Line

- **HIPAA** = Healthcare data → BAA + technical safeguards
- **PCI** = Card data → Don't store it, use compliant processors
- **SOC 2** = Prove you're trustworthy → Documentation + audits

For Irvin's business, focus on:
1. **BAA templates** for healthcare clients
2. **Avoid storing card data** for e-commerce clients
3. **SOC 2** as a selling point for enterprise/MSSP deals

---

*Last updated: 2026-03-18*
*Created for: TechSupport - Irvin's Tech Business*
