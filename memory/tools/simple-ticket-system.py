#!/usr/bin/env python3
"""
Simple Ticket System for Irvin's Tech Business
"""
import json
import os
from datetime import datetime

TICKET_FILE = "tickets.json"

def load_tickets():
    if os.path.exists(TICKET_FILE):
        with open(TICKET_FILE, 'r') as f:
            return json.load(f)
    return []

def save_tickets(tickets):
    with open(TICKET_FILE, 'w') as f:
        json.dump(tickets, f, indent=2)

def create_ticket(client, issue, priority="medium"):
    tickets = load_tickets()
    ticket_id = f"TKT-{len(tickets)+1:03d}"
    ticket = {
        "id": ticket_id,
        "client": client,
        "issue": issue,
        "priority": priority,
        "status": "open",
        "created": datetime.now().isoformat(),
        "resolved": None
    }
    tickets.append(ticket)
    save_tickets(tickets)
    print(f"Created ticket {ticket_id}")

def list_tickets(status=None):
    tickets = load_tickets()
    for t in tickets:
        if status and t["status"] != status:
            continue
        print(f"{t['id']} | {t['client']} | {t['issue'][:40]} | {t['status']} | {t['priority']}")

def update_status(ticket_id, status):
    tickets = load_tickets()
    for t in tickets:
        if t["id"] == ticket_id:
            t["status"] = status
            if status == "resolved":
                t["resolved"] = datetime.now().isoformat()
            save_tickets(tickets)
            print(f"Updated {ticket_id} to {status}")
            return
    print(f"Ticket {ticket_id} not found")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: ticket.py [create|list|update]")
    elif sys.argv[1] == "create":
        create_ticket(sys.argv[2], sys.argv[3], sys.argv[4] if len(sys.argv) > 4 else "medium")
    elif sys.argv[1] == "list":
        list_tickets(sys.argv[2] if len(sys.argv) > 2 else None)
    elif sys.argv[1] == "update":
        update_status(sys.argv[2], sys.argv[3])
