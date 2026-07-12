<!-- CRACKODH -->
# TransitOps

TransitOps is a smart transport operations platform for managing vehicles, drivers, trips, maintenance, fuel, expenses, and fleet analytics.

## Tech Stack

- Next.js with TypeScript
- Tailwind CSS with shadcn/ui
- NextAuth email/password authentication
- Prisma ORM
- Supabase Postgres
- Vercel deployment
- GitHub Actions CI

## Features

- Auth with RBAC (Fleet Manager, Driver, Safety Officer, Financial Analyst)
- Vehicle, driver, and trip management with business rules
- Maintenance workflow with automatic vehicle status updates
- Fuel and expense tracking
- Dashboard KPIs with filters
- Reports with fuel efficiency, ROI, and CSV export

## Local Setup

Install dependencies:

```bash
npm install
```

Create an environment file:

```bash
cp .env.example .env
```

Update `.env` with your Supabase connection strings and secrets:

```env
DATABASE_URL="..."   # Supabase pooler (port 6543)
DIRECT_URL="..."     # Supabase direct (port 5432)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."
```

Generate the Prisma client and apply migrations:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000` and sign in with:

- `fleet@transitops.com` / `password123`

## Useful Commands

```bash
npm run lint
npm run build
npm run db:generate
npm run db:migrate
npm run db:deploy
npm run db:seed
npm run db:studio
```

## Deploy to Vercel

### 1. Push to GitHub

Ensure your repo is on GitHub (e.g. `iamsyg/crackODH-pvt`).

### 2. Connect Vercel to GitHub

**Option A — Vercel dashboard (simplest for previews):**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the GitHub repository
3. Framework preset: **Next.js** (auto-detected)
4. Build command: `prisma generate && next build` (from `vercel.json`)
5. Enable automatic deployments for `main` and preview branches

**Option B — GitHub Actions (production deploy on `main`):**

Use the `Deploy to Vercel` workflow after adding `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` secrets (see GitHub Actions section below).

### 3. Add environment variables

In Vercel → Project → Settings → Environment Variables, add:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Supabase **pooler** URL (port 6543, `?pgbouncer=true`) |
| `DIRECT_URL` | Supabase **direct** URL (port 5432) |
| `NEXTAUTH_SECRET` | Same secret as local (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` |

Apply to **Production**, **Preview**, and **Development**.

### 4. Deploy database migrations

Before the first production deploy (or after schema changes), run migrations against Supabase:

**Option A — locally:**

```bash
npm run db:deploy
```

**Option B — GitHub Actions:**

Add repository secrets:

- `DATABASE_URL`
- `DIRECT_URL`

The `Deploy Database` workflow runs on pushes to `main`, or trigger it manually from the Actions tab.

### 5. Seed production (optional, first time only)

```bash
npm run db:seed
```

Run locally with production `DATABASE_URL` in `.env`, or use Supabase SQL editor.

### 6. Deploy

Vercel deploys automatically on every push to your connected branch.

Visit your deployment URL and sign in with the seeded accounts.

## GitHub Actions

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `CI` | Push / PR to `main` or `anchit` | Lint and production build |
| `Deploy Database` | Push to `main` or manual | Apply Prisma migrations |
| `Deploy to Vercel` | Push to `main` or manual | Production deploy via Vercel CLI |
| `Seed Database` | Manual only | Load demo users and fleet data |

### Required GitHub secrets

Add these in GitHub → **Settings** → **Secrets and variables** → **Actions**:

| Secret | Used by |
|--------|---------|
| `DATABASE_URL` | Deploy Database, Seed Database |
| `DIRECT_URL` | Deploy Database, Seed Database |
| `VERCEL_TOKEN` | Deploy to Vercel |
| `VERCEL_ORG_ID` | Deploy to Vercel |
| `VERCEL_PROJECT_ID` | Deploy to Vercel |

Get Vercel IDs after linking the project:

```bash
npm install -g vercel
vercel login
vercel link
cat .vercel/project.json
```

Create a Vercel token at [vercel.com/account/tokens](https://vercel.com/account/tokens).

### Recommended deploy order

1. Push code to GitHub
2. Import repo in Vercel and add environment variables
3. Add GitHub secrets listed above
4. Run **Deploy Database** workflow
5. Run **Seed Database** workflow (first time only)
6. Push to `main` or run **Deploy to Vercel** workflow

## Demo Accounts

| Email | Password | Role |
|-------|----------|------|
| `fleet@transitops.com` | `password123` | Fleet Manager |
| `driver@transitops.com` | `password123` | Driver |
| `safety@transitops.com` | `password123` | Safety Officer |
| `finance@transitops.com` | `password123` | Financial Analyst |
