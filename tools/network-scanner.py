#!/usr/bin/env python3
"""
Network Scanner - Standalone Version (No Flask Required)
Scans subnet and outputs JSON to stdout
Usage: python3 network-scanner.py --subnet 192.168.1.0/24
"""

import os
import sys
import json
import socket
import subprocess
import ipaddress
import argparse
from collections import defaultdict
from datetime import datetime

def ping_host(ip, timeout=1):
    """Ping a single host"""
    try:
        result = subprocess.run(
            ['ping', '-c', '1', '-W', str(timeout), str(ip)],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        return result.returncode == 0
    except:
        return False

def get_mac(ip):
    """Get MAC address from ARP table"""
    try:
        result = subprocess.run(['arp', '-n', str(ip)], capture_output=True, text=True, timeout=5)
        for line in result.stdout.split('\n'):
            if str(ip) in line and 'ether' in line.lower():
                parts = line.split()
                for i, p in enumerate(parts):
                    if p == 'ether' and i + 1 < len(parts):
                        return parts[i + 1]
    except:
        pass
    return None

def get_vendor(mac):
    """Simple vendor lookup based on MAC prefix"""
    if not mac:
        return "Unknown"
    
    # Common OUI prefixes
    vendors = {
        '00:1A:2B': 'Dell',
        '00:1C:42': 'Parallels',
        '00:25:90': 'Dell', 
        '00:1E:68': 'Cisco',
        '00:1F:29': 'Cisco',
        '00:26:B9': 'Dell',
        '00:50:56': 'VMware',
        '08:00:27': 'VirtualBox',
        '0C:8D:98': 'TP-Link',
        '10:FE': 'TP-Link',
        'E4:FA:': 'TP-Link',
        'E4:FA1D': 'TP-Link',
        '2C:F0:5D': 'Intel',
        '3C:31': 'HP',
        '3C:52:82': 'HP',
        '84:D9:E8': 'Netgear',
        '44:D9:E7': 'Netgear',
        'B4:23:A2': 'Apple',
        '00:C0:CA': 'Raspberry Pi',
        '68:1D:EF': 'Brother',
        '20:23:51': 'Dahua',
        '2C:CF:67': 'Hikvision',
        '00:1A:2B': 'Hikvision',
        'D8:3A:DD': 'Xerox',
        '44:BB:3B': 'Canon',
    }
    
    mac_prefix = mac.replace(':', '').upper()[:6]
    for prefix, vendor in vendors.items():
        if prefix.replace(':', '').upper() in mac_prefix:
            return vendor
    return "Unknown"

def get_hostname(ip):
    """Try to resolve hostname"""
    try:
        hostname, _, _ = socket.gethostbyaddr(str(ip))
        return hostname
    except:
        return None

def detect_device_type(ip, ports, vendor, hostname):
    """Guess device type based on ports, vendor, hostname"""
    ip_str = str(ip).lower()
    hostname = (hostname or '').lower()
    
    # Check hostname for hints
    if any(x in hostname for x in ['router', 'gateway', 'modem']):
        return 'router'
    if any(x in hostname for x in ['server', 'srv', 'nas']):
        return 'server'
    if any(x in hostname for x in ['camera', 'cam', 'nvr', 'dvr']):
        return 'camera'
    if any(x in hostname for x in ['print', 'printer']):
        return 'printer'
    if any(x in hostname for x in ['ap', 'wifi', 'access']):
        return 'accesspoint'
    
    # Check vendor
    if 'cisco' in vendor.lower() or 'netgear' in vendor.lower():
        return 'router'
    if 'dell' in vendor.lower() or 'hp' in vendor.lower() or 'lenovo' in vendor.lower():
        return 'workstation'
    if 'hikvision' in vendor.lower() or 'dahua' in vendor.lower():
        return 'camera'
    if 'raspberry' in vendor.lower():
        return 'iot'
    
    # Check ports
    if 80 in ports or 443 in ports or 8080 in ports:
        if len(ports) > 3:
            return 'server'
    
    return 'workstation'

def quick_port_scan(ip, ports=[22, 80, 445, 3389, 8000, 554]):
    """Quick port scan"""
    open_ports = []
    for port in ports:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(0.5)
            result = sock.connect_ex((str(ip), port))
            if result == 0:
                open_ports.append(port)
            sock.close()
        except:
            pass
    return open_ports

def scan_subnet(subnet_str):
    """Main scan function"""
    print(f"[*] Scanning subnet: {subnet_str}")
    
    try:
        network = ipaddress.ip_network(subnet_str, strict=False)
    except ValueError as e:
        print(f"[-] Error: {e}")
        sys.exit(1)
    
    hosts = []
    total = sum(1 for _ in network.hosts())
    current = 0
    
    print(f"[*] Total hosts to scan: {total}")
    
    for ip in network.hosts():
        current += 1
        if current % 16 == 0:
            print(f"[*] Progress: {current}/{total}")
        
        # Quick ping
        if ping_host(ip, timeout=1):
            mac = get_mac(ip)
            vendor = get_vendor(mac)
            hostname = get_hostname(ip)
            ports = quick_port_scan(ip)
            device_type = detect_device_type(ip, ports, vendor, hostname)
            
            host = {
                'ip': str(ip),
                'mac': mac or '00:00:00:00:00:00',
                'vendor': vendor,
                'hostname': hostname or '',
                'type': device_type,
                'ports': ports
            }
            hosts.append(host)
            print(f"[+] Found: {ip} ({vendor}) - {device_type}")
    
    return {
        'subnet': subnet_str,
        'hosts': hosts,
        'total_found': len(hosts),
        'scan_time': datetime.now().isoformat()
    }

def main():
    parser = argparse.ArgumentParser(description='Network Scanner')
    parser.add_argument('--subnet', required=True, help='Subnet to scan (e.g., 192.168.1.0/24)')
    parser.add_argument('--json', action='store_true', help='Output JSON')
    
    args = parser.parse_args()
    
    result = scan_subnet(args.subnet)
    
    if args.json:
        print(json.dumps(result, indent=2))
    else:
        print("\n=== Scan Results ===")
        print(f"Subnet: {result['subnet']}")
        print(f"Hosts found: {result['total_found']}")
        print("\nHosts:")
        for h in result['hosts']:
            print(f"  {h['ip']:20} {h['vendor']:15} {h['type']:15} {','.join(map(str,h['ports'])) if h['ports'] else 'no ports'}")

if __name__ == '__main__':
    main()
