# Tech & Electrical Services - Lead Generation Landing Page

Professional lead capture landing page for Tech & Electrical Services LLC in Temecula, CA.

## Features

✅ **Professional Design** - Modern, mobile-responsive layout  
✅ **Services Showcase** - 6 core service offerings with icons  
✅ **Lead Capture Form** - Clean form with validation  
✅ **Google Business Integration** - Direct link to Google Business profile  
✅ **Call-to-Action** - Multiple CTAs for lead conversion  
✅ **Conversion-Optimized** - Fast-loading, no frameworks, minimal dependencies  

## What's Included

```
leadgen/
├── index.html          # Complete landing page (HTML + CSS + JS)
├── server.js           # Optional Node.js server for lead handling
└── README.md          # This file
```

## Quick Start

### Option 1: Static HTML Only
Simply open `index.html` in a browser. The form uses browser localStorage for demo purposes.

```bash
# Open in browser
open index.html
# or
firefox index.html
```

### Option 2: With Node.js Server (Recommended)
Use the included Node.js server for better lead tracking.

```bash
# Install Node.js (if needed)
node --version

# Run the server
node server.js

# Open browser to http://localhost:3000
```

The server will:
- Serve the landing page
- Accept form submissions via API
- Store leads in memory
- Log new leads to console

## Form Submission Flow

1. **Static Mode** (index.html only):
   - Leads stored in browser's localStorage
   - View leads: Open DevTools → Console → `JSON.parse(localStorage.getItem('leads'))`

2. **Server Mode** (node server.js):
   - Leads submitted to `/api/leads` endpoint
   - View all leads: Visit `http://localhost:3000/api/leads`
   - Logs appear in server console

## Services Featured

- 🔒 **Cybersecurity** - Enterprise-grade security solutions
- 💻 **Software Development** - Custom coding & architecture
- 🛡️ **MSP/MSSP Services** - 24/7 managed IT & security
- 🖥️ **Computer Repair & Custom Builds** - Hardware repair & micro soldering
- ⚡ **Electrical Services** - Installation & repairs
- ☁️ **DevOps & Cloud Infrastructure** - Migration & optimization

## Customization

### Update Company Info
Edit these sections in `index.html`:

```html
<!-- Hero -->
<h1>Your Company Name</h1>
<p>Your tagline here</p>

<!-- Footer -->
<a href="https://your-google-business-url">Google Business</a>
<a href="mailto:your-email@company.com">Email Us</a>
<a href="tel:+1-XXX-XXX-XXXX">Call Us</a>
```

### Change Colors
Search and replace in `<style>` section:
- Primary blue: `#1e3a8a` → your brand color
- Accent gold: `#fbbf24` → your accent color

### Add Services
Duplicate a `.service-card` block and update icon/text:

```html
<div class="service-card">
    <div class="service-icon">🔧</div>
    <h3>Your Service</h3>
    <p>Description here</p>
</div>
```

### Connect to CRM/Email
Replace the form submission handler in the `<script>` section to:
- Send to Zapier/Make
- Integrate with HubSpot, Pipedrive, or Salesforce
- Email leads directly to your inbox

Example integration point:
```javascript
// Replace this section to send to your backend/CRM
let leads = JSON.parse(localStorage.getItem('leads') || '[]');
leads.push(formData);
localStorage.setItem('leads', JSON.stringify(leads));
```

## Performance

- **Load time:** < 1 second
- **Page size:** ~15KB (single HTML file)
- **Dependencies:** None (vanilla HTML/CSS/JS)
- **Mobile:** Fully responsive
- **SEO:** Basic structure ready for optimization

## Production Deployment

### Deploy to Netlify (Free)
```bash
# Drag-and-drop index.html to https://netlify.com
# Or connect your git repo
```

### Deploy to Vercel (Free)
```bash
# Push to GitHub, connect to https://vercel.com
```

### Deploy to Your Server
```bash
# Copy index.html to your web server
scp index.html user@yourserver:/var/www/html/

# Run Node server on your VPS
node server.js &
```

## Next Steps

1. **Customize** - Update company info, colors, services
2. **Test** - Fill out form, verify submission
3. **Integration** - Connect to CRM/email service
4. **Deploy** - Host on Netlify, Vercel, or your server
5. **Monitor** - Track leads, optimize conversion

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Responsive grid, flexbox, gradients
- **Vanilla JavaScript** - No dependencies
- **localStorage** - Demo lead storage
- **Node.js** (optional) - Simple lead API

## Support

For customization questions or integration help, refer to the code comments or reach out to your development team.

---

**Created for:** Tech & Electrical Services LLC, Temecula, CA  
**Version:** 1.0  
**Last Updated:** 2026-03-19
