#!/usr/bin/env python3
"""
TES MSP Toolset - Backend Server
Tech & Electrical Services LLC

Serves the MSP dashboard and provides a REST API for data persistence.
Also handles email alerts and monitoring checks.

Usage:
    python3 msp_server.py                 # Start on port 8765
    python3 msp_server.py --port 9090    # Custom port
    python3 msp_server.py --check        # Run monitoring check once
"""

import json
import os
import sys
import argparse
import subprocess
import datetime
from pathlib import Path
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from urllib.request import urlopen
from urllib.error import URLError
import threading
import time

# ─────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────
BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

PORT = 8765
ALERT_EMAIL = "irvin@techelectrical.com"  # Update with real email
MONITOR_INTERVAL_SEC = 300  # 5 minutes


# ─────────────────────────────────────────
# DATA PERSISTENCE
# ─────────────────────────────────────────
class DataStore:
    def __init__(self):
        self.files = {
            "clients": DATA_DIR / "clients.json",
            "tickets": DATA_DIR / "tickets.json",
            "monitors": DATA_DIR / "monitors.json",
            "invoices": DATA_DIR / "invoices.json",
            "alerts": DATA_DIR / "alerts.json",
        }
        self._init_default_data()

    def _init_default_data(self):
        """Seed default data if files don't exist."""
        if not self.files["clients"].exists():
            self.save("clients", [
                {
                    "id": "c1",
                    "company": "Barney's Tire Shop",
                    "contact": "Barney Rubble",
                    "email": "barney@tireshop.com",
                    "phone": "(951) 555-0101",
                    "plan": "Standard",
                    "users": 8,
                    "address": "1234 Main St, Temecula, CA",
                    "status": "active",
                    "since": "2026-01-01",
                },
                {
                    "id": "c2",
                    "company": "Desert Dental Group",
                    "contact": "Dr. Sarah Lee",
                    "email": "slee@desertdental.com",
                    "phone": "(951) 555-0202",
                    "plan": "Premium",
                    "users": 15,
                    "address": "555 Vine St, Murrieta, CA",
                    "status": "active",
                    "since": "2026-02-15",
                },
            ])

        if not self.files["tickets"].exists():
            self.save("tickets", [
                {
                    "id": "TKT-001",
                    "clientId": "c1",
                    "issue": "Server not responding after power outage",
                    "details": "Main file server went down during power outage.",
                    "priority": "critical",
                    "status": "in-progress",
                    "assigned": "Irvin Avitia",
                    "created": datetime.datetime.now().isoformat(),
                    "resolved": None,
                }
            ])

        if not self.files["monitors"].exists():
            self.save("monitors", [
                {
                    "id": "m1",
                    "name": "Barney File Server",
                    "clientId": "c1",
                    "type": "server",
                    "ip": "192.168.1.10",
                    "status": "down",
                    "cpu": 0,
                    "ram": 0,
                    "disk": 72,
                    "uptime": 94.2,
                    "lastCheck": datetime.datetime.now().isoformat(),
                    "latency": None,
                },
                {
                    "id": "m2",
                    "name": "Barney Firewall",
                    "clientId": "c1",
                    "type": "firewall",
                    "ip": "192.168.1.1",
                    "status": "up",
                    "cpu": 18,
                    "ram": 42,
                    "disk": 15,
                    "uptime": 99.9,
                    "lastCheck": datetime.datetime.now().isoformat(),
                    "latency": 2,
                },
            ])

        if not self.files["invoices"].exists():
            self.save("invoices", [
                {
                    "id": "INV-001",
                    "clientId": "c1",
                    "status": "paid",
                    "due": "2026-03-01",
                    "created": "2026-02-25",
                    "notes": "February MSP - Standard Plan",
                    "items": [{"desc": "MSP Standard Plan - 8 users", "qty": 1, "rate": 1200, "amount": 1200}],
                    "total": 1200,
                }
            ])

        if not self.files["alerts"].exists():
            self.save("alerts", [])

    def load(self, key):
        try:
            with open(self.files[key], "r") as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return []

    def save(self, key, data):
        with open(self.files[key], "w") as f:
            json.dump(data, f, indent=2, default=str)
        return data

    def get_stats(self):
        clients = self.load("clients")
        tickets = self.load("tickets")
        monitors = self.load("monitors")
        invoices = self.load("invoices")

        rates = {"Basic": 125, "Standard": 150, "Premium": 175, "None": 0}
        mrr = sum(rates.get(c["plan"], 0) * c.get("users", 0) for c in clients)

        return {
            "clients": len(clients),
            "open_tickets": len([t for t in tickets if t["status"] in ("open", "in-progress")]),
            "critical_tickets": len([t for t in tickets if t["priority"] == "critical" and t["status"] not in ("resolved", "closed")]),
            "devices_total": len(monitors),
            "devices_up": len([m for m in monitors if m["status"] == "up"]),
            "devices_down": len([m for m in monitors if m["status"] == "down"]),
            "devices_warn": len([m for m in monitors if m["status"] == "warn"]),
            "mrr": mrr,
            "unpaid": sum(i["total"] for i in invoices if i["status"] in ("sent", "overdue")),
            "overdue": len([i for i in invoices if i["status"] == "overdue"]),
            "generated_at": datetime.datetime.now().isoformat(),
        }


