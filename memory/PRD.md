# Portfolio — Senior Software Engineer

## Original Problem Statement
Professional portfolio for a senior software engineer (5-10 yrs).
Sections: Hero, About (+ resume download), Skills (Frontend/Backend/DB/Cloud), Projects (4-6 cards w/ GitHub+demo), Experience (timeline), Contact (form + socials).
Design: Dark minimal `#0A0A0A` + electric cyan `#00E5FF`. Mono/sans pairing. Subtle scroll anims. $15k handcrafted feel.

## Architecture
- **Frontend**: React 19 + Tailwind + Framer-Motion-free CSS animations + Lucide icons + sonner toasts. Single-page scrollable portfolio.
- **Backend**: FastAPI + Motor (MongoDB) + Resend SDK for contact email notifications.
- **Stack**: Outfit (display) + JetBrains Mono (labels/code). Custom cyan accent system via CSS vars.

## User Personas
- Recruiters / hiring managers scanning for staff/principal candidates
- Founders looking for senior engineers / advisors
- Engineering peers evaluating credibility

## Core Requirements (static)
- 6 sections + nav + footer
- Resume PDF download
- Contact form → MongoDB + Resend email notification
- Responsive (mobile/tablet/desktop)
- Dark cyber-brutalism aesthetic, generous whitespace, mono labels

## What's Been Implemented (2025-12)
- Hero with animated grid + radial cyan glow, name/title/tagline/two CTAs
- About with stats card + resume download
- Skills (4 groups × 6 items, hover cyan)
- Projects (5 cards, cursor-tracking radial glow, GitHub + Demo links, abstract dark imagery)
- Experience vertical timeline (4 roles, glowing cyan dots)
- Contact form (name/email/message) + social block + status block; sonner toast feedback
- Backend `POST /api/contact` stores in MongoDB + best-effort Resend email
- Backend `GET /api/contact` admin list endpoint
- Footer with social icons
- Sticky nav with scroll-blur backdrop
- Smooth scroll, IntersectionObserver reveal animations, grain overlay, custom scrollbar

## Prioritized Backlog
### P0 (must)
- ✅ All core sections functional

### P1 (next)
- Replace placeholder `Alex Chen` content with real data (user will edit)
- Replace placeholder `/resume.pdf` (user uploads real PDF)
- Verify Resend domain (currently `onboarding@resend.dev` testing sender)
- Update `NOTIFICATION_EMAIL` in `/app/backend/.env` to real inbox
- Configure real GitHub / LinkedIn / Email in `PROFILE` constant

### P2 (future)
- Admin route `/admin/messages` to view contact submissions
- Project case-study deep-pages (`/work/[slug]`)
- Blog/writing section
- OG image + meta tags for sharing
- Lighthouse pass (lazy-load images already, but could add WebP)
- Analytics events on CTA clicks (PostHog already loaded)

## Test Credentials
N/A — no auth in this build.

## Next Tasks
1. User edits `PROFILE` constant in `/app/frontend/src/components/Portfolio.jsx`
2. User updates `PROJECTS` + `EXPERIENCE` arrays with real content
3. User uploads real `/app/frontend/public/resume.pdf`
4. User updates `NOTIFICATION_EMAIL` in `/app/backend/.env`
