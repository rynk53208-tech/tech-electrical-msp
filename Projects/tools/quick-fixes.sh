#!/bin/bash
# Quick Fixes Collection - Linux/Mac Script
# Run with sudo for full functionality

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo "  Quick Fixes - Linux/Mac Collection"
echo "========================================"
echo

# Function to check if running as root
check_root() {
    if [ "$EUID" -ne 0 ]; then
        echo -e "${YELLOW}Warning: Not running as root. Some fixes may fail.${NC}"
        echo "Run with: sudo $0"
        echo
    fi
}

# Menu function
show_menu() {
    echo "Select an option:"
    echo "1. Clear Temp Files"
    echo "2. Flush DNS / Reset Network"
    echo "3. Quick Malware Scan (ClamAV)"
    echo "4. Common System Fixes"
    echo "5. Fix Permissions Issues"
    echo "6. Run All"
    echo "7. Exit"
    echo
}

# Option 1: Clear Temp Files
clear_temp() {
    echo -e "${YELLOW}[1/5] Clearing Temp Files...${NC}"
    echo
    
    # User temp
    rm -rf /tmp/* 2>/dev/null
    rm -rf ~/.cache/* 2>/dev/null
    
    # System temp (root only)
    if [ "$EUID" -eq 0 ]; then
        rm -rf /var/tmp/* 2>/dev/null
        rm -rf /var/cache/apt/archives/*.deb 2>/dev/null
        apt-get clean 2>/dev/null
    fi
    
    # Browser caches
    rm -rf ~/.mozilla/firefox/*/cache* 2>/dev/null
    rm -rf ~/.cache/google-chrome/* 2>/dev/null
    
    echo -e "${GREEN}[OK] Temp files cleared.${NC}"
    echo
}

# Option 2: Reset Network
reset_network() {
    echo -e "${YELLOW}[2/5] Resetting Network...${NC}"
    echo
    
    # Flush DNS
    if command -v resolvectl &> /dev/null; then
        resolvectl flush-caches
        echo "Flushed systemd-resolved DNS cache"
    elif command -v systemd-resolve &> /dev/null; then
        systemd-resolve --flush-caches
    fi
    
    # Flush DNS via nscd if available
    if command -v nscd &> /dev/null; then
        systemctl restart nscd 2>/dev/null || nscd -i hosts
    fi
    
    # Restart networking (systemd)
    if command -v systemctl &> /dev/null; then
        echo "Restarting network manager..."
        systemctl restart NetworkManager 2>/dev/null || \
        systemctl restart networking 2>/dev/null || \
        systemctl restart systemd-networkd 2>/dev/null
    fi
    
    # Release/renew DHCP (root required)
    if [ "$EUID" -eq 0 ]; then
        # Get interface
        iface=$(ip route | awk '/default/ {print $5; exit}')
        if [ -n "$iface" ]; then
            echo "Renewing DHCP on $iface..."
            dhclient -r $iface 2>/dev/null
            dhclient $iface 2>/dev/null
        fi
    fi
    
    # Reset network statistics
    ip -s link flush cache 2>/dev/null
    
    echo -e "${GREEN}[OK] Network reset complete.${NC}"
    echo
}

# Option 3: Quick Malware Scan
malware_scan() {
    echo -e "${YELLOW}[3/5] Running Quick Malware Scan...${NC}"
    echo
    
    if command -v clamscan &> /dev/null; then
        echo "Running ClamAV quick scan..."
        clamscan --recursive --quick --bell /home /tmp 2>/dev/null
        
        # Update signatures if needed
        if [ "$EUID" -eq 0 ]; then
            freshclam 2>/dev/null
        fi
    elif command -v rkhunter &> /dev/null; then
        echo "Running RKHunter check..."
        rkhunter --check --skip-keypress 2>/dev/null
    else
        echo -e "${YELLOW}No malware scanner found. Install clamav or rkhunter:${NC}"
        echo "  sudo apt install clamav rkhunter"
    fi
    
    echo -e "${GREEN}[OK] Scan complete. Review results above.${NC}"
    echo
}

# Option 4: Common System Fixes
system_fixes() {
    echo -e "${YELLOW}[4/5] Applying Common System Fixes...${NC}"
    echo
    
    # Fix broken packages (Debian/Ubuntu)
    if command -v apt-get &> /dev/null; then
        if [ "$EUID" -eq 0 ]; then
            echo "Fixing broken packages..."
            dpkg --configure -a 2>/dev/null
            apt-get install -f -y 2>/dev/null
        fi
    fi
    
    # Fix SSH permissions
    if [ -d "/etc/ssh" ]; then
        echo "Fixing SSH permissions..."
        chmod 644 /etc/ssh/sshd_config 2>/dev/null
        chmod 600 /etc/ssh/ssh_host_*_key 2>/dev/null
    fi
    
    # Fix sudo group
    if [ "$EUID" -eq 0 ]; then
        usermod -aG sudo "$SUDO_USER" 2>/dev/null
    fi
    
    # Clear zombie processes
    pkill -9 -Z 2>/dev/null
    
    # Reset UI session (kill stale processes)
    killall -9 chrome 2>/dev/null
    killall -9 firefox 2>/dev/null
    
    echo -e "${GREEN}[OK] System fixes applied.${NC}"
    echo
}

# Option 5: Fix Permissions
fix_permissions() {
    echo -e "${YELLOW}[5/5] Fixing Permissions...${NC}"
    echo
    
    # Fix home directory permissions
    if [ -n "$HOME" ]; then
        echo "Fixing home directory permissions..."
        chown -R $(whoami):$(whoami) "$HOME"
        chmod 700 "$HOME"
    fi
    
    # Fix common directories
    if [ "$EUID" -eq 0 ]; then
        echo "Fixing system directories..."
        chmod 755 /usr/bin /usr/lib /bin /lib /sbin /etc
        chown root:root /etc/passwd /etc/shadow /etc/group /etc/gshadow
        chmod 644 /etc/passwd /etc/group
        chmod 600 /etc/shadow /etc/gshadow
    fi
    
    echo -e "${GREEN}[OK] Permissions fixed.${NC}"
    echo
}

# Run all
run_all() {
    echo -e "${RED}Running all fixes...${NC}"
    echo
    clear_temp
    reset_network
    malware_scan
    system_fixes
    fix_permissions
    echo "========================================"
    echo -e "${GREEN}  ALL FIXES COMPLETE${NC}"
    echo "========================================"
    echo "Recommendation: Reboot if issues persist."
}

# Main logic
check_root
show_menu
read -p "Enter option (1-7): " choice

case $choice in
    1) clear_temp ;;
    2) reset_network ;;
    3) malware_scan ;;
    4) system_fixes ;;
    5) fix_permissions ;;
    6) run_all ;;
    7) exit ;;
    *) echo "Invalid option" ;;
esac