# ─────────────────────────────────────────
# MONITORING ENGINE
# ─────────────────────────────────────────
class MonitorEngine:
    def __init__(self, store: DataStore):
        self.store = store

    def ping(self, ip: str, timeout: int = 3) -> tuple[bool, int | None]:
        """Ping an IP and return (reachable, latency_ms)."""
        try:
            if ip.startswith("http"):
                start = time.time()
                urlopen(ip, timeout=timeout)
                ms = int((time.time() - start) * 1000)
                return True, ms
            else:
                result = subprocess.run(
                    ["ping", "-c", "1", "-W", str(timeout), ip],
                    capture_output=True, text=True, timeout=timeout + 1
                )
                if result.returncode == 0:
                    # Parse latency from ping output
                    for line in result.stdout.split("\n"):
                        if "time=" in line:
                            ms = float(line.split("time=")[1].split(" ")[0])
                            return True, int(ms)
                    return True, None
                return False, None
        except Exception:
            return False, None

    def check_all(self, verbose=False):
        """Run checks on all monitored devices and update status."""
        monitors = self.store.load("monitors")
        alerts = self.store.load("alerts")
        changed = []

        for m in monitors:
            old_status = m["status"]
            reachable, latency = self.ping(m["ip"])

            if not reachable:
                m["status"] = "down"
                m["latency"] = None
            else:
                m["latency"] = latency
                # Determine status based on resources
                if m.get("cpu") is not None and (m["cpu"] >= 90 or m.get("ram", 0) >= 90):
                    m["status"] = "warn"
                else:
                    m["status"] = "up"

            m["lastCheck"] = datetime.datetime.now().isoformat()

            if old_status != m["status"]:
                changed.append(m)
                alert = {
                    "id": f"alert_{int(time.time())}_{m['id']}",
                    "deviceId": m["id"],
                    "deviceName": m["name"],
                    "clientId": m["clientId"],
                    "from": old_status,
                    "to": m["status"],
                    "timestamp": datetime.datetime.now().isoformat(),
                    "acked": False,
                }
                alerts.append(alert)
                if verbose:
                    print(f"[ALERT] {m['name']}: {old_status} → {m['status']}")

        self.store.save("monitors", monitors)
        self.store.save("alerts", alerts[-100:])  # Keep last 100 alerts

        if changed and verbose:
            print(f"[MONITOR] {len(changed)} status changes detected")

        return changed

    def run_loop(self, interval=MONITOR_INTERVAL_SEC):
        """Continuous monitoring loop (runs in background thread)."""
        print(f"[MONITOR] Starting monitoring loop (every {interval}s)")
        while True:
            try:
                self.check_all(verbose=True)
            except Exception as e:
                print(f"[MONITOR] Error: {e}")
            time.sleep(interval)


