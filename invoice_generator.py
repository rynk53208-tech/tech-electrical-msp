#!/usr/bin/env python3
"""
TES Invoice Generator
Tech & Electrical Services LLC

Generates professional invoices as plain text or HTML.
Can also calculate MSP monthly billing automatically.

Usage:
    python3 invoice_generator.py --list                     # List all invoices
    python3 invoice_generator.py --create                   # Interactive create
    python3 invoice_generator.py --show INV-001             # Show invoice
    python3 invoice_generator.py --html INV-001             # Export HTML
    python3 invoice_generator.py --mrr                      # Show monthly recurring
    python3 invoice_generator.py --generate-msp             # Auto-generate MSP invoices for all clients
"""

import json
import argparse
import datetime
from pathlib import Path

BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

INVOICES_FILE = DATA_DIR / "invoices.json"
CLIENTS_FILE = DATA_DIR / "clients.json"

MSP_RATES = {"Basic": 125, "Standard": 150, "Premium": 175, "None": 0}

COMPANY = {
    "name": "Tech & Electrical Services LLC",
    "address": "Temecula, CA 92591",
    "email": "irvin@techelectrical.com",
    "phone": "(951) 555-0100",
    "website": "www.techelectrical.com",
}


def load_json(path, default=None):
    try:
        with open(path) as f:
            return json.load(f)
    except:
        return default or []


def save_json(path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)


def get_client(client_id):
    clients = load_json(CLIENTS_FILE, [])
    return next((c for c in clients if c["id"] == client_id), None)


def next_invoice_id():
    invoices = load_json(INVOICES_FILE, [])
    nums = []
    for inv in invoices:
        try:
            nums.append(int(inv["id"].split("-")[1]))
        except:
            pass
    n = max(nums, default=0) + 1
    return f"INV-{n:03d}"


def fmt_currency(n):
    return f"${n:,.2f}"


def generate_text_invoice(inv, client):
    """Generate plain-text invoice."""
    w = 62
    sep = "─" * w

    def center(s):
        return s.center(w)

    def row(desc, qty, rate, amount, header=False):
        desc = str(desc)[:33]
        if header:
            return f"{'DESCRIPTION':<33} {'QTY':>5} {'RATE':>9} {'AMOUNT':>10}"
        return f"{desc:<33} {qty:>5} {rate:>9.2f} {amount:>10.2f}"

    lines = [
        sep,
        center("⚡ " + COMPANY["name"]),
        center(COMPANY["address"]),
        center(f"{COMPANY['phone']} | {COMPANY['email']}"),
        sep,
        "",
        f"INVOICE #: {inv['id']:<30} STATUS: {inv.get('status','draft').upper()}",
        f"DATE:      {inv.get('created', '—'):<30} DUE: {inv.get('due', '—')}",
        "",
        "BILL TO:",
        f"  {client.get('company', 'Unknown Client')}",
        f"  {client.get('contact', '')}",
        f"  {client.get('address', '')}",
        f"  {client.get('email', '')}",
        "",
        sep,
        row("DESCRIPTION", "QTY", "RATE", "AMOUNT", header=True),
        sep,
    ]

    for item in inv.get("items", []):
        lines.append(row(item["desc"], item["qty"], item["rate"], item["amount"]))

    total = inv.get("total", sum(i["amount"] for i in inv.get("items", [])))
    lines += [
        sep,
        f"{'TOTAL DUE:':>{w - 12}} {fmt_currency(total):>10}",
        sep,
        "",
    ]

    if inv.get("notes"):
        lines += ["NOTES:", f"  {inv['notes']}", ""]

    lines += [
        "PAYMENT OPTIONS:",
        "  • Check payable to 'Tech & Electrical Services LLC'",
        "  • Zelle/Venmo: @irvin-TES",
        "  • ACH/Bank transfer available on request",
        "",
        "Late payments subject to 1.5% monthly interest.",
        "Thank you for your business! — Irvin Avitia",
        sep,
    ]

    return "\n".join(lines)


