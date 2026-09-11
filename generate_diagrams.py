import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

os.makedirs("docs_assets", exist_ok=True)

# 1. ARCHITECTURE DIAGRAM
fig, ax = plt.subplots(figsize=(11, 6), dpi=200)
ax.set_xlim(0, 11)
ax.set_ylim(0, 6)
ax.axis('off')

# Title
ax.text(5.5, 5.6, "System Architecture: Mini ERP + CRM Operations Portal", 
        fontsize=15, fontweight='bold', ha='center', color='#102a22', fontfamily='sans-serif')
ax.text(5.5, 5.25, "Client (React/TS) <---> REST API (Express/TS) <---> Database (Neon PostgreSQL)", 
        fontsize=10, ha='center', color='#65756d', fontfamily='sans-serif')

def draw_box(ax, x, y, w, h, title, subtitle, items, bg_color, border_color):
    box = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.15", 
                                 facecolor=bg_color, edgecolor=border_color, linewidth=2)
    ax.add_patch(box)
    ax.text(x + w/2, y + h - 0.35, title, fontsize=11, fontweight='bold', ha='center', color='#102a22', fontfamily='sans-serif')
    if subtitle:
        ax.text(x + w/2, y + h - 0.6, subtitle, fontsize=8.5, fontstyle='italic', ha='center', color='#4b5563', fontfamily='sans-serif')
    start_y = y + h - 0.95
    for item in items:
        ax.text(x + 0.2, start_y, item, fontsize=8.5, ha='left', color='#1f2937', fontfamily='sans-serif')
        start_y -= 0.28

# Frontend Box
draw_box(ax, 0.5, 1.2, 2.8, 3.6, "Frontend Client Tier", "React 18 + Vite + TypeScript", 
         ["• Single Page App (SPA)", "• Lucide Enterprise Icons", "• Role-Based Views (4 Roles)", 
          "• Dynamic Multi-Item Challan", "• Customer CRM & Follow-ups", "• Low-Stock Alerts & Restock", 
          "• Print / PDF Tax Invoices", "• Responsive Dark/Light Shell"], 
         "#e6f4ea", "#196f50")

# Backend Box
draw_box(ax, 4.1, 1.2, 2.8, 3.6, "Backend API Tier", "Node.js 24 + Express + TS", 
         ["• RESTful Endpoints (CRUD)", "• Stateless JWT Auth (Bcrypt)", "• express-validator Rules", 
          "• Role Guard Middleware", "• Row Locks (FOR UPDATE)", "• Negative Stock Protection", 
          "• Atomic Challan Confirm", "• Centralized Error Handling"], 
         "#ede9fe", "#7c3aed")

# Database Box
draw_box(ax, 7.7, 1.2, 2.8, 3.6, "Database Tier", "PostgreSQL (Neon Cloud AWS)", 
         ["• Connection Pool (pg-pool)", "• ACID Transactions", "• Historical Item Snapshots", 
          "• Foreign Key Cascades", "• Immutable Audit Movement Log", "• Multi-Role User Records", 
          "• 7 Normalized Relations", "• High Availability Cloud SLA"], 
         "#e0f2fe", "#0284c7")

# Arrows
ax.annotate("", xy=(4.0, 3.0), xytext=(3.4, 3.0), arrowprops=dict(arrowstyle="<->", color="#196f50", lw=2.5))
ax.text(3.7, 3.2, "JSON\nREST", fontsize=8, fontweight='bold', ha='center', color="#196f50")

ax.annotate("", xy=(7.6, 3.0), xytext=(7.0, 3.0), arrowprops=dict(arrowstyle="<->", color="#7c3aed", lw=2.5))
ax.text(7.3, 3.2, "SQL\nQueries", fontsize=8, fontweight='bold', ha='center', color="#7c3aed")

# Bottom DevOps Ribbon
devops_box = patches.FancyBboxPatch((0.5, 0.2), 10.0, 0.7, boxstyle="round,pad=0.1", 
                                    facecolor="#fef3c7", edgecolor="#d97706", linewidth=1.5)
ax.add_patch(devops_box)
ax.text(5.5, 0.52, "DevOps & Deployment Infrastructure: Docker Compose | GitHub Actions CI/CD | Render Cloud Web Hosting", 
        fontsize=9, fontweight='bold', ha='center', color="#92400e")