# ─────────────────────────────────────────
# HTTP API SERVER
# ─────────────────────────────────────────
class MSPHandler(BaseHTTPRequestHandler):
    store = None  # Injected at startup

    def log_message(self, format, *args):
        print(f"[HTTP] {self.address_string()} - {format % args}")

    def send_json(self, data, status=200):
        body = json.dumps(data, indent=2, default=str).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", len(body))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def send_file(self, path: Path, content_type: str):
        content = path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", len(content))
        self.end_headers()
        self.wfile.write(content)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/")

        # Serve main UI
        if path in ("", "/"):
            index = BASE_DIR / "index.html"
            if index.exists():
                self.send_file(index, "text/html")
            else:
                self.send_json({"error": "index.html not found"}, 404)
            return

        # Static files
        if path.endswith(".css"):
            f = BASE_DIR / path.lstrip("/")
            if f.exists():
                self.send_file(f, "text/css")
                return

        # API routes
        if path == "/api/stats":
            self.send_json(self.store.get_stats())
        elif path in ("/api/clients", "/api/tickets", "/api/monitors", "/api/invoices", "/api/alerts"):
            key = path.split("/")[-1]
            self.send_json(self.store.load(key))
        elif path == "/api/health":
            self.send_json({"status": "ok", "time": datetime.datetime.now().isoformat()})
        else:
            self.send_json({"error": "Not found"}, 404)

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/")
        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length)) if length else {}

        if path in ("/api/clients", "/api/tickets", "/api/monitors", "/api/invoices"):
            key = path.split("/")[-1]
            data = self.store.load(key)

            # Auto-generate ID
            if "id" not in body or not body["id"]:
                prefix = {"clients": "c", "tickets": "TKT-", "monitors": "m", "invoices": "INV-"}[key]
                if key == "tickets":
                    body["id"] = f"TKT-{len(data)+1:03d}"
                elif key == "invoices":
                    body["id"] = f"INV-{len(data)+1:03d}"
                else:
                    body["id"] = f"{prefix}{int(time.time())}"

            # Auto timestamps
            if key == "tickets" and "created" not in body:
                body["created"] = datetime.datetime.now().isoformat()
            if key == "invoices" and "created" not in body:
                body["created"] = datetime.date.today().isoformat()

            data.append(body)
            self.store.save(key, data)
            self.send_json(body, 201)

        elif path == "/api/monitor/check":
            engine = MonitorEngine(self.store)
            changed = engine.check_all(verbose=True)
            self.send_json({"checked": len(self.store.load("monitors")), "changed": len(changed)})

        else:
            self.send_json({"error": "Not found"}, 404)

    def do_PUT(self):
        parsed = urlparse(self.path)
        parts = parsed.path.strip("/").split("/")
        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length)) if length else {}

        if len(parts) == 3 and parts[0] == "api":
            key = parts[1]
            item_id = parts[2]
            if key in ("clients", "tickets", "monitors", "invoices"):
                data = self.store.load(key)
                for i, item in enumerate(data):
                    if item.get("id") == item_id:
                        data[i] = {**item, **body, "id": item_id}
                        self.store.save(key, data)
                        self.send_json(data[i])
                        return
                self.send_json({"error": "Not found"}, 404)
            else:
                self.send_json({"error": "Unknown resource"}, 404)
        else:
            self.send_json({"error": "Invalid path"}, 400)

    def do_DELETE(self):
        parsed = urlparse(self.path)
        parts = parsed.path.strip("/").split("/")

        if len(parts) == 3 and parts[0] == "api":
            key = parts[1]
            item_id = parts[2]
            if key in ("clients", "tickets", "monitors", "invoices"):
                data = self.store.load(key)
                new_data = [item for item in data if item.get("id") != item_id]
                if len(new_data) == len(data):
                    self.send_json({"error": "Not found"}, 404)
                else:
                    self.store.save(key, new_data)
                    self.send_json({"deleted": item_id})
            else:
                self.send_json({"error": "Unknown resource"}, 404)
        else:
            self.send_json({"error": "Invalid path"}, 400)