def generate_html_invoice(inv, client):
    """Generate self-contained HTML invoice."""
    total = inv.get("total", sum(i["amount"] for i in inv.get("items", [])))
    status_color = {
        "paid": "#22c55e",
        "sent": "#3b82f6",
        "overdue": "#ef4444",
        "draft": "#9ca3af",
    }.get(inv.get("status", "draft"), "#9ca3af")

    items_html = "".join(
        f"""<tr>
            <td>{item['desc']}</td>
            <td style="text-align:center">{item['qty']}</td>
            <td style="text-align:right">{fmt_currency(item['rate'])}</td>
            <td style="text-align:right;font-weight:600">{fmt_currency(item['amount'])}</td>
        </tr>"""
        for item in inv.get("items", [])
    )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Invoice {inv['id']} - {client.get('company','')}</title>
<style>
  body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px; max-width: 760px; margin: 0 auto; color: #111; }}
  .header {{ display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }}
  .brand {{ font-size: 1.8rem; font-weight: 800; color: #00d4ff; }}
  .brand-sub {{ color: #555; font-size: 0.9rem; margin-top: 4px; }}
  .inv-num {{ font-size: 1.4rem; font-weight: 700; text-align: right; }}
  .status-badge {{ display: inline-block; padding: 4px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; color: #fff; background: {status_color}; }}
  .meta-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }}
  .meta-label {{ font-size: 0.75rem; text-transform: uppercase; color: #999; letter-spacing: 0.06em; }}
  .meta-value {{ font-weight: 600; margin-top: 3px; }}
  table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
  th {{ background: #f5f5f5; padding: 12px 14px; text-align: left; font-size: 0.8rem; text-transform: uppercase; color: #666; }}
  td {{ padding: 12px 14px; border-bottom: 1px solid #eee; }}
  .total-row {{ display: flex; justify-content: flex-end; margin-top: 10px; }}
  .total-box {{ background: #f0fdf4; border: 2px solid #22c55e; border-radius: 8px; padding: 16px 24px; text-align: right; }}
  .total-label {{ font-size: 0.85rem; color: #666; }}
  .total-amount {{ font-size: 2rem; font-weight: 800; color: #22c55e; }}
  .notes {{ background: #fffbeb; border-left: 4px solid #fbbf24; padding: 12px 16px; border-radius: 4px; margin: 20px 0; font-size: 0.9rem; }}
  .footer {{ margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.8rem; color: #999; }}
  @media print {{ body {{ padding: 10px; }} .no-print {{ display: none; }} }}
</style>
</head>
<body>
<div class="header">
  <div>
    <div class="brand">⚡ {COMPANY['name']}</div>
    <div class="brand-sub">{COMPANY['address']}<br>{COMPANY['phone']} · {COMPANY['email']}</div>
  </div>
  <div style="text-align:right">
    <div class="inv-num">INVOICE #{inv['id']}</div>
    <div style="margin-top:8px"><span class="status-badge">{inv.get('status','draft').upper()}</span></div>
  </div>
</div>

<div class="meta-grid">
  <div>
    <div class="meta-label">Bill To</div>
    <div class="meta-value">{client.get('company','Unknown')}</div>
    <div>{client.get('contact','')}</div>
    <div>{client.get('address','')}</div>
    <div style="color:#3b82f6">{client.get('email','')}</div>
  </div>
  <div>
    <div class="meta-label">Invoice Date</div><div class="meta-value">{inv.get('created','—')}</div>
    <div class="meta-label" style="margin-top:12px">Due Date</div>
    <div class="meta-value" style="color:{'#ef4444' if inv.get('status')=='overdue' else '#111'}">{inv.get('due','—')}</div>
  </div>
</div>

<table>
  <thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
  <tbody>{items_html}</tbody>
</table>

<div class="total-row">
  <div class="total-box">
    <div class="total-label">TOTAL DUE</div>
    <div class="total-amount">{fmt_currency(total)}</div>
  </div>
</div>

{f'<div class="notes">📝 {inv["notes"]}</div>' if inv.get("notes") else ""}

<div class="footer">
  <strong>Payment Options:</strong><br>
  Check payable to "{COMPANY['name']}" · Zelle/Venmo: @irvin-TES · ACH available on request<br>
  Late payments subject to 1.5% monthly interest charge.
  <br><br>
  Thank you for trusting Tech & Electrical Services LLC — Irvin Avitia
</div>

<div class="no-print" style="margin-top:30px;text-align:center">
  <button onclick="window.print()" style="padding:10px 30px;background:#00d4ff;border:none;border-radius:6px;cursor:pointer;font-size:1rem;font-weight:600">🖨️ Print / Save PDF</button>
</div>
</body>
</html>"""


def cmd_list(args):
    invoices = load_json(INVOICES_FILE, [])
    if not invoices:
        print("No invoices found.")
        return

    print(f"\n{'ID':<10} {'CLIENT':<25} {'AMOUNT':>10} {'STATUS':<10} {'DUE':<12}")
    print("─" * 72)
    total_paid = 0
    total_owed = 0
    for inv in invoices:
        client = get_client(inv.get("clientId", ""))
        name = (client["company"][:23] if client else "Unknown")
        print(f"{inv['id']:<10} {name:<25} {fmt_currency(inv['total']):>10} {inv.get('status','?'):<10} {inv.get('due','—'):<12}")
        if inv.get("status") == "paid":
            total_paid += inv["total"]
        elif inv.get("status") in ("sent", "overdue"):
            total_owed += inv["total"]

    print("─" * 72)
    print(f"Collected: {fmt_currency(total_paid)}  |  Outstanding: {fmt_currency(total_owed)}")


def cmd_show(args):
    invoices = load_json(INVOICES_FILE, [])
    inv = next((i for i in invoices if i["id"] == args.show), None)
    if not inv:
        print(f"Invoice {args.show} not found.")
        return
    client = get_client(inv.get("clientId", "")) or {}
    print(generate_text_invoice(inv, client))


def cmd_html(args):
    invoices = load_json(INVOICES_FILE, [])
    inv = next((i for i in invoices if i["id"] == args.html), None)
    if not inv:
        print(f"Invoice {args.html} not found.")
        return
    client = get_client(inv.get("clientId", "")) or {}
    html = generate_html_invoice(inv, client)
    out = BASE_DIR / f"{args.html}.html"
    out.write_text(html)
    print(f"✓ HTML invoice saved to: {out}")
    print(f"  Open in browser: file://{out}")


def cmd_mrr(args):
    clients = load_json(CLIENTS_FILE, [])
    print(f"\n{'CLIENT':<30} {'PLAN':<12} {'USERS':>6} {'MRR':>10}")
    print("─" * 62)
    total = 0
    for c in clients:
        rate = MSP_RATES.get(c.get("plan", "None"), 0)
        users = c.get("users", 0)
        mrr = rate * users
        total += mrr
        if mrr > 0:
            print(f"{c['company']:<30} {c.get('plan','None'):<12} {users:>6} {fmt_currency(mrr):>10}")
    print("─" * 62)
    print(f"{'TOTAL MRR':>50} {fmt_currency(total):>10}")
    print(f"{'ANNUAL RECURRING':>50} {fmt_currency(total*12):>10}")


def cmd_generate_msp(args):
    """Auto-generate MSP invoices for all active clients."""
    clients = load_json(CLIENTS_FILE, [])
    invoices = load_json(INVOICES_FILE, [])
    today = datetime.date.today()
    due = today.replace(day=1) + datetime.timedelta(days=32)
    due = due.replace(day=1)  # First of next month

    created = 0
    for client in clients:
        plan = client.get("plan", "None")
        rate = MSP_RATES.get(plan, 0)
        if rate == 0:
            continue
        users = client.get("users", 0)
        total = rate * users
        month = today.strftime("%B %Y")

        inv_id = next_invoice_id()
        inv = {
            "id": inv_id,
            "clientId": client["id"],
            "status": "sent",
            "due": due.isoformat(),
            "created": today.isoformat(),
            "notes": f"{month} MSP Services - {plan} Plan",
            "items": [
                {
                    "desc": f"MSP {plan} Plan - {users} users",
                    "qty": 1,
                    "rate": total,
                    "amount": total,
                }
            ],
            "total": total,
        }
        invoices.append(inv)
        created += 1
        print(f"✓ Created {inv_id} for {client['company']}: {fmt_currency(total)}")

    save_json(INVOICES_FILE, invoices)
    total_billed = sum(MSP_RATES.get(c.get("plan","None"),0)*c.get("users",0) for c in clients)
    print(f"\n✓ Generated {created} MSP invoices | Total: {fmt_currency(total_billed)}")


def cmd_create(args):
    """Interactive invoice creation."""
    clients = load_json(CLIENTS_FILE, [])
    if not clients:
        print("No clients found. Add clients first via the web dashboard.")
        return

    print("\n=== New Invoice ===")
    for i, c in enumerate(clients):
        print(f"  {i+1}. {c['company']}")
    idx = int(input("Select client (number): ")) - 1
    client = clients[idx]

    print(f"\nCreating invoice for: {client['company']}")
    due_days = int(input("Due in how many days? [30]: ") or "30")
    due = (datetime.date.today() + datetime.timedelta(days=due_days)).isoformat()

    items = []
    print("\nAdd line items (empty description to stop):")
    while True:
        desc = input("  Description: ").strip()
        if not desc:
            break
        qty = float(input("  Quantity [1]: ") or "1")
        rate = float(input("  Rate ($): "))
        amount = qty * rate
        items.append({"desc": desc, "qty": qty, "rate": rate, "amount": amount})
        print(f"  → {fmt_currency(amount)}")

    if not items:
        print("No items added.")
        return

    total = sum(i["amount"] for i in items)
    notes = input(f"\nNotes (optional): ").strip()
    print(f"\nTotal: {fmt_currency(total)}")
    confirm = input("Save? [y/N]: ").strip().lower()
    if confirm != "y":
        print("Cancelled.")
        return

    invoices = load_json(INVOICES_FILE, [])
    inv = {
        "id": next_invoice_id(),
        "clientId": client["id"],
        "status": "draft",
        "due": due,
        "created": datetime.date.today().isoformat(),
        "notes": notes,
        "items": items,
        "total": total,
    }
    invoices.append(inv)
    save_json(INVOICES_FILE, invoices)
    print(f"\n✓ Invoice {inv['id']} created for {client['company']}: {fmt_currency(total)}")


def main():
    parser = argparse.ArgumentParser(description="TES Invoice Generator")
    parser.add_argument("--list", action="store_true", help="List all invoices")
    parser.add_argument("--show", metavar="INV_ID", help="Show invoice as text")
    parser.add_argument("--html", metavar="INV_ID", help="Export invoice as HTML")
    parser.add_argument("--mrr", action="store_true", help="Show monthly recurring revenue")
    parser.add_argument("--create", action="store_true", help="Interactively create invoice")
    parser.add_argument("--generate-msp", action="store_true", help="Auto-generate MSP invoices")
    args = parser.parse_args()

    if args.list:
        cmd_list(args)
    elif args.show:
        cmd_show(args)
    elif args.html:
        cmd_html(args)
    elif args.mrr:
        cmd_mrr(args)
    elif args.create:
        cmd_create(args)
    elif args.generate_msp:
        cmd_generate_msp(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