plt.tight_layout()
plt.savefig("docs_assets/architecture_diagram.png", bbox_inches='tight')
plt.close()

# 2. DATABASE ERD DIAGRAM
fig, ax = plt.subplots(figsize=(11, 7), dpi=200)
ax.set_xlim(0, 11)
ax.set_ylim(0, 7)
ax.axis('off')

ax.text(5.5, 6.6, "Relational Database Schema & Data Integrity Design (ERD)", 
        fontsize=14, fontweight='bold', ha='center', color='#102a22')

def draw_table_card(ax, x, y, w, h, table_name, columns, header_color):
    card = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.08", 
                                  facecolor="#ffffff", edgecolor=header_color, linewidth=1.8)
    ax.add_patch(card)
    hdr = patches.FancyBboxPatch((x, y + h - 0.45), w, 0.45, boxstyle="round,pad=0.08", 
                                facecolor=header_color, edgecolor=header_color)
    ax.add_patch(hdr)
    ax.text(x + w/2, y + h - 0.25, table_name, fontsize=9.5, fontweight='bold', ha='center', color="#ffffff")
    start_y = y + h - 0.7
    for col in columns:
        ax.text(x + 0.15, start_y, col, fontsize=8, ha='left', color="#374151")
        start_y -= 0.23

# Draw Tables
draw_table_card(ax, 0.4, 3.8, 2.2, 2.4, "users", 
                ["PK id: SERIAL", "name: VARCHAR(100)", "email: VARCHAR (UNIQUE)", "password_hash: TEXT", "role: ENUM (4 roles)", "created_at: TIMESTAMPTZ"], 
                "#7c3aed")

draw_table_card(ax, 3.1, 3.6, 2.3, 2.7, "customers", 
                ["PK id: SERIAL", "name: VARCHAR(150)", "mobile: VARCHAR(20)", "email: VARCHAR(255)", "business_name: VARCHAR", "gst_number: VARCHAR", "customer_type: ENUM", "status: Lead/Active/Inact", "follow_up_date: DATE"], 
                "#196f50")

draw_table_card(ax, 5.8, 3.8, 2.3, 2.4, "customer_followups", 
                ["PK id: SERIAL", "FK customer_id -> customers", "note: TEXT", "follow_up_date: DATE", "FK created_by -> users", "created_at: TIMESTAMPTZ"], 
                "#059669")

draw_table_card(ax, 8.4, 3.6, 2.2, 2.7, "products", 
                ["PK id: SERIAL", "name: VARCHAR(150)", "sku: VARCHAR (UNIQUE)", "category: VARCHAR(100)", "unit_price: NUMERIC(12,2)", "current_stock: INT (>= 0)", "min_stock_alert: INT", "warehouse_location: VARCHAR"], 
                "#d97706")

draw_table_card(ax, 1.8, 0.5, 2.4, 2.4, "challans", 
                ["PK id: SERIAL", "challan_number: VARCHAR (UNQ)", "FK customer_id -> customers", "total_quantity: INT", "status: Draft/Confirmed", "FK created_by -> users", "created_at: TIMESTAMPTZ"], 
                "#0284c7")

draw_table_card(ax, 5.0, 0.4, 2.6, 2.6, "challan_items (Snapshot)", 
                ["PK id: SERIAL", "FK challan_id -> challans", "FK product_id -> products", "product_name: VARCHAR (Snap)", "sku: VARCHAR (Snap)", "unit_price: NUMERIC (Snap)", "quantity: INT (> 0)"], 
                "#0369a1")

draw_table_card(ax, 8.2, 0.5, 2.4, 2.4, "stock_movements (Audit)", 
                ["PK id: SERIAL", "FK product_id -> products", "quantity_changed: INT (> 0)", "movement_type: IN / OUT", "reason: TEXT", "FK created_by -> users", "created_at: TIMESTAMPTZ"], 
                "#dc2626")

plt.tight_layout()
plt.savefig("docs_assets/database_erd.png", bbox_inches='tight')
plt.close()

# 3. TRANSACTION CONCURRENCY FLOW DIAGRAM
fig, ax = plt.subplots(figsize=(10, 5), dpi=200)
ax.set_xlim(0, 10)
ax.set_ylim(0, 5)
ax.axis('off')

ax.text(5.0, 4.6, "Concurrency & Transaction Safety Workflow (Challan Confirmation)", 
        fontsize=13, fontweight='bold', ha='center', color='#102a22')

