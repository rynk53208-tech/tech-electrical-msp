# DNS Checker — Quick Start (5 Minutes)

## Step 1: Open the Tool
Open `index.html` in any browser (Chrome, Firefox, Safari, Edge all work).

## Step 2: Lookup DNS Records

```
📝 Enter domain: example.com
🎯 Select types: A (and/or AAAA, MX, TXT, etc.)
🔍 Click Lookup
```

**Result:** See all records with TTL, values, and copy buttons.

---

## Step 3: Check Propagation (Optional)

Switch to **🌐 Propagation Check** tab:

```
📝 Enter domain: example.com
📋 Pick record type: A (or MX, TXT, etc.)
🌐 Click Check Propagation
```

**Result:** See if your DNS change has spread to 6 global DNS servers.

---

## Step 4: Analyze Email Security (Optional)

Switch to **🛡 SPF/DMARC Analyzer** tab:

```
📝 Enter domain: example.com
🛡 Click Analyze
```

**Result:** Get an email security score (A–F grade) with recommendations.

---

## Common Lookups

| Task | Steps |
|------|-------|
| **Check website IP** | Domain: `example.com` → Type: `A` → Lookup |
| **Check email servers** | Domain: `example.com` → Type: `MX` → Lookup |
| **Check SPF record** | Domain: `example.com` → Type: `TXT` → Look for `v=spf1` |
| **Verify propagation** | Domain: `example.com` → Type: `A` → Propagation Check |
| **Email security audit** | Domain: `example.com` → SPF/DMARC Analyzer |
| **Compare resolvers** | Domain: `example.com` → Toggle Multi-Resolver → Lookup |

---

## Export Results

After a lookup, go to **📥 Export** tab and choose:
- 📄 **JSON** — Full data
- 📊 **CSV** — Spreadsheet
- 📝 **Plain Text** — Report
- 🖨 **Print/PDF** — Print-ready

---

## History

All lookups auto-save. Click **📋 History** tab to:
- See past lookups
- Click one to replay it
- View stats (total lookups, unique domains, records found)
- Clear old lookups if needed

---

## TTL Explained

**TTL** = Time to Live (how long DNS caches record)

- 🟢 **300–3600s** ← Typical (5 minutes to 1 hour)
- 🟡 **>3600s** ← Long cache (stable records)
- 🔴 **<300s** ← Short cache (testing/changes)

**Key:** After DNS change, wait for old TTL to expire before checking propagation.

---

## SPF/DMARC Score

**Email Security Grade (A–F):**

- **A** (90–100%) ← Excellent ✅
- **B** (75–89%) ← Good
- **C** (60–74%) ← Fair
- **D** (40–59%) ← Weak ⚠️
- **F** (<40%) ← Poor ❌

**Aim for:** B or A (75%+)

**Common issues:**
- ❌ No SPF → Add `v=spf1 ... -all`
- ❌ DMARC set to `none` → Change to `quarantine` or `reject`
- ❌ Too many SPF includes → Consolidate (limit: 10)

---

## 3 Minute Use Cases

### Scenario 1: Website Down / Can't Access
1. Enter domain → Type: A → Lookup
2. Check if A record points to correct IP
3. If A record correct, check propagation (may be cached)

### Scenario 2: Email Not Delivering
1. Enter domain → Analyzer tab → Click Analyze
2. Check SPF score (if low, add SPF record)
3. Check DMARC score (if low, add DMARC policy)
4. Verify MX records exist

### Scenario 3: Just Changed DNS
1. Go to Propagation Check
2. Enter domain + record type you changed
3. Wait for ✅ green dots (all propagated)
4. If any red dots after 24h, contact ISP

---

## Keyboard Shortcuts

- **Enter** (in domain field) → Run lookup immediately
- **Ctrl+P** → Print / Export as PDF
- **F12** → Open browser console (if troubleshooting)

---

## Browser Requirements

✅ Works in: Chrome, Firefox, Safari, Edge (2020+)  
✅ Works offline: Yes (after page loads)  
✅ Mobile: Works (touch screen)  
❌ Does NOT require: Backend server, API key, or installation

---

## Questions?

- **Hover over info icons** in the app for tooltips
- **History tab** shows all past lookups (good for reference)
- **Export tab** explains each format
- **Dark theme** — Press F12 if you want to customize colors (advanced)

---

**Ready? Open index.html now! 🚀**
