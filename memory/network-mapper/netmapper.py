#!/usr/bin/env python3
"""
Network Topology Mapper - Barney's Tire Shop
Cross-platform: Kali Linux + Windows 11
Portable: Single script, no dependencies beyond standard lib + nmap
"""
import subprocess
import json
import socket
import os
import sys

# === CONFIGURATION ===
DEFAULT_PORTS = "21,22,23,25,53,80,110,135,139,143,443,445,993,995,1433,3306,3389,5432,8080,8443"

def run_cmd(cmd):
    """Run shell command and return output"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=60)
        return result.stdout + result.stderr
    except Exception as e:
        return str(e)

def discover_hosts(subnet):
    """Discover hosts using nmap ARP scan"""
    print(f"[*] Scanning {subnet} for active hosts...")
    cmd = f"nmap -sn -PR {subnet} --exclude 255.255.255.255"
    output = run_cmd(cmd)
    
    hosts = []
    for line in output.split('\n'):
        if "Nmap scan report for" in line:
            ip = line.split("for ")[1].strip()
            if ip:
                hosts.append({"ip": ip, "mac": "", "hostname": "", "ports": [], "os": ""})
    
    # Get MAC addresses
    cmd = "arp -a"
    arp_output = run_cmd(cmd)
    for host in hosts:
        for line in arp_output.split('\n'):
            if host["ip"] in line:
                parts = line.split()
                if len(parts) >= 2:
                    mac = parts[3].replace("-", ":").replace(".", ":")
                    if mac and mac != "(incomplete)":
                        host["mac"] = mac
    
    return hosts

def get_hostname(ip):
    """Reverse DNS lookup"""
    try:
        hostname, _, _ = socket.gethostbyaddr(ip)
        return hostname
    except:
        return ""

def scan_ports(hosts, ports=DEFAULT_PORTS):
    """Scan ports on each host"""
    print(f"[*] Scanning ports on {len(hosts)} hosts...")
    for host in hosts:
        ip = host["ip"]
        print(f"    Scanning {ip}...")
        cmd = f"nmap -sV -p {ports} {ip}"
        output = run_cmd(cmd)
        
        open_ports = []
        for line in output.split('\n'):
            if "/tcp" in line or "/udp" in line:
                parts = line.split()
                if len(parts) >= 3:
                    port = parts[0].split('/')[0]
                    state = parts[1]
                    service = parts[2] if len(parts) > 2 else "unknown"
                    if state == "open":
                        open_ports.append({"port": port, "service": service})
        
        host["ports"] = open_ports
        host["hostname"] = get_hostname(ip)
    
    return hosts

def guess_os(hosts):
    """OS fingerprinting via nmap"""
    print("[*] OS detection...")
    for host in hosts:
        ip = host["ip"]
        cmd = f"nmap -O {ip}"
        output = run_cmd(cmd)
        
        for line in output.split('\n'):
            if "OS details" in line or "OS guesses" in line:
                host["os"] = line.split(":")[1].strip() if ":" in line else "Unknown"
                break
    return hosts

def generate_html_topology(hosts, output_file="network-topology.html"):
    """Generate visual HTML network map"""
    html = f"""<!DOCTYPE html>
