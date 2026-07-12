# TransitOps

TransitOps is a smart transport operations platform for managing vehicles, drivers, trips, maintenance, fuel, expenses, and fleet analytics. The first version is built for a single organization, with the data model ready to evolve toward multi-organization support later.

## Tech Stack

- Next.js with TypeScript
- Tailwind CSS with shadcn/ui
- NextAuth email/password authentication
- Prisma ORM
- Supabase Postgres
- Vercel deployment target with GitHub Actions planned

## Current Scope

The foundation currently includes the application shell, protected dashboard route, credential-based auth wiring, RBAC role claims, and the initial Prisma schema for the fleet operations domain.

Core workflows still to build:

- Vehicle and driver registry CRUD
- Trip creation, dispatch, completion, and cancellation
- Maintenance, fuel, and expense logging
- Dashboard KPIs, filters, analytics, and CSV export
- Supabase migration and seed setup
- GitHub Actions and Vercel deployment automation

## Local Setup

Install dependencies:

```bash
npm install
```

Create an environment file:

```bash
cp .env.example .env
```

Update `.env` with the Supabase Postgres connection string and a strong `NEXTAUTH_SECRET`.

Generate the Prisma client:

```bash
npm run db:generate
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Useful Commands

```bash
npm run lint
npm run build
npm run db:generate
npm run db:migrate
npm run db:deploy
npm run db:studio
```
