#!/bin/bash
# Backup Verification Script
# Checks last backup time, size, and success/fail status
# Run via cron: 0 */6 * * * /root/.openclaw/workspace/memory/tools/backup-check.sh

# Configuration - customize these paths
BACKUP_PATHS=(
    "/backup"
    "/mnt/backup"
    "/home/backup"
    "/var/backups"
    "/root/backup"
)

# Log file
LOGFILE="/var/log/backup-check.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOGFILE"
}

# Check if backup paths exist and get most recent backup
find_latest_backup() {
    local newest=""
    local newest_time=0
    
    for path in "${BACKUP_PATHS[@]}"; do
        if [ -e "$path" ]; then
            # Get most recent modification time in this path
            local mtime=$(find "$path" -type f -printf '%T@' 2>/dev/null | sort -rn | head -1)
            if [ -n "$mtime" ]; then
                local mtime_sec=$(echo "$mtime" | cut -d. -f1)
                if [ "$mtime_sec" -gt "$newest_time" ]; then
                    newest_time=$mtime_sec
                    newest=$path
                fi
            fi
        fi
    done
    
    echo "$newest"
}

# Main check
log "=== Backup Check Started ==="

latest_backup=$(find_latest_backup)

if [ -z "$latest_backup" ]; then
    log "⚠️  NO BACKUP FOUND"
    log "   Checked paths: ${BACKUP_PATHS[*]}"
    echo "FAIL: No backup found"
    exit 1
fi

# Get backup details
last_backup_time=$(find "$latest_backup" -type f -printf '%T+\n' 2>/dev/null | sort | tail -1)
backup_size=$(du -sh "$latest_backup" 2>/dev/null | cut -f1)
file_count=$(find "$latest_backup" -type f 2>/dev/null | wc -l)

# Check age
backup_epoch=$(stat -c %Y "$latest_backup" 2>/dev/null)
now_epoch=$(date +%s)
age_hours=$(( (now_epoch - backup_epoch) / 3600 ))

# Determine status
if [ $age_hours -lt 24 ]; then
    status="✅ GOOD"
    status_code=0
elif [ $age_hours -lt 48 ]; then
    status="⚠️  WARNING - Backup is >24h old"
    status_code=1
else
    status="❌ CRITICAL - Backup is >48h old"
    status_code=2
fi

log "Backup Location: $latest_backup"
log "Last Backup:    $last_backup_time"
log "Age:            ${age_hours}h"
log "Size:           $backup_size"
log "Files:          $file_count"
log "Status:         $status"
log "=== Backup Check Complete ==="

# Output for cron/stdout
echo "Status: $status"
echo "Location: $latest_backup"
echo "Last Run: $last_backup_time"
echo "Size: $backup_size"
echo "Age: ${age_hours}h"

exit $status_code
