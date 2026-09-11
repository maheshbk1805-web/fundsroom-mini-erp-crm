import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls
import os

doc = docx.Document()

# Page Margins
for section in doc.sections:
    section.top_margin = Inches(0.75)
    section.bottom_margin = Inches(0.75)
    section.left_margin = Inches(0.75)
    section.right_margin = Inches(0.75)

PRIMARY = RGBColor(16, 42, 34)       # Deep Forest Green #102a22
ACCENT = RGBColor(25, 111, 80)       # Fundsroom Green #196f50
PURPLE = RGBColor(124, 58, 237)      # Admin Purple #7c3aed
MUTED = RGBColor(100, 116, 109)      # Slate Green #64746d
DARK = RGBColor(23, 32, 29)          # Charcoal #17201d

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def add_heading_1(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(5)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = 'Calibri'
    run.font.size = Pt(15)
    run.font.bold = True
    run.font.color.rgb = PRIMARY
    return p

def add_heading_2(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = 'Calibri'
    run.font.size = Pt(12.5)
    run.font.bold = True
    run.font.color.rgb = ACCENT
    return p

def add_body(text, bold_prefix=""):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = 'Calibri'
        r_pre.font.size = Pt(10)
        r_pre.font.bold = True
        r_pre.font.color.rgb = DARK
    r = p.add_run(text)
    r.font.name = 'Calibri'
    r.font.size = Pt(10)
    r.font.color.rgb = DARK
    return p

def add_bullet(text, bold_prefix=""):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_before = Pt(1)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = 'Calibri'
        r_pre.font.size = Pt(9.5)
        r_pre.font.bold = True
        r_pre.font.color.rgb = DARK
    r = p.add_run(text)
    r.font.name = 'Calibri'
    r.font.size = Pt(9.5)
    r.font.color.rgb = DARK
    return p

def add_image_with_caption(img_path, caption, width_inches=6.2):
    if os.path.exists(img_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(8)
        p_img.paragraph_format.space_after = Pt(3)
        run = p_img.add_run()
        run.add_picture(img_path, width=Inches(width_inches))

        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(0)
        p_cap.paragraph_format.space_after = Pt(10)
        r_cap = p_cap.add_run(caption)
        r_cap.font.name = 'Calibri'
        r_cap.font.size = Pt(9)
        r_cap.font.italic = True
        r_cap.font.bold = True
        r_cap.font.color.rgb = MUTED

# ==================== HEADER & CANDIDATE PROFILE ====================
p_sup = doc.add_paragraph()
p_sup.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_sup.paragraph_format.space_after = Pt(1)
r_sup = p_sup.add_run("FUNDSROOM RECRUITMENT — ROUND 1 TECHNICAL CASE STUDY")
r_sup.font.name = 'Calibri'
r_sup.font.size = Pt(10)
r_sup.font.bold = True
r_sup.font.color.rgb = MUTED

p_title = doc.add_paragraph()
p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_title.paragraph_format.space_after = Pt(4)
r_title = p_title.add_run("Mini ERP + CRM Operations Portal\nFull-Stack Technical Solution & Architecture Report")
r_title.font.name = 'Calibri'
r_title.font.size = Pt(18)
r_title.font.bold = True
r_title.font.color.rgb = PRIMARY

# CANDIDATE PROFILE BOX TABLE
cand_table = doc.add_table(rows=5, cols=2)
cand_table.alignment = WD_TABLE_ALIGNMENT.CENTER
for r in cand_table.rows:
    for c in r.cells:
        c.vertical_alignment = WD_ALIGN_VERTICAL.CENTER

meta_fields = [
    ("Candidate Name:", "Mahesh B K"),
    ("University Roll Number:", "2023006427"),
    ("GITAM Official Email ID:", "mbk@gitam.in"),
    ("Personal Email ID:", "maheshbk1805@gmail.com"),
    ("GitHub Repository URL:", "https://github.com/maheshbk1805-web/fundsroom-mini-erp-crm")
]

for i, (k, v) in enumerate(meta_fields):
    row = cand_table.rows[i]
    cell_k, cell_v = row.cells[0], row.cells[1]
    set_cell_background(cell_k, "F0F4F2")
    set_cell_background(cell_v, "FFFFFF")
    
    p_k = cell_k.paragraphs[0]
    p_k.paragraph_format.space_after = Pt(2)
    p_k.paragraph_format.space_before = Pt(2)
    rk = p_k.add_run(k)
    rk.font.bold = True
    rk.font.size = Pt(9.5)
    rk.font.color.rgb = PRIMARY

    p_v = cell_v.paragraphs[0]
    p_v.paragraph_format.space_after = Pt(2)
    p_v.paragraph_format.space_before = Pt(2)
    rv = p_v.add_run(v)
    rv.font.size = Pt(9.5)
    rv.font.color.rgb = DARK
    if "https://" in v:
        rv.font.bold = True
        rv.font.color.rgb = ACCENT

doc.add_paragraph().paragraph_format.space_after = Pt(6)

# ==================== 1. EXECUTIVE SUMMARY ====================
add_heading_1("1. Executive Summary & Business Context")
add_body("This document presents the complete engineering solution for the Fundsroom Full Stack Developer Case Study: a production-grade Mini ERP + CRM Operations Portal developed for a wholesale distribution enterprise. The enterprise model requires coordinating client acquisition, catalog inventory with alert thresholds, tamper-evident stock movement logs, and sales delivery challans.")
add_body("Key engineering achievements in this submission include:")
add_bullet("Distinct, decoupled workspaces and login experiences for Executive Administrators versus Staff members (Sales, Warehouse, Accounts).", "• Role-Driven Architecture: ")
add_bullet("Atomic stock deduction with PostgreSQL row-level locks (SELECT ... FOR UPDATE), guaranteeing zero negative inventory and no race conditions.", "• Concurrency Safety: ")
add_bullet("Preserving product name, SKU, and unit price in challan_items to maintain historical accuracy regardless of future catalog changes.", "• Historical Snapshot Integrity: ")
add_bullet("Full containerization via Docker Compose, automated CI/CD via GitHub Actions, and browser-native PDF delivery note export.", "• Bonus Implementations: ")
add_bullet("I confirm my 100% availability for immediate joining in Pune, Maharashtra upon selection.", "• Immediate Joining Commitment: ")

# ==================== 2. TOOLS & TECHNOLOGIES USED ====================
add_heading_1("2. Tools & Technologies Used & How They Work")
add_body("The project leverages modern industry tools chosen specifically for speed, reliability, type safety, and scalability:")

tools_data = [
    ("React 18 & TypeScript", "Frontend Tier", "Provides a robust Single Page Application (SPA) architecture with strict type safety, modular component lifecycle management, and instant sub-second bundling with Vite."),
    ("Node.js 24 & Express.js", "Backend REST API", "Asynchronous, event-driven RESTful micro-service with express-validator validation pipelines, role authorization middleware, and centralized error handling."),
    ("PostgreSQL (Neon Cloud AWS)", "Database Tier", "Serverless PostgreSQL engine providing ACID transactional integrity, multi-client connection pooling, and row-level locking primitives."),
    ("JSON Web Tokens (JWT) & Bcrypt", "Security & Auth", "Stateless authentication using cryptographically signed JWT tokens with 24-hour expiration, paired with salted bcrypt hashing (10–12 salt rounds) for password storage."),
    ("Docker & Docker Compose", "Containerization (Bonus)", "Multi-stage Dockerfiles for backend (Node 22-alpine) and frontend (Nginx alpine) orchestrated via docker-compose.yml with local PostgreSQL networking."),
    ("GitHub Actions", "CI / CD Pipeline (Bonus)", "Automated continuous integration pipeline (.github/workflows/ci.yml) validating TypeScript compilation, linting, and production builds on push/PR."),
    ("Postman Collection", "API Testing (Bonus)", "Structured collection (postman/Fundsroom-ERP.postman_collection.json) covering 100% of REST endpoints across auth, CRM, products, and challans."),
    ("Render Cloud Hosting", "Cloud Deployment", "Configured for zero-downtime deployment on Render.com with single-service production serving (Express serving client/dist static build).")
]

t_table = doc.add_table(rows=1, cols=3)
t_table.alignment = WD_TABLE_ALIGNMENT.CENTER
for c in t_table.rows[0].cells:
    set_cell_background(c, "102A22")
    for p in c.paragraphs:
        for r in p.runs:
            r.font.bold = True
            r.font.color.rgb = RGBColor(255, 255, 255)
            r.font.size = Pt(9)

th = t_table.rows[0].cells
th[0].text = "Tool / Technology"
th[1].text = "Layer"
th[2].text = "How It Works & Business Value"

for tool, layer, desc in tools_data:
    row = t_table.add_row()
    row.cells[0].text = tool
    row.cells[1].text = layer
    row.cells[2].text = desc
    for i, c in enumerate(row.cells):
        for p in c.paragraphs:
            for r in p.runs:
                r.font.size = Pt(8.5)
                r.font.color.rgb = DARK
                if i == 0:
                    r.font.bold = True

# FIGURE 1: ARCHITECTURE
add_image_with_caption("docs_assets/architecture_diagram.png", "Figure 1: Full-Stack System Architecture (React Frontend, Express API, Neon PostgreSQL DB, and Docker/CI Infrastructure)")

# ==================== 3. DATABASE SCHEMA & DATA INTEGRITY ====================
add_heading_1("3. Database Schema & Data Integrity Design")
add_body("The database architecture is designed with 7 normalized tables, enforcing relational foreign key constraints, automatic timestamps, and check constraints to prevent invalid operational states:")
add_bullet("users: Stores employee credentials, salted password hashes, and strictly enumerated roles (Admin, Sales, Warehouse, Accounts).")
add_bullet("customers: Complete CRM records including business name, mobile, email, customer type (Retail/Wholesale/Distributor), status (Lead/Active/Inactive), follow-up date, and optional GSTIN.")
add_bullet("customer_followups: Chronological interaction history linked to customers with created_by employee foreign key.")
add_bullet("products: Catalog SKUs, categories, unit prices (NUMERIC 12,2), on-hand stock (CHECK >= 0), minimum alert thresholds, and warehouse location.")
add_bullet("stock_movements: Immutable audit trail tracking product, movement direction (IN/OUT), quantity changed (> 0), reason reference, and authorized employee.")
add_bullet("challans: Outbound delivery orders with unique formatted challan numbers (CH-YYYY-XXXXXX), customer relation, total items, and status (Draft/Confirmed/Cancelled).")
add_bullet("challan_items: Historical product snapshot preserving product name, SKU, and unit price at moment of sale.")

# FIGURE 2: DATABASE ERD
add_image_with_caption("docs_assets/database_erd.png", "Figure 2: Relational Database Entity Relationship Diagram (ERD) with Constraints & Snapshots")

# ==================== 4. CONCURRENCY & TRANSACTION SAFETY ====================
add_heading_1("4. Transaction Safety & Concurrency Control (Stock Safety)")
add_body("In high-volume wholesale distribution, race conditions during order placement can lead to inventory overselling or negative stock balances. OrbitOps solves this at the database engine level:")
add_bullet("When a sales challan is confirmed, Express initiates an atomic transaction using BEGIN.")
add_bullet("PostgreSQL Row-Level Locking: Executes SELECT current_stock FROM products WHERE id = $1 FOR UPDATE. This locks the specific product rows against concurrent modifications.")
add_bullet("Zero Negative Stock Check: If current_stock < requested_quantity, the transaction immediately executes ROLLBACK and returns HTTP 409 Conflict with an error message.")
add_bullet("Atomic Stock Decrement: Deducts on-hand inventory via UPDATE products SET current_stock = current_stock - $1 WHERE id = $2.")
add_bullet("Automatic Audit Log: Concurrently writes an OUT entry in stock_movements linked to the confirmed challan number.")
add_bullet("Atomic COMMIT commits all updates together, ensuring no partial or corrupted states.")

# FIGURE 3: CONCURRENCY WORKFLOW
add_image_with_caption("docs_assets/transaction_concurrency_flow.png", "Figure 3: Five-Step Atomic Transaction Workflow with PostgreSQL Row-Level Locking (FOR UPDATE)")

# ==================== 5. ROLE-BASED ACCESS CONTROL (ADMIN VS USER) ====================
add_heading_1("5. Role-Based Access Control: Admin vs. Staff Experience")
add_body("Per the prompt instructions, distinct workspaces and portals were engineered for Executive Administrators versus Department Staff:")

add_heading_2("A. Login Page Role Separation")
add_body("The sign-in interface features a Tabbed Entrance separating the Admin Portal from the Staff Workspace. Administrators enter through the purple Executive Portal, while staff select their respective department. One-click demo login buttons and a password visibility toggle (Eye icon) allow instant testing.")

add_heading_2("B. Executive Admin Portal Experience")
add_body("When logging in as Admin (admin@fundsroom.local):")
add_bullet("Executive Command Center: Dashboard displaying high-level operational health, inventory asset value, live low-stock warnings, and recent dispatches.")
add_bullet("Exclusive 'Team & Roles' Governance (/admin/users): Administrators have exclusive access to view all registered employees and dynamically reassign or promote roles (Admin, Sales, Warehouse, Accounts) via dropdowns.")
add_bullet("Unrestricted Access: Admin can perform all operations across CRM, Catalog, Restock, Dispatches, and Auditing.")

add_heading_2("C. Department Staff Workspaces (Sales, Warehouse, Accounts)")
add_body("When logging in as Staff:")
add_bullet("Sales (sales@fundsroom.local): Dedicated workspace for Customer CRM leads, follow-up scheduler, and multi-product Challan generation. Cannot modify warehouse stock directly.")
add_bullet("Warehouse (warehouse@fundsroom.local): Dedicated logistics workspace with on-hand inventory, low-stock alerts, 1-click Quick Restock, and goods inward logs. Cannot view customer CRM.")
add_bullet("Accounts (accounts@fundsroom.local): Read-only financial auditing workspace with delivery notes, GSTIN verification, and printable tax invoices.")

# FIGURE 4: RBAC PERMISSION MATRIX
add_image_with_caption("docs_assets/rbac_matrix.png", "Figure 4: Comprehensive Role-Based Access Control (RBAC) Permission Matrix across All 4 Roles")

# ==================== 6. SCREENSHOTS OF DEVELOPMENT & GITHUB ====================
add_heading_1("6. Development Environment & Repository Evidence")
add_body("The development environment in Visual Studio Code and the official GitHub repository setup are shown below:")

add_image_with_caption("docs_assets/vscode_workspace.png", "Figure 5: Local VS Code Workspace with Neon PostgreSQL Active Database Configuration (.env) & Monorepo Structure", width_inches=5.8)

add_image_with_caption("docs_assets/github_repo.png", "Figure 6: Official GitHub Repository Creation for fundsroom-mini-erp-crm (maheshbk1805-web)", width_inches=5.8)

# ==================== 7. PRE-SEEDED TEST CREDENTIALS ====================
add_heading_1("7. Verified Test Login Credentials")
add_body("All accounts are pre-seeded in the Neon Cloud database with password: ", "")
p_p = doc.add_paragraph()
r_p = p_p.add_run("Universal Password: Password@123")
r_p.font.bold = True
r_p.font.size = Pt(11)
r_p.font.color.rgb = ACCENT

cred_table = doc.add_table(rows=1, cols=4)
cred_table.alignment = WD_TABLE_ALIGNMENT.CENTER
for c in cred_table.rows[0].cells:
    set_cell_background(c, "196F50")
    for p in c.paragraphs:
        for r in p.runs:
            r.font.bold = True
            r.font.color.rgb = RGBColor(255, 255, 255)
            r.font.size = Pt(9)

ch = cred_table.rows[0].cells
ch[0].text = "Role"
ch[1].text = "Login Email"
ch[2].text = "Password"
ch[3].text = "Workspace Access Scope"

c_data = [
    ("Admin", "admin@fundsroom.local", "Password@123", "Executive full access: CRM, Inventory, Orders, Audit logs, and exclusive User Role Governance."),
    ("Sales", "sales@fundsroom.local", "Password@123", "Sales domain: Register clients, log follow-ups, draft and confirm multi-item delivery challans."),
    ("Warehouse", "warehouse@fundsroom.local", "Password@123", "Logistics domain: Manage catalog products, set reorder alert thresholds, 1-click Quick Restock."),
    ("Accounts", "accounts@fundsroom.local", "Password@123", "Auditing domain: Read-only operational visibility across all records and printable delivery invoices.")
]

for role, em, pw, scope in c_data:
    row = cred_table.add_row()
    row.cells[0].text = role
    row.cells[1].text = em
    row.cells[2].text = pw
    row.cells[3].text = scope
    for i, cell in enumerate(row.cells):
        for p in cell.paragraphs:
            for r in p.runs:
                r.font.size = Pt(8.5)
                r.font.color.rgb = DARK
                if i == 0:
                    r.font.bold = True

# ==================== 8. SCREEN RECORDING & SUBMISSION INSTRUCTIONS ====================
add_heading_1("8. Screen Recording & Google Form Submission Checklist")
add_body("Per the case study instructions, follow this exact procedure for the submission:")
add_bullet("Start your screen recorder (Windows Game Bar [Win + G], OBS Studio, or Loom).", "1. Screen Recording: ")
add_bullet("Demonstrate Admin login, Executive Command Center metrics, and the User Management page.", "2. Admin Flow: ")
add_bullet("Go to Customer CRM &rarr; Add customer with GSTIN &rarr; Open Profile &rarr; Log a follow-up note.", "3. CRM Flow: ")
add_bullet("Go to Inventory &rarr; Show low-stock alert badge &rarr; Click '+ Restock' to inward goods in 1 click.", "4. Inventory Flow: ")
add_bullet("Go to Sales Challans &rarr; Click 'New Challan' &rarr; Add multiple products &rarr; Create Confirmed &rarr; Show printable Tax Invoice.", "5. Challan Flow: ")
add_bullet("Go to Stock Audit Log &rarr; Show the automated OUT movement logged for the confirmed challan.", "6. Audit Log: ")
add_bullet("Sign out &rarr; Log in as Sales or Accounts to showcase the tailored role workspace.", "7. Role Switching: ")
add_bullet("Upload your video recording to Google Drive. Right-click &rarr; Share &rarr; Set General Access to 'Anyone with the link can view'.", "8. Drive Upload: ")
add_bullet("Submit the Google Form before 6:00 PM with your Drive link and this PDF document.", "9. Form Submission: ")

# ==================== 9. CONCLUSION & JOINING CONFIRMATION ====================
add_heading_1("9. Immediate Joining Commitment")
add_body("I, Mahesh B K, confirm my genuine interest and availability for immediate joining at Fundsroom in Pune, Maharashtra. I am fully comfortable with the Pune work location and look forward to clearing Rounds 2 and 3 and joining the organization without fail.")

output_docx = "Fundsroom_Full_Stack_Case_Study_Solution.docx"
doc.save(output_docx)
print(f"Document successfully saved: {output_docx}")
