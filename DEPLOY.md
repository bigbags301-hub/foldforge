# FoldForge — Deployment Guide

## Quick Start (Any Server)

### Requirements
- Node.js 18+ (or 20+)
- pnpm (`npm install -g pnpm`)

### 1. Install Dependencies
```bash
cd foldforge
pnpm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

**Minimum required variables:**
```
NODE_ENV=production
PORT=3000
JWT_SECRET=<generate a strong random secret>
```

**Optional — Supabase (for email auth/password reset):**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Optional — Stripe (for payments):**
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Optional — MySQL/TiDB (for production DB instead of SQLite):**
```
DATABASE_URL=mysql://user:pass@host:3306/foldforge
DATABASE_PATH=./data/foldforge.db   # SQLite path (default)
```

### 3. Build the Frontend
```bash
pnpm build
```

### 4. Start the Server
```bash
# Production
NODE_ENV=production node dist/server/_core/index.js

# Or with tsx (development)
pnpm dev
```

### 5. Using PM2 (Recommended for Production)
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## Database

By default, FoldForge uses **SQLite** stored at `./data/foldforge.db`.  
The database is auto-created on first run with all tables and 50+ reference symbols seeded.

To use MySQL/TiDB in production, set `DATABASE_URL` in your `.env`.

---

## Admin Account

The first user to sign up with the email set in `ADMIN_EMAIL` (default: `bigbags301@gmail.com`) will automatically be granted admin role.

---

## Ports & Proxy

The server runs on `PORT` (default: 3000). For HTTPS, place it behind nginx or Caddy:

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Features Included
- Full Studio Engine (backtest, Monte Carlo, walk-forward)
- Broker Data Pipeline (MT4/MT5 EA sync)
- License Management (generate, activate, deactivate)
- Stripe Webhook Handler
- Supabase Auth (optional) or Local JWT Auth
- Admin Dashboard
- Support Ticket System
- 50+ Symbol Reference Hub (seeded automatically)
- PDF Report Generation
- Funded Account Guardian UI
