# Minh Tran Portfolio

> Personal portfolio website — "Khu Vườn Nhỏ" (My Little Garden)

## 🌿 About

A bilingual (EN/VI) portfolio website for **Minh Tran**, Head of Digital & Technology Consulting for Supply Chain at Unilever Greater Asia. Built with Next.js 14, TypeScript, and Tailwind CSS.

**Live:** [minhtran-portfolio.vercel.app](https://minhtran-portfolio.vercel.app)

## ✨ Features

- 🌐 **Bilingual** — Full English/Vietnamese support
- 📝 **Blog** — Write and publish articles via admin CMS
- 💼 **Projects** — Showcase initiatives and ideas
- 📬 **Contact Form** — Get in touch page
- 🔒 **Admin Dashboard** — Manage content, blog posts, projects
- 📊 **Visitor Analytics** — Privacy-friendly, GDPR compliant
- 📱 **Responsive** — Mobile-first design

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## 🔧 Environment Variables

Create `.env.local` for local development, or set in Vercel dashboard for production:

```env
# Required: Authentication
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=tranminhtran83@gmail.com
ADMIN_PASSWORD_HASH=<bcrypt hash of password>

# Required: Database (Upstash Redis)
UPSTASH_REDIS_REST_URL=<from console.upstash.com>
UPSTASH_REDIS_REST_TOKEN=<from console.upstash.com>
KV_REST_API_URL=<same as UPSTASH_REDIS_REST_URL>
KV_REST_API_TOKEN=<same as UPSTASH_REDIS_REST_TOKEN>

# Optional: File uploads
BLOB_READ_WRITE_TOKEN=<from Vercel Blob storage>

# Optional: Email notifications
RESEND_API_KEY=<from resend.com>
RESEND_FROM_EMAIL=onboarding@resend.dev
RESEND_TO_EMAIL=tranminhtran83@gmail.com

# Optional: Site URL
NEXT_PUBLIC_SITE_URL=https://minhtran-portfolio.vercel.app
```

## 📁 Project Structure

```
app/              # Pages and API routes
components/       # React components
contexts/         # Language context (i18n)
lib/              # Utilities, auth, helpers
public/           # Static assets
```

## 🛡️ Security & Privacy

- HTTPS encrypted connections
- GDPR compliant — no tracking cookies, no PII
- Rate limiting on all endpoints
- Input validation and XSS prevention

## 📝 License

Private project. All rights reserved.
