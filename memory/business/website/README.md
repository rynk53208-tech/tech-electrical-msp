# Tech & Electrical Services LLC — Company Website

**Location:** `memory/business/website/`  
**Type:** Static HTML/CSS — no build step, no dependencies  
**Status:** ✅ Complete v1.0 (2026-03-19)

---

## Pages

| File | Page | Description |
|------|------|-------------|
| `index.html` | Home | Hero, services overview, why us, testimonials, CTA |
| `services.html` | Services | Full service detail with pricing — Cyber, MSP, Repair, Electrical, Dev |
| `about.html` | About | Irvin's background, Charles Garcia, team, credentials, values |
| `portfolio.html` | Portfolio | 9 case studies with filter tabs by category + testimonials |
| `contact.html` | Contact | Full contact form, FAQ, quick tiles, emergency CTA |
| `styles.css` | Design System | Full CSS design system — variables, components, responsive |

---

## Design Decisions

- **Color palette:** Dark theme — electric cyan (`#00d4ff`) primary, amber (`#f59e0b`) accent (electrical spark motif)
- **Typography:** Inter — clean, modern, professional
- **Grid:** 2-col and 3-col responsive grids, collapses to 1-col on mobile
- **Animations:** Intersection Observer fade-up — no dependency, pure JS
- **Nav:** Fixed glass-morphism navbar with hamburger menu on mobile
- **Cards:** Hover lift with glow border effect (top accent bar on service cards)

---

## Key Content

### Services + Pricing
- Cybersecurity: From $499 (audit), $1,200 (pen test), $800/mo (MSSP)
- MSP: $500/mo (Starter, 5 devices), $1,000/mo (Pro, 15 devices), Custom (MSSP)
- Computer Repair: $49 diagnostic (applied to repair)
- Custom Dev: From $800 (website), $500 (automation), $1,500 (business tools)
- Electrical: Panel upgrade from $1,800, EV charger from $600, Cat6 from $75/drop

### Credentials Highlighted
- CompTIA Security+
- BS in Information Technology
- MS in Computer Science
- DoD / Northrop Grumman background
- Charles Garcia — Licensed Electrician CA

### Portfolio Case Studies (9 projects)
1. Barney's Tire Shop — MSP server room build → $1,000/mo contract
2. Dental Practice — HIPAA compliance, 12 critical vulns remediated
3. MacBook Pro micro soldering — saved client $1,000+ vs. replacement
4. Commercial office build-out — electrical + IT, turnkey
5. Dual video production workstation build — 30% under budget
6. Law firm network hardening — zero-trust, MFA, now on MSSP retainer
7. RAID-5 data recovery — accounting firm, 98% recovery at $650 (vs $3,500–$8,000 quoted)
8. Residential EV charger + 200A panel upgrade
9. Custom MSP client portal — $500/mo SaaS fee eliminated

---

## How to Deploy

### Local preview
```bash
cd memory/business/website
python3 -m http.server 9090
# → http://localhost:9090
```

### GitHub Pages
```bash
# From workspace root
cd memory/business/website
git init && git add . && git commit -m "Initial website v1.0"
# Push to GitHub Pages branch
```

### Netlify / Vercel
Drop the `website/` folder into Netlify — instant deploy, free tier works fine.

### Production checklist before going live
- [ ] Update phone number from placeholder `(951) 555-0100`
- [ ] Update email from `info@techelectricalsvc.com` (or confirm it's active)
- [ ] Hook up contact form to a real backend (Formspree, Netlify Forms, or custom)
- [ ] Add real domain in meta tags and footer
- [ ] Add Google Analytics or Plausible
- [ ] Add Google Business Profile embed (map)
- [ ] Add real photos / headshots when available
- [ ] SEO: submit sitemap to Google Search Console

---

## File Sizes
- `styles.css` — ~23KB (complete design system)
- `index.html` — ~16KB
- `services.html` — ~22KB
- `about.html` — ~18KB
- `portfolio.html` — ~21KB
- `contact.html` — ~24KB
- **Total: ~124KB** (loads in <1s on any connection)
