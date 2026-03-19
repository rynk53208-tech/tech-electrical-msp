# SMS Notification System for Irvin's Tech Business

## 1. When to Send SMS

### Priority 1: Critical Alerts (Send Immediately)
- **Server down / service outage** - Any production server or critical service goes offline
- **Security breach detected** - Intrusion attempts, unauthorized access, malware detected
- **Payment failed** - Recurring payment declined, subscription at risk
- **Client emergency** - High-priority ticket from VIP client

### Priority 2: Important Notifications (Send within 5 min)
- **New urgent ticket** - Ticket marked as urgent/emergency priority
- **Ticket assigned** - Client notified their issue is being worked on
- **Payment received** - Confirmation of invoice payment
- **Service restoration** - Server/service back online after outage

### Priority 3: Daily Summaries (Once per day)
- **Daily ticket summary** - Open tickets count, pending payments
- **Weekly revenue report** - Payment summary for the week
- **Scheduled maintenance reminder** - 24h notice before maintenance

### Priority 4: Optional/On-Demand
- **Quote sent** - Client sent a quote
- **Invoice sent** - New invoice generated
- **Appointment reminder** - Upcoming scheduled service

---

## 2. SMS Sending Script

### Option A: Twilio (Recommended)

```python
#!/usr/bin/env python3
"""
SMS Notification Script for Irvin's Tech Business
Uses Twilio API - get credentials at https://www.twilio.com
"""

import os
import sys
from twilio.rest import Client

# Configuration - Set these environment variables or edit directly
TWILIO_ACCOUNT_SID = os.environ.get('TWILIO_ACCOUNT_SID', 'your_account_sid')
TWILIO_AUTH_TOKEN = os.environ.get('TWILIO_AUTH_TOKEN', 'your_auth_token')
TWILIO_PHONE_NUMBER = os.environ.get('TWILIO_PHONE_NUMBER', '+1234567890')

# Your phone number (for testing/primary recipient)
MY_PHONE = os.environ.get('MY_PHONE', '+1987654321')


def send_sms(message: str, to_number: str = None) -> bool:
    """Send an SMS message."""
    if to_number is None:
        to_number = MY_PHONE
    
    try:
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        message = client.messages.create(
            body=message,
            from_=TWILIO_PHONE_NUMBER,
            to=to_number
        )
        print(f"✅ SMS sent: {message.sid}")
        return True
    except Exception as e:
        print(f"❌ Failed to send SMS: {e}")
        return False


def send_urgent_alert(subject: str, body: str) -> bool:
    """Send urgent alert with URGENT prefix."""
    full_message = f"🚨 URGENT: {subject}\n{body}"
    return send_sms(full_message)


def send_payment_alert(invoice_id: str, amount: str, status: str) -> bool:
    """Send payment-related notification."""
    emoji = "✅" if status == "paid" else "⚠️"
    message = f"{emoji} Payment {status.upper()}\nInvoice #{invoice_id}: ${amount}"
    return send_sms(message)


def send_ticket_alert(ticket_id: str, client_name: str, priority: str) -> bool:
    """Send new ticket notification."""
    emoji = "🔴" if priority == "urgent" else "🟡"
    message = f"{emoji} New {priority} Ticket\n#{ticket_id} - {client_name}"
    return send_sms(message)


if __name__ == "__main__":
    # Example usage
    if len(sys.argv) > 1:
        # Direct message: python sms.py "Your message here"
        send_sms(" ".join(sys.argv[1:]))
    else:
        # Demo
        print("SMS Script Ready")
        print("Usage: python sms.py 'Your message here'")
        # send_sms("Test message from your SMS system!")
```

### Installation
```bash
pip install twilio
```

### Option B: CLI Tool (simpler, no Python)

```bash
#!/bin/bash
# sms.sh - Quick SMS send via Twilio CLI
# Install: brew install twilio-cli && twilio login

SMS_MSG="${1:-Test message}"
twilio api:core:messages:create --body "$SMS_MSG" --from "+1234567890" --to "+1987654321"
```

---

## 3. Integration Ideas

### A. Ticketing System Integration
- **AutomatMate / Webhook**: Connect ticketing system webhooks to trigger SMS on ticket creation/update
- **SpiceWorks**: Use PowerShell scripts in workflows to call SMS
- **Custom**: Add `send_sms()` call when ticket priority = "urgent"

### B. Payment/Invoice Integration
- **Stripe**: Use Stripe webhooks for `invoice.payment_succeeded` / `invoice.payment_failed`
- **QuickBooks**: Scheduled job to check unpaid invoices > 30 days
- **FreshBooks**: Webhook plugin for payment events

### C. Monitoring/Ops Integration
- **Uptime Kuma**: Add "Custom Notification" webhook pointing to a receiver script
- **Prometheus/Alertmanager**: Configure webhook receiver for critical alerts
- **Zabbix/Nagios**: Action scripts to call SMS on trigger

### D. Business Logic Hooks
- **Daily cron job**: Run at 9am - check open tickets, pending payments → send summary
- **Weekly report**: Every Monday → send weekly revenue/pipeline summary

### Example: Cron Integration
```bash
# /etc/cron.d/sms-daily-summary
0 9 * * * root /root/scripts/sms-daily-summary.py >> /var/log/sms-notifications.log
```

```python
# sms-daily-summary.py
#!/usr/bin/env python3
import subprocess
import json

# Check pending payments (example - customize to your system)
result = subprocess.run(
    ['bash', '-c', 'curl -s your-api/invoices?status=pending | jq ". | length"'],
    capture_output=True, text=True
)
pending_count = result.stdout.strip()

if int(pending_count) > 0:
    msg = f"📊 Daily Summary\nOpen Tickets: 5\nPending Invoices: {pending_count}"
    subprocess.run(['python3', '/root/scripts/sms.py', msg])
```

---

## 4. Quick Start

1. **Get Twilio**: Free account at twilio.com (gives $15 credit for testing)
2. **Get a number**: Buy an SMS-enabled number ($1-15/month)
3. **Set env vars**:
   ```bash
   export TWILIO_ACCOUNT_SID="ACxxxxxxxx"
   export TWILIO_AUTH_TOKEN="your_token"
   export TWILIO_PHONE_NUMBER="+1234567890"
   export MY_PHONE="+1987654321"
   ```
4. **Test**: `python3 sms.py "Hello from your SMS system!"`

---

## 5. Cost Estimate

| Usage | Monthly Cost |
|-------|-------------|
| ~100 SMS/mo (alerts only) | $1-5 |
| ~500 SMS/mo (with summaries) | $5-15 |
| 1000+ SMS/mo | $15-50 |

*Twilio pricing: ~$0.0075-0.02 per SMS depending on destination*

---

## 6. Alternative Services (if Twilio doesn't fit)

| Service | Pros | Cons |
|---------|------|------|
| **ClickSend** | Good API, email-to-SMS | Less popular |
| **Plivo** | Cheaper than Twilio | Smaller ecosystem |
| **Google Voice** | Free (personal use) | No API, not for biz |
| **Email-to-SMS** | Free via carriers | Unreliable, limited |

---

*Document created: 2026-03-18*
*System: Axiom Automator for Irvin's Tech Business*
