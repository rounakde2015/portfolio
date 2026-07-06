# Alex Chen — Portfolio (Next.js migration)

A pixel-identical port of the CRA + FastAPI portfolio to **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **Biome** for linting/formatting.

## Stack

- **Framework**: Next.js 15 (App Router, React 19, TypeScript strict)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`) — no `tailwind.config.js`, CSS-first tokens in `app/globals.css`
- **Linter/Formatter**: Biome (`biome.json`)
- **DB**: MongoDB (`mongodb` driver, connection cached in `globalThis`)
- **Auth**: `jose` for JWT (HS256, 2h expiry) + `bcryptjs` for password hashing
- **Email**: `resend` for contact-form notifications
- **UI**: `lucide-react` icons, `sonner` toasts

## Getting started

```bash
# 1. Install (Node 20+ recommended)
yarn install     # or: pnpm install / npm install

# 2. Configure env
cp .env.example .env.local
# Then fill in MONGODB_URI, ADMIN_PASSWORD, JWT_SECRET, RESEND_API_KEY, etc.
# Generate JWT_SECRET:
#   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 3. Dev server
yarn dev
# → http://localhost:3000       (portfolio)
# → http://localhost:3000/admin/messages  (admin login)

# 4. Production
yarn build
yarn start
```

## Environment variables

| Var | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `MONGODB_DB`  | Database name (default `portfolio`) |
| `ADMIN_PASSWORD` | Plaintext admin password (bcrypt-hashed at boot) |
| `JWT_SECRET` | 32-byte random hex — sign admin JWTs |
| `JWT_EXPIRE_HOURS` | Token lifetime (default `2`) |
| `RESEND_API_KEY` | Resend API key (blank = notifications disabled) |
| `SENDER_EMAIL` | From-address (`onboarding@resend.dev` works without domain verify) |
| `NOTIFICATION_EMAIL` | Inbox that receives contact-form notifications |

## Scripts

- `yarn dev` — Next dev server (hot reload)
- `yarn build` — production build
- `yarn start` — run production server
- `yarn lint` — Biome check (lint + format)
- `yarn lint:fix` — Biome auto-fix
- `yarn format` — Biome format only

## Project layout

```
app/
  layout.tsx                  # Root layout, dark data-theme, fonts
  page.tsx                    # Portfolio landing (renders <Portfolio/>)
  globals.css                 # Tailwind v4 + all theming (dark default, light overrides)
  providers.tsx               # Client wrapper for <Toaster/>
  admin/messages/page.tsx     # /admin/messages route
  api/
    contact/route.ts          # POST public contact form
    admin/
      login/route.ts          # POST admin login (rate-limited by IP)
      verify/route.ts         # GET verify JWT
      stats/route.ts          # GET total + unread counts
      messages/route.ts       # GET messages list (admin only)
      messages/[id]/route.ts  # DELETE message
      messages/[id]/read/route.ts  # PATCH toggle read
components/
  portfolio/                  # Portfolio sections + hooks + constants
  admin/                      # Admin login + messages UI + fetch client
lib/
  mongodb.ts                  # cached Mongo client
  auth.ts                     # JWT sign/verify, bcrypt, requireAdmin(), getClientIp()
  ratelimit.ts                # in-memory brute-force protection
  email.ts                    # Resend integration
  models.ts                   # TypeScript types
public/
  resume.pdf                  # Downloadable resume (replace with your own)
```

## Notes on the migration

- **Routing**: `react-router-dom` was removed. Next.js file-based routing handles `/` and `/admin/messages`.
- **API base URL**: The React CRA build used `REACT_APP_BACKEND_URL`; the Next version calls **relative** `/api/*` paths since API routes live in the same app.
- **JWT library**: swapped `PyJWT` (server) for **`jose`** (edge-compatible, ESM-first).
- **Bcrypt**: swapped Python's `bcrypt` for **`bcryptjs`** (pure-JS, no native binding required).
- **Env vars**: Consolidated from `.env` (React) + `.env` (FastAPI) into a single `.env.local`.
- **Rate limiting**: Stays in-memory (`Map`) — for multi-instance deploys, switch to Redis or Vercel KV.
- **Design**: 100% preserved. Same tokens, same CSS variables, same `[data-theme='light']` overrides, same kinetic hero, same admin panel UX.

## Deploying

- **Vercel** (recommended): `vercel --prod`. Add env vars in the dashboard. Zero config needed.
- **Docker / Node host**: `yarn build && yarn start`. Serve behind any reverse proxy.
- **Static export**: Not supported — API routes require a Node runtime.

## What's different from the FastAPI version

| Concern | FastAPI + CRA | Next.js |
|---|---|---|
| Backend | Python (uvicorn on 8001) | Node (embedded in Next server) |
| Frontend | CRA on 3000, calls REACT_APP_BACKEND_URL | Same-origin `/api/*` |
| Auth lib | `pyjwt` + `bcrypt` | `jose` + `bcryptjs` |
| Email lib | `resend` (python) | `resend` (node) |
| Rate-limit | Python dict, XFF-aware | JS `Map`, XFF-aware |
| Testing | pytest + Playwright | (bring your own — vitest + Playwright suggested) |

Everything else — theme, animation, copy, layout, testIds, admin flow — is byte-for-byte equivalent.
