"""
MSP Ticketing Automator - Tech & Electrical Services LLC
Flask + SQLite backend with full ticketing features
"""

import os
import json
import logging
from datetime import datetime, timedelta
from flask import Flask, render_template, request, redirect, url_for, jsonify, flash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_

# ─────────────────────────────────────────────
# App Setup
# ─────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOG_DIR = os.path.join(BASE_DIR, "logs")
os.makedirs(LOG_DIR, exist_ok=True)

app = Flask(__name__)
app.secret_key = "tes-llc-secret-key-2026"
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(BASE_DIR, 'instance', 'tickets.db')}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# ─────────────────────────────────────────────
# Notification Logger (simulated email)
# ─────────────────────────────────────────────
notif_log = os.path.join(LOG_DIR, "notifications.log")
logging.basicConfig(level=logging.INFO)
notif_logger = logging.getLogger("notifications")
fh = logging.FileHandler(notif_log)
fh.setFormatter(logging.Formatter("%(asctime)s | %(message)s"))
notif_logger.addHandler(fh)

def send_notification(to: str, subject: str, body: str):
    msg = f"TO: {to} | SUBJECT: {subject} | BODY: {body}"
    notif_logger.info(msg)

# ─────────────────────────────────────────────
# Constants
# ─────────────────────────────────────────────
CATEGORIES = ["IT Support", "Electrical", "Cybersecurity", "Hardware Repair", "Software"]
PRIORITIES = ["Critical", "High", "Medium", "Low"]
STATUSES   = ["Open", "In Progress", "Pending", "Resolved", "Closed"]

# SLA response targets (hours)
SLA_RESPONSE = {"Critical": 1, "High": 4, "Medium": 8, "Low": 24}
SLA_RESOLVE  = {"Critical": 4, "High": 24, "Medium": 72, "Low": 168}

# Auto-routing: category → default assignee
ROUTING = {
    "IT Support":      "team@tes-llc.com",
    "Electrical":      "electrical@tes-llc.com",
    "Cybersecurity":   "cyber@tes-llc.com",
    "Hardware Repair": "hardware@tes-llc.com",
    "Software":        "dev@tes-llc.com",
}

TEAM_MEMBERS = [
    "Irvin Avitia",
    "IT Team",
    "Electrical Team",
    "Cyber Team",
    "Hardware Team",
    "Dev Team",
    "Unassigned",
]

# ─────────────────────────────────────────────
# Models
# ─────────────────────────────────────────────
class Ticket(db.Model):
    __tablename__ = "tickets"

    id           = db.Column(db.Integer, primary_key=True)
    ticket_id    = db.Column(db.String(20), unique=True, nullable=False)
    title        = db.Column(db.String(200), nullable=False)
    description  = db.Column(db.Text, nullable=False)
    category     = db.Column(db.String(50), nullable=False)
    priority     = db.Column(db.String(20), nullable=False, default="Medium")
    status       = db.Column(db.String(30), nullable=False, default="Open")
    assigned_to  = db.Column(db.String(100), default="Unassigned")
    client_name  = db.Column(db.String(100), nullable=False)
    client_email = db.Column(db.String(150), nullable=False)
    created_at   = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at   = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    sla_response_due = db.Column(db.DateTime)
    sla_resolve_due  = db.Column(db.DateTime)
    resolved_at  = db.Column(db.DateTime)

    activities = db.relationship("Activity", backref="ticket", lazy=True, cascade="all, delete-orphan")

    def sla_response_breached(self):
        if self.status in ["Resolved", "Closed"]:
            return False
        return datetime.utcnow() > self.sla_response_due if self.sla_response_due else False

    def sla_resolve_breached(self):
        if self.status in ["Resolved", "Closed"]:
            return False
        return datetime.utcnow() > self.sla_resolve_due if self.sla_resolve_due else False

    def sla_status(self):
        if self.sla_resolve_breached():
            return "breached"
        if self.sla_response_breached():
            return "warning"
        return "ok"

    def to_dict(self):
        return {
            "id": self.id,
            "ticket_id": self.ticket_id,
            "title": self.title,
            "description": self.description,
            "category": self.category,
            "priority": self.priority,
            "status": self.status,
            "assigned_to": self.assigned_to,
            "client_name": self.client_name,
            "client_email": self.client_email,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "sla_response_due": self.sla_response_due.isoformat() if self.sla_response_due else None,
            "sla_resolve_due": self.sla_resolve_due.isoformat() if self.sla_resolve_due else None,
            "sla_status": self.sla_status(),
        }


