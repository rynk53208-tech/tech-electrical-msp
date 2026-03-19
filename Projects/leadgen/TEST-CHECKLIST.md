# ✅ Testing Checklist - Lead Gen Landing Page

Run through this checklist before going live.

## Desktop Browser Testing

- [ ] **Chrome** - Opens without errors
- [ ] **Firefox** - Opens without errors
- [ ] **Safari** - Opens without errors
- [ ] **Edge** - Opens without errors

## Mobile Testing

- [ ] **iPhone** - Responsive, readable
- [ ] **Android** - Responsive, readable
- [ ] **Landscape mode** - Layout adapts correctly
- [ ] **Touch interactions** - Buttons clickable

## Form Testing

### Basic Submission
- [ ] Fill all fields correctly
- [ ] Click "Get Your Free Quote"
- [ ] Success message appears
- [ ] Form clears after submission

### Validation
- [ ] **Name:** Leave blank → error shows
- [ ] **Email:** Invalid email → error shows
- [ ] **Phone:** Leave blank → error shows
- [ ] **Service:** No selection → error shows
- [ ] **Message:** Leave blank → error shows
- [ ] **Consent:** Unchecked → error shows

### Field Interactions
- [ ] Can type in text fields
- [ ] Can select from dropdown
- [ ] Can type in message textarea
- [ ] Can check/uncheck checkbox
- [ ] Tab between fields works
- [ ] Focus states visible

## Page Elements

### Hero Section
- [ ] Title visible and readable
- [ ] Tagline displays correctly
- [ ] Background gradient renders

### Services Section
- [ ] All 6 service cards display
- [ ] Icons render correctly
- [ ] Cards stack on mobile
- [ ] Hover effect works (desktop)
- [ ] Text is readable

### CTA Section
- [ ] "Get a Free Quote" button works
- [ ] "View on Google Business" link opens in new tab
- [ ] Text displays correctly

### Form Section
- [ ] All labels visible
- [ ] All form fields render
- [ ] Form aligns correctly on mobile
- [ ] Submit button is prominent

### Footer
- [ ] All links present
- [ ] Google Business link opens correctly
- [ ] Email link works
- [ ] Phone link works (on mobile)
- [ ] Copyright text displays

## Responsive Design

### Mobile (< 480px)
- [ ] No horizontal scroll
- [ ] Text is readable without zoom
- [ ] Buttons are easy to tap
- [ ] Form fits screen width

### Tablet (480px - 1024px)
- [ ] Layout adapts correctly
- [ ] Services grid shows 2 columns
- [ ] Form looks good
- [ ] Navigation clear

### Desktop (> 1024px)
- [ ] Services grid shows 3 columns
- [ ] Form is centered properly
- [ ] Hover effects work
- [ ] All content visible

## Performance

- [ ] Page loads in < 2 seconds
- [ ] No broken images (emojis display)
- [ ] No console errors (F12 → Console)
- [ ] Smooth scrolling
- [ ] No layout shifts

## Browser Console

- [ ] Open DevTools (F12)
- [ ] Go to Console tab
- [ ] No red error messages
- [ ] No warnings about missing files

## Lead Capture (Static Mode)

- [ ] Submit a test form
- [ ] Open DevTools → Console
- [ ] Run: `JSON.parse(localStorage.getItem('leads'))`
- [ ] Verify lead appears in output
- [ ] All fields match what you entered

## Lead Capture (Server Mode)

- [ ] Start server: `node server.js`
- [ ] Open http://localhost:3000
- [ ] Submit test form
- [ ] Check server terminal for log
- [ ] Visit http://localhost:3000/api/leads
- [ ] Verify lead appears in API response

## Links & External Resources

- [ ] Google Business link works
- [ ] Email link opens email client
- [ ] Phone link triggers dial (mobile)
- [ ] No broken links in footer

## Accessibility

- [ ] Can use keyboard to navigate
- [ ] Tab order is logical
- [ ] Form labels associated with inputs
- [ ] Color contrast is readable
- [ ] Can zoom in/out

## Cross-Browser Compatibility

- [ ] Works without JavaScript (basic structure)
- [ ] Works with JavaScript enabled
- [ ] localStorage works (static mode)
- [ ] localStorage doesn't break page if disabled

## SEO Basics

- [ ] Page title is descriptive
- [ ] Meta description exists
- [ ] Heading hierarchy is correct
- [ ] Alt text on images (emojis)

## Security Check

- [ ] No sensitive data in HTML
- [ ] Form fields are reasonable
- [ ] No exposed API keys
- [ ] HTTPS ready (for deployment)

## Before Going Live

- [ ] All tests above pass ✅
- [ ] Customized with your company info
- [ ] Brand colors applied
- [ ] Contact info updated
- [ ] Google Business link added
- [ ] Services match your offerings
- [ ] Someone unfamiliar tested it (fresh eyes)

## Deployment Checklist

- [ ] Hosting platform chosen
- [ ] Files uploaded/deployed
- [ ] Domain configured (if custom)
- [ ] SSL/HTTPS enabled
- [ ] Email notifications set up (optional)
- [ ] Analytics configured (optional)
- [ ] CRM integration ready (optional)
- [ ] Test lead submitted on live site

## Post-Launch Monitoring

- [ ] Check leads appear daily
- [ ] Monitor response/conversion rate
- [ ] Check analytics for traffic
- [ ] Review bounce rate
- [ ] Test form weekly
- [ ] Update info as needed
- [ ] Monitor uptime (for server)

---

## Notes Section

Use this to track issues found and fixes applied:

```
Test Date: _______________
Tester: ___________________

Issues Found:
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

Fixes Applied:
1. _______________________________________________
2. _______________________________________________

Result: [ ] PASS  [ ] FAIL
Sign-off: ________________________
```

---

## Quick Test Script

Run this to test everything programmatically (requires Node.js):

```bash
# Navigate to directory
cd /root/.openclaw/workspace/Projects/leadgen/

# Start server
node server.js &

# Wait 2 seconds
sleep 2

# Test homepage
echo "Testing homepage..."
curl -s http://localhost:3000/ | grep -q "Tech & Electrical" && echo "✓ Page loads"

# Test form submission
echo "Testing form submission..."
curl -s -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test User",
    "email":"test@example.com",
    "phone":"555-1234",
    "service":"cybersecurity",
    "message":"Test message"
  }' | grep -q "success" && echo "✓ Form accepts leads"

# View leads
echo "Viewing stored leads..."
curl -s http://localhost:3000/api/leads | grep -q "Test User" && echo "✓ Leads stored"

echo "All tests completed!"
```

---

**Last Updated:** 2026-03-19  
**Status:** Ready for testing  
**Version:** 1.0
