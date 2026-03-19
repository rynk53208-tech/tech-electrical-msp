# 🚀 START HERE – Invoice Follow-Up Email Templates

Welcome! You now have a complete, professional invoice payment reminder system ready to deploy.

## ⚡ Quick Start (2 minutes)

### Step 1: Open the Interactive Index
Open `INDEX.html` in your browser to see all templates and pick which one you need.

### Step 2: Pick Your Template
Based on where the invoice is in the payment cycle:
- **7 days before due** → Use `01-reminder-7-days.html`
- **On due date** → Use `02-due-today.html`
- **1-5 days overdue** → Use `03-overdue-1st-notice.html`
- **15+ days overdue** → Use `04-overdue-2nd-notice.html`
- **30+ days overdue** → Use `05-final-notice.html`

### Step 3: Customize the Template
1. Open the HTML file in a text editor
2. Find and replace ALL {{PLACEHOLDERS}} with actual data:
   - `{{CLIENT_NAME}}` → "John Smith"
   - `{{INVOICE_NUMBER}}` → "INV-2026-001"
   - `{{AMOUNT}}` → "$2,500.00"
   - etc.

### Step 4: Send as Email
- Copy the entire HTML
- Paste into your email client as HTML
- Send!

## 📋 What You Have

```
/invoice-followup/
├── 📧 EMAIL TEMPLATES (Ready to customize and send):
│   ├── 01-reminder-7-days.html
│   ├── 02-due-today.html
│   ├── 03-overdue-1st-notice.html
│   ├── 04-overdue-2nd-notice.html
│   └── 05-final-notice.html
│
├── 📊 TRACKING & DASHBOARD:
│   ├── tracking.html (Visual status of all invoices)
│   └── INDEX.html (Template browser & quick reference)
│
├── 📚 DOCUMENTATION:
│   ├── README.md (Full guide with detailed instructions)
│   ├── QUICK-REFERENCE.txt (One-page cheat sheet)
│   ├── SAMPLE-DATA.json (Example data for testing)
│   └── START-HERE.md (This file)
```

## 🎯 All Template Placeholders

Copy & paste these into your template, replacing each placeholder:

```
{{CLIENT_NAME}}         - Customer's name or company
{{INVOICE_NUMBER}}      - Invoice ID
{{AMOUNT}}              - Original invoice amount
{{DUE_DATE}}            - Original due date
{{DAYS_OVERDUE}}        - Days past due
{{LATE_FEES}}           - Late fees charged
{{TOTAL_AMOUNT}}        - Total due (including fees)
{{PAYMENT_LINK}}        - Link to payment portal
{{COMPANY_NAME}}        - Your company name
{{CONTACT_PHONE}}       - Your phone number
{{CONTACT_EMAIL}}       - Your email address
```

## 🔄 Recommended Timeline

| Day | Action | Template |
|-----|--------|----------|
| -7 | Send friendly reminder | 01-reminder-7-days.html |
| 0 | Due date reminder | 02-due-today.html |
| +3 | 1st overdue notice | 03-overdue-1st-notice.html |
| +15 | 2nd overdue notice (late fees) | 04-overdue-2nd-notice.html |
| +30 | Final notice before collections | 05-final-notice.html |
| +33 | Escalate to collections | Manual follow-up |

## 💡 Pro Tips

✅ **Test first:** Send to yourself before sending to real clients  
✅ **Customize the tone:** Adjust text to match your business voice  
✅ **Use a payment link:** Include a direct link to your payment portal  
✅ **Keep records:** Document when each email was sent  
✅ **Automate if possible:** Integrate with your invoicing software (Wave, FreshBooks, Stripe, etc.)  
✅ **Use the tracking dashboard:** Monitor which clients have been sent which reminders  

## 🌐 Email Client Compatibility

These templates work in:
- ✅ Gmail (web & mobile)
- ✅ Outlook (web & desktop)
- ✅ Apple Mail
- ✅ Thunderbird
- ✅ Most email clients

**Tip:** Always test in your specific email client before sending to clients.

## 🎨 Design Features

- **Professional gradient headers** – Matches your brand
- **Color-coded urgency** – Visual escalation (blue → orange → red → dark red)
- **Mobile responsive** – Works perfectly on phones and tablets
- **Clear CTAs** – Prominent "Pay Now" buttons in all templates
- **Standalone emails** – No context needed from previous messages
- **Print-friendly** – Can be printed if needed

## 🔒 Legal Considerations

- The templates include appropriate legal language where needed
- Final notice template includes collection-level language
- Keep records of all emails sent (for legal protection)
- Check your local laws regarding late fees and collection practices
- Consider having a lawyer review the final notice template

## 📞 Integration Ideas

### With Invoicing Software:
- **Wave Accounting** → Export CSV, send manually or use built-in reminders
- **FreshBooks** → Has automated reminders; use these as supplements
- **Stripe** → Use webhooks to trigger emails automatically
- **Square** → Similar webhook integration

### With Email Automation:
- **Zapier** → Connect invoice app → email service (Gmail, Sendgrid, Mailgun)
- **IFTTT** → Simple automation for basic triggers
- **Make.com** → Visual workflow builder

### With CRM:
- **Pipedrive** → Automate email sequences based on invoice age
- **HubSpot** → Built-in automation workflows
- **Salesforce** → Custom workflows

## 📊 Track Your Progress

Use `tracking.html` to:
- View all outstanding invoices at a glance
- See which reminders have been sent
- Track payment status
- Know which action to take next

## ❓ FAQ

**Q: Can I modify the design?**  
A: Yes! All templates are fully editable. Change colors, fonts, layout—whatever you need.

**Q: How do I automate this?**  
A: See "Integration Ideas" above. Or manually send using your email client.

**Q: What if a client needs a payment plan?**  
A: Add a note to the 2nd or Final notice offering payment plan options.

**Q: Can I add my logo?**  
A: Yes! Edit the HTML and replace the header section with your logo.

**Q: Are these legal?**  
A: Yes, they follow standard business practices. Review with a lawyer if in doubt.

## 🎓 Next Steps

1. **Read full docs:** Open `README.md` for complete details
2. **Quick reference:** Check `QUICK-REFERENCE.txt` for a one-page guide
3. **Try a template:** Open any HTML file in your browser to preview
4. **Customize:** Edit the HTML files with your company info
5. **Send test:** Test email to yourself first
6. **Go live:** Start using with real clients

---

**Ready to send professional payment reminders? Pick a template above and get started!** 🚀
