#!/usr/bin/env python3
"""
TES Infrastructure Monitor
Tech & Electrical Services LLC

Standalone monitoring script. Checks device/service status,
logs results, and sends alerts on state changes.

Usage:
    python3 monitor_check.py               # Run once, show report
    python3 monitor_check.py --watch 60   # Run every 60 seconds
    python3 monitor_check.py --report      # Summary report only
    python3 monitor_check.py --log         # Show alert history
    
Cron example (every 5 minutes):
    */5 * * * * /usr/bin/python3 /path/to/monitor_check.py >> /var/log/tes-monitor.log 2>&1
"""

import json
import os
import sys
import subprocess
import time
import argparse
import datetime
from pathlib import Path
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError

BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

MONITORS_FILE = DATA_DIR / "monitors.json"
ALERTS_FILE = DATA_DIR / "alerts.json"
CLIENTS_FILE = DATA_DIR / "clients.json"
LOG_FILE = DATA_DIR / "monitor.log"

# Alert thresholds
CPU_WARN = 80
CPU_CRIT = 90
RAM_WARN = 80
RAM_CRIT = 90
DISK_WARN = 85
DISK_CRIT = 95
LATENCY_WARN = 500
LATENCY_CRIT = 2000


def ts():
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def log(msg, level="INFO"):
    line = f"[{ts()}] [{level}] {msg}"
    print(line)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")


def load_json(path, default=None):
    try:
        with open(path) as f:
            return json.load(f)
    except:
        return default if default is not None else []


def save_json(path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)


def client_name(client_id):
    clients = load_json(CLIENTS_FILE, [])
    c = next((x for x in clients if x["id"] == client_id), None)
    return c["company"] if c else "Unknown"


# ─────────────────────────────────────────
# CHECK FUNCTIONS
# ─────────────────────────────────────────
def ping_host(ip: str, count=3, timeout=3) -> dict:
    """Ping a host. Returns dict with reachable, latency_ms."""
    try:
        result = subprocess.run(
            ["ping", "-c", str(count), "-W", str(timeout), ip],
            capture_output=True, text=True, timeout=timeout * count + 2
        )
        if result.returncode == 0:
            # Parse latency from ping stats
            for line in result.stdout.split("\n"):
                if "rtt min" in line or "round-trip" in line:
                    # linux: rtt min/avg/max/mdev = 1.2/2.3/3.4/0.5 ms
                    parts = line.split("=")[-1].strip().split("/")
                    avg_ms = float(parts[1]) if len(parts) >= 2 else 0
                    return {"reachable": True, "latency_ms": round(avg_ms)}
            return {"reachable": True, "latency_ms": None}
        return {"reachable": False, "latency_ms": None}
    except Exception as e:
        return {"reachable": False, "latency_ms": None, "error": str(e)}


def check_url(url: str, timeout=10) -> dict:
    """Check an HTTP/HTTPS URL."""
    try:
        start = time.time()
        req = Request(url, headers={"User-Agent": "TES-Monitor/1.0"})
        resp = urlopen(req, timeout=timeout)
        ms = int((time.time() - start) * 1000)
        return {
            "reachable": True,
            "status_code": resp.status,
            "latency_ms": ms,
            "ok": resp.status < 400,
        }
    except HTTPError as e:
        return {"reachable": True, "status_code": e.code, "latency_ms": None, "ok": False}
    except (URLError, Exception) as e:
        return {"reachable": False, "latency_ms": None, "ok": False, "error": str(e)}


def check_port(host: str, port: int, timeout=5) -> dict:
    """Check if a TCP port is open."""
    import socket
    try:
        start = time.time()
        with socket.create_connection((host, port), timeout=timeout):
            ms = int((time.time() - start) * 1000)
            return {"open": True, "latency_ms": ms}
    except Exception as e:
        return {"open": False, "latency_ms": None}


def determine_status(result: dict, monitor: dict) -> str:
    """Determine UP/WARN/DOWN based on check results."""
    if not result.get("reachable", result.get("ok", False)):
        return "down"

    latency = result.get("latency_ms")
    if latency and latency >= LATENCY_CRIT:
        return "down"
    if latency and latency >= LATENCY_WARN:
        return "warn"

    cpu = monitor.get("cpu", 0) or 0
    ram = monitor.get("ram", 0) or 0
    disk = monitor.get("disk", 0) or 0

    if cpu >= CPU_CRIT or ram >= RAM_CRIT or disk >= DISK_CRIT:
        return "down"
    if cpu >= CPU_WARN or ram >= RAM_WARN or disk >= DISK_WARN:
        return "warn"

    return "up"


