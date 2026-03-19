# Encryption Best Practices Guide

> For Irvin's Tech & Electrical Services — MSP/MSSP Focus

---

## 1. Disk Encryption

### Full Disk Encryption (FDE)

**Windows:**
- **BitLocker** (Pro/Enterprise editions) — TPM + PIN for best security
- ** VeraCrypt** — Free, open-source alternative for non-TPM systems
- Enable TPM protector + auto-unlock on trusted boot

**Linux:**
- **LUKS (Linux Unified Key Setup)** — Standard for Linux FDE
- `cryptsetup luksFormat /dev/sdaX`
- Store keyfile on encrypted USB for headless servers

**macOS:**
- **FileVault** — Enable for all Macs handling client data
- Use FileVault recovery key (store in secure location, not on same machine)

**Best Practices:**
- Always encrypt BEFORE putting sensitive data on any drive
- Never store decryption keys on the same system as encrypted data
- Use TPM + PIN on Windows where possible (prevents offline attacks)
- Ensure backup of recovery keys/seed phrases

---

## 2. File Encryption

### Individual File/Folder Encryption

**Tools:**
- **VeraCrypt** — Create encrypted containers (.vc) for sensitive file folders
- **7-Zip** with AES-256 — Quick encrypt before sending
- **GNU Privacy Guard (GPG)** — Command-line, open-source
- **Cryptomator** — Encrypt files before cloud sync (Dropbox, Google Drive, OneDrive)

**Algorithms:**
- AES-256 (preferred)
- ChaCha20 (modern, fast, good for mobile)

**Process (GPG example):**
```bash
# Encrypt file
gpg --symmetric --cipher-algo AES256 filename

# Encrypt for recipient
gpg --encrypt --recipient client@example.com filename

# Decrypt
gpg --decrypt filename.gpg
```

**Best Practices:**
- Use unique passwords/passphrases per file/folder
- Never send password with the encrypted file (send separately)
- Use encrypted containers for multi-file groups
- Always verify encryption after setup (decrypt test)

---

## 3. Email Encryption

### Why It Matters
Email is inherently insecure — plaintext by default. For client communications involving:
- Contracts, statements, PII
- Credentials, access details
- Financial information

### Options

**S/MIME (Certificate-based)**
- Uses client/server certificates
- Integrated into Outlook, Apple Mail
- Requires PKI infrastructure or certificate authority
- Best for: Internal business communications

**PGP/GPG (Key-based)**
- Open-source, decentralized
- Public/private key pairs
- More flexible, no CA needed
- Best for: Cross-org communications, tech-savvy clients

**Proton Mail / Tutanota**
- End-to-end encrypted by default
- Zero-knowledge architecture
- Best for: New client setups, secure external comms

**Setup GPG for Business:**
1. Generate key pair: `gpg --full-generate-key`
2. Export public key: `gpg --armor --export your@email.com > pubkey.asc`
3. Share public key via website, email signature, or keyserver
4. Import client public keys before sending

**Email Signature (GPG example):**
```
-----BEGIN PGP PUBLIC KEY BLOCK-----
[your public key here]
-----END PGP PUBLIC KEY BLOCK-----
```

**Best Practices:**
- Enable encryption as default for internal comms
- Train staff on identifying unencrypted sensitive data
- Use secure email gateways for mass outbound encryption
- Don't forget attachment encryption (embed in encrypted email)

---

## 4. Backup Encryption

### Critical Rule
**Never backup unencrypted.** Backup media is a high-value target for attackers.

### Cloud Backup Encryption

**Options:**
- **Backblaze, CrashPlan, Carbonite** — Client-side encryption enabled by default
- **AWS S3 + SSE-KMS** — Server-side encryption with customer-managed keys
- **Restic, Borg, Duplicati** — Open-source, client-side encrypted

**Best Practice:** Use **client-side encryption** (you hold the keys, not the cloud provider)

### Local/Offsite Backup Encryption

**LTO Tapes:**
- Hardware encryption built into drive
- Use separate encryption key management

**External Drives:**
- VeraCrypt container or BitLocker To Go
- Store USB key separately from backup media

**NAS:**
- Enable volume encryption (Synology, QNAP)
- Use unique encryption passphrase, store in secure vault

### Backup Encryption Checklist

- [ ] All backups encrypted at rest (AES-256 minimum)
- [ ] Encryption keys stored separately from backups
- [ ] Test restoration of encrypted backups QUARTERLY
- [ ] Offsite backups use separate encryption key
- [ ] Backup retention policy includes key rotation
- [ ] 3-2-1 rule: 3 copies, 2 media types, 1 offsite

---

## Quick Reference: Algorithm Strength

| Algorithm | Key Size | Status | Use Case |
|-----------|----------|--------|----------|
| AES-256 | 256-bit | ✅ Standard | Everything |
| ChaCha20 | 256-bit | ✅ Modern | Mobile, performance |
| RSA | 2048+ bit | ✅ OK | Key exchange, signatures |
| AES-128 | 128-bit | ⚠️ Acceptable | Legacy compatibility only |
| 3DES | 168-bit | ❌ Avoid | Legacy only |
| MD5 | 128-bit | ❌ Avoid | Never |
| SHA-1 | 160-bit | ❌ Avoid | Never |

---

## Key Management Essentials

1. **Never hardcode keys** in code/config files
2. **Use key vaults**: HashiCorp Vault, AWS KMS, Azure Key Vault
3. **Key rotation**: Rotate annually minimum, quarterly for sensitive systems
4. **Key escrow**: Store copy of critical keys in secure offsite location
5. **Access logging**: Log all key access, especially decrypt operations

---

## Summary: Encryption Decision Tree

| Scenario | Recommended |
|----------|-------------|
| Full system disk | BitLocker / FileVault / LUKS |
| Portable USB drive | BitLocker To Go / VeraCrypt |
| Cloud file sync | Cryptomator / Boxcryptor |
| Email (internal) | S/MIME |
| Email (external) | PGP/GPG |
| Cloud backup | Client-side + provider SSE |
| Tape/offsite backup | LUKS / VeraCrypt container |
| Database | TDE (transparent data encryption) |

---

*Last updated: 2026-03-18 | For Irvin's Tech & Electrical Services*