<html><head>
    <meta charset="UTF-8">
    <title>Network Topology - Barney's Tire Shop</title>
    <style>
        body {{ font-family: Arial; margin: 20px; background: #1a1a2e; color: #eee; }}
        h1 {{ color: #00d4ff; }}
        .host {{ 
            background: #16213e; padding: 15px; margin: 10px 0; 
            border-radius: 8px; border-left: 4px solid #00d4ff;
        }}
        .ip {{ font-size: 18px; color: #00d4ff; font-weight: bold; }}
        .mac {{ color: #888; }}
        .hostname {{ color: #4ecca3; }}
        .ports {{ margin-top: 10px; }}
        .port {{
            display: inline-block; background: #0f3460; 
            padding: 4px 8px; margin: 2px; border-radius: 4px; font-size: 12px;
        }}
        .gateway {{ border-left-color: #ff6b6b; }}
        .server {{ border-left-color: #ffd93d; }}
        .workstation {{ border-left-color: #6bcb77; }}
    </style>
</head><body>
    <h1>🏢 Network Topology - Barney's Tire Shop</h1>
    <p>Total Devices: {len(hosts)}</p>
"""
    
    # Identify gateway (usually .1 or .254)
    gateway_ip = None
    for host in hosts:
        if host["ip"].endswith(".1") or host["ip"].endswith(".254"):
            gateway_ip = host["ip"]
            host["type"] = "gateway"
            break
    
    for host in hosts:
        if not host.get("type"):
            if host.get("ports"):
                ports_str = str(host["ports"])
                if "443" in ports_str or "3389" in ports_str or "22" in ports_str:
                    host["type"] = "server"
                else:
                    host["type"] = "workstation"
            else:
                host["type"] = "workstation"
        
        css_class = host.get("type", "workstation")
        
        html += f"""
    <div class="host {css_class}">
        <div class="ip">📱 {host['ip']}</div>
        <div class="hostname">🌐 {host['hostname'] or 'N/A'}</div>
        <div class="mac">MAC: {host['mac'] or 'Unknown'}</div>
        <div class="os">OS: {host['os'] or 'Unknown'}</div>
        <div class="ports">
"""
        for p in host.get("ports", []):
            html += f'            <span class="port">{p["port"]}/{p["service"]}</span>\n'
        
        html += """        </div>
    </div>
"""
    
    html += """
</body></html>"""
    
    with open(output_file, 'w') as f:
        f.write(html)
    print(f"[+] HTML topology saved to {output_file}")
    return html

def export_json(hosts, output_file="network-data.json"):
    """Export to JSON"""
    with open(output_file, 'w') as f:
        json.dump(hosts, f, indent=2)
    print(f"[+] JSON data saved to {output_file}")

def export_csv(hosts, output_file="network-data.csv"):
    """Export to CSV"""
    import csv
    with open(output_file, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['IP', 'MAC', 'Hostname', 'OS', 'Open Ports', 'Services'])
        for h in hosts:
            ports = [f'{p["port"]}/{p["service"]}' for p in h.get('ports', [])]
            writer.writerow([h['ip'], h['mac'], h['hostname'], h['os'], 
                           ';'.join(ports), ''])
    print(f"[+] CSV data saved to {output_file}")

def main():
    print("=" * 50)
    print("  Network Topology Mapper - Barney's Tire Shop")
    print("  Cross-platform: Kali Linux + Windows 11")
    print("=" * 50)
    
    subnet = input("Enter subnet (e.g., 192.168.1.0/24): ").strip() or "192.168.1.0/24"
    
    hosts = discover_hosts(subnet)
    if not hosts:
        print("[!] No hosts found. Trying sample data for demo...")
        # Sample data for demo
        hosts = [
            {"ip": "192.168.1.1", "mac": "00:11:22:33:44:55", "hostname": "router.barney.local", "ports": [], "os": "Router/Firewall"},
            {"ip": "192.168.1.10", "mac": "00:11:22:33:44:66", "hostname": "server-barney", "ports": [{"port": "3389", "service": "ms-wbt-server"}, {"port": "80", "service": "http"}, {"port": "443", "service": "https"}], "os": "Windows Server 2019"},
            {"ip": "192.168.1.15", "mac": "00:11:22:33:44:77", "hostname": "pos-01", "ports": [{"port": "3389", "service": "ms-wbt-server"}], "os": "Windows 10"},
            {"ip": "192.168.1.20", "mac": "00:11:22:33:44:88", "hostname": "workstation-01", "ports": [], "os": "Windows 11"},
            {"ip": "192.168.1.21", "mac": "00:11:22:33:44:99", "hostname": "workstation-02", "ports": [], "os": "Windows 11"},
        ]
        print("[+] Using sample data")
    
    hosts = scan_ports(hosts)
    hosts = guess_os(hosts)
    
    print(f"\\n[+] Found {len(hosts)} devices")
    
    export_json(hosts)
    export_csv(hosts)
    generate_html_topology(hosts)
    
    print("\\n[✓] Done! Open network-topology.html in a browser")

if __name__ == "__main__":
    main()
