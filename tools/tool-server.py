#!/usr/bin/env python3
"""
Tool Server - Runs all MSP tools via GUI
Serves HTML tools and provides API endpoints for backend tools
"""

import http.server
import socketserver
import json
import subprocess
import os
from urllib.parse import urlparse, parse_qs
import threading

PORT = 8888
TOOLS_DIR = os.path.dirname(os.path.abspath(__file__))

class ToolHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=TOOLS_DIR, **kwargs)
    
    def do_GET(self):
        # Serve files from tools directory
        return super().do_GET()
    
    def do_POST(self):
        parsed = urlparse(self.path)
        
        if parsed.path == '/api/scan':
            # Run network scan
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body) if body else {}
            subnet = data.get('subnet', '192.168.1.0/24')
            
            # Run the scanner
            try:
                result = subprocess.run(
                    ['python3', f'{TOOLS_DIR}/network-scanner.py', '--subnet', subnet, '--json'],
                    capture_output=True,
                    text=True,
                    timeout=120
                )
                
                if result.returncode == 0:
                    try:
                        scan_data = json.loads(result.stdout)
                        self.send_response(200)
                        self.send_header('Content-Type', 'application/json')
                        self.end_headers()
                        self.wfile.write(json.dumps(scan_data).encode())
                    except json.JSONDecodeError:
                        self.send_error(500, "Invalid JSON from scanner")
                else:
                    self.send_response(500)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'error': result.stderr}).encode())
                    
            except subprocess.TimeoutExpired:
                self.send_response(408)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Scan timeout'}).encode())
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
        
        elif parsed.path == '/api/test':
            # Test endpoint
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'ok', 'message': 'Tool Server running'}).encode())
        
        else:
            self.send_error(404)
    
    def log_message(self, format, *args):
        # Custom logging
        print(f"[{self.log_date_time_string()}] {format % args}")

def start_server():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), ToolHandler) as httpd:
        print(f"🚀 Tool Server running on http://localhost:{PORT}")
        print(f"📁 Serving tools from: {TOOLS_DIR}")
        print(f"\nAvailable endpoints:")
        print(f"  GET  /                    - Tool Launcher")
        print(f"  GET  /network-mapper.html - Network Mapper GUI")
        print(f"  POST /api/scan            - Run network scan")
        print(f"  POST /api/test            - Test endpoint")
        print(f"\nPress Ctrl+C to stop\n")
        httpd.serve_forever()

if __name__ == '__main__':
    start_server()
