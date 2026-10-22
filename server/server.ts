#!/usr/bin/env bun

import path from "path";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

const TIMEOUT_MS = 120_000;

function parseArgs(): Record<string, string> {
  const args = process.argv.slice(2);
  const result: Record<string, string> = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--") && args[i + 1] && !args[i + 1].startsWith("--")) {
      result[args[i].slice(2)] = args[i + 1];
      i++;
    }
  }

  return result;
}

async function getDefaultDashboardDist(): Promise<string> {
  try {
    const configPath = path.join(process.cwd(), "config.js");
    const { default: config } = await import(configPath);
    const base = (config.base as string)?.replace(/^\//, "") ?? "dashboard";
    return `./${base}/dist`;
  } catch {
    return "./dashboard/dist";
  }
}

async function proxyRequest(
  req: Request,
  targetUrl: string,
): Promise<Response> {
  const headers = new Headers(req.headers);
  headers.delete("host");

  const hasBody = req.method !== "GET" && req.method !== "HEAD";

  const response = await fetch(targetUrl, {
    method: req.method,
    headers,
    body: hasBody ? req.body : undefined,
    signal: AbortSignal.timeout(TIMEOUT_MS),
    // @ts-ignore — Bun requires this for streaming request bodies
    duplex: "half",
  });

  const responseHeaders = new Headers(response.headers);
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    responseHeaders.set(key, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

async function serveStatic(
  pathname: string,
  dashboardDist: string,
): Promise<Response> {
  const subPath = pathname.replace(/^\/dashboard\/?/, "") || "index.html";
  const file = Bun.file(path.join(dashboardDist, subPath));

  if (await file.exists()) {
    return new Response(file);
  }

  return new Response(Bun.file(path.join(dashboardDist, "index.html")));
}

const parsed = parseArgs();

const PORT = Number(parsed["port"] ?? 3000);
const API_TARGET = parsed["api"] ?? "http://localhost:4000";
const DASHBOARD_DIST = path.resolve(
  parsed["dist-location"] ?? await getDefaultDashboardDist()
);

const server = Bun.serve({
  port: PORT,

  async fetch(req) {
    const url = new URL(req.url);

    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (url.pathname === "/") {
      return Response.redirect("/dashboard", 301);
    }

    try {
      if (url.pathname.startsWith("/api")) {
        const newPath = url.pathname.replace(/^\/api/, "") || "/";
        console.info(
          `[Proxy] ${req.method} ${url.pathname} → ${API_TARGET}${newPath}`,
        );
        return await proxyRequest(req, `${API_TARGET}${newPath}${url.search}`);
      }

      return await serveStatic(url.pathname, DASHBOARD_DIST);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[Proxy Error]", {
        path: url.pathname,
        method: req.method,
        message,
      });
      return new Response(`Proxy Error: ${message}`, {
        status: 500,
        headers: CORS_HEADERS,
      });
    }
  },
});

console.log(
  `Server running on port ${server.port} [static: ${DASHBOARD_DIST}]`,
);
