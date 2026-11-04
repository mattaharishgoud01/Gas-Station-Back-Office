# Gas Station Back Office

A full-stack project exploring convenience-store and fuel operations, including inventory, sales, pricing, and reporting workflows.

> **Project status:** Development project. Features and deployment configurations should be evaluated before use with real store data. This repository is distinct from the Java/Spring Boot StationOS implementation.

## Features and areas of focus

- Inventory and product price-book workflows
- Fuel pricing, tank and sales records
- Store sales and reporting dashboards
- Role-based user and store data models
- PostgreSQL data persistence using Prisma

The repository contains both frontend and backend implementations; individual workflows may still need testing or integration work.

## Technology

| Component | Stack |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS, Recharts |
| Backend | Node.js, Express 5, TypeScript |
| Data | PostgreSQL, Prisma |
| Authentication libraries | JWT, bcryptjs |
| Tests | Jest (backend); ESLint (frontend) |

## Repository layout

- `frontend/` — React user interface
- `backend/` — Express API, Prisma schema, and backend code
- `recover.js` — recovery utility; review before running

## Local development

**Prerequisites:** Node.js/npm and a running PostgreSQL instance.

1. Clone the repository and create a local PostgreSQL database.
2. Configure `DATABASE_URL` in a local backend environment file. Do not commit real passwords or secrets.
3. Install dependencies and generate the Prisma client:

```bash
cd backend
npm install
npm run db:generate
npm run db:push
npm run dev
```

4. In another terminal, start the frontend:

```bash
cd frontend
npm install
npm run dev
```

The backend's `dev` script runs `ts-node src/index.ts`. Confirm local ports, API URL, CORS, and any additional environment variables from the source before testing the full application.

## Checks

```bash
cd backend && npm test
cd ../frontend && npm run lint
npm run build
```

Run these from the repository root as separate commands if your shell's current directory differs. Tests and builds have not been executed as part of this documentation update.

## Security and deployment notes

- **No universal admin login is documented or recommended.** Create credentials securely for your local environment.
- Never use sample passwords, development secrets, or seeded users in a public deployment.
- Review authentication, authorization, secret management, and database migrations before exposing this application to the internet.
- Do not assume a production deployment is configured or validated.

## Project context

This project demonstrates full-stack application development and operational data modeling. For the separate Java 17/Spring Boot implementation, see the owner's `stationos-back-office` repository (currently private).
