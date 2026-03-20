# Tool Launcher - Quick Usage Guide

## Opening the Launcher

Open `/root/.openclaw/workspace/tools/launcher.html` in your browser.

## Using Each Tool Type

### 1️⃣ HTML-Based Tools (Interactive Forms)

**Examples:**
- Client Onboarding
- Pricing Calculator
- Monthly Report Generator

**How it works:**
1. Click the tool card → Modal opens
2. Fill in the form fields with your data
3. Click "Run Tool"
4. ✅ The tool opens in a **new browser tab**
5. Use the tool directly in the browser

**Pro Tip:** 
- The new tab should open automatically
- If it doesn't, check your browser's pop-up blocker
- The modal will show instructions if pop-ups are blocked

---

### 2️⃣ Python Scripts

**Examples:**
- Network Mapper (netmapper.py)
- SSL Monitor (monitor_check.py)
- Ticket Tracker (ticket-tracker.py)

**How it works:**
1. Click the tool card → Modal opens
2. Fill in required parameters
3. Click "Run Tool"
4. ✅ See the **exact command to run** in the output area
5. Copy the command and paste into terminal:
   ```bash
   python3 /path/to/script.py --param "value"
   ```

**Example:**
```
Input: domain="example.com", alert_days="30"
↓
Output command:
$ python3 monitor_check.py --domain "example.com" --alert-days "30"
↓
Copy & paste into terminal to execute
```

---

### 3️⃣ Bash Scripts

**Examples:**
- Backup Check (backup-check.sh)
- Quick Fixes (quick-fixes.sh)

**How it works:**
1. Click the tool card → Modal opens
2. Fill in parameters
3. Click "Run Tool"
4. ✅ See the **bash command** with parameters
5. Open terminal and run:
   ```bash
   bash /path/to/script.sh
   ```

**Pro Tip:**
- The guide shows both direct execution and environment variable methods
- Includes troubleshooting if permissions are needed

---

### 4️⃣ Templates (Email, Invoices, Reports)

**Examples:**
- Email Outreach Sequence
- Invoice Template
- Monthly Service Report

**How it works:**
1. Click the tool card → Modal opens
2. Fill in the data you want to populate
3. Click "Run Tool"
4. ✅ See a **preview** of the generated output
5. Navigate to the template file to download/export

**Example:**
```
Input: client="Acme Corp", amount="$1500", due_days="30"
↓
Preview shows:
INVOICE #INV-234567
Date: 3/19/2026
Client: Acme Corp
Amount: $1500.00
Due: 30 days
```

---

## What Happens When You Click "Run"

### Smart Detection
The launcher automatically identifies what type of tool you're running:

```
.html file → Open in new tab
.py file  → Show Python command
.sh file  → Show Bash command
template  → Generate preview
```

### Immediate Feedback
✅ **Loading spinner** while processing
✅ **Success message** when complete
✅ **Toast notifications** for results
✅ **Detailed output** with next steps

---

## Output Area Explained

After clicking "Run", the **Output Area** shows:

### For HTML Tools:
```
✓ Tool Opened
→ New tab location
→ Parameters passed
→ Fallback instructions if blocked
```

### For Python/Bash:
```
→ Exact command to run
→ Parameter formatting
→ Working directory
→ Help documentation
→ Troubleshooting tips
```

### For Templates:
```
→ Generated preview
→ Data mapping
→ File location
→ Export options
```

---

## Troubleshooting

### "Pop-up Blocked" on HTML Tools?
→ Check your browser's pop-up blocker settings
→ Allow pop-ups for this domain
→ Try again

### Command Won't Run?
→ Make sure you have proper permissions
→ Navigate to `/root/.openclaw/workspace` first
→ Check that Python/Bash is installed
→ Try running with: `python3` (not just `python`)

### Parameters Not Showing?
→ All filled form fields appear in the output
→ Check the output area scroll bar
→ Scroll down to see full command

---

## Pro Tips

### 💡 Copy Commands
- Commands are **copy-paste ready**
- No need to modify the syntax
- Just paste directly into terminal

### 💡 Multiple Parameters
- All form fields are automatically included
- No need to manually add flags
- Proper escaping is handled

### 💡 Templates
- Previews show **exactly** what will be generated
- Use for planning before actual generation
- Support multiple export formats

### 💡 Scripts Without Backend
- Don't need a running server
- Each tool is self-contained
- Can run locally or remotely

---

## Tool Categories

Use the **navigation buttons** at the top to filter by category:

- **All Tools** - See everything
- **Network** - Network Mapper, DNS Checker
- **Security** - SSL Monitor, Password Policy
- **Admin** - Tickets, Invoices, Reports, Onboarding

---

## Getting Help

Click the **"?"** button on any tool card to see:
- What the tool does
- When to use it
- Expected outputs

---

## Summary

| Tool Type | Action | Result |
|-----------|--------|--------|
| HTML | Fill form + Run | Opens in new tab |
| Python | Fill form + Run | Shows command |
| Bash | Fill form + Run | Shows command |
| Template | Fill form + Run | Shows preview |

**Key Point:** Clicking "Run" always gives you **immediate, actionable value**! ✨
