# Giddings Capital Management — company site

Plain HTML/CSS/JS, no build step. Edit `index.html` and push to `main`.

Where it is served:
- `https://foldforge.app/company/` (by the FoldForge server, see `server/_core/vite.ts`)
- At the root of any domain listed in the `COMPANY_SITE_HOSTS` env var on the FoldForge Render service
- Optionally as its own Render static site (`giddings-capital` in `render.yaml`)

Everything under the Giddings Capital Management LLC umbrella lives in this one repo:
- FoldForge app: `client/`, `server/`, `shared/`
- Company site: `giddings-site/`
