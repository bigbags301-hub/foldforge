import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // Resolve dist/public from the project root using process.cwd()
  // This is the most reliable way on Render as long as the start command
  // is run from the project root.
  const distPath = path.resolve(process.cwd(), "dist", "public");

  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  // Giddings Capital Management company site (static, lives in /giddings-site).
  // Served at /company, and at the root for any host listed in COMPANY_SITE_HOSTS
  // (comma-separated, e.g. "giddingscapital.com,www.giddingscapital.com").
  const companyPath = path.resolve(process.cwd(), "giddings-site");
  if (fs.existsSync(companyPath)) {
    const companyStatic = express.static(companyPath);
    const companyHosts = (process.env.COMPANY_SITE_HOSTS || "")
      .split(",")
      .map(h => h.trim().toLowerCase())
      .filter(Boolean);
    app.use((req, res, next) => {
      const host = (req.hostname || "").toLowerCase();
      if (companyHosts.includes(host) && !req.path.startsWith("/api")) {
        return companyStatic(req, res, next);
      }
      next();
    });
    app.use("/company", companyStatic);
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
