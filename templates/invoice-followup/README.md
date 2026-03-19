# Invoice Follow-Up Email Templates

Professional HTML email templates for managing invoice payment reminders across all stages of the collections process. All templates follow the same design system and include customizable placeholders.

## 📋 Templates Included

### 1. **Reminder - 7 Days Before** (`01-reminder-7-days.html`)
**Purpose:** Friendly, early reminder before invoice is due  
**Tone:** Courteous and helpful  
**CTA:** "Pay Now" button  
**Use Case:** Send 7 days before the due date to keep it on their radar

### 2. **Due Today** (`02-due-today.html`)
**Purpose:** Professional nudge on the actual due date  
**Tone:** Professional, appreciative  
**CTA:** "Pay Now" button with emphasis on keeping account active  
**Use Case:** Send on the due date to prompt immediate payment

### 3. **Overdue - 1st Notice** (`03-overdue-1st-notice.html`)
**Purpose:** First escalation - polite but clear that payment is overdue  
**Tone:** Professional, urgent  
**CTA:** Clear call to action with 30-day deadline  
**Use Case:** Send when invoice is 1-5 days overdue

### 4. **Overdue - 2nd Notice** (`04-overdue-2nd-notice.html`)
**Purpose:** Second escalation with late fees notification  
**Tone:** Urgent, firm  
**CTA:** Prominent "Pay Now" button with collections warning  
**Use Case:** Send when invoice is 15-20 days overdue; late fees have accrued

### 5. **Final Notice** (`05-final-notice.html`)
**Purpose:** Last notice before collections escalation  
**Tone:** Very urgent, formal, legal language  
**CTA:** Large "Pay Now - 48 Hours Remaining" button  
**Use Case:** Send when invoice is 30+ days overdue; final opportunity before collections

## 🎨 Design Features

- **Consistent branding:** All templates use the same professional color scheme (navy blue gradients)
- **Responsive design:** Works on desktop, tablet, and mobile
- **Color-coded urgency:** 
  - 7-day reminder: Blue (calm)
  - Due today: Orange (attention)
  - 1st overdue: Red (urgent)
  - 2nd overdue: Dark red (very urgent)
  - Final notice: Very dark red (critical)
- **Clear visual hierarchy:** Important information stands out
- **Standalone emails:** Each template works independently—no context needed from previous emails

## 🔤 Placeholder Variables

Replace these placeholders in each template with your actual data:

```
{{CLIENT_NAME}}         - Customer's first name or company name
{{INVOICE_NUMBER}}      - Invoice reference number
{{AMOUNT}}              - Original invoice amount (e.g., $2,500.00)
{{DUE_DATE}}            - Original due date (e.g., 2026-03-26)
{{DAYS_OVERDUE}}        - Number of days past due
{{LATE_FEES}}           - Late fees or interest charges
{{TOTAL_AMOUNT}}        - Total amount due (including late fees)
{{PAYMENT_LINK}}        - Link to payment portal or Stripe/PayPal
{{COMPANY_NAME}}        - Your company/business name
{{CONTACT_PHONE}}       - Your phone number
{{CONTACT_EMAIL}}       - Your email address
```

## 📧 Recommended Sending Schedule

| Event | Days | Template | Priority |
|-------|------|----------|----------|
| Friendly reminder | -7 | 01-reminder-7-days.html | Low |
| Due date | 0 | 02-due-today.html | Medium |
| First overdue notice | +1 to +5 | 03-overdue-1st-notice.html | High |
| Second overdue notice | +15 to +20 | 04-overdue-2nd-notice.html | Very High |
| Final notice | +30+ | 05-final-notice.html | Critical |

## 🛠️ How to Use

### 1. **Copy & Customize**
- Open the HTML template you need
- Replace all {{PLACEHOLDER}} variables with actual data
- Customize the company name, phone, email in the signature

### 2. **Email Integration**
- Send as HTML email via your email provider (Gmail, Outlook, etc.)
- Most email clients support drag-and-drop HTML pasting
- Test in multiple email clients before sending to ensure formatting looks good

### 3. **Automation**
- Integrate with your invoicing software (Wave, FreshBooks, etc.) using webhooks
- Or use email automation tools (Zapier, IFTTT) to send based on due date rules
- Or manually send when payment milestones are reached

### 4. **Tracking**
- Use `tracking.html` to monitor which reminders have been sent
- Track payment status for each invoice
- See at a glance which clients need follow-up

## 📊 Tracking Dashboard

Open `tracking.html` in a browser to see:
- **Stats cards:** Total invoices, awaiting payment, paid, overdue
- **Client table:** Full overview of all invoice statuses
- **Follow-up progress:** Visual timeline showing which reminders have been sent
- **Action buttons:** Quick links to send the next appropriate reminder

## 💡 Tips for Success

1. **Personalize the tone:** Feel free to adjust language to match your company voice
2. **Test first:** Send to yourself before real clients to check formatting
3. **Stay consistent:** Use the same template set for all clients for consistency
4. **Be professional:** Even the "Final Notice" should remain professional and factual
5. **Include payment methods:** Always provide multiple ways to pay (link, phone, email)
6. **Document everything:** Keep records of when each email was sent for legal protection

## 🔒 Legal Considerations

- The "Final Notice" template includes language suitable for pre-collections correspondence
- Sending reminders establishes a paper trail for legal proceedings if needed
- Check your local laws regarding collection letters and late fee policies
- Consider having an attorney review your final notice template

## ✉️ Sample Workflow

**Day -7:** Client receives "Reminder - 7 Days Before" → Blue, friendly tone  
↓  
**Day 0:** Client receives "Due Today" → Orange, professional nudge  
↓  
**Day +3:** Client receives "Overdue - 1st Notice" → Red, polite but firm  
↓  
**Day +15:** Client receives "Overdue - 2nd Notice" → Dark red, late fees added  
↓  
**Day +30:** Client receives "Final Notice" → Very dark red, last chance  
↓  
**Day +33:** Escalate to collections agency if payment still not received

## 📝 Customization Ideas

- Add your logo to the header
- Include links to payment portal in all emails
- Add FAQ section to FAQ-heavy templates
- Customize colors to match your brand
- Add different signatures for different team members
- Include payment plan options in 2nd Notice and Final Notice

---

**All templates are ready to use as-is. Feel free to modify colors, text, and structure to match your business needs.**
