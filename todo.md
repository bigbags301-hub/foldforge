# FoldForge SaaS — TODO

## Foundation
- [x] Database schema: users, subscriptions, licenses, activations, files, tickets, broker_data, symbol_reference, studio_runs
- [x] Environment secrets: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PUBLISHABLE_KEY
- [x] Install additional packages: stripe, bcryptjs, uuid, crypto-js
- [x] Upload logo to CDN and set VITE_APP_LOGO

## Theme & Design System
- [x] Dark theme with gold (#D4A843) accent color system
- [x] Inter + Playfair Display fonts
- [x] Global CSS variables for consistent theming

## Marketing Homepage (/)
- [x] Navbar with login/pricing links
- [x] Hero section with headline, subhead, CTAs, trust chips
- [x] Pain section (3 cards: blown funded accounts, untested strategies, wrong broker data)
- [x] Feature grid (6 tiles)
- [x] Prop Firm Guardian module with live mockup
- [x] Pricing section (3 tiers: Starter $19, Pro $39, Funded $79)
- [x] Social proof / testimonials (3 cards)
- [x] FAQ section (6 accordion items)
- [x] Final CTA section
- [x] Footer with legal info and risk disclaimer

## Auth Pages
- [x] Auth via Manus OAuth (session-based)
- [x] /success page (post-Stripe checkout)
- [x] /pricing page (standalone route)
- [x] Auth context/hook for session management (useAuth)

## User Dashboard (/dashboard)
- [x] Dashboard layout with tabbed navigation
- [x] Subscription tab — plan status, manage subscription link
- [x] Licenses tab — show license keys, activations, deactivate button
- [x] Downloads tab — members-only vault with subscription-gated access
- [x] Broker Data tab — last sync time, symbols synced
- [x] Support tab — support ticket submission and history

## Studio (/studio)
- [x] Configure tab — EA name, symbol, timeframe, run type, account settings
- [x] Run Queue tab — queue management with start/cancel actions
- [x] Results tab — backtest results with equity curves and metrics
- [x] Reference Data tab — 174 symbols browsable by category
- [x] Reports tab — report generation and export

## Backend APIs
- [x] POST /api/stripe/webhook — handle checkout/invoice/subscription events
- [x] POST /api/license/verify — EA license check with grace period
- [x] POST /api/license/activate — bind account_number + broker_server
- [x] POST /api/license/deactivate — remove activation
- [x] POST /api/broker/sync/specs — receive symbol specs from EA
- [x] POST /api/broker/sync/ohlc — receive OHLC history from EA
- [x] POST /api/broker/sync/spread — receive spread samples from EA
- [x] GET /api/broker/heartbeat — heartbeat endpoint
- [x] tRPC routers: dashboard, studio, referenceData, admin

## Admin Dashboard (/admin)
- [x] Metrics tab — Total Users, Active Subscriptions, Total Licenses, Open Tickets, MRR
- [x] Users tab with suspend/activate and role promotion
- [x] Subscriptions tab with plan and status
- [x] Licenses tab with activations and revoke
- [x] Tickets tab with reply and status update
- [x] Downloads tab with file management

## Data Pipeline
- [x] Reference Data Hub: 174 preloaded symbols (forex, metals, indices, crypto, commodities, bonds)
- [x] Broker Sync endpoints for MT4/MT5 uploader EA
- [x] Symbol data display in Studio reference tab

## Downloads Vault
- [x] S3 storage integration via storageGet/storagePut helpers
- [x] Signed URL generation (subscription-gated)
- [x] File versioning + changelog fields
- [x] Download logging per user

## Aureus Prime Page (/aureus-prime)
- [x] Product description and features (10 feature items)
- [x] Technical specifications table
- [x] Performance track record stats
- [x] CTA to subscribe

## Legal & Support Pages
- [x] /terms — Terms of Service (Giddings Capital Management LLC, NM)
- [x] /privacy — Privacy Policy
- [x] /refund-policy — Refund Policy
- [x] /disclaimer — Risk Disclaimer
- [x] /support — Contact page with company info
- [x] /docs — Documentation (7 tabbed sections)

## Polish
- [x] Risk disclaimers in footer
- [x] Vitest tests passing (13/13)
- [x] All routes wired in App.tsx (14 routes)
- [x] 404 page with dark theme

## Fix Sweep — Required Changes
- [x] Replace Manus auth with Supabase auth (email/password + session) — no manus.im sign-in anywhere
- [x] Create /login and /signup pages with Supabase email/password
- [x] Wire pricing CTAs to real Stripe payment links (Starter/Pro/Funded)
- [x] Implement Stripe webhook provisioning (/api/stripe/webhook) — persist subscription state in DB
- [x] Real license system: /api/license/verify, /activate, /deactivate with activation limits (1/5/25)
- [x] Downloads vault: Supabase Storage private bucket + signed URLs, gated by subscription
- [x] Admin bootstrap: auto-set role=admin for bigbags301@gmail.com on first login
- [x] Remove Cloudflare email obfuscation — plain text emails everywhere
- [x] Support page: phone (505) 230-1932, email, ticket link
- [x] Update company identity everywhere: Giddings Capital Management LLC, 1209 Mountain Road Pl NE Ste N, Albuquerque, NM 87110 USA
- [x] Fix favicon to use the bull logo
- [x] Make studio fully functional (all tabs working, real run engine)
- [x] After Stripe checkout redirect to /success then unlock dashboard/studio/downloads
- [x] Proof: purchase flow, signed URL downloads, license activate/deactivate, admin access


## YouTube Channel Setup
- [ ] Log into YouTube (foldforge1@gmail.com)
- [ ] Set up channel profile (name, description, banner, links, branding)
- [ ] Create first marketing/demo video
- [ ] Post first video to YouTube

## YouTube Videos (Updated)
- [ ] Update website link to foldforge.app in YouTube channel profile
- [ ] Create Video 1: "Stop Losing Funded Accounts" — publish immediately
- [ ] Create Video 2: "How to Stress Test Any EA" — schedule 1 week out
- [ ] Create Video 3: "FoldForge Studio Full Walkthrough" — schedule 2 weeks out
- [ ] Update foldforge.app references in the platform codebase
