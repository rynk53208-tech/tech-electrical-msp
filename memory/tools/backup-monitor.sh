#!/bin/bash
#
# Backup Monitor Script
# Checks if daily backup ran and size is valid
# Run via cron: 0 8 * * * /root/.openclaw/workspace/memory/tools/backup-monitor.sh
#

# === CONFIGURATION ===
BACKUP_DIR="/var/backups"           # Where backups are stored
BACKUP_PATTERN="*.tar.gz"           # Backup file pattern (adjust as needed)
DAYS_OLD=1                          # Backup must be from last 24h
MIN_SIZE_KB=100                     # Minimum valid backup size in KB
ALERT_EMAIL="irvin@example.com"     # Email for alerts
LOG_FILE="/var/log/backup-monitor.log"

# === LOGGING ===
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# === CHECKS ===
check_backup() {
    local status=0
    
    # 1. Find most recent backup
    local latest_backup
    latest_backup=$(find "$BACKUP_DIR" -maxdepth 1 -name "$BACKUP_PATTERN" -type f -mtime -$DAYS_OLD 2>/dev/null | sort -r | head -n1)
    
    if [ -z "$latest_backup" ]; then
        log "❌ FAIL: No backup found in $BACKUP_DIR matching $BACKUP_PATTERN (last $DAYS_OLD day(s))"
        send_alert "Backup Missing" "No backup file found in $BACKUP_DIR matching $BACKUP_PATTERN"
        return 1
    fi
    
    log "Found backup: $latest_backup"
    
    # 2. Check backup size
    local size_kb
    size_kb=$(du -k "$latest_backup" 2>/dev/null | cut -f1)
    
    if [ "$size_kb" -lt "$MIN_SIZE_KB" ]; then
        log "❌ FAIL: Backup size too small (${size_kb}KB < ${MIN_SIZE_KB}KB)"
        send_alert "Backup Size Warning" "Backup file is ${size_kb}KB (expected > ${MIN_SIZE_KB}KB): $latest_backup"
        return 1
    fi
    
    log "✓ Backup OK: ${size_kb}KB"
    return 0
}

# === ALERTING ===
send_alert() {
    local subject="$1"
    local message="$2"
    
    log "Sending alert: $subject"
    
    # Try multiple notification methods
    
    # Method 1: mail (if available)
    if command -v mail &>/dev/null; then
        echo "$message" | mail -s "[BACKUP ALERT] $subject" "$ALERT_EMAIL"
    # Method 2: sendmail
    elif command -v sendmail &>/dev/null; then
        echo "Subject: [BACKUP ALERT] $subject
$message" | sendmail "$ALERT_EMAIL"
    # Method 3: webhook (if configured)
    elif [ -n "$WEBHOOK_URL" ]; then
        curl -s -X POST "$WEBHOOK_URL" \
            -H "Content-Type: application/json" \
            -d "{\"text\": \"[BACKUP ALERT] $subject: $message\"}" 2>/dev/null
    # Method 4: log only (fallback)
    else
        log "WARNING: No alert method available. Install mail or set WEBHOOK_URL"
    fi
}

# === MAIN ===
main() {
    log "=== Backup Check Started ==="
    
    if check_backup; then
        log "=== Backup Check: PASSED ==="
        exit 0
    else
        log "=== Backup Check: FAILED ==="
        exit 1
    fi
}

main "$@"
