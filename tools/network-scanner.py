#!/usr/bin/env python3
"""
Network Scanner Backend - Scans subnets and generates JSON topology data
Designed to work with network-mapper.html frontend
"""

import os
import sys
import json
import socket
import subprocess
import ipaddress
import threading
import time
from collections import defaultdict
from datetime import datetime
from threading import Thread, Lock

try:
    from flask import Flask, request, jsonify
    from flask_cors import CORS
except ImportError:
    print("[!] Flask not installed. Install with: pip3 install flask flask-cors")
    print("[!] Backend requires: pip3 install flask flask-cors")
    sys.exit(1)

app = Flask(__name__)
CORS(app)

# Global state
scan_results = {}
scan_lock = Lock()

class NetworkScanner:
    def __init__(self):
        self.hosts_found = {}
        self.lock = Lock()
        self.max_threads = 20
        
        # MAC OUI database (vendor lookup)
        self.oui_db = {
            '00:11:22': 'Cisco',
            '00:24:9B': 'HP',
            '00:E0:4C': 'Realtek',
            '08:00:27': 'Virtualbox',
            '52:54:00': 'QEMU',
            '00:0A:95': 'Netgear',
            '00:13:10': 'Linksys',
            '00:1A:2B': 'Cisco',
            '00:25:D4': 'Alcatel',
            '00:E0:4C': 'Intel',
            'AA:BB:CC': 'Generic',
        }
        
        # Device fingerprints for role detection
        self.role_patterns = {
            'Gateway/Router': ['Gateway', 'Router', 'Switch'],
            'Windows Server': ['Windows Server', 'Server 2019', 'Server 2016'],
            'Linux Server': ['Linux', 'Ubuntu', 'CentOS', 'Debian'],
            'Windows Workstation': ['Windows 10', 'Windows 11', 'Windows 7'],
            'IP Camera': ['Camera', 'Hikvision', 'Axis', 'RTSP'],
            'Printer': ['Printer', 'HP LaserJet', 'Brother', 'Canon'],
        }
    
    def get_local_interfaces(self):
        """Get local IP and gateway"""
        try:
            result = subprocess.run(['ip', 'route', 'show'], capture_output=True, text=True, timeout=5)
            for line in result.stdout.split('\n'):
                if 'default via' in line:
                    parts = line.split()
                    return {
                        'gateway': parts[2],
                        'interface': parts[4] if len(parts) > 4 else 'eth0'
                    }
        except:
            pass
        
        try:
            result = subprocess.run(['hostname', '-I'], capture_output=True, text=True, timeout=5)
            local_ips = result.stdout.strip().split()
            if local_ips:
                return {
                    'local_ip': local_ips[0],
                    'interface': 'eth0'
                }
        except:
            pass
        
        return {'gateway': '192.168.1.1', 'interface': 'eth0', 'local_ip': '192.168.1.100'}
    
    def get_vendor_from_mac(self, mac):
        """Lookup vendor from MAC address"""
        if not mac:
            return 'Unknown'
        
        mac_prefix = mac[:8].upper()
        for prefix, vendor in self.oui_db.items():
            if mac.upper().startswith(prefix):
                return vendor
        
        # Try to use actual OUI database if available
        try:
            result = subprocess.run(['macchanger', '-l'], capture_output=True, text=True, timeout=5)
            for line in result.stdout.split('\n'):
                if mac_prefix in line:
                    return line.split('\t')[-1].strip()
        except:
            pass
        
        return 'Unknown'
    
    def ping_host(self, ip):
        """Check if host responds to ping"""
        try:
            result = subprocess.run(['ping', '-c', '1', '-W', '1', ip], 
                                  capture_output=True, timeout=2)
            return result.returncode == 0
        except:
            return False
    
    def arp_scan(self, subnet):
        """Use ARP to discover hosts on subnet"""
        hosts = {}
        try:
            # Try using arp-scan if available
            result = subprocess.run(['arp-scan', '--localnet', '-q'], 
                                  capture_output=True, text=True, timeout=10)
            
            for line in result.stdout.split('\n'):
                if '\t' in line and not line.startswith('Interface'):
                    parts = line.split('\t')
                    if len(parts) >= 2:
                        ip = parts[0].strip()
                        mac = parts[1].strip()
                        if ip and mac and ip != 'Interface':
                            hosts[ip] = {
                                'mac': mac,
                                'method': 'arp'
                            }
        except:
            pass
        
        # Fallback: read /proc/net/arp
        try:
            with open('/proc/net/arp', 'r') as f:
                for line in f:
                    if not line.startswith('IP'):
                        parts = line.split()
                        if len(parts) >= 4:
                            ip = parts[0]
                            mac = parts[3]
                            if ip not in hosts and mac != '00:00:00:00:00:00':
                                hosts[ip] = {
                                    'mac': mac,
                                    'method': 'arp-table'
                                }
        except:
            pass
        
        return hosts
    
    def icmp_sweep(self, subnet):
        """ICMP ping sweep of subnet"""
        hosts = {}
        try:
            net = ipaddress.ip_network(subnet, strict=False)
            
            threads = []
            results = {}
            results_lock = Lock()
            
            def ping_worker(ip_addr):
                if self.ping_host(str(ip_addr)):
                    with results_lock:
                        results[str(ip_addr)] = {'method': 'icmp'}
            
            # Create thread pool
            for ip in list(net.hosts())[:200]:  # Limit to 200 hosts
                thread = Thread(target=ping_worker, args=(ip,), daemon=True)
                threads.append(thread)
                thread.start()
                
                # Limit concurrent threads
                if len(threads) >= self.max_threads:
                    for t in threads:
                        t.join(timeout=5)
                    threads = [t for t in threads if t.is_alive()]
            
            # Wait for remaining threads
            for thread in threads:
                thread.join(timeout=5)
            
            hosts = results
        except:
            pass
        
        return hosts
    
    def port_scan(self, ip, ports=[22, 80, 443, 135, 139, 445, 3306, 3389, 5432, 8080, 9090]):
        """Quick port scan"""
        open_ports = []
        for port in ports:
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(1)
                result = sock.connect_ex((ip, port))
                sock.close()
                if result == 0:
                    open_ports.append(port)
            except:
                pass
        
        return open_ports
    
    def get_os_guess(self, ip, ports):
        """Guess OS based on open ports"""
        if 135 in ports or 139 in ports or 445 in ports:
            return 'Windows'
        elif 22 in ports and 443 in ports:
            return 'Linux/Unix'
        elif 80 in ports and 8000 in ports:
            return 'Linux/IoT'
        else:
            return 'Unknown'
    
    def infer_device_role(self, ip, open_ports, vendor):
        """Infer device role from characteristics"""
        if ip.endswith('.1'):
            return 'Gateway/Router'
        
        if 135 in open_ports or 139 in open_ports or 445 in open_ports:
            if 3389 in open_ports:
                return 'Windows Server'
            else:
                return 'Windows Workstation'
        
        if 22 in open_ports:
            if any(p in open_ports for p in [3306, 5432, 27017]):
                return 'Linux Server'
            elif 80 in open_ports or 443 in open_ports or 8080 in open_ports:
                return 'Web Server'
            else:
                return 'Linux/SSH Node'
        
        if any(p in open_ports for p in [8000, 8001, 8080, 8081]):
            if 'Hikvision' in vendor or 'Axis' in vendor:
                return 'IP Camera'
            else:
                return 'Web Device'
        
        if 9100 in open_ports or 515 in open_ports or 631 in open_ports:
            return 'Network Printer'
        
        return 'Unknown Device'
    
    def scan_subnet(self, subnet):
        """Perform full subnet scan"""
        print(f"[*] Starting scan of {subnet}")
        
        # Get local info
        local_info = self.get_local_interfaces()
        local_ip = local_info.get('local_ip', '192.168.1.100')
        gateway = local_info.get('gateway', '192.168.1.1')
        
        # Try both ARP and ICMP
        print("[*] Running ARP scan...")
        hosts = self.arp_scan(subnet)
        
        print("[*] Running ICMP ping sweep...")
        icmp_hosts = self.icmp_sweep(subnet)
        hosts.update(icmp_hosts)
        
        print(f"[+] Found {len(hosts)} potential hosts")
        
        # Enrich data
        results = []
        for ip in sorted(hosts.keys()):
            print(f"[*] Scanning {ip}...")
            
            mac = hosts[ip].get('mac', '00:00:00:00:00:00')
            vendor = self.get_vendor_from_mac(mac)
            
            # Port scan
            open_ports = self.port_scan(ip)
            ports_str = ','.join(str(p) for p in open_ports) if open_ports else ''
            
            # OS guess
            os_guess = self.get_os_guess(ip, open_ports)
            
            # Role inference
            role = self.infer_device_role(ip, open_ports, vendor)
            
            # Service detection
            http_service = ''
            smb_shares = ''
            
            if 80 in open_ports or 443 in open_ports or 8080 in open_ports:
                http_service = 'HTTP/HTTPS Service'
            
            if 445 in open_ports:
                smb_shares = 'SMB Shares Available'
            
            host_data = {
                'ip': ip,
                'mac': mac,
                'vendor': vendor,
                'os': os_guess,
                'role': role,
                'ports': ports_str,
                'type': self.get_device_type(role),
                'description': role,
                'http': http_service,
                'smb': smb_shares
            }
            
            results.append(host_data)
        
        return results, local_ip, gateway
    
    def get_device_type(self, role):
        """Map role to device type for frontend"""
        if 'Gateway' in role or 'Router' in role:
            return 'gateway'
        elif 'Server' in role:
            return 'server'
        elif 'Workstation' in role:
            return 'computer'
        elif 'Camera' in role:
            return 'camera'
        elif 'Printer' in role:
            return 'printer'
        else:
            return 'default'
    
    def generate_topology(self, hosts, gateway_ip, local_ip):
        """Generate Mermaid diagram"""
        mermaid = "graph TD\n"
        mermaid += "    Internet((🌐 Internet))\n"
        mermaid += f"    Internet --> Gateway\n"
        mermaid += f"    Gateway[\"🛡️ {gateway_ip}<br/>Gateway\"]:::gateway\n"
        
        # Group devices
        servers = [h for h in hosts if h['type'] == 'server']
        computers = [h for h in hosts if h['type'] == 'computer']
        cameras = [h for h in hosts if h['type'] == 'camera']
        printers = [h for h in hosts if h['type'] == 'printer']
        
        node_id = 1
        node_map = {}
        
        # Add servers
        for host in servers:
            node_id_str = f"Node{node_id}"
            node_map[host['ip']] = node_id_str
            safe_role = host['role'].replace('"', '\\"').replace('\n', ' ')[:30]
            mermaid += f"    {node_id_str}[\"💾 {host['ip']}<br/>{safe_role}\"]:::server\n"
            mermaid += f"    Gateway --> {node_id_str}\n"
            node_id += 1
        
        # Add computers
        for host in computers:
            node_id_str = f"Node{node_id}"
            node_map[host['ip']] = node_id_str
            safe_role = host['role'].replace('"', '\\"').replace('\n', ' ')[:30]
            mermaid += f"    {node_id_str}[\"💻 {host['ip']}<br/>{safe_role}\"]:::computer\n"
            mermaid += f"    Gateway --> {node_id_str}\n"
            node_id += 1
        
        # Add cameras
        for host in cameras:
            node_id_str = f"Node{node_id}"
            node_map[host['ip']] = node_id_str
            safe_role = host['role'].replace('"', '\\"').replace('\n', ' ')[:30]
            mermaid += f"    {node_id_str}[\"📹 {host['ip']}<br/>{safe_role}\"]:::camera\n"
            mermaid += f"    Gateway --> {node_id_str}\n"
            node_id += 1
        
        # Add printers
        for host in printers:
            node_id_str = f"Node{node_id}"
            node_map[host['ip']] = node_id_str
            safe_role = host['role'].replace('"', '\\"').replace('\n', ' ')[:30]
            mermaid += f"    {node_id_str}[\"🖨️ {host['ip']}<br/>{safe_role}\"]:::printer\n"
            mermaid += f"    Gateway --> {node_id_str}\n"
            node_id += 1
        
        # Add styling
        mermaid += "    classDef gateway fill:#3b82f6,stroke:#1e40af,stroke-width:3px,color:#fff\n"
        mermaid += "    classDef server fill:#f97316,stroke:#c2410c,stroke-width:2px,color:#fff\n"
        mermaid += "    classDef computer fill:#a855f7,stroke:#6d28d9,stroke-width:2px,color:#fff\n"
        mermaid += "    classDef camera fill:#06b6d4,stroke:#0369a1,stroke-width:2px,color:#fff\n"
        mermaid += "    classDef printer fill:#10b981,stroke:#065f46,stroke-width:2px,color:#fff\n"
        
        return mermaid