# ─────────────────────────────────────────
# MAIN CHECK LOOP
# ─────────────────────────────────────────
def run_checks(verbose=True) -> list:
    """Run all monitoring checks. Returns list of status changes."""
    monitors = load_json(MONITORS_FILE, [])
    alerts = load_json(ALERTS_FILE, [])
    changes = []

    if not monitors:
        log("No monitors configured.", "WARN")
        return []

    for m in monitors:
        name = m["name"]
        ip = m.get("ip", "")
        mtype = m.get("type", "server")
        old_status = m.get("status", "unknown")

        # Run appropriate check
        if ip.startswith("http://") or ip.startswith("https://") or mtype == "website":
            result = check_url(ip) if ip.startswith("http") else {"reachable": False}
        elif mtype in ("server", "workstation", "network", "firewall"):
            result = ping_host(ip)
        else:
            result = ping_host(ip)

        new_status = determine_status(result, m)
        latency = result.get("latency_ms")

        # Update monitor state
        m["status"] = new_status
        m["latency"] = latency
        m["lastCheck"] = datetime.datetime.now().isoformat()

        if verbose:
            icon = {"up": "✅", "warn": "⚠️", "down": "🔴"}.get(new_status, "❓")
            lat_str = f" ({latency}ms)" if latency else ""
            log(f"{icon} {name:<30} [{m['clientId']}]{lat_str} → {new_status}")

        # Alert on status change
        if old_status != new_status:
            alert = {
                "id": f"alert_{int(time.time())}_{m['id']}",
                "deviceId": m["id"],
                "deviceName": name,
                "clientId": m.get("clientId", ""),
                "clientName": client_name(m.get("clientId", "")),
                "from": old_status,
                "to": new_status,
                "timestamp": datetime.datetime.now().isoformat(),
                "acked": False,
            }
            alerts.append(alert)
            changes.append(alert)
            level = "CRIT" if new_status == "down" else "WARN"
            log(f"STATUS CHANGE: {name} {old_status}→{new_status}", level)

    save_json(MONITORS_FILE, monitors)
    save_json(ALERTS_FILE, alerts[-200:])  # Keep last 200 alerts

    return changes


def print_report():
    """Print a summary monitoring report."""
    monitors = load_json(MONITORS_FILE, [])
    alerts = load_json(ALERTS_FILE, [])

    up = [m for m in monitors if m["status"] == "up"]
    warn = [m for m in monitors if m["status"] == "warn"]
    down = [m for m in monitors if m["status"] == "down"]

    print("\n" + "=" * 60)
    print("⚡ TES INFRASTRUCTURE MONITORING REPORT")
    print(f"   Generated: {ts()}")
    print("=" * 60)
    print(f"\n  Total Devices:  {len(monitors)}")
    print(f"  🟢 Online:      {len(up)}")
    print(f"  🟡 Warning:     {len(warn)}")
    print(f"  🔴 Offline:     {len(down)}")

    if down:
        print("\n  ⚠️  CRITICAL — DEVICES OFFLINE:")
        for m in down:
            print(f"    • {m['name']} [{client_name(m.get('clientId',''))}]")

    if warn:
        print("\n  ⚠️  WARNING:")
        for m in warn:
            cpu = m.get("cpu", "—")
            ram = m.get("ram", "—")
            print(f"    • {m['name']} — CPU:{cpu}% RAM:{ram}%")

    # Recent alerts (last 5)
    recent = [a for a in alerts if not a.get("acked")][-5:]
    if recent:
        print("\n  📋 RECENT UNACKNOWLEDGED ALERTS:")
        for a in reversed(recent):
            print(f"    [{a['timestamp'][:16]}] {a['deviceName']}: {a['from']} → {a['to']}")

    print("\n" + "=" * 60 + "\n")


def cmd_log(args):
    """Show alert history."""
    alerts = load_json(ALERTS_FILE, [])
    if not alerts:
        print("No alerts recorded.")
        return
    print(f"\n{'TIMESTAMP':<20} {'DEVICE':<25} {'CLIENT':<20} {'CHANGE':<15}")
    print("─" * 82)
    for a in reversed(alerts[-50:]):
        change = f"{a['from']} → {a['to']}"
        acked = "✓" if a.get("acked") else " "
        print(f"{a['timestamp'][:16]:<20} {a['deviceName']:<25} {a.get('clientName',''):<20} {change:<15} {acked}")


def main():
    parser = argparse.ArgumentParser(description="TES Infrastructure Monitor")
    parser.add_argument("--watch", type=int, metavar="SECONDS", help="Run continuously every N seconds")
    parser.add_argument("--report", action="store_true", help="Print summary report")
    parser.add_argument("--log", action="store_true", help="Show alert history")
    parser.add_argument("--quiet", action="store_true", help="Suppress per-device output")
    args = parser.parse_args()

    if args.log:
        cmd_log(args)
        return

    if args.report:
        print_report()
        return

    if args.watch:
        print(f"[*] Watching infrastructure every {args.watch}s (Ctrl+C to stop)")
        while True:
            print(f"\n{'─'*40} {ts()} {'─'*40}")
            changes = run_checks(verbose=not args.quiet)
            if changes:
                print(f"\n⚡ {len(changes)} status change(s) detected!")
                for c in changes:
                    print(f"   {c['deviceName']}: {c['from']} → {c['to']}")
            time.sleep(args.watch)
    else:
        log("=== TES Monitor Check ===")
        changes = run_checks(verbose=not args.quiet)
        print_report()
        if changes:
            log(f"SUMMARY: {len(changes)} status change(s) detected", "WARN" if any(c['to']=='down' for c in changes) else "INFO")
        sys.exit(1 if any(c["to"] == "down" for c in changes) else 0)


if __name__ == "__main__":
    main()
