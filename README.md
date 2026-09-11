# Fundsroom — Mini ERP + CRM Operations Portal

A complete, production-grade operations management portal built for a wholesale/distribution company. This portal unifies Customer Relationship Management (CRM), warehouse inventory & alert thresholds, immutable stock movement audit logs, and transaction-safe sales delivery challans.

---

## Quick Start (Run Locally)

The application is already initialized and configured with an active PostgreSQL database.

### 1. Prerequisites
- **Node.js**: v20+ (Tested on v24.21.0)
- **pnpm** or **npm** (included with Node.js)
- **PostgreSQL**: Neon Cloud PostgreSQL (already configured in `server/.env`)

### 2. Start Application
From the repository root (`fundsroom project`), run:
```bash
pnpm dev
# or
npm run dev
```

The terminal will launch:
- **Frontend Portal**: `http://localhost:5173`
- **Backend REST API**: `http://localhost:4000` (Health check: `http://localhost:4000/health`)

---

## Test Login Credentials

Every role is pre-seeded with the password: `Password@123`

| Role | Email | Permissions & Workspace Scope |
| :--- | :--- | :--- |
| **Admin** | `admin@fundsroom.local` | **Full access**: CRM, Inventory, Movements, Challans, and System administration. |
| **Sales** | `sales@fundsroom.local` | **Sales operations**: Add/edit customers, log follow-up notes, generate & confirm sales challans, view catalog. |
| **Warehouse** | `warehouse@fundsroom.local` | **Inventory & Logistics**: Add/edit catalog products, set min stock alerts, record manual inward/outward movements. |
| **Accounts** | `accounts@fundsroom.local` | **Financial Auditing**: Read-only access across all modules, printable challans, delivery notes, and activity logs. |

---

## Core Modules & Features

### 1. Authentication & Role-Based Access Control (RBAC)
- Clean JWT-based authentication with bcrypt password hashing (12 salt rounds).
- Role guards protecting mutating endpoints on the REST API.
- UI automatically adapts based on logged-in user role (disabling mutation actions for read-only accounts).

### 2. Customer CRM Module
- Comprehensive profile tracking: Name, Mobile, Email, Business Name, **GSTIN (GST Number)**, Customer Type (`Retail`, `Wholesale`, `Distributor`), Address, Status (`Lead`, `Active`, `Inactive`), Next follow-up date, and notes.
- **Search**: Case-insensitive filtering by customer name or company.
- **Customer Detail Drawer**: Full customer profile overview with complete chronological interaction history.
- **Follow-up Management**: Sales representatives can log call/meeting notes and reschedule the next follow-up date with a single click.

### 3. Product & Inventory Module
- Catalog management: Product name, unique SKU/code, category, unit price, opening stock, minimum stock alert threshold, and warehouse bay/location.
- **Low Stock Visual Badges**: Automatic visual warning tags (`LOW`) when on-hand stock falls below the defined minimum alert threshold.
- **Add & Edit Products**: In-place editing of catalog specifications and thresholds.

### 4. Stock Movement Audit Trail
- Immutable transaction log recording every stock change.
- Captures: Product name & SKU, movement direction (`IN` vs `OUT`), quantity changed, reason/source reference, employee who logged it, and precise timestamp.
- Automatic creation of `OUT` audit entries whenever a sales challan is confirmed.

### 5. Sales Challan Module & Transactional Integrity
- **Multi-Product Line Items**: Allows sales agents to dynamically add multiple product items per challan with live subtotal calculations and available inventory warnings.
- **Draft vs Confirmed**:
  - `Draft`: Saves the order draft without affecting warehouse stock.
  - `Confirmed`: Executes an atomic database transaction.
- **Concurrency & Transaction Safety**:
  - Employs PostgreSQL row-level locks (`SELECT ... FOR UPDATE`).
  - Guards against negative inventory balances (`current_stock < quantity` immediately aborts).
  - Returns `409 Conflict` with a descriptive message if stock is insufficient.
  - Atomically reduces product inventory and logs matching `OUT` movement logs.
- **Product Snapshot Preservation**:
  - The challan permanently stores the historical product name, SKU, and unit price in `challan_items` so future price adjustments or product changes never corrupt historical delivery records.
- **Invoice & Delivery Challan PDF Export**:
  - One-click print/export preview formatted as an official delivery note and tax invoice with GST details, company header, itemized pricing, and signatures.

---

## Bonus Features Completed

1. **Docker Setup**:
   - `docker-compose.yml` orchestrating PostgreSQL 16, Express API, and Nginx frontend.
   - Multi-stage `server/Dockerfile` and `client/Dockerfile`.
2. **GitHub Actions CI/CD Pipeline**:
   - `.github/workflows/ci.yml` running automated typechecking and production builds on push/PR.
3. **Invoice / Challan PDF Export**:
   - Clean printable view directly accessible from any Challan detail drawer.

---

## Technical Architecture

```
[ React + TypeScript (Vite) ]  <--- HTTP/JSON REST --->  [ Express + TypeScript API ]
         (Port 5173)                                              (Port 4000)
                                                                       |
                                                                  (pg-pool)
                                                                       |
                                                                       v
                                                           [ PostgreSQL Database ]
                                                         - Users (Roles & Bcrypt)
                                                         - Customers & Followups
                                                         - Products & Stock Levels
                                                         - Stock Movement Logs
                                                         - Challans & Items Snapshots
```

### Transaction Safety Implementation
When creating or confirming a challan:
```sql
BEGIN;
-- 1. Lock candidate product rows to prevent race conditions:
SELECT * FROM products WHERE id = $1 FOR UPDATE;

-- 2. Verify stock availability:
-- If current_stock < requested_quantity => ROLLBACK & return HTTP 409

-- 3. Insert historical snapshot into challan_items:
INSERT INTO challan_items(challan_id, product_id, product_name, sku, unit_price, quantity) ...

-- 4. Deduct inventory:
UPDATE products SET current_stock = current_stock - $1 WHERE id = $2;

-- 5. Write audit movement trail:
INSERT INTO stock_movements(product_id, quantity_changed, movement_type, reason, created_by) ...

COMMIT;
```

---

## Postman API Collection

Import `postman/Fundsroom-ERP.postman_collection.json` into Postman. It includes pre-configured requests for:
1. `POST /auth/login` (Admin, Sales, Warehouse, Accounts)
2. `GET /customers`, `POST /customers`, `GET /customers/:id`, `PUT /customers/:id`, `POST /customers/:id/followups`
3. `GET /products`, `POST /products`, `PUT /products/:id`
4. `GET /stock-movements`, `POST /stock-movements`
5. `GET /challans`, `GET /challans/:id`, `POST /challans`, `POST /challans/:id/confirm`
6. `GET /dashboard`

---

## Deployment Guide

### Deploy Backend (Render / Railway / Fly.io)
1. Push this repository to GitHub.
2. Create a new **Web Service** on Render/Railway pointing to the `server` directory.
3. Environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `JWT_SECRET`: Random 32+ character secret string.
   - `CLIENT_URL`: URL of your deployed frontend.
   - `PORT`: `4000`
4. Build command: `npm install && npm run build`
5. Start command: `node dist/index.js`

### Deploy Frontend (Vercel / Netlify)
1. Import repository on Vercel/Netlify.
2. Root directory: `client`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Environment variable: `VITE_API_URL` set to the deployed backend URL.

---

## Known Assumptions & Limitations
- Single warehouse location per SKU (multi-warehouse location bins are supported as text annotations; multi-warehouse separate balance rows were outside assessment scope).
- Currency is formatted in Indian Rupees (INR ₹) standard for Indian wholesale operations.
