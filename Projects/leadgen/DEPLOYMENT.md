# Deployment Guide - Lead Gen Landing Page

## Quick Deployment Options

### 1. Netlify (Recommended - Free & Easy)

**Fastest Option - 2 minutes:**

1. Visit https://netlify.com
2. Sign up (or use GitHub login)
3. Drag & drop `index.html` into the deploy zone
4. Done! Your site is live at `[random-name].netlify.app`

**With Git (Continuous Deployment):**
```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push origin main

# Connect repo to Netlify
# Go to netlify.com → New site from Git
# Select your repo → Deploy
```

### 2. Vercel (Free Tier Available)

1. Visit https://vercel.com
2. Sign in with GitHub
3. Import this repository
4. Deploy
5. Get custom domain at `your-domain.vercel.app`

### 3. Your Own VPS/Server

**Deploy to Linux Server:**

```bash
# SSH into your server
ssh user@your-server.com

# Create web directory
mkdir -p /var/www/leadgen
cd /var/www/leadgen

# Copy files
scp index.html user@your-server:/var/www/leadgen/
scp server.js user@your-server:/var/www/leadgen/

# Run with Node.js
cd /var/www/leadgen
node server.js &

# Or use pm2 for persistence
npm install -g pm2
pm2 start server.js --name leadgen
pm2 startup
pm2 save
```

**With Nginx (Reverse Proxy):**

```nginx
server {
    listen 80;
    server_name leadgen.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. cPanel/Shared Hosting

1. Upload `index.html` via FTP/File Manager
2. Set directory to public_html
3. Access at `yourdomain.com/path-to-file`

**For Node.js (if supported):**
1. Upload files to your Node app directory
2. Use cPanel "Setup Node.js App"
3. Point to `server.js`

### 5. GitHub Pages (Static Only)

```bash
# Create repo named: username.github.io
git init
git add index.html README.md
git commit -m "Landing page"
git push origin main

# Visit https://username.github.io/
```

**Note:** GitHub Pages doesn't support Node.js. Use static version or set up a separate backend.

## Custom Domain Setup

### Add Your Domain

**If using Netlify/Vercel:**
1. Dashboard → Settings → Domain
2. Add custom domain: `leadgen.yourdomain.com`
3. Update DNS records (they'll show you how)

**If using your own server:**
1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Update A record to point to your server IP
3. Wait for DNS propagation (24 hours)

## SSL/HTTPS Setup

**Netlify/Vercel:** Automatic ✅

**Your Server:**
```bash
# Using Let's Encrypt (Free)
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d leadgen.yourdomain.com

# Auto-renew
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## Enable Lead Form Email Notifications

### Option A: Zapier Integration

1. Create Zapier account (free tier available)
2. Create new Zap:
   - **Trigger:** Webhook (catch raw data)
   - **Action:** Send email / Add to Google Sheets / CRM

3. Get your Webhook URL from Zapier
4. Update `server.js` or form submission:

```javascript
// Send to Zapier
fetch('https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID/', {
    method: 'POST',
    body: JSON.stringify(formData)
});
```

### Option B: Direct Email (Node.js)

Install Nodemailer:
```bash
npm install nodemailer
```

Update `server.js`:
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// In the /api/leads handler, add:
transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: 'your-email@company.com',
    subject: `New Lead: ${leadData.name}`,
    html: `<p>Name: ${leadData.name}</p>...`
});
```

### Option C: Google Sheets

1. Set up Google Apps Script
2. Create POST endpoint from Sheets
3. Point form to that endpoint

[Guide: Send form data to Google Sheets](https://github.com/jamiewilson/form-to-google-sheets)

## Performance Optimization

### Minify HTML/CSS/JS
```bash
# Install minifier
npm install -g html-minifier

# Minify
html-minifier --collapse-whitespace --remove-comments \
    index.html > index.min.html
```

### Enable Gzip Compression (Nginx)
```nginx
gzip on;
gzip_types text/plain text/css text/javascript;
gzip_min_length 1000;
```

### Cache Headers
```nginx
location ~* \.(html|css|js)$ {
    expires 1d;
    add_header Cache-Control "public, immutable";
}
```

## Monitoring & Analytics

### Google Analytics
Add to `<head>` in index.html:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_ID');
</script>
```

### Track Form Submissions
```javascript
// In form submission handler:
gtag('event', 'lead_submitted', {
    'service': formData.service,
    'lead_value': 'quote_request'
});
```

## Troubleshooting

**Forms not submitting?**
- Check browser console for errors (F12)
- Verify API endpoint is correct
- Check CORS headers in server response

**Server won't start?**
- Make sure Node.js is installed: `node --version`
- Check port 3000 is available: `lsof -i :3000`
- Review error logs: `node server.js 2>&1 | tee app.log`

**DNS not resolving?**
- Wait for DNS propagation (can take 24 hours)
- Verify DNS records: `nslookup leadgen.yourdomain.com`
- Check registrar settings

## Maintenance Checklist

- [ ] Test form submission weekly
- [ ] Monitor server uptime
- [ ] Review leads regularly
- [ ] Update contact info if needed
- [ ] Keep Node.js/server updated
- [ ] Backup lead data regularly
- [ ] Monitor SSL certificate expiration
- [ ] Track analytics monthly

## Next Steps

1. Choose deployment method above
2. Deploy landing page
3. Test form submission
4. Add to Google Business
5. Share with marketing channels
6. Monitor conversions
7. Iterate based on feedback

---

Need help? Refer to README.md or check the code comments in index.html
