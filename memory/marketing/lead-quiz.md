# Lead Qualifying Quiz

## Self-Qualifying Quiz for Website Visitors

AInteractive quiz to qualify leads, score them automatically, route to the right service, and capture contact info.

---

## Quiz Flow Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    VISITOR ENTERS                            │
│                         ↓                                    │
│    ┌─────────────────────────────────────────────┐          │
│    │  Q1: What type of help do you need?         │          │
│    └─────────────────────────────────────────────┘          │
│                         ↓                                    │
│    Based on answer → Route to relevant question track       │
│                         ↓                                    │
│    Track A: IT/Technical Services                           │
│    Track B: Cybersecurity                                   │
│    Track C: Electrical Services                             │
│    Track D: General/Not Sure                                │
│                         ↓                                    │
│    Score leads → Route to service                           │
│                         ↓                                    │
│    Capture contact info → Nurture sequence                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Questions

### Q1: What type of help do you need?

**Purpose:** Initial routing to correct service track

**Options:**

- A) Computer repair, hardware issues, or custom builds
- B) Network security, vulnerability assessment, or cybersecurity
- C) Software development or coding help
- D) Managed IT services (ongoing support)
- E) Electrical work (residential/commercial)
- F) Not sure / need to talk to someone

**Scoring:** This determines the primary track. Each option maps to a service category.

---

### Track A: IT/Technical Services

#### Q2A: What's the current issue?

- A) Computer won't turn on / hardware failure (10 pts)
- B) Slow performance / needs upgrade (5 pts)
- C) Data recovery needed (15 pts)
- D) Need custom PC build (5 pts)
- E) Multiple devices affected (8 pts)

#### Q3A: How urgent is this?

- A) Critical - business down (20 pts)
- B) Urgent - need it fixed today (15 pts)
- C) Within a week (10 pts)
- D) Flexible / planning (5 pts)

#### Q4A: How many devices need attention?

- A) Just one (5 pts)
- B) 2-5 devices (10 pts)
- C) 6-20 devices (15 pts)
- D) 20+ devices / entire network (20 pts)

#### Q5A: Is this for home or business?

- A) Home (5 pts)
- B) Small business (10 pts)
- C) Enterprise / large business (20 pts)

---

### Track B: Cybersecurity

#### Q2B: What are you most concerned about?

- A) Ransomware / malware protection (15 pts)
- B) Data breach prevention (15 pts)
- C) Compliance requirements (HIPAA, SOC2, etc.) (20 pts)
- D) Network security / firewall (10 pts)
- E) Employee security training (5 pts)
- F) Not sure what I need (5 pts)

#### Q3B: Have you had a security incident before?

- A) Yes - recent incident (25 pts)
- B) Yes - but not recently (15 pts)
- C) No, but concerned (10 pts)
- D) No - just starting to think about it (5 pts)

#### Q4B: What's your current IT setup?

- A) No dedicated IT team (15 pts)
- B) Small internal IT team (1-3 people) (10 pts)
- C) Outsourced IT support (10 pts)
- D) Full internal IT department (5 pts)

#### Q5B: How many employees/users need protection?

- A) 1-10 (5 pts)
- B) 11-50 (10 pts)
- C) 51-200 (15 pts)
- D) 200+ (20 pts)

---

### Track C: Software Development

#### Q2C: What type of project?

- A) New web application (15 pts)
- B) Mobile app (15 pts)
- C) API / backend development (10 pts)
- D) Website / landing page (5 pts)
- E) Custom software / automation (15 pts)
- F) Not sure / need consultation (5 pts)

#### Q3C: What's your timeline?

- A) Need it ASAP / emergency (20 pts)
- B) Within 1 month (15 pts)
- C) 1-3 months (10 pts)
- D) 3+ months / flexible (5 pts)

#### Q4C: What's your budget range?

- A) Under $5,000 (5 pts)
- B) $5,000 - $25,000 (10 pts)
- C) $25,000 - $100,000 (15 pts)
- D) $100,000+ (20 pts)
- E) Prefer to discuss (10 pts)

#### Q5C: Do you have existing technical documentation?

