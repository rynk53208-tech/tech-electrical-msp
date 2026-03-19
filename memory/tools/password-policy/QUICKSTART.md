# Password Policy Generator — Quick Start (5 Minutes)

## 🚀 Get Started

### 1. Open the Tool
Double-click `index.html` or open in browser: `file:///path/to/index.html`

### 2. Basic Setup (1 min)
On the **Configuration** tab:
- Enter client name: "Acme Corporation"
- Keep default date (today's date auto-filled)
- Choose enforcement level: "Strict" for most MSP clients
- Defaults are reasonable (12-char minimum, 90-day expiration, MFA enabled)

### 3. Select Compliance Standards (1 min)
On the **Compliance** tab, click cards for applicable standards:
- **Medical/Dental?** → Click HIPAA
- **Retail/Restaurant?** → Click PCI-DSS
- **Public company?** → Click SOX
- **EU data?** → Click GDPR
- **Government?** → Click NIST
- **Enterprise?** → Click ISO 27001
- **Not sure?** → NIST is best default

Check the compliance checklist items:
- ✅ All items by default (should stay checked)

### 4. Preview (1 min)
On the **Preview** tab:
- Click "Refresh Preview"
- See compliance % score (aim for 70%+)
- Review policy text

### 5. Export (2 min)
On the **Export** tab, choose format:
- **📄 PDF** — Best for most clients (print-ready)
- **📝 Word** — If client wants edits
- **📋 Text** — Quick reference, email-friendly
- **⚙️ JSON** — For automation/integrations

Click button → auto-downloads to Downloads folder

---

## 📋 Pre-Made Client Scenarios

### Scenario 1: Medical Office (HIPAA)
```
Client: Desert Dental Associates
Effective Date: [Today]
Enforcement: Strict
Settings:
  - Min Length: 12
  - Max Length: 128
  - Expiration: 90 days
  - Lockout: 5 attempts, 30 min
  - MFA: ON
Compliance:
  - HIPAA: ✓
  - ISO 27001: ✓
  - NIST: ✓
Export: PDF
```

### Scenario 2: Retail Store (PCI-DSS)
```
Client: Barney's Tire Shop
Effective Date: [Today]
Enforcement: Strict
Settings:
  - Min Length: 14
  - Max Length: 128
  - Expiration: 90 days
  - Lockout: 6 attempts, 30 min
  - MFA: ON
  - SSO: ON (if using)
Compliance:
  - PCI-DSS: ✓
  - ISO 27001: ✓
  - NIST: ✓
Export: PDF
```

### Scenario 3: Small Office (General)
```
Client: Local Business LLC
Effective Date: [Today]
Enforcement: Recommended
Settings:
  - Min Length: 12
  - Max Length: 128
  - Expiration: 180 days (or 0 for modern approach)
  - Lockout: 5 attempts, 30 min
  - MFA: ON (optional for non-admin)
Compliance:
  - NIST: ✓
  - ISO 27001: ✓
Export: PDF
```

### Scenario 4: Government Contractor (NIST)
```
Client: Government Services Inc
Effective Date: [Today]
Enforcement: Enterprise
Settings:
  - Min Length: 15
  - Max Length: 128
  - Expiration: 0 days (NIST modern guidance)
  - Lockout: 5 attempts, 30 min
  - MFA: ON (mandatory)
  - SSO: ON (mandatory)
  - Block Common: ON
  - Biometric: ON
Compliance:
  - NIST: ✓
  - ISO 27001: ✓
  - SOX: ✓
Export: PDF
```

---

## ⏱️ Time Savings

**Traditional approach:** Write policy from scratch → legal review → 4–6 hours

**This tool:** Generate policy → review 5 min → export → 30 minutes

**Savings per client:** 3.5–5.5 hours

**At $200/hour:** $700–$1,100 per policy generated

---

## 💡 Pro Tips

1. **Save settings as JSON** — Export JSON, rename to client name, keep in folder. Import for future updates.

2. **Use templates** — Create policies for your most common scenarios (medical, retail, general). Export as JSON once, reuse for similar clients.

3. **Include in proposals** — Add exported PDF to MSP proposals as "Password Policy (included in management)". Demonstrates professionalism.

4. **Annual refresh** — Each year, reload JSON template, update expiration/lockout dates, export new version. Send to client.

5. **Compliance ammunition** — Use "Best Practices" tab content in client training or support conversations. Shows expertise.

6. **Print-friendly** — All exports are print-optimized. Perfect for paper filing.

---

## 🎯 Common Questions

**Q: My client uses 365/Azure AD. How do I implement?**
A: Export policy, then configure in Azure AD security settings. Tool generates specs; implementation is client/system admin work.

**Q: Do I need to ask the client for approval first?**
A: Yes. Email client the PDF: "Here's the password policy we'll implement for you. Review and confirm." Get email/signature approval before implementing.

**Q: Can I modify the policy after export?**
A: Yes! PDF/Word files are editable. Or reimport JSON → modify → re-export.

**Q: What if I mess up?**
A: Browser localStorage saves as you type. Just reload the page. Or export JSON periodically.

**Q: Is this compliant with regulation X?**
A: Depends. This tool helps you meet framework requirements, but always have your lawyer review final policy for your jurisdiction/industry.

---

## 🔗 Integration

### Automate Policy Deployment
1. Generate policy (text format)
2. Parse text via script
3. Apply settings to:
   - Active Directory Group Policy
   - Azure AD Conditional Access
   - OKTA Rules
   - Linux PAM modules
   - Cloud IAM services

### Share with Legal
1. Export as PDF
2. Email to legal review
3. They mark up → send back
4. Reimport settings if changes needed

### Track Compliance
1. Export as JSON
2. Store in compliance database
3. Compare year-over-year
4. Generate audit report

---

**Ready? Open `index.html` and start generating policies!**

Need help? See README.md for detailed feature guide.

---

**Last updated:** 2026-03-19  
**Version:** 1.0