class Activity(db.Model):
    __tablename__ = "activities"

    id         = db.Column(db.Integer, primary_key=True)
    ticket_id  = db.Column(db.Integer, db.ForeignKey("tickets.id"), nullable=False)
    action     = db.Column(db.String(100), nullable=False)
    note       = db.Column(db.Text)
    actor      = db.Column(db.String(100), default="System")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "action": self.action,
            "note": self.note,
            "actor": self.actor,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


# ─────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────
def generate_ticket_id():
    today = datetime.utcnow().strftime("%Y%m%d")
    count = Ticket.query.filter(Ticket.ticket_id.like(f"TKT-{today}-%")).count()
    return f"TKT-{today}-{count+1:04d}"


def log_activity(ticket: Ticket, action: str, note: str = "", actor: str = "System"):
    act = Activity(ticket_id=ticket.id, action=action, note=note, actor=actor)
    db.session.add(act)


def calculate_sla(ticket: Ticket):
    now = datetime.utcnow()
    ticket.sla_response_due = now + timedelta(hours=SLA_RESPONSE[ticket.priority])
    ticket.sla_resolve_due  = now + timedelta(hours=SLA_RESOLVE[ticket.priority])


# ─────────────────────────────────────────────
# Routes — Dashboard
# ─────────────────────────────────────────────
@app.route("/")
def dashboard():
    query = Ticket.query

    # Filters
    status_f   = request.args.get("status", "")
    category_f = request.args.get("category", "")
    priority_f = request.args.get("priority", "")
    search_q   = request.args.get("q", "").strip()

    if status_f:
        query = query.filter(Ticket.status == status_f)
    if category_f:
        query = query.filter(Ticket.category == category_f)
    if priority_f:
        query = query.filter(Ticket.priority == priority_f)
    if search_q:
        query = query.filter(
            or_(
                Ticket.ticket_id.ilike(f"%{search_q}%"),
                Ticket.title.ilike(f"%{search_q}%"),
                Ticket.client_name.ilike(f"%{search_q}%"),
                Ticket.client_email.ilike(f"%{search_q}%"),
            )
        )

    tickets = query.order_by(Ticket.created_at.desc()).all()

    # Stats
    stats = {
        "total":       Ticket.query.count(),
        "open":        Ticket.query.filter_by(status="Open").count(),
        "in_progress": Ticket.query.filter_by(status="In Progress").count(),
        "pending":     Ticket.query.filter_by(status="Pending").count(),
        "resolved":    Ticket.query.filter_by(status="Resolved").count(),
        "closed":      Ticket.query.filter_by(status="Closed").count(),
        "critical":    Ticket.query.filter_by(priority="Critical").count(),
    }

    return render_template(
        "dashboard.html",
        tickets=tickets,
        stats=stats,
        categories=CATEGORIES,
        priorities=PRIORITIES,
        statuses=STATUSES,
        filters={
            "status": status_f,
            "category": category_f,
            "priority": priority_f,
            "q": search_q,
        },
        now=datetime.utcnow(),
    )


# ─────────────────────────────────────────────
# Routes — Submit Ticket (Client Portal)
# ─────────────────────────────────────────────
@app.route("/submit", methods=["GET", "POST"])
def submit_ticket():
    if request.method == "POST":
        title        = request.form.get("title", "").strip()
        description  = request.form.get("description", "").strip()
        category     = request.form.get("category", "IT Support")
        priority     = request.form.get("priority", "Medium")
        client_name  = request.form.get("client_name", "").strip()
        client_email = request.form.get("client_email", "").strip()

        if not all([title, description, client_name, client_email]):
            flash("All fields are required.", "error")
            return redirect(url_for("submit_ticket"))

        if category not in CATEGORIES:
            category = "IT Support"
        if priority not in PRIORITIES:
            priority = "Medium"

        # Auto-route
        assigned_email = ROUTING.get(category, "team@tes-llc.com")
        assigned_to    = {
            "IT Support":      "IT Team",
            "Electrical":      "Electrical Team",
            "Cybersecurity":   "Cyber Team",
            "Hardware Repair": "Hardware Team",
            "Software":        "Dev Team",
        }.get(category, "Unassigned")

        ticket = Ticket(
            ticket_id    = generate_ticket_id(),
            title        = title,
            description  = description,
            category     = category,
            priority     = priority,
            status       = "Open",
            assigned_to  = assigned_to,
            client_name  = client_name,
            client_email = client_email,
        )
        calculate_sla(ticket)
        db.session.add(ticket)
        db.session.flush()  # get ticket.id before logging

        log_activity(ticket, "Ticket Created",
                     f"Auto-routed to {assigned_to} | SLA: respond by {ticket.sla_response_due.strftime('%Y-%m-%d %H:%M')} UTC",
                     actor="System")

        db.session.commit()

        # Simulated email notifications
        send_notification(
            to=client_email,
            subject=f"[{ticket.ticket_id}] Ticket Received - {title}",
            body=(f"Hi {client_name}, your ticket has been received and assigned to {assigned_to}. "
                  f"Priority: {priority}. We'll respond within {SLA_RESPONSE[priority]}h.")
        )
        send_notification(
            to=assigned_email,
            subject=f"[{ticket.ticket_id}] New {priority} Ticket - {title}",
            body=(f"New ticket assigned to you from {client_name} ({client_email}). "
                  f"Category: {category} | Priority: {priority}. "
                  f"SLA Response Due: {ticket.sla_response_due.strftime('%Y-%m-%d %H:%M')} UTC")
        )

        flash(f"Ticket {ticket.ticket_id} submitted successfully!", "success")
        return redirect(url_for("ticket_detail", ticket_id=ticket.ticket_id))

    return render_template("submit.html", categories=CATEGORIES, priorities=PRIORITIES)


