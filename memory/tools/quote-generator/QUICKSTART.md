# Quote Generator — Quick Start (5 Minutes)

**For Irvin & Team**

---

## Open It

1. **Find the file:** `memory/tools/quote-generator/quote-generator.html`
2. **Open in browser:** Double-click or right-click → Open with Chrome/Firefox
3. **No login needed** — everything is local to your browser

---

## First Quote in 3 Minutes

### Step 1: Fill in Customer (30 seconds)
📝 **New Quote** tab
- **Client Name:** (required) `John Smith` or `Barney's Tire Shop`
- **Company, Email, Phone, Address:** (optional, but nice to have)
- **Project Scope:** What are they getting repaired/installed?

### Step 2: Add Services (1 minute)
🛠️ **Service Catalog** — pick from 50+ pre-built services
- **💻 IT Support:** Diagnostics ($49), Virus removal ($99), Data recovery ($199+), labor ($85/hr)
- **🔬 Board Repair:** Micro-soldering ($125/hr), MacBook repair ($299), iPhone repair ($149)
- **⚡ Electrical:** Labor ($95/hr), panel upgrade, EV charger, inspection, etc.
- **🌐 MSP:** Monthly monitoring/backup/support packages
- **🔒 Cybersecurity:** Assessments, pen tests, vCISO services
- **Dev & Parts:** Custom code, components, materials

**Just click the service card to add it.** Qty jumps to 1. Tweak if needed.

### Step 3: Generate PDF (30 seconds)
💰 **On the right panel:**
- Check totals (auto-calculate with tax/discount)
- Click **📄 Generate PDF Quote**
- Browser downloads `TES-001_ClientName.pdf`

**Done!** Send to client.

---

## Key Features

### Add Custom Items
**Can't find it in the catalog?** Use the ➕ **Add Custom Line Item** section:
- Describe what it is
- Pick unit (flat, hr, each, mo, day, ft)
- Enter your price
- Click ➕ to add
- Adjust qty/rate in the table if needed

### Capture E-Signature
✍️ **Add E-Signature** button:
1. Draw on canvas
2. Click ✅ Accept
3. Signature embeds in PDF
4. Client sees your signature on print

### Save & Edit Later
💾 **Save Quote** button saves it locally:
- Go to **📋 Quote History** to see all saved quotes
- Click ✏️ to reload and edit
- Click 📄 to reprint PDF
- Click ✅/❌ Status dropdowns to track (Draft → Sent → Accepted, etc.)

### Set Reminders
🔔 **Reminders** tab:
1. Click ➕ Add Reminder
2. Pick client name, quote #, date (e.g., 3 days from now)
3. Add message (optional)
4. App alerts you on that date

---

## Settings You Might Want to Change

⚙️ **Settings** tab:

| Setting | Current | When to Change |
|---------|---------|----------------|
| Company name | Tech & Electrical Services LLC | If you rebrand |
| Owner name | Irvin Avitia | If someone else signs |
| Phone/Email | Your contact info | If it changes |
| Micro-solder rate | $125/hr | If you want to charge more for board-level work |
| Tax rate | 8.25% | If you move states (e.g., Nevada = 0%) |
| Quote prefix | TES | If you prefer "TE" or custom code |

---

## Real Example: Barney's Tire Shop Laptop Repair

1. **Customer:** Barney's Tire Shop, John (manager)
2. **Issue:** MacBook won't turn on, liquid damage suspected
3. **Quote items:**
   - Diagnostic / Assessment: $49 (flat)
   - MacBook Liquid Damage Repair: $299 (flat) — *includes board clean, reball, testing*
   - Parts: 1x Thermal Paste ($8)
   - Micro-Solder Labor: 2 hrs × $125 = $250 *(if diagnosis confirms rework needed)*
4. **Subtotal:** ~$606
5. **Tax (8.25%):** ~$50
6. **Total:** ~$656
7. **PDF** has company branding, Irvin's sig, terms at bottom
8. **John approves** → You have a signed quote record → Mark status "Accepted" in history

---

## Pro Tips

✨ **Use these to close more deals faster:**

1. **Quote within 24 hours** — responsiveness wins business
2. **Always include diagnostics** — justifies the quote, shows professionalism
3. **Batch labor** — e.g., "2 hrs micro-soldering" instead of "IC replacement + reballing + testing" as separate lines (less intimidating to clients)
4. **Add margin on parts** — use Parts markup line if you're reselling ($79 SSD might cost you $65, resell $79)
5. **Set realistic labor** — if it takes 3 hours, quote 3 hours (don't lowball)
6. **Export monthly** — backup your quotes to external drive (use 📥 Export JSON button)

---

## FAQ

**Q: Can I use this on my phone?**  
A: Works but screen is small. Better on laptop. Signature pad works on mobile though!

**Q: What if I want to change a price?**  
A: **💰 Pricing DB** tab → Find service → Click ✏️ Edit Price

**Q: Can I share quotes across browsers?**  
A: No, data is per-browser. Use **📥 Export JSON** to backup and restore on another device.

**Q: What if my browser crashes?**  
A: Data persists (localStorage). When you reload, everything is still there.

**Q: Can someone else use this?**  
A: Yes, send them the HTML file. Each browser has its own data, so it's independent per device.

**Q: How do I delete a quote?**  
A: **📋 Quote History** → click 🗑 (red delete button)

**Q: Can I edit a quote after saving?**  
A: Yes! Click ✏️ to reload it in the builder, make changes, save again.

**Q: What if I made a mistake on a sent PDF?**  
A: Edit the quote (✏️), regenerate PDF (📄), send the new version. Old PDF stays in client's email but you have the updated record.

---

## Workflow for Team

**Irvin (Owner/Lead Sales):**
- Creates quotes, gets client approval
- Marks status "Sent" when emailed
- Uses Reminders for follow-ups

**Team Member (Tech/Electrician):**
- Opens tool, adds work they'll be doing
- Gives Irvin the list
- Irvin builds quote, sends

**Optional: Admin/Manager:**
- Reviews **Quote History** daily
- Checks pending value ($$ in "Sent" status)
- Alerts team on overdue quotes
- Exports JSON weekly for backup

---

## Keyboard Shortcuts

- **Tab** — Move between fields
- **Enter** — Add custom line item
- (More in README.md if needed)

---

## Troubleshooting 30-Second Tips

**PDF won't download?**  
→ Check pop-up blocker. Try Chrome.

**My data vanished?**  
→ Browser cache was cleared. Check if you have a JSON export backup.

**Signature not in PDF?**  
→ Make sure you clicked ✅ Accept after drawing. Then regenerate PDF.

**Prices look wrong?**  
→ Check tax rate & discount % in right panel.

---

## Next Steps

1. **Open the app now** — bookmark it (add to home screen on phone too)
2. **Customize Settings** — your company name, rates, taxes
3. **Create a test quote** — practice workflow
4. **Use it for next client** — replace your current manual process
5. **Export JSON** — backup button to save regularly

---

## Support

Need help? Check the full **README.md** in the same folder for detailed docs.

---

**You're ready to quote faster and close more deals. Let's go! ⚡**
