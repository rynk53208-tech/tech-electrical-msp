# CRM Tracker Template

Simple lead/pipeline tracker for Irvin's tech business. Import to Google Sheets or Notion.

---

## Columns

| Column | Description |
|--------|-------------|
| **Company** | Business name |
| **Contact** | Person's name |
| **Phone** | Phone number |
| **Email** | Email address |
| **Source** | Where the lead came from (referral, website, cold outreach, etc.) |
| **Status** | Current pipeline stage |
| **Last Contact** | Date of last interaction (YYYY-MM-DD) |
| **Next Action** | What needs to happen next (call, quote, follow-up) |
| **Notes** | Any relevant details |

---

## Pipeline Stages

| Stage | Meaning |
|-------|---------|
| **New Lead** | Just came in, not yet contacted |
| **Attempted** | Tried to reach, no answer yet |
| **Contacted** | Had a conversation, qualifiying |
| **Qualified** | Confirmed interest + budget + timeline |
| **Quote Sent** | Proposal out, waiting on response |
| **Negotiating** | Discussing terms, closing |
| **Closed Won** | Booked/paid |
| **Closed Lost** | Passed or not interested |

---

## Follow-Up Reminders

| Status | Action |
|--------|--------|
| New Lead | Contact within 24 hours |
| Attempted | Retry within 3 days |
| Contacted | Follow up within 7 days |
| Quote Sent | Check in within 5 days |
| Negotiating | Check in every 2-3 days |

---

## Quick Import (CSV Format)

```
Company,Contact,Phone,Email,Source,Status,Last Contact,Next Action,Notes
Acme Corp,John Smith,555-1234,john@acme.com,Referral,New Lead,,
TechStart LLC,Jane Doe,555-5678,jane@techstart.io,Website,Contacted,2026-03-15,Send quote,"Interested in MSP services"
```

---

## Tips

- **Color-code rows by status** (green=won, red=lost, yellow=active)
- **Set calendar reminders** for follow-ups based on the schedule above
- **Update "Last Contact"** every time you touch base
- **Archive closed lost** monthly to keep the sheet clean