# ─────────────────────────────────────────────
# Routes — Ticket Detail
# ─────────────────────────────────────────────
@app.route("/ticket/<ticket_id>")
def ticket_detail(ticket_id):
    ticket = Ticket.query.filter_by(ticket_id=ticket_id).first_or_404()
    activities = Activity.query.filter_by(ticket_id=ticket.id).order_by(Activity.created_at.asc()).all()
    return render_template(
        "ticket_detail.html",
        ticket=ticket,
        activities=activities,
        statuses=STATUSES,
        team_members=TEAM_MEMBERS,
        priorities=PRIORITIES,
        sla_response=SLA_RESPONSE,
        sla_resolve=SLA_RESOLVE,
        now=datetime.utcnow(),
    )


# ─────────────────────────────────────────────
# Routes — Update Ticket (AJAX or form)
# ─────────────────────────────────────────────
@app.route("/ticket/<ticket_id>/update", methods=["POST"])
def update_ticket(ticket_id):
    ticket = Ticket.query.filter_by(ticket_id=ticket_id).first_or_404()
    data = request.get_json() or request.form.to_dict()
    actor = data.get("actor", "Technician")

    changed = []

    if "status" in data and data["status"] in STATUSES:
        old = ticket.status
        ticket.status = data["status"]
        if ticket.status == "Resolved" and old != "Resolved":
            ticket.resolved_at = datetime.utcnow()
        changed.append(f"Status: {old} → {ticket.status}")

    if "assigned_to" in data and data["assigned_to"] in TEAM_MEMBERS:
        old = ticket.assigned_to
        ticket.assigned_to = data["assigned_to"]
        changed.append(f"Assigned: {old} → {ticket.assigned_to}")
        send_notification(
            to=ROUTING.get(ticket.category, "team@tes-llc.com"),
            subject=f"[{ticket.ticket_id}] Ticket Reassigned to {ticket.assigned_to}",
            body=f"Ticket {ticket.ticket_id} has been reassigned from {old} to {ticket.assigned_to}."
        )

    if "priority" in data and data["priority"] in PRIORITIES:
        old = ticket.priority
        ticket.priority = data["priority"]
        if old != ticket.priority:
            calculate_sla(ticket)
        changed.append(f"Priority: {old} → {ticket.priority}")

    if changed:
        ticket.updated_at = datetime.utcnow()
        note = data.get("note", "") or ", ".join(changed)
        log_activity(ticket, "Ticket Updated", note, actor=actor)

    # Add a standalone note
    if "note_only" in data and data["note_only"].strip():
        log_activity(ticket, "Note Added", data["note_only"].strip(), actor=actor)

    db.session.commit()

    if request.is_json:
        return jsonify({"success": True, "ticket": ticket.to_dict()})
    flash("Ticket updated.", "success")
    return redirect(url_for("ticket_detail", ticket_id=ticket_id))


# ─────────────────────────────────────────────
# Routes — Add Note
# ─────────────────────────────────────────────
@app.route("/ticket/<ticket_id>/note", methods=["POST"])
def add_note(ticket_id):
    ticket = Ticket.query.filter_by(ticket_id=ticket_id).first_or_404()
    note   = (request.form.get("note") or "").strip()
    actor  = (request.form.get("actor") or "Technician").strip()
    if note:
        log_activity(ticket, "Note Added", note, actor=actor)
        db.session.commit()
        flash("Note added.", "success")
    return redirect(url_for("ticket_detail", ticket_id=ticket_id))


# ─────────────────────────────────────────────
# Routes — API endpoints
# ─────────────────────────────────────────────
@app.route("/api/tickets")
def api_tickets():
    tickets = Ticket.query.order_by(Ticket.created_at.desc()).all()
    return jsonify([t.to_dict() for t in tickets])