@app.route('/api/scan', methods=['POST'])
def api_scan():
    """API endpoint for network scanning"""
    data = request.json
    subnet = data.get('subnet', '192.168.1.0/24')
    mode = data.get('mode', 'fast')
    
    try:
        scanner = NetworkScanner()
        hosts, local_ip, gateway = scanner.scan_subnet(subnet)
        
        # Generate topology
        topology = scanner.generate_topology(hosts, gateway, local_ip)
        
        response = {
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'scanMode': mode,
            'network': {
                'subnet': subnet,
                'localIp': local_ip,
                'gateway': gateway,
                'dns': '8.8.8.8, 1.1.1.1'
            },
            'hosts': hosts,
            'topology': topology
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Scan failed - ensure proper permissions (may require sudo)'
        }), 500


@app.route('/api/status', methods=['GET'])
def api_status():
    """Health check endpoint"""
    return jsonify({
        'status': 'running',
        'version': '1.0',
        'timestamp': datetime.utcnow().isoformat() + 'Z'
    })


@app.route('/', methods=['GET'])
def index():
    """Simple health check page"""
    return """
    <html>
    <head><title>Network Scanner Backend</title></head>
    <body style="font-family: sans-serif; padding: 20px;">
        <h1>🔍 Network Scanner Backend</h1>
        <p>Backend is running and ready for scanning.</p>
        
        <h3>API Endpoints:</h3>
        <ul>
            <li><strong>POST /api/scan</strong> - Start network scan
                <ul>
                    <li>Parameters: <code>{"subnet": "192.168.1.0/24", "mode": "fast"}</code></li>
                </ul>
            </li>
            <li><strong>GET /api/status</strong> - Check backend status</li>
        </ul>
        
        <h3>Usage:</h3>
        <ol>
            <li>Open network-mapper.html in your browser</li>
            <li>Enter subnet (e.g., 192.168.1.0/24)</li>
            <li>Click "Scan Network"</li>
            <li>Results will display in the topology diagram</li>
        </ol>
        
        <p><strong>Note:</strong> Some scan functions may require elevated permissions (sudo)</p>
    </body>
    </html>
    """


if __name__ == '__main__':
    print("""
╔════════════════════════════════════════════════════════════════╗
║         Network Scanner Backend v1.0                           ║
║         For use with network-mapper.html                       ║
╚════════════════════════════════════════════════════════════════╝

[*] Starting Flask server...
[*] API running on http://localhost:5000

[*] Endpoints:
    - POST /api/scan - Perform network scan
    - GET /api/status - Health check

[*] To use:
    1. Open network-mapper.html in your browser
    2. Enter subnet (e.g., 192.168.1.0/24)
    3. Click "Scan Network"

[!] Note: ARP scanning may require sudo/root privileges
    Run with: sudo python3 network-scanner.py

    """)
    
    # Run Flask
    app.run(host='localhost', port=5000, debug=False, use_reloader=False)
