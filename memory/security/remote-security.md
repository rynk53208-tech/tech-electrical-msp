# Remote Security Best Practices

> For Irvin's Tech & Electrical Services Business  
> Last Updated: 2026-03-18

This document outlines security best practices for remote access to your business systems, clients, and infrastructure.

---

## 1. VPN Setup and Usage

### When to Use VPN
- Any time accessing client networks or sensitive systems
- On public/untrusted Wi-Fi (coffee shops, hotels, airports)
- Connecting to your own infrastructure from remote locations

### Recommended VPN Solutions

| Use Case | Recommended Solution |
|----------|----------------------|
| Business-wide | Tailscale (self-hosted control server) or WireGuard |
| Client access | Cloudflare Zero Trust or Twingate |
| Quick/solo | Mullvad, ProtonVPN (paid, no-log) |

### Configuration Checklist

- [ ] **Always-on VPN** — Enable auto-connect on trusted networks
- [ ] **Kill switch** — Block all traffic if VPN drops unexpectedly
- [ ] **Split tunneling disabled** — Route all traffic through VPN for sensitive work
- [ ] **Strong encryption** — WireGuard (ChaCha20) or OpenVPN (AES-256)
- [ ] **Regular key rotation** — Rotate VPN keys every 90 days
- [ ] **Unique credentials** — Don't reuse passwords from other services

### For Client Work
- Get written authorization before connecting to client VPNs
- Log all client VPN sessions (start time, end time, IP assigned)
- Never store client VPN credentials in browsers — use a password manager
- Disconnect immediately when work is complete

---

## 2. MFA Requirements

### Mandatory MFA for All Access Points

Multi-factor authentication is **non-negotiable** for:
- Email (Google Workspace, Microsoft 365)
- Cloud consoles (AWS, Azure, GCP)
- Remote desktop access
- Password managers
- VPN authentication
- GitHub / code repositories
- Any admin portals

### MFA Methods Ranked (Best to Worst)

1. **Hardware keys** (YubiKey, Google Titan) — Best. Resistant to phishing, no SIM-swapping risk
2. **Authenticator apps** (Bitwarden Authenticator, Authy, Aegis) — Good. Time-based codes (TOTP)
3. **Push notifications** (Duo, Microsoft Authenticator) — Acceptable. Easier UX, but phone compromise is a risk
4. **SMS/Text** — **Avoid**. SIM-swapping attacks are real

### MFA Policy Requirements

- [ ] MFA required for **all** user accounts (no exceptions)
- [ ] MFA required for **every** login (not just new devices)
- [ ] Backup codes stored securely (encrypted USB, not cloud)
- [ ] Recovery options secured with MFA
- [ ] Monthly MFA compliance audit

### Implementation Tips
- Use Bitwarden or 1Password for MFA code storage (encrypted, synced)
- Register multiple authentication methods (primary + backup)
- Test MFA recovery flow annually

---

## 3. Secure Remote Desktop

### RDP/Remote Access Security

**Never expose RDP directly to the internet.** This is one of the most common attack vectors.

#### Recommended Setup

```
[Remote User] → [VPN] → [Jump Host/Bastion] → [Target Machine]
```

Or:

```
[Remote User] → [Cloudflare Zero Trust] → [Target Machine]
```

### Hardening Checklist

- [ ] **Network Level Authentication (NLA)** — Require authentication before session starts
- [ ] **Strong account lockout policy** — Lock after 5 failed attempts for 15 minutes
- [ ] **Restricted admin groups** — Only specific users can RDP
- [ ] **Change default port** — Move from 3389 to random high port (e.g., 33890)
- [ ] **Use TLS encryption** — Not NTLM/RDP encryption
- [ ] **Log all connections** — Enable RDP logging in Windows Event Viewer

### Alternative Remote Desktop Solutions

| Solution | Best For | Security Notes |
|----------|----------|----------------|
| **Tailscale SSH/TCP** | Linux/Windows | End-to-end encrypted, no open ports |
| **Cloudflare Access** | Web apps + RDP | Zero-trust, browser-based |
| **AnyDesk** | Client support | Encrypted, permission-based |
| **Parsec** | Low-latency work | Encrypted, designed for gaming/graphics |
| **RustDesk** | Self-hosted | Full control, self-hosted server option |

### For Client Support Sessions
- Use dedicated support accounts with limited permissions
- Require client to approve/accept support session
- Never save client credentials in remote software
- Session recording enabled where legal/required

---

## 4. Zero Trust Principles

Zero Trust = "Never trust, always verify." Every request is treated as potentially hostile, regardless of location.

### Core Pillars

1. **Verify explicitly** — Authenticate and authorize every request
2. **Least privilege access** — Give minimum permissions needed, just in time
3. **Assume breach** — Design assuming attackers are already inside

### Implementation Checklist

#### Identity & Access
- [ ] All users have unique accounts (no shared credentials)
- [ ] Role-based access control (RBAC) defined for every system
- [ ] Just-in-time (JIT) admin access for elevated tasks
- [ ] Privileged Access Workstations (PAW) for admin tasks

#### Network
- [ ] Network segmentation — Separate IT systems from client work
- [ ] Micro-segmentation — Critical assets isolated
- [ ] All traffic encrypted (TLS 1.3 minimum)
- [ ] DNS filtering (NextDNS, Quad9, or Cloudflare)

#### Devices
- [ ] Endpoint detection and response (EDR) on all work devices
- [ ] Disk encryption (BitLocker, FileVault, LUKS)
- [ ] Automatic security updates within 72 hours of release
- [ ] Mobile Device Management (MDM) for remote wipe capability

#### Monitoring
- [ ] Centralized logging (all auth events, network traffic)
- [ ] Automated alerting on anomalous behavior
- [ ] Regular access reviews (quarterly)
- [ ] Incident response plan documented and tested

### Zero Trust Architecture (Simple)

```
┌─────────────────────────────────────────────────────┐
│                    INTERNET                         │
└─────────────────┬───────────────────────────────────┘
                  │
         ┌────────▼────────┐
         │ Cloudflare/Edge │ ← WAF, DDoS protection
         └────────┬────────┘
                  │
    ┌─────────────┴─────────────┐
    │                           │
┌───▼────┐              ┌───────▼────┐
│ VPN/   │              │  Identity  │
│ ZTNA   │              │  Provider  │
└───┬────┘              └───────┬────┘
    │                            │
    │         ┌─────────────────┼─────────────────┐
    │         │                 │                 │
┌───▼───┐ ┌───▼───┐        ┌────▼────┐      ┌────▼────┐
│ Work  │ │ Dev   │        │ Client  │      │ Internal│
│ Load  │ │ Env   │        │ Systems │      │ Systems │
└───────┘ └───────┘        └─────────┘      └─────────┘
```

### Quick Wins (Start Here)

1. Enable MFA everywhere (takes 1 hour)
2. Set up a jump host/bastion for RDP (takes 1 afternoon)
3. Switch to Tailscale for mesh VPN (takes 1 hour)
4. Turn on logging in AWS/Azure/GCP (takes 30 minutes)
5. Document your access roles (takes 1 day)

---

## Summary

| Area | Key Action |
|------|------------|
| **VPN** | Use WireGuard/Tailscale, always-on, kill switch enabled |
| **MFA** | Hardware keys > Authenticator app > Push > SMS |
| **Remote Desktop** | Never expose RDP directly; use jump hosts or Zero Trust |
| **Zero Trust** | Verify explicitly, least privilege, assume breach |

---

*Document created for Irvin's tech business. Review and update quarterly.*
