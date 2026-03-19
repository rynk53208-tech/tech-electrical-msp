# Service Pricing Calculator — Tech & Electrical Services

**Purpose:** Quick quote generation for common IT and electrical services.

---

## IT Services Pricing

| Service | Base Price | Per Device | Notes |
|---|---|---|---|
| **Managed IT (Monthly)** | | | |
| - Up to 10 users | $500/mo | +$25/user | |
| - 11-25 users | $750/mo | +$20/user | |
| - 26-50 users | $1,200/mo | +$15/user | |
| **Break-fix (On-demand)** | $100/hr | 1hr min | Remote: $80/hr |
| **Network Installation** | | | |
| - Small office (5-10 users) | $2,500 | — | Basic setup |
| - Medium (10-25 users) | $5,000 | — | + managed switch |
| **Cybersecurity Assessment** | $1,500 | — | Basic vulnerability scan |
| **Full Security Audit** | $5,000 | — | Comprehensive |
| **Server Setup** | $1,500 | — | Per server |
| **Cloud Migration** | $3,000 | — | Per 10 users |
| **VoIP Setup** | $500 | +$50/phone | Includes config |

---

## Electrical Services Pricing

| Service | Base Price | Notes |
|---|---|---|
| **Outlet/Switch Install** | $75 | Per unit |
| **Circuit Breaker** | $150 | Per breaker |
| **Panel Upgrade** | $1,500 | 200A residential |
| **EV Charger Install** | $750 | Includes permit |
| **Outdoor/Landscape Lighting** | $500 | Per zone |
| **Commercial Wiring** | $75/hr | Licensed electrician |

---

## Markup Rules
- **Parts:** 30% markup on cost
- **Labor:** Already built into pricing above
- **Emergency:** 1.5x multiplier (after-hours, same-day)
- **Travel:** Free within 20 miles, $0.50/mile after

---

## Calculator Logic (Future)

```
function calculateQuote(service, devices, hours) {
  base = getBasePrice(service)
  deviceCost = getDeviceRate(service) * devices
  laborCost = getLaborRate(service) * hours
  total = base + deviceCost + laborCost
  
  if (emergency) total *= 1.5
  if (contractClient) total *= 0.9 // 10% discount
  
  return total
}
```

---

## Quick Reference Card
Print this for truck/computer:
- Remote support: $80/hr
- On-site: $100/hr
- Emergency: $150/hr
- Network install (small): $2,500
- Managed IT: $500-1,200/mo
- Security assessment: $1,500
