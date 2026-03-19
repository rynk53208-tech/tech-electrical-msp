#!/usr/bin/env python3
"""
Simple Support Ticket Tracker
CLI-based ticket management for Irvin's tech business
"""

import json
import os
from datetime import datetime
from pathlib import Path

DATA_FILE = Path(__file__).parent / "tickets.json"

def load_tickets():
    if DATA_FILE.exists():
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    return []

def save_tickets(tickets):
    with open(DATA_FILE, "w") as f:
        json.dump(tickets, f, indent=2)

def generate_id(tickets):
    if not tickets:
        return "TKT-001"
    max_num = 0
    for t in tickets:
        try:
            num = int(t["id"].split("-")[1])
            if num > max_num:
                max_num = num
        except:
            pass
    return f"TKT-{max_num + 1:03d}"

def create_ticket(client, issue, priority="medium"):
    tickets = load_tickets()
    ticket = {
        "id": generate_id(tickets),
        "client": client,
        "issue": issue,
        "status": "open",
        "priority": priority.lower(),
        "created": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "resolved": None
    }
    tickets.append(ticket)
    save_tickets(tickets)
    print(f"✓ Created {ticket['id']} for {client}")

def list_tickets(status_filter=None):
    tickets = load_tickets()
    if status_filter:
        tickets = [t for t in tickets if t["status"] == status_filter]
    
    if not tickets:
        print("No tickets found.")
        return
    
    print(f"\n{'ID':<10} {'Client':<20} {'Issue':<30} {'Status':<10} {'Priority':<10} {'Created'}")
    print("-" * 100)
    for t in tickets:
        print(f"{t['id']:<10} {t['client']:<20} {t['issue'][:28]:<30} {t['status']:<10} {t['priority']:<10} {t['created']}")

def update_status(ticket_id, new_status):
    tickets = load_tickets()
    for t in tickets:
        if t["id"] == ticket_id:
            t["status"] = new_status
            if new_status == "resolved":
                t["resolved"] = datetime.now().strftime("%Y-%m-%d %H:%M")
            save_tickets(tickets)
            print(f"✓ Updated {ticket_id} to {new_status}")
            return
    print(f"✗ Ticket {ticket_id} not found")

def show_ticket(ticket_id):
    tickets = load_tickets()
    for t in tickets:
        if t["id"] == ticket_id:
            print(f"\n--- Ticket {t['id']} ---")
            print(f"Client:   {t['client']}")
            print(f"Issue:    {t['issue']}")
            print(f"Status:   {t['status']}")
            print(f"Priority: {t['priority']}")
            print(f"Created:  {t['created']}")
            if t['resolved']:
                print(f"Resolved: {t['resolved']}")
            return
    print(f"✗ Ticket {ticket_id} not found")

def delete_ticket(ticket_id):
    tickets = load_tickets()
    new_tickets = [t for t in tickets if t["id"] != ticket_id]
    if len(new_tickets) == len(tickets):
        print(f"✗ Ticket {ticket_id} not found")
        return
    save_tickets(new_tickets)
    print(f"✓ Deleted {ticket_id}")

def main():
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: ticket-tracker.py <command> [args]")
        print("\nCommands:")
        print("  create <client> <issue> [priority]  Create new ticket")
        print("  list [open|resolved]                List tickets (optional status filter)")
        print("  show <id>                           Show ticket details")
        print("  update <id> <status>                Update ticket status (open/in-progress/resolved)")
        print("  delete <id>                         Delete ticket")
        print("\nPriorities: low, medium, high, critical")
        return
    
    cmd = sys.argv[1]
    
    if cmd == "create" and len(sys.argv) >= 4:
        client = sys.argv[2]
        issue = sys.argv[3]
        priority = sys.argv[4] if len(sys.argv) > 4 else "medium"
        create_ticket(client, issue, priority)
    elif cmd == "list":
        status = sys.argv[2] if len(sys.argv) > 2 else None
        list_tickets(status)
    elif cmd == "show" and len(sys.argv) >= 3:
        show_ticket(sys.argv[2])
    elif cmd == "update" and len(sys.argv) >= 4:
        update_status(sys.argv[2], sys.argv[3])
    elif cmd == "delete" and len(sys.argv) >= 3:
        delete_ticket(sys.argv[2])
    else:
        print("Invalid command. Run without args for usage.")

if __name__ == "__main__":
    main()
