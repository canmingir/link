#!/usr/bin/env bun

import { spawn, spawnSync } from "node:child_process";

function log(message: string) {
  process.stdout.write(`\x1b[36m[tunnel]\x1b[0m ${message}\n`);
}

function err(message: string) {
  process.stderr.write(`\x1b[31m[tunnel]\x1b[0m ${message}\n`);
}

const port = Number(process.argv[2]?.replace("--port=", "") ?? process.env.PORT ?? 3000);

if (spawnSync("cloudflared", ["--version"], { stdio: "ignore" }).error) {
  err("cloudflared not found: brew install cloudflared");
  process.exit(1);
}

log(`Starting cloudflared tunnel for http://localhost:${port} ...`);

const cloudflared = spawn(
  "cloudflared",
  ["tunnel", "--url", `http://localhost:${port}`],
  { stdio: ["ignore", "pipe", "pipe"] }
);

const urlPattern = /https:\/\/[a-z0-9-]+\.trycloudflare\.com/;
let printed = false;

const onData = (chunk: Buffer) => {
  const text = chunk.toString();
  if (!printed) {
    const match = text.match(urlPattern);
    if (match) {
      printed = true;
      log(`Public URL: ${match[0]}`);
    }
  }
};

cloudflared.stdout.on("data", onData);
cloudflared.stderr.on("data", onData);

cloudflared.on("exit", (code) => process.exit(code ?? 0));

process.on("SIGINT", () => cloudflared.kill("SIGTERM"));
process.on("SIGTERM", () => cloudflared.kill("SIGTERM"));
