# Nexus Enterprise: C-Store & Fuel Platform

A production-ready Gas Station and Convenience Store management system inspired by Mercury One.

## 🚀 Quick Start

### 1. Database Setup
Ensure PostgreSQL is running, then execute the schema and seed files:
```bash
psql -U postgres -d nexus_db -f sql/schema.sql
psql -U postgres -d nexus_db -f sql/seed.sql
```

### 2. Backend Initialization
```bash
cd backend
npm install
npm run dev
```
*Port: 5000*

### 3. Frontend Initialization
```bash
cd frontend
npm install
npm run dev
```
*Port: 3000*

## 🔑 Authentication
- **Admin Username**: `admin`
- **Password**: `admin123`

## 🧱 Project Modules
- **Dashboard**: Real-time KPIs, fuel tank telemetry, and sales trends.
- **Price Book**: Unified inventory management with UPC tracking.
- **Fuel Command**: Price management across grades (Regular, Premium, Diesel).
- **POS-Lite**: Operational sales ledger for store and fuel.
- **P&L Intelligence**: Financial reporting with automated profit margin calculation.

## 🛠 Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide, Recharts.
- **Backend**: Node.js, Express, JWT, Bcrypt, pg (PostgreSQL driver).
- **Database**: PostgreSQL (Normalized).