- A) Yes - full specs (5 pts)
- B) Yes - basic requirements (10 pts)
- C) No - need help defining (15 pts)

---

### Track D: Electrical Services

#### Q2E: What type of electrical work?

- A) New installation / renovation (15 pts)
- B) Repair / troubleshooting (10 pts)
- C) Upgrade / panel replacement (15 pts)
- D) Safety inspection (10 pts)
- E) Not sure (5 pts)

#### Q3E: Is this residential or commercial?

- A) Residential (5 pts)
- B) Commercial (15 pts)
- C) Industrial (20 pts)

#### Q4E: Any safety concerns?

- A) Yes - immediate safety issue (25 pts)
- B) Some concerns (15 pts)
- C) No - routine project (5 pts)

---

## Scoring System

### Score Ranges

| Score | Qualification | Action |
|-------|--------------|--------|
| 0-20  | Low          | Add to general nurture list |
| 21-40 | Medium       | Schedule consultation call |
| 41-60 | High         | Priority callback within 24h |
| 61+   | Very High    | Immediate outreach - same day |

### Service Routing by Score + Track

#### Computer Repair / IT Services
- Score 0-25: Budget PC repair → Email quote request
- Score 26-50: Standard repair → Consultation scheduled
- Score 51+: Emergency/priority → Same-day callback

#### Cybersecurity (MSSP)
- Score 0-20: Security awareness → Download free guide
- Score 21-45: Basic needs → Security assessment quote
- Score 46+: Enterprise needs → Compliance/assessment meeting

#### Software Development
- Score 0-20: Small project → Portfolio email + quote form
- Score 21-45: Medium project → Discovery call
- Score 46+: Enterprise/large → Senior consultation

#### Electrical
- Score 0-15: Simple job → Email/quote
- Score 16-30: Standard job → Site visit scheduled
- Score 31+: Complex/commercial → Project manager call

---

## Contact Capture Form

**Shown after quiz completion**

### Fields

```
Name: [Required]
Email: [Required]
Phone: [Optional]
Company: [Optional]
Best time to contact:
  □ Morning (8am-12pm)
  □ Afternoon (12pm-5pm)
  □ Evening (5pm-8pm)
  □ Anytime

How did you hear about us?: [Dropdown]
  □ Google Search
  □ Social Media
  □ Referral
  □ Previous Customer
  □ Other

Notes / Additional Details: [Textarea]
```

### Submit Button Text Options
- "Get My Results & Quote"
- "See My Service Options"
- "Schedule My Consultation"

---

## Automated Response Flow

### Immediate Email (Triggered on submission)

**Subject Line Options:**
- "Your Quiz Results - [Service Type]"
- "Next Steps for Your [Project Type]"
- "Here Are Your Options - [Name]"

**Email Content:**
1. Thank you message
2. Summary of their quiz responses
3. Recommended service tier
4. Next steps
5. Calendar link for consultation
6. Phone number for urgent matters

---

## Implementation Notes

### Tech Stack Suggestions

- **Form + Quiz:** Typeform, JotForm, or custom form
- **CRM Integration:** HubSpot, Pipedrive, or Airtable
- **Email Automation:** Mailchimp, ConvertKit, or CRM-native
- **Calendar Booking:** Calendly or Cal.com

### A/B Testing Ideas

1. Quiz length (5 questions vs 7 questions)
2. Question order (urgency first vs problem type first)
3. Contact form fields (more fields vs fewer fields)
4. CTA button text variants

### Tracking to Add

- Quiz completion rate
- Drop-off points per question
- Score distribution
- Conversion by score tier
- Time to conversion by score

---

## Quick-Start Checklist

- [ ] Choose quiz platform
- [ ] Build questions in platform
- [ ] Set up scoring logic
- [ ] Create email automations
- [ ] Connect to CRM
- [ ] Add to website
- [ ] Test full flow
- [ ] Set up analytics
- [ ] Create follow-up sequences

---

## Resources Needed

- Lead capture form landing page
- Email templates for each score tier
- Calendar booking link
- Free lead magnet (if using low-score nurturing)
- CRM pipeline setup

---

*Last Updated: 2026-03-18*
*Status: Ready for implementation*