# ─────────────────────────────────────────
# INVOICE GENERATOR (CLI)
# ─────────────────────────────────────────
def generate_invoice_text(store: DataStore, invoice_id: str) -> str:
    """Generate a plain-text invoice."""
    invoices = store.load("invoices")
    clients = store.load("clients")
    inv = next((i for i in invoices if i["id"] == invoice_id), None)
    if not inv:
        return f"Invoice {invoice_id} not found"
    client = next((c for c in clients if c["id"] == inv["clientId"]), {})

    lines = [
        "=" * 60,
        "TECH & ELECTRICAL SERVICES LLC",
        "Temecula, CA | irvin@techelectrical.com | (951) 555-0100",
        "=" * 60,
        f"INVOICE #{inv['id']}",
        f"Date: {inv.get('created', 'N/A')}",
        f"Due:  {inv.get('due', 'N/A')}",
        f"Status: {inv.get('status', 'N/A').upper()}",
        "-" * 60,
        f"BILL TO:",
        f"  {client.get('company', 'Unknown')}",
        f"  {client.get('contact', '')}",
        f"  {client.get('address', '')}",
        "-" * 60,
        f"{'DESCRIPTION':<35} {'QTY':>4} {'RATE':>10} {'AMOUNT':>10}",
        "-" * 60,
    ]
    for item in inv.get("items", []):
        lines.append(
            f"{item['desc'][:34]:<35} {item['qty']:>4} {item['rate']:>10.2f} {item['amount']:>10.2f}"
        )
    lines += [
        "-" * 60,
        f"{'TOTAL DUE':>50} {inv['total']:>9.2f}",
        "=" * 60,
        inv.get("notes", ""),
        "",
        "Payment: Check payable to 'Tech & Electrical Services LLC'",
        "Venmo/Zelle: @irvin-TES | ACH available on request",
        "Late payments: 1.5%/month interest",
    ]
    return "\n".join(lines)


# ─────────────────────────────────────────
# CLI INTERFACE
# ─────────────────────────────────────────
def cli_main(args):
    store = DataStore()

    if args.check:
        engine = MonitorEngine(store)
        print("[*] Running monitoring check...")
        changed = engine.check_all(verbose=True)
        stats = store.get_stats()
        print(f"\n📊 Stats:")
        print(f"  Open Tickets:  {stats['open_tickets']} ({stats['critical_tickets']} critical)")
        print(f"  Devices Up:    {stats['devices_up']}/{stats['devices_total']}")
        print(f"  Devices Down:  {stats['devices_down']}")
        print(f"  MRR:           ${stats['mrr']:,.2f}")
        print(f"  Unpaid:        ${stats['unpaid']:,.2f}")
        return

    if args.invoice:
        text = generate_invoice_text(store, args.invoice)
        print(text)
        return

    if args.stats:
        stats = store.get_stats()
        print(json.dumps(stats, indent=2))
        return

    # Start server
    MSPHandler.store = store
    server = HTTPServer(("0.0.0.0", args.port), MSPHandler)
    print(f"⚡ TES MSP Server running at http://0.0.0.0:{args.port}")
    print(f"   Dashboard: http://localhost:{args.port}")
    print(f"   API:       http://localhost:{args.port}/api/stats")
    print(f"   Data dir:  {DATA_DIR}")
    print(f"   Press Ctrl+C to stop\n")

    # Start monitor loop in background if requested
    if args.monitor:
        engine = MonitorEngine(store)
        monitor_thread = threading.Thread(target=engine.run_loop, daemon=True)
        monitor_thread.start()
        print(f"[MONITOR] Background monitoring started (every {MONITOR_INTERVAL_SEC}s)")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[*] Server stopped")


# ─────────────────────────────────────────
# ENTRY POINT
# ─────────────────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="TES MSP Toolset Server")
    parser.add_argument("--port", type=int, default=PORT, help=f"Port to listen on (default: {PORT})")
    parser.add_argument("--check", action="store_true", help="Run monitoring check and exit")
    parser.add_argument("--monitor", action="store_true", help="Enable background monitoring loop")
    parser.add_argument("--invoice", type=str, metavar="INV_ID", help="Print invoice to stdout")
    parser.add_argument("--stats", action="store_true", help="Print JSON stats and exit")
    args = parser.parse_args()
    cli_main(args)
