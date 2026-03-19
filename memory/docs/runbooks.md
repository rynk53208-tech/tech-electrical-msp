# Client Runbooks

Quick fixes for common issues. Try these steps before contacting support.

---

## 1. Password Reset

### For Microsoft 365 / Google Workspace Accounts

**Step 1:** Go to your login page (portal.office.com or mail.google.com)

**Step 2:** Click "Forgot password" or "Can't access your account"

**Step 3:** Enter your work email address

**Step 4:** Choose verification method:
- **Text message** (if cell number is on file)
- **Email** (to your alternate address)
- **Authenticator app** (Microsoft Authenticator or Google Authenticator)

**Step 5:** Enter the code, create a new password

> **Tip:** New password must be at least 12 characters with uppercase, lowercase, number, and symbol.

### If You Can't Reset Online

Contact support with:
- Your name and email address
- Employee ID (if applicable)
- Manager confirmation (for privileged accounts)

---

## 2. Printer Troubleshooting

### Issue: Printer Not Responding

**Step 1: Check physical connections**
- Ensure power cable is plugged in
- Check USB or network cable connections
- Confirm paper tray has paper

**Step 2: Check printer status**
- Look for error lights on the printer
- Check display panel for error messages
- Clear any paper jams

**Step 3: Restart the printer**
1. Turn off printer
2. Wait 30 seconds
3. Turn back on
4. Wait for it to fully initialize (2-3 minutes)

**Step 4: Restart your computer**
- Close all applications
- Restart PC/Mac
- Try printing again

### Issue: Print Jobs Stuck in Queue

**Step 1:** Open Print Queue
- Windows: Settings → Bluetooth & devices → Printers → Open print queue
- Mac: System Settings → Printers & Scanners → Open Print Queue

**Step 2:** Cancel all documents
- Right-click each job → Cancel

**Step 3:** Clear print spooler (Windows only)
```
1. Press Win + R
2. Type: services.msc
3. Find "Print Spooler"
4. Right-click → Stop
5. Go to C:\Windows\System32\spool\PRINTERS
6. Delete all files in that folder
7. Return to Services → Print Spooler → Start
```

**Step 4:** Restart printer and try again

### Issue: Poor Print Quality

- Check ink/toner levels
- Run printer head cleaning utility
- Replace consumables if low

---

## 3. VPN Setup / Access

### For Windows

**Step 1:** Open Settings → Network & Internet → VPN

**Step 2:** Click "Add a VPN connection"

**Step 3:** Enter details:
- **VPN provider:** Windows (built-in)
- **Connection name:** Company VPN
- **Server address:** vpn.yourcompany.com (provided by IT)
- **VPN type:** IKEv2 or Automatic
- **User name:** Your work email
- **Password:** Your work password
- **Remember sign-in info:** Checked

**Step 4:** Click Save → Connect

### For macOS

**Step 1:** Open System Settings → Network

**Step 2:** Click "+" to add new interface

**Step 3:** Select "VPN", VPN Type: "IKEv2"

**Step 4:** Enter:
- **Description:** Company VPN
- **Server:** vpn.yourcompany.com
- **Remote ID:** vpn.yourcompany.com
- **Username:** Your work email

**Step 5:** Click "Authentication Settings" → Enter password

**Step 6:** Click OK → Apply → Connect

### For iOS / Android

**Step 1:** Install "Cisco Secure Client" from App Store/Play Store

**Step 2:** Open app → Enter server: vpn.yourcompany.com

**Step 3:** Authenticate with work credentials

**Step 4:** Accept certificate if prompted

### VPN Not Connecting?

1. **Check internet** — VPN requires active internet
2. **Try different network** — Some networks block VPN ports
3. **Restart device** — Clear network stack
4. **Check credentials** — Ensure password is current
5. **Contact support** — If issues persist

---

## 4. Email Issues

### Issue: Can't Send Emails

**Step 1: Check your internet connection**
- Visit a website to confirm connectivity

**Step 2: Verify credentials**
- Log out and back into Outlook/Webmail
- Check for "Password Expired" notifications

**Step 3: Check sent items**
- Email may have already sent but shown error
- Look for duplicate in Sent folder

**Step 4: Clear Outlook cache**
```
1. Close Outlook
2. Press Win + R
3. Type: outlook.exe /cleanviews
4. Press Enter
```

**Step 5: Check for large attachments**
- Max attachment size: 25MB
- Use OneDrive/SharePoint link for larger files

### Issue: Can't Receive Emails

**Step 1: Check Junk folder**
- Legitimate emails sometimes land in Junk

**Step 2: Check blocked senders**
- Settings → Mail → Blocked senders

**Step 3: Check inbox rules**
- Rules may be moving emails automatically

**Step 4: Verify storage quota**
- Office 365: Check mailbox size in Outlook
- Delete old emails if near limit

### Issue: Outlook Not Syncing

**Step 1:** Check account status
- Outlook → File → Account Settings

**Step 2:** Repair Outlook
- Control Panel → Programs → Microsoft Office → Change → Repair

**Step 3:** Recreate profile
- Control Panel → Mail → Show Profiles → Add new

### Issue: "Working Offline" in Outlook

- Click "Send/Receive" tab
- Click "Work Offline" to toggle back to online

---

## 5. Backup Restore

### Requesting a Restore

**Option A: Via Support Portal**
1. Go to support.yourcompany.com
2. Submit "Data Restore Request"
3. Specify: file/folder name, date needed, destination

**Option B: Via Email**
- Email: support@yourcompany.com
- Subject: "Backup Restore - [Your Name]"
- Body: File path, date, where to restore

**Option C: Phone**
- Call (951) XXX-XXXX
- Have file location ready

### Self-Service Restore (If Enabled)

**OneDrive Restore:**

1. Go to onedrive.com → Sign in
2. Navigate to file/folder
3. Right-click → Version history
4. Select version → Restore

**SharePoint/Shared Drive Restore:**

1. Go to sharepoint.com
2. Navigate to document library
3. Select file → Version history
4. Restore previous version

### Typical Restore Times

| Data Type | Estimated Time |
|-----------|----------------|
| Individual file | 15-30 minutes |
| Folder (< 10GB) | 1-2 hours |
| Large folder (> 10GB) | 4-8 hours |
| Full system restore | Scheduled with IT |

> **Note:** Critical business data takes priority. Let us know if it's urgent.

---

## Still Need Help?

**Email:** support@yourcompany.com  
**Phone:** (951) XXX-XXXX  
**Portal:** support.yourcompany.com

Include: Your name, what you tried, error messages if any.