@app.route("/api/tickets/<ticket_id>")
def api_ticket(ticket_id):
    ticket = Ticket.query.filter_by(ticket_id=ticket_id).first_or_404()
    data = ticket.to_dict()
    data["activities"] = [a.to_dict() for a in ticket.activities]
    return jsonify(data)


@app.route("/api/stats")
def api_stats():
    total = Ticket.query.count()
    by_status = {}
    for s in STATUSES:
        by_status[s] = Ticket.query.filter_by(status=s).count()
    by_priority = {}
    for p in PRIORITIES:
        by_priority[p] = Ticket.query.filter_by(priority=p).count()
    by_category = {}
    for c in CATEGORIES:
        by_category[c] = Ticket.query.filter_by(category=c).count()
    return jsonify({
        "total": total,
        "by_status": by_status,
        "by_priority": by_priority,
        "by_category": by_category,
    })


# ─────────────────────────────────────────────
# Routes — Delete Ticket (admin)
# ─────────────────────────────────────────────
@app.route("/ticket/<ticket_id>/delete", methods=["POST"])
def delete_ticket(ticket_id):
    ticket = Ticket.query.filter_by(ticket_id=ticket_id).first_or_404()
    db.session.delete(ticket)
    db.session.commit()
    flash(f"Ticket {ticket_id} deleted.", "info")
    return redirect(url_for("dashboard"))


# ─────────────────────────────────────────────
# Init DB + Seed
# ─────────────────────────────────────────────
def seed_demo_data():
    if Ticket.query.count() > 0:
        return
    demos = [
        ("Firewall not blocking malicious IPs", "Our perimeter firewall is allowing traffic from known bad IPs despite updated rules.", "Cybersecurity", "Critical", "Acme Corp", "security@acme.com"),
        ("Outlet sparking in server room", "3-phase outlet near rack B is arcing when servers are at peak load.", "Electrical", "Critical", "DataVault Inc", "facilities@datavault.com"),
        ("Laptop won't boot after Windows update", "Windows 11 update bricked the boot sector on a Dell XPS 15.", "IT Support", "High", "Smith Consulting", "bob@smithco.com"),
        ("Micro-solder GPU RAM chip on RTX 4090", "One memory die on RTX 4090 is dead. Need board-level repair.", "Hardware Repair", "Medium", "Gaming Studio X", "hardware@gsx.com"),
        ("Custom inventory app crashing on save", "Python Flask app throws 500 on POST /items when description exceeds 200 chars.", "Software", "High", "RetailPro LLC", "dev@retailpro.com"),
        ("Wi-Fi drops every 30 min in warehouse", "802.11ac AP loses association every 30 minutes. DHCP lease issue suspected.", "IT Support", "Medium", "Logistics Co", "it@logisticsco.com"),
        ("Panel upgrade to 200A for new CNC machine", "Existing 100A panel insufficient for 3 new CNC machines being installed.", "Electrical", "High", "Metal Works Inc", "ops@metalworks.com"),
    ]
    for i, (title, desc, cat, pri, cname, cemail) in enumerate(demos):
        statuses_demo = ["Open", "In Progress", "Open", "Pending", "In Progress", "Resolved", "Open"]
        t = Ticket(
            ticket_id    = f"TKT-20260319-{i+1:04d}",
            title        = title,
            description  = desc,
            category     = cat,
            priority     = pri,
            status       = statuses_demo[i],
            assigned_to  = {"IT Support": "IT Team", "Electrical": "Electrical Team",
                            "Cybersecurity": "Cyber Team", "Hardware Repair": "Hardware Team",
                            "Software": "Dev Team"}.get(cat, "Unassigned"),
            client_name  = cname,
            client_email = cemail,
            created_at   = datetime.utcnow() - timedelta(hours=24 - i * 3),
        )
        calculate_sla(t)
        if t.status == "Resolved":
            t.resolved_at = datetime.utcnow() - timedelta(hours=1)
        db.session.add(t)
        db.session.flush()
        log_activity(t, "Ticket Created",
                     f"Auto-routed to {t.assigned_to} | Priority: {t.priority}", actor="System")
        if t.status == "In Progress":
            log_activity(t, "Status Changed", "Open → In Progress", actor="Technician")
        if t.status == "Resolved":
            log_activity(t, "Status Changed", "In Progress → Resolved", actor="IT Team")
            log_activity(t, "Note Added", "Issue resolved after DHCP lease time reduced to 15 min.", actor="IT Team")
    db.session.commit()


with app.app_context():
    db.create_all()
    seed_demo_data()


if __name__ == "__main__":
    print("🎫 TES LLC Ticketing System — http://127.0.0.1:5000")
    app.run(debug=True, host="0.0.0.0", port=5000)