steps = [
    ("1. BEGIN Transaction", "Acquire PostgreSQL client from pool", "#f3f4f6", "#4b5563"),
    ("2. Row Lock FOR UPDATE", "Lock target product rows to block concurrent race conditions", "#ede9fe", "#7c3aed"),
    ("3. Stock Validation", "Verify current_stock >= quantity. If fail -> ROLLBACK & 409", "#fee2e2", "#dc2626"),
    ("4. Snapshot & Deduct", "Save item price snapshot & atomic UPDATE current_stock", "#e0f2fe", "#0284c7"),
    ("5. Write Audit & COMMIT", "Insert OUT log in stock_movements & COMMIT transaction", "#dcfce7", "#15803d")
]

x_pos = 0.4
for title, desc, bg, border in steps:
    box = patches.FancyBboxPatch((x_pos, 1.2), 1.6, 2.6, boxstyle="round,pad=0.1", facecolor=bg, edgecolor=border, lw=2)
    ax.add_patch(box)
    ax.text(x_pos + 0.8, 3.4, title, fontsize=9, fontweight='bold', ha='center', color='#111827', wrap=True)
    ax.text(x_pos + 0.8, 2.2, desc, fontsize=8, ha='center', color='#374151', wrap=True)
    if x_pos < 7.0:
        ax.annotate("", xy=(x_pos + 1.85, 2.5), xytext=(x_pos + 1.65, 2.5), arrowprops=dict(arrowstyle="->", color="#1f2937", lw=2))
    x_pos += 1.9

plt.tight_layout()
plt.savefig("docs_assets/transaction_concurrency_flow.png", bbox_inches='tight')
plt.close()

# 4. RBAC MATRIX
fig, ax = plt.subplots(figsize=(10, 4.5), dpi=200)
ax.set_xlim(0, 10)
ax.set_ylim(0, 4.5)
ax.axis('off')

ax.text(5.0, 4.1, "Role-Based Access Control (RBAC) Permission Matrix", 
        fontsize=13, fontweight='bold', ha='center', color='#102a22')

table_data = [
    ["Functional Module / Action", "Admin", "Sales", "Warehouse", "Accounts"],
    ["Customer CRM (Add / Edit / Detail)", "Full Access", "Full Access", "Read-Only", "Read-Only"],
    ["Customer Follow-Up Logging", "Full Access", "Full Access", "Forbidden", "Read-Only"],
    ["Products Catalog (Add / Edit)", "Full Access", "Read-Only", "Full Access", "Read-Only"],
    ["Inventory Quick Restock", "Full Access", "Forbidden", "Full Access", "Forbidden"],
    ["Sales Challan (Create Multi-item)", "Full Access", "Full Access", "Forbidden", "Read-Only"],
    ["Confirm Challan & Stock Deduct", "Full Access", "Full Access", "Forbidden", "Forbidden"],
    ["Stock Audit Trail (IN / OUT Logs)", "Full Access", "Read-Only", "Full Access", "Read-Only"],
    ["Team Member Role Reassignment", "Admin Exclusive", "Forbidden", "Forbidden", "Forbidden"]
]

tab = ax.table(cellText=table_data, loc='center', cellLoc='center')
tab.auto_set_font_size(False)
tab.set_fontsize(8.5)
tab.scale(1, 1.45)

for (row, col), cell in tab.get_celld().items():
    if row == 0:
        cell.set_facecolor('#102a22')
        cell.get_text().set_color('#ffffff')
        cell.get_text().set_weight('bold')
    elif col == 1:
        cell.set_facecolor('#ede9fe')
        cell.get_text().set_weight('bold')
    elif col == 0:
        cell.set_facecolor('#f9fafb')
        cell.get_text().set_weight('bold')
        cell.get_text().set_ha('left')
    else:
        text = cell.get_text().get_text()
        if text == "Full Access":
            cell.set_facecolor('#dcfce7')
            cell.get_text().set_color('#15803d')
        elif text == "Forbidden":
            cell.set_facecolor('#fee2e2')
            cell.get_text().set_color('#991b1b')
        elif text == "Read-Only":
            cell.set_facecolor('#f0f9ff')
            cell.get_text().set_color('#0369a1')

plt.tight_layout()
plt.savefig("docs_assets/rbac_matrix.png", bbox_inches='tight')
plt.close()

print("All 4 visual diagrams created successfully in docs_assets/")
