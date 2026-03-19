# 🚀 Quick Start - Lead Gen Landing Page

## 30-Second Setup

### Option 1: Open Now (No Server)
```bash
# Navigate to the directory
cd /root/.openclaw/workspace/Projects/leadgen/

# Open in your browser
open index.html
# or
firefox index.html
# or
chrome index.html
```

**That's it!** The page works immediately with browser storage.

### Option 2: Run Node Server (Better)
```bash
# Navigate to directory
cd /root/.openclaw/workspace/Projects/leadgen/

# Start the server
node server.js

# Open http://localhost:3000 in your browser
```

Server logs appear in terminal. View leads:
- **Console:** Check terminal for each new lead
- **API:** Visit http://localhost:3000/api/leads to see all leads

---

## What You Get

✅ **Professional landing page** - Modern, mobile-friendly design  
✅ **Lead capture form** - 5 fields + service dropdown  
✅ **Service showcase** - 6 core services with icons  
✅ **CTA buttons** - Multiple conversion opportunities  
✅ **Google Business link** - Direct Google Maps link  
✅ **Responsive design** - Works on mobile, tablet, desktop  

---

## File Structure

```
leadgen/
├── index.html           👈 The landing page (open this!)
├── server.js            👈 Optional Node.js server
├── README.md            📖 Full documentation
├── DEPLOYMENT.md        🚀 Hosting guides (Netlify, Vercel, AWS, etc.)
└── QUICKSTART.md        👈 This file
```

---

## Next Steps (After Testing)

1. **Customize** (Optional)
   - Edit `index.html` to change company name, colors, services
   - Search for `TODO` comments in the file

2. **Test the Form**
   - Fill out form with test data
   - Verify it submits successfully
   - Check confirmation message appears

3. **Deploy** (Choose One)
   - **Easiest:** Drag `index.html` to https://netlify.app
   - **Free:** Upload to https://vercel.com
   - **Full Control:** Run on your own server (see DEPLOYMENT.md)

4. **Collect Leads**
   - Set up email notifications (see DEPLOYMENT.md)
   - Monitor in real-time
   - Follow up with prospects

---

## Customization Tips

### Change Company Name/Contact
Edit these lines in `index.html`:
```html
Line 241: <h1>Your Company Name Here</h1>
Line 470: <a href="tel:+1-951-555-0123">Call Us</a>
Line 471: <a href="mailto:contact@techelectrical.local">Email Us</a>
```

### Change Brand Colors
Replace these hex codes:
- `#1e3a8a` → your primary blue (dark)
- `#fbbf24` → your accent gold (CTA buttons)

### Add/Remove Services
Find the `.services-grid` section (~line 270). Each service is a card:
```html
<div class="service-card">
    <div class="service-icon">🔒</div>
    <h3>Service Name</h3>
    <p>Description</p>
</div>
```

---

## Where to Host

| Platform | Ease | Cost | Speed |
|----------|------|------|-------|
| Netlify | ⭐⭐⭐⭐⭐ | Free | Fast |
| Vercel | ⭐⭐⭐⭐⭐ | Free | Fast |
| Your VPS | ⭐⭐⭐ | $5-20/mo | Fast |
| GoDaddy | ⭐⭐⭐⭐ | ~$5/mo | OK |
| GitHub Pages | ⭐⭐⭐⭐ | Free | Fast |

**Recommendation:** Start with Netlify (easiest). Drag & drop → done in 2 minutes.

---

## Troubleshooting

**"Form won't submit"**
- Check browser console (F12 → Console tab)
- Make sure you filled all required fields
- Try a different browser

**"Can't see leads"**
- Static mode: Open DevTools → Console → `JSON.parse(localStorage.getItem('leads'))`
- Server mode: Check terminal where you ran `node server.js`

**"Server won't start"**
- Make sure Node.js is installed: `node -v`
- Check port 3000 is free: `lsof -i :3000`
- Try different port: Edit `const PORT = 3000;` in server.js

---

## Contact Form Fields

1. **Name** - Full name (required)
2. **Email** - Email address (required)
3. **Phone** - Phone number (required)
4. **Service** - Dropdown selection (required)
5. **Message** - Project details (required)
6. **Consent** - Opt-in checkbox (required)

Customize in `index.html` form section (~line 350).

---

## What Happens When Someone Submits?

1. **Static Mode (No Server)**
   - Form data saved to browser localStorage
   - Success message shown
   - Form clears
   - Check DevTools Console to view leads

2. **Server Mode (node server.js)**
   - Form data POSTed to `/api/leads` endpoint
   - Logged in server terminal
   - Saved in memory (use database for production)
   - Success response sent to browser
   - View all leads: `http://localhost:3000/api/leads`

---

## Pro Tips

💡 **Add Google Analytics** - Track visitors, form submissions, bounce rate
💡 **Use Zapier** - Auto-email leads or add to CRM (HubSpot, Salesforce)
💡 **Add live chat** - Consider Drift, Intercom, or Zendesk
💡 **Set up email autoresponder** - Send "thanks for inquiry" email
💡 **Mobile optimize** - Already done! Test on your phone.

---

## Full Documentation

- **README.md** - Complete feature list and customization guide
- **DEPLOYMENT.md** - Step-by-step hosting instructions
- **index.html** - Read the code comments!

---

## Questions?

Everything is commented in the code. Open `index.html` and search for:
- `<!-- -->` for HTML comments
- `/* */` for CSS comments
- `//` for JavaScript comments

---

**Status:** ✅ Ready to deploy  
**Time to live:** 2 minutes (Netlify)  
**Estimated leads per month:** Depends on traffic!

---

Let's go! 🚀
