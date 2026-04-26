# Minh Tran Portfolio

Personal portfolio website for Minh Tran.

## Project Overview

- **Type:** Portfolio website with blog, projects, contact form, and admin CMS
- **Owner:** Minh Tran - Head of Digital & Technology | Supply Chain
- **Production:** https://minhtran-portfolio.vercel.app
- **GitHub:** https://github.com/tranminhtran83-wellground/minhtran-portfolio

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Data Store | Upstash Redis (@vercel/kv) |
| File Storage | Vercel Blob |
| Auth | NextAuth.js v5 |
| Analytics | Vercel Analytics |
| Deployment | Vercel |

## Key Directories

```
app/                  # Next.js pages and API routes
  admin/              # Admin dashboard (protected)
  api/                # API endpoints
  about/              # About page
  blog/               # Blog pages
  projects/           # Projects pages
  contact/            # Contact page
  security/           # Security & privacy page
components/           # React components
  admin/              # Admin-specific components
  layout/             # Header, Footer, Navigation
  ui/                 # Reusable UI components
lib/                  # Utilities and helpers
  auth.ts             # NextAuth configuration
contexts/             # React contexts
  LanguageContext.tsx  # i18n (EN/VI)
```

## Important Conventions

### Bilingual Support (EN/VI)
- All user-facing text uses `useLanguage()` hook from `LanguageContext`
- Translations defined in `contexts/LanguageContext.tsx`
- Pattern: `t('key.subkey')` returns translated string

### Admin Protection
- All `/admin/*` routes require authentication
- Use `auth()` from `lib/auth.ts` to check session
- Redirect to `/admin/login` if not authenticated

### Data Storage Pattern
- Content stored in Upstash Redis (via @vercel/kv) with structured keys
- Example: `about:content`, `projects:list`, `blog:posts`

### Privacy & GDPR
- **No tracking cookies** - GDPR compliant
- **No PII storage** - Only aggregate data
- Footer states: "GDPR Compliant | No Tracking"

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Build for production
npm run lint     # Run ESLint
npm run start    # Start production server
```

## Environment Setup

Required environment variables (set in Vercel dashboard):
- `NEXTAUTH_SECRET` - Auth secret
- `NEXTAUTH_URL` - Site URL
- `ADMIN_EMAIL` - Admin email
- `ADMIN_PASSWORD_HASH` - Bcrypt hash of admin password
- `UPSTASH_REDIS_REST_URL` - Redis URL
- `UPSTASH_REDIS_REST_TOKEN` - Redis token
- `KV_REST_API_URL` - Same as Upstash URL
- `KV_REST_API_TOKEN` - Same as Upstash token

## Do's and Don'ts

### Do
- Follow existing component patterns
- Use TypeScript strictly
- Support both EN and VI languages
- Keep admin routes protected
- Use @vercel/kv for data persistence

### Don't
- Store PII or tracking data (GDPR)
- Commit `.env.local` or secrets
- Skip authentication checks on admin routes
- Use cookies for tracking
