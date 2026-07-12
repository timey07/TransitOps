# TransitOps 🚚 - Smart Transport Operations Platform

A next-generation, full-stack Fleet Management and Logistics platform built for the modern era. TransitOps handles end-to-end operational telemetry, automated maintenance tracking, dispatch scheduling, and financial analytics for commercial fleets.

---

## 🎯 The Problem & Our Solution
The logistics industry struggles with fragmented tools—using different software for vehicle registries, driver rosters, trip tracking, and expense ledgers. This leads to operational inefficiencies, missed maintenance schedules, and poor ROI visibility. 

**TransitOps** unifies all these pillars into a single, cohesive, premium dashboard. 

*(For a deeper dive into our design goals, please refer to the included `TransitOps Smart Transport Operations Platform.pdf` problem statement in this repository).*

## ✨ Core Features
*   **Role-Based Access Control (RBAC):** Secure login with distinct permission scopes (Fleet Manager, Dispatcher, Safety Officer, Financial Analyst) and a secure lockout mechanism after 5 failed attempts.
*   **Asset & Vehicle Registry:** Track heavy-duty machinery, transport vans, and payload capacities. Supports **Bulk CSV Import** with strict error handling and validation.
*   **Predictive Maintenance:** Log vehicle issues. Vehicles are automatically marked as "IN_SHOP" preventing accidental dispatch, keeping drivers safe.
*   **Kanban Trip Dispatching:** Drag-and-drop styled dispatch board to manage active fleet deployments.
*   **Financial & ROI Analytics:** Auto-calculates fuel efficiency (Km/L) and vehicle-specific Return on Investment (ROI) based on revenue, maintenance costs, and fuel logs.

## 🛠️ Tech Stack
*   **Frontend:** React, TypeScript, Vite, Tailwind CSS (Glassmorphism & Modern Dark Mode UI), Lucide Icons, React Hook Form
*   **Backend:** Node.js, Express, TypeScript, Zod (Validation), Prisma (ORM), SQLite (Database), JSON Web Tokens (Auth)

---

## 🚀 Local Setup & Installation

### 1. Backend Setup
```bash
cd backend
npm install
# Sync the database schema
npx prisma db push
# Seed the initial admin user
npx tsx seed.ts
# Start the backend server (runs on port 3000)
npm run dev
```

### 2. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
# Start the Vite development server
npm run dev
```

---

## 🔑 Demo Access
To easily evaluate the platform, use the seeded test account:

*   **Email:** `admin@transitops.com`
*   **Password:** `password123`
*   **Role:** `FLEET_MANAGER`

*(Note: Try entering the wrong password 5 times to see the security lockout trigger in action!)*

## 🤝 Contributors
*   **timey07** - *Hackathon Participant & Primary Contributor*
*   **aru-shi2** - *Co-Creator & Project Partner*

Built with passion for modern logistics. 🚀
