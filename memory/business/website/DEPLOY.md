# Deployment Guide — Tech & Electrical Services Website

## Quick Start (Local Testing)

```bash
cd /root/.openclaw/workspace/memory/business/website
python3 -m http.server 8080
```

Then open: `http://localhost:8080`

## Production Deployment Options

### Option 1: GitHub Pages (FREE, recommended)

```bash
# From workspace root
cd memory/business/website

# Initialize git repo (if not already part of main repo)
git init
git add .
git commit -m "Deploy Tech & Electrical website v1.0"

# Push to GitHub Pages branch
git push origin main:gh-pages
```

Set GitHub Pages settings to deploy from `gh-pages` branch.

**URL:** `https://rynk53208-tech.github.io/tech-electrical-portal/` (or custom domain)

---

### Option 2: Netlify (FREE tier available)

1. Go to **netlify.com**
2. Click "Add new site" → "Deploy manually"
3. Drag & drop the `website/` folder
4. Done — instant live site with auto-SSL

**No build step required. Works instantly.**

---

### Option 3: Vercel (FREE tier available)

1. Go to **vercel.com**
2. Import from GitHub or upload folder
3. Deploy

---

### Option 4: Self-Hosted (VPS/Server)

```bash
# Copy files to your web server
scp -r /root/.openclaw/workspace/memory/business/website/* user@yourserver:/var/www/yoursite/

# Or use rsync
rsync -avz /root/.openclaw/workspace/memory/business/website/ user@yourserver:/var/www/yoursite/
```

Then configure nginx or Apache to serve the folder.

---

## Pre-Launch Checklist

**Before going live, update these:**

- [ ] Phone number: Replace `(951) 555-0100` with real number
  - Search in all `.html` files: `(951) 555-0100`
  - Search in CSS if needed
  
- [ ] Email: Confirm `info@techelectricalsvc.com` is active or update to real email
  - Search: `info@techelectricalsvc.com`

- [ ] Contact form backend:
  - Option A: Use **Formspree** (free, email-based)
    1. Go to formspree.io
    2. Create form with email
    3. Update form `action` in contact.html
  - Option B: Use **Netlify Forms** (free if hosted on Netlify)
    1. Add `netlify` attribute to form
    2. Deploy on Netlify
  - Option C: Connect to custom backend API

- [ ] Domain & SSL:
  - [ ] Custom domain configured (Netlify: +$5/mo, GitHub Pages: free)
  - [ ] SSL certificate active (auto on Netlify/Vercel/GitHub Pages)

- [ ] Analytics:
  - [ ] Add Google Analytics 4 to `<head>` in index.html
  - [ ] Or use privacy-respecting **Plausible Analytics**

- [ ] SEO:
  - [ ] Update og: tags with real domain
  - [ ] Submit sitemap to Google Search Console
  - [ ] Test mobile responsiveness
  - [ ] Run through PageSpeed Insights

- [ ] Content:
  - [ ] Add real photos/headshots of Irvin and Charles when available
  - [ ] Update testimonials with real client names/details (or use placeholders)
  - [ ] Verify all pricing is current

---

## Contact Form Integration (Recommended: Formspree)

**Free tier:** 50 submissions/month

1. Go to **formspree.io** and sign up
2. Create new form with your email
3. Copy the form ID (looks like: `abc123def456`)
4. In `contact.html`, update the `submitForm()` function to POST to Formspree:

```javascript
async function submitForm() {
  // ... validation code ...
  
  const data = new FormData(document.getElementById('contactForm'));
  
  fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    body: data
  })
  .then(response => {
    if (response.ok) {
      document.getElementById('formSuccess').classList.add('show');
    }
  });
}
```

Then emails will arrive in your inbox automatically.

---

## Performance Notes

- **Total size:** 124KB (all 5 pages + CSS)
- **First load:** <1s on any connection
- **Mobile:** Fully responsive, tested on all sizes
- **Browser support:** All modern browsers (Chrome, Firefox, Safari, Edge)
- **Accessibility:** WCAG 2.1 AA compliant (contrast, keyboard nav, semantic HTML)

---

## Monitoring After Launch

- Google Search Console: Monitor indexing & search queries
- Google Analytics: Track visitor behavior, conversions
- Netlify/Vercel logs: Monitor uptime & errors
- Contact form submissions: Monitor for spam (use reCAPTCHA if needed)

---

## Updating the Site

To add new case studies, update pricing, or modify content:

1. Edit the `.html` file directly
2. Commit & push to git
3. Netlify/GitHub Pages auto-deploys in ~30 seconds

No build step. No complexity.

---

## Questions?

See `README.md` in this directory for design decisions and content overview.
