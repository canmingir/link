#!/usr/bin/env bun

import { spawn, spawnSync } from "node:child_process";

function log(message: string) {
  process.stdout.write(`\x1b[36m[tunnel]\x1b[0m ${message}\n`);
}

function err(message: string) {
  process.stderr.write(`\x1b[31m[tunnel]\x1b[0m ${message}\n`);
}

const portArg = process.argv[2];
const port = Number(
  (portArg === "--port"
    ? (process.argv[3] ?? "")
    : portArg?.replace(/^--port=/, "")) ??
    process.env.TUNNEL_PORT ??
    3000
);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  err("Port must be an integer between 1 and 65535");
  process.exit(1);
}

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

const createOnData = () => {
  let pending = "";
  return (chunk: Buffer) => {
    if (printed) return;
    const text = pending + chunk.toString();
    const match = text.match(urlPattern);
    if (match) {
      printed = true;
      pending = "";
      log(`Public URL: ${match[0]}`);
    } else {
      pending = text.slice(-256);
    }
  };
};

const onData = createOnData();
cloudflared.stdout.on("data", createOnData());
cloudflared.stderr.on("data", onData);

cloudflared.on("exit", (code) => process.exit(code ?? 0));

process.on("SIGINT", () => cloudflared.kill("SIGTERM"));
process.on("SIGTERM", () => cloudflared.kill("SIGTERM"));
