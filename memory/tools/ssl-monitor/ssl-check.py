#!/usr/bin/env python3
"""
SSL Certificate Monitor (Python version)
Checks SSL expiry for domains listed in domains.json.
Outputs a console report and writes results to results/latest.json.

Usage:
  python3 ssl-check.py [--json-only] [--domain example.com]

Dependencies: standard library only (ssl, socket, json, datetime, argparse)
"""

import ssl
import socket
import json
import sys
import os
import argparse
from datetime import datetime, timezone
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent.resolve()
DOMAINS_FILE = SCRIPT_DIR / "domains.json"
RESULTS_DIR = SCRIPT_DIR / "results"
DEFAULT_ALERT_DAYS = 30

# ANSI colors
RED    = "\033[0;31m"
YELLOW = "\033[1;33m"
GREEN  = "\033[0;32m"
CYAN   = "\033[0;36m"
BOLD   = "\033[1m"
RESET  = "\033[0m"


def check_cert(domain: str, port: int = 443, alert_days: int = DEFAULT_ALERT_DAYS, label: str = None) -> dict:
    label = label or domain
    result = {
        "domain": domain,
        "label": label,
        "port": port,
        "alertDays": alert_days,
        "status": "unreachable",
        "expiryDate": None,
        "daysLeft": None,
        "subject": None,
        "issuer": None,
    }

    ctx = ssl.create_default_context()
    try:
        with socket.create_connection((domain, port), timeout=10) as sock:
            with ctx.wrap_socket(sock, server_hostname=domain) as ssock:
                cert = ssock.getpeercert()

        # Parse expiry
        expiry_str = cert.get("notAfter")  # e.g. "Apr  7 12:00:00 2026 GMT"
        expiry_dt = datetime.strptime(expiry_str, "%b %d %H:%M:%S %Y %Z").replace(tzinfo=timezone.utc)
        now = datetime.now(timezone.utc)
        days_left = (expiry_dt - now).days

        # Subject & Issuer
        subject = dict(x[0] for x in cert.get("subject", []))
        issuer  = dict(x[0] for x in cert.get("issuer", []))

        result["expiryDate"] = expiry_str
        result["daysLeft"] = days_left
        result["subject"] = subject.get("commonName", str(subject))
        result["issuer"] = issuer.get("organizationName", str(issuer))

        if days_left <= 0:
            result["status"] = "EXPIRED"
        elif days_left <= alert_days:
            result["status"] = "WARNING"
        else:
            result["status"] = "OK"

    except ssl.SSLCertVerificationError as e:
        result["status"] = "INVALID"
        result["error"] = str(e)
    except (socket.timeout, socket.gaierror, ConnectionRefusedError, OSError) as e:
        result["status"] = "unreachable"
        result["error"] = str(e)
    except Exception as e:
        result["status"] = "ERROR"
        result["error"] = str(e)

    return result


def status_color(status: str) -> str:
    return {
        "OK": GREEN,
        "WARNING": YELLOW,
        "EXPIRED": RED,
        "INVALID": RED,
        "unreachable": RED,
        "ERROR": RED,
    }.get(status, RESET)


def print_result(r: dict):
    status = r["status"]
    color  = status_color(status)
    icon   = "✓" if status == "OK" else ("⚠" if status == "WARNING" else "✗")
    days   = r["daysLeft"]
    days_str = f"{days:4d} days" if days is not None else "  N/A     "
    expiry = r.get("expiryDate") or r.get("error", "")
    print(f"  {color}{icon} {status:<12}{RESET}  {BOLD}{r['label']:<30}{RESET}  "
          f"expires in {color}{days_str}{RESET}  ({expiry})")


def load_domains(extra_domain=None):
    domains = []
    if DOMAINS_FILE.exists():
        with open(DOMAINS_FILE) as f:
            data = json.load(f)
        domains = data.get("domains", [])

    if extra_domain:
        domains.append({"domain": extra_domain})

    return domains


def main():
    parser = argparse.ArgumentParser(description="SSL Certificate Monitor")
    parser.add_argument("--json-only", action="store_true", help="Output JSON only (no color console)")
    parser.add_argument("--domain", help="Check a single domain (overrides domains.json)")
    parser.add_argument("--port", type=int, default=443, help="Port for --domain (default 443)")
    parser.add_argument("--alert-days", type=int, default=DEFAULT_ALERT_DAYS,
                        help="Warn if expiry is within this many days")
    args = parser.parse_args()

    RESULTS_DIR.mkdir(parents=True, exist_ok=True)

    domains = load_domains(args.domain)
    if not domains:
        print(f"{YELLOW}No domains configured. Add entries to domains.json or use --domain{RESET}")
        sys.exit(0)

    if not args.json_only:
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M %Z")
        print(f"\n{CYAN}{BOLD}══════════════════════════════════════════════════{RESET}")
        print(f"{CYAN}{BOLD}  SSL Certificate Monitor — {now_str}{RESET}")
        print(f"{CYAN}{BOLD}══════════════════════════════════════════════════{RESET}\n")

    results = []
    counts = {"OK": 0, "WARNING": 0, "EXPIRED": 0, "unreachable": 0, "INVALID": 0, "ERROR": 0}

    for entry in domains:
        domain     = entry.get("domain")
        port       = entry.get("port", args.port)
        alert_days = entry.get("alertDays", args.alert_days)
        label      = entry.get("label", domain)

        r = check_cert(domain, port, alert_days, label)
        results.append(r)
        counts[r["status"]] = counts.get(r["status"], 0) + 1

        if not args.json_only:
            print_result(r)

    # Summary
    total = len(results)
    ok_count          = counts.get("OK", 0)
    warning_count     = counts.get("WARNING", 0)
    expired_count     = counts.get("EXPIRED", 0)
    unreachable_count = counts.get("unreachable", 0) + counts.get("INVALID", 0) + counts.get("ERROR", 0)

    if not args.json_only:
        print(f"\n{CYAN}{BOLD}── Summary ────────────────────────────────────────{RESET}")
        print(f"  Total checked:  {BOLD}{total}{RESET}")
        print(f"  {GREEN}✓ OK:{RESET}           {ok_count}")
        print(f"  {YELLOW}⚠ Warning:{RESET}      {warning_count}")
        print(f"  {RED}✗ Expired:{RESET}      {expired_count}")
        print(f"  {RED}✗ Unreachable:{RESET}  {unreachable_count}")

    report = {
        "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "summary": {
            "total": total,
            "ok": ok_count,
            "warning": warning_count,
            "expired": expired_count,
            "unreachable": unreachable_count,
        },
        "results": results,
    }

    # Write latest.json
    latest_path = RESULTS_DIR / "latest.json"
    with open(latest_path, "w") as f:
        json.dump(report, f, indent=2)

    # Write timestamped copy
    ts = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    with open(RESULTS_DIR / f"{ts}.json", "w") as f:
        json.dump(report, f, indent=2)

    if args.json_only:
        print(json.dumps(report, indent=2))
    else:
        print(f"\n  Report saved → {latest_path}\n")

    # Exit codes
    if expired_count > 0:
        sys.exit(2)
    elif warning_count > 0:
        sys.exit(1)
    sys.exit(0)


if __name__ == "__main__":
    main()
