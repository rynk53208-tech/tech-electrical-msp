# Helpdesk Chat Widget

A lightweight, zero-dependency floating chat widget for client websites. Drop one `<script>` tag onto any site and get a polished support chat interface instantly.

---

## Files

| File | Purpose |
|------|---------|
| `widget.js` | Main widget source (~18KB unminified) |
| `widget.min.js` | Minified build placeholder (run terser to generate) |
| `index.html` | Live demo / preview page |
| `embed-snippet.html` | Copy-paste snippet for client sites |
| `README.md` | This file |

---

## Quick Start

### 1. Host the widget file
Upload `widget.js` to your CDN or server:
```
https://cdn.yourdomain.com/helpdesk/widget.js
```

### 2. Add to client site
Paste before `</body>`:
```html
<script>
  window.HelpdeskConfig = {
    businessName: "Acme Corp",
    greeting: "Hi! How can we help?",
    accentColor: "#2563eb",
    emailFallback: "support@acmecorp.com",
  };
</script>
<script src="https://cdn.yourdomain.com/helpdesk/widget.js" defer></script>
```

### 3. Done
A floating chat button appears in the bottom-right corner.

---

## Full Configuration

```js
window.HelpdeskConfig = {
  // Required
  businessName: "Your Business",
  greeting: "Hi! How can we help you today?",

  // Appearance
  accentColor: "#2563eb",           // hex color
  position: "bottom-right",         // "bottom-right" | "bottom-left"
  avatarUrl: "",                     // optional avatar/logo image URL

  // Backend
  webhookUrl: null,                  // POST endpoint (see Webhook section)

  // Offline / Fallback
  emailFallback: "support@you.com",
  offlineMessage: "We're away. We'll reply soon.",
  onlineHours: {
    start: 8,                        // hour (0-23)
    end: 18,
    timezone: "America/Los_Angeles"
  },

  // Behavior
  collectEmail: false,               // ask for email before chatting
  autoOpenDelay: 0,                  // ms to auto-open (0 = disabled)
  showBranding: true,
  brandingText: "Helpdesk Widget",
  brandingUrl: "#",
  inputPlaceholder: "Type a message...",
  sendLabel: "Send",
};
```

---

## Webhook Integration

When `webhookUrl` is set, every user message is POSTed to your backend.

**Request** (POST application/json):
```json
{
  "message": "I need help with my invoice",
  "sessionId": "session_1710000000000",
  "timestamp": "2026-03-19T16:55:00.000Z"
}
```

**Expected Response**:
```json
{
  "reply": "Sure! Can you share your invoice number?",
  "sessionId": "session_1710000000000"
}
```

If `webhookUrl` is `null`, the widget shows a canned acknowledgment reply — perfect for "leave a message" mode.

---

## JavaScript API

Control the widget from your own code:

```js
HelpdeskWidget.open()                 // Open the chat window
HelpdeskWidget.close()                // Close it
HelpdeskWidget.toggle()               // Toggle open/closed
HelpdeskWidget.sendAgentMessage(text) // Push a message from the agent
                                      // Increments unread badge if closed
HelpdeskWidget.setConfig({ ... })     // Update config at runtime
```

**Listen for ready:**
```js
document.addEventListener("helpdesk:ready", (e) => {
  console.log("Widget ready:", e.detail.widget);
});
```

---

## Features

- ✅ Zero dependencies — vanilla JS, no jQuery/React needed
- ✅ Fully self-contained (CSS injected automatically)
- ✅ Smooth open/close animation
- ✅ Typing indicator (animated dots)
- ✅ Unread message badge
- ✅ Online/offline hours detection
- ✅ Optional email collection before chat starts
- ✅ Mobile responsive (slides up from bottom on small screens)
- ✅ Keyboard accessible (Escape to close, Enter to send)
- ✅ ARIA roles for screen readers
- ✅ Auto-resizing message input
- ✅ Webhook backend support
- ✅ JavaScript API for external control

---

## Deployment Options

### Static CDN
Upload `widget.js` to S3/Cloudflare R2 and serve it. Set a long cache TTL (1 year) and use versioned filenames for updates.

### Self-hosted
Serve directly from Nginx/Apache alongside client sites.

### Per-client config
Create a thin wrapper per client:
```js
// /clients/acmecorp/widget-config.js
window.HelpdeskConfig = { businessName: "Acme Corp", accentColor: "#ff6b00", ... };
```
Then:
```html
<script src="/clients/acmecorp/widget-config.js"></script>
<script src="/helpdesk/widget.js"></script>
```

---

## Backend Ideas

| Stack | Notes |
|-------|-------|
| **n8n** | Webhook trigger → notify Slack/email |
| **Make (Integromat)** | Same pattern, no-code |
| **Node.js/Express** | Full control, session management |
| **Supabase Edge Functions** | Serverless, free tier available |
| **Cloudflare Workers** | Ultra-fast, globally distributed |

For AI-powered replies, route the webhook to OpenAI/Claude and stream back responses.

---

## Revenue Use Case (for Irvin)

Charge clients a monthly fee for the hosted widget as part of MSP services:

- **Tier 1 – Basic:** Widget on site + email notifications ($29/mo)
- **Tier 2 – Pro:** Widget + live agent dashboard + chat history ($79/mo)
- **Tier 3 – AI:** Widget + AI auto-replies + handoff to human ($149/mo)

Deploy once, bill monthly. All three tiers use this same widget — the backend determines the tier.

---

## Minification

```bash
npx terser widget.js -o widget.min.js --compress --mangle
# Result: ~7KB minified, ~3KB gzipped
```

---

## License
MIT — use freely on client sites.
