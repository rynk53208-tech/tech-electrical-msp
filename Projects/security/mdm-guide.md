# Mobile Device Management (MDM) Guide

> For Irvin's Tech & Electrical Services Business

## 1. Recommended MDM Solutions

### Top Choices for SMB/MSP

| Solution | Best For | Pricing (approx) | Notes |
|----------|----------|------------------|-------|
| **Microsoft Intune** | Microsoft shops, enterprises | $10/user/mo | Full endpoint management, integrate with M365 |
| **Jamf Pro** | Apple-only environments | $5-10/device/mo | Best for Mac/iOS management, zero-touch |
| **Hexnode UEM** | MSPs, multi-OS | $5-9/device/mo | Strong MSP focus, affordable |
| **Microsoft Intune + Azure AD** | Hybrid with Windows devices | $10/user/mo | Conditional access, compliance policies |
| **Kandji** | Apple-focused SMBs | $8/device/mo | Modern UI, strong automation |

### Recommended Stack for Irvin's Business

**Primary: Microsoft Intune**
- Integrates with existing Microsoft 365
- Conditional access + compliance
- Full endpoint manager (mobile + Windows)
- Supports iOS, Android, macOS, Windows

**Alternative: Hexnode UEM**
- Better for multi-tenant MSP deployments
- More affordable for smaller fleets
- Cross-platform (iOS, Android, Windows, macOS, Linux)

---

## 2. Device Enrollment Process

### For iOS Devices (Intune)

**Method A: Apple Business Manager (ABM) - Recommended**
1. Set up Apple Business Manager (business.apple.com)
2. Link Intune to ABM via Apple Device Enrollment Program
3. Devices purchased through Apple automatically enroll
4. No user interaction needed - zero-touch deployment

**Method B: User-Driven Enrollment**
1. User installs Company Portal app (App Store)
2. Signs in with work account (Azure AD)
3. Follows prompts to enroll device
4. MDM profile installs automatically

**Method C: DEM (Device Enrollment Manager)**
- Single account enrolls multiple devices
- Good for IT-owned corporate devices
- Bypass per-user Apple ID requirement

### For Android Devices (Intune)

**Method A: Android Enterprise (Recommended)**
1. Set up Android Enterprise in Intune console
2. Create enrollment token
3. Devices factory reset → sign in with work profile
4. Fully managed or work profile mode

**Method B: Samsung Knox**
- For Samsung devices
- Enhanced security, lockdown features
- Integrate via Intune

### Enrollment Steps (User Workflow)

```
1. Receive enrollment invitation (email/portal)
2. Download Company Portal (iOS/Android)
3. Sign in with work credentials
4. Accept MDM profile / work profile setup
5. Complete compliance checks
6. Device ready for use
```

---

## 3. Policy Management

### Device Compliance Policies

**iOS Compliance:**
- Require device encryption
- Require passcode (6+ digits, alphanumeric)
- Require iOS latest version (within 30 days)
- Require jailbreak detection
- Require MDM profile installed

**Android Compliance:**
- Require encryption
- Require password (6+ char, alphanumeric)
- Require Google Play Services
- Require safetyLaxy/antivirus (optional)
- Restrict sideloading apps

### Configuration Profiles

**iOS Restrictions:**
- Block Siri (optional)
- Block FaceTime
- Block App Store
- Block AirDrop
- Require supervised mode for corporate devices

**Android Restrictions:**
- Disable camera (per-app)
- Disable screen capture
- Disable USB debugging
- Block unknown sources
- Configure work profile policies

### App Management Policies (MAM)

- **Intune App Protection Policies (MAM)**
  - Protect data at app level (no MDM required)
  - Microsoft Edge, Outlook, Teams, Office apps
  - Wipe corporate data selectively

**Key MAM Settings:**
- Require PIN for app access
- Block copy/paste between apps
- Block "Save As" to personal storage
- Encrypt corporate data
- Require approved apps for data access

---

## 4. Security Settings for Mobile

### Core Security Checklist

- [ ] **Enable device encryption** (mandatory)
- [ ] **Require strong passcode** (6+ digit or alphanumeric)
- [ ] **Enable biometric authentication** (Face ID/Touch ID/Fingerprint)
- [ ] **Set auto-lock timeout** (5 minutes or less)
- [ ] **Disable Bluetooth/Wi-Fi auto-connect** (prevent honeypot attacks)
- [ ] **Enable Find My Device** (locate/wipe lost devices)
- [ ] **Keep OS/apps updated** (auto-update within 30 days)
- [ ] **Use VPN** for corporate network access
- [ ] **Install MDM profile** (enables remote management)

### Network Security

**Wi-Fi:**
- Block automatic Wi-Fi connections
- Deploy corporate Wi-Fi profiles via MDM
- Block personal cloud storage sync over cellular

**VPN:**
- Require VPN for corporate resources
- Use Intune VPN profiles (IKEv2, WireGuard, per-app VPN)

### Data Protection

| Setting | iOS | Android |
|---------|-----|---------|
| Encryption | FileVault + Data Protection class | Full-disk encryption |
| Remote Wipe | MDM "Wipe" command | Factory reset (AFW) |
| Selective Wipe | Remove corporate data only | Work profile removal |
| Backup | iCloud (exclude corporate) | Google (exclude work) |

### Conditional Access (Azure AD + Intune)

Require compliant device for:
- Email access (Outlook)
- SharePoint/OneDrive
- Teams access
- VPN connectivity
- Custom apps

**Compliance Gate:**
- Device must be marked "Compliant"
- Non-compliant → blocked or restricted access
- User remediation via Company Portal

---

## Quick Start Checklist

### Phase 1: Setup (Week 1)
- [ ] Sign up for Microsoft Intune (or Hexnode)
- [ ] Configure Azure AD conditional access
- [ ] Set up Apple Business Manager (if iOS)
- [ ] Configure Android Enterprise (if Android)

### Phase 2: Enrollment (Week 2)
- [ ] Create enrollment groups
- [ ] Publish Company Portal
- [ ] Test enrollment with 2-3 devices
- [ ] Document user enrollment steps

### Phase 3: Policies (Week 3)
- [ ] Deploy compliance policies
- [ ] Deploy configuration profiles
- [ ] Set up app protection policies
- [ ] Test conditional access rules

### Phase 4: Ongoing
- [ ] Monitor compliance dashboard
- [ ] Review monthly device status
- [ ] Update policies for new threats
- [ ] Automate remediation (self-healing)

---

## Resources

- Microsoft Intune: https://endpoint.microsoft.com
- Apple Business Manager: https://business.apple.com
- Android Enterprise: https://android.com/enterprise
- Hexnode UEM: https://www.hexnode.com

---

*Document Version: 1.0 | Created for Irvin's Tech Services*
