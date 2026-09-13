#!/usr/bin/env bun

import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

type Options = {
  port: number;
  run: string;
  projectId: string | null;
  storage: Record<string, string>;
  rewriteEnv: string[];
  envFile: string | null;
  dryRun: boolean;
};

function log(message: string) {
  process.stdout.write(`\x1b[36m[tunnel]\x1b[0m ${message}\n`);
}

function err(message: string) {
  process.stderr.write(`\x1b[31m[tunnel]\x1b[0m ${message}\n`);
}

function parseArgs(argv: string[]): Options {
  const options: Options = {
    port: 3000,
    run: "bun run dev",
    projectId: null,
    storage: {},
    rewriteEnv: [],
    envFile: null,
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = () => {
      const value = argv[++i];
      if (value === undefined) {
        err(`Missing value for ${arg}`);
        process.exit(1);
      }
      return value;
    };

    switch (arg) {
      case "--port":
        options.port = Number(next());
        break;
      case "--run":
        options.run = next();
        break;
      case "--project-id":
        options.projectId = next();
        break;
      case "--storage": {
        const [key, ...rest] = next().split("=");
        if (!key || rest.length === 0) {
          err("--storage expects key=value");
          process.exit(1);
        }
        options.storage[key] = rest.join("=");
        break;
      }
      case "--rewrite-env":
        options.rewriteEnv = next()
          .split(",")
          .map((key) => key.trim())
          .filter(Boolean);
        break;
      case "--env-file":
        options.envFile = next();
        break;
      case "--dry-run":
        options.dryRun = true;
        break;
      case "--help":
      case "-h":
        printUsage();
        process.exit(0);
        break;
      default:
        err(`Unknown argument: ${arg}`);
        printUsage();
        process.exit(1);
    }
  }

  return options;
}

function printUsage() {
  process.stdout.write(
    `
Usage: link-tunnel [options]

Exposes the local dev server through an ngrok tunnel and starts the dev stack
with the public URL injected into its environment. No project file is modified.

Options:
  --port <number>        Local port to expose (default: 3000)
  --run <command>        Dev command to start (default: "bun run dev")
  --project-id <uuid>    Enable dashboard auto-login for this project (DEMO admin/admin)
  --storage <key=value>  Extra localStorage entry written by auto-login, repeatable
  --rewrite-env <keys>   Comma separated env vars whose origin is replaced with
                         the tunnel URL, e.g. GOOGLE_REDIRECT_URI,GDRIVE_REDIRECT_URI
  --env-file <path>      File to read --rewrite-env values from (read only)
  --dry-run              Print the tunnel URL, then exit without starting the dev stack

Environment passed to the dev command:
  LINK_TUNNEL_URL                    Public tunnel URL
  LINK_TUNNEL_AUTOLOGIN_PROJECT_ID   Set when --project-id is given
  LINK_TUNNEL_AUTOLOGIN_STORAGE      JSON map of extra --storage entries
`.trimStart()
  );
}

function readEnvFile(file: string): Record<string, string> {
  const values: Record<string, string> = {};

  if (!fs.existsSync(file)) return values;

  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;
    values[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }

  return values;
}

function replaceOrigin(value: string, origin: string): string | null {
  try {
    const url = new URL(value);
    return `${origin}${url.pathname}${url.search}${url.hash}`.replace(/\/$/, "");
  } catch {
    return null;
  }
}

async function isPortInUse(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(2000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

function startNgrok(port: number) {
  const ngrok = spawn(
    "ngrok",
    ["http", String(port), "--log", "stdout", "--log-format", "json"],
    { stdio: ["ignore", "pipe", "pipe"] }
  );

  const state: { url: string | null; webAddr: string | null; lines: string[] } = {
    url: null,
    webAddr: null,
    lines: [],
  };

  const onData = (chunk: Buffer) => {
    for (const line of chunk.toString().split("\n")) {
      if (!line.trim()) continue;
      state.lines.push(line);
      if (state.lines.length > 20) state.lines.shift();

      try {
        const entry = JSON.parse(line);
        if (entry.msg === "started tunnel" && entry.url) {
          state.url = String(entry.url);
        }
        if (entry.msg === "starting web service" && entry.addr) {
          state.webAddr = String(entry.addr);
        }
      } catch {
        continue;
      }
    }
  };

  ngrok.stdout.on("data", onData);
  ngrok.stderr.on("data", onData);

  return { process: ngrok, state };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const root = process.cwd();

  if (!Bun.which("ngrok")) {
    err("ngrok not found: brew install ngrok");
    process.exit(1);
  }

  if (await isPortInUse("http://127.0.0.1:4040/api/tunnels")) {
    log("WARNING: 127.0.0.1:4040 is in use — another ngrok agent is running.");
    log("         The new agent moves its web UI to 4041; the URL is read from its log.");
  }

  log(`Starting ngrok (http :${options.port})...`);
  const ngrok = startNgrok(options.port);

  let child: ReturnType<typeof spawn> | null = null;
  let exiting = false;

  const cleanup = () => {
    if (exiting) return;
    exiting = true;
    child?.kill("SIGTERM");
    ngrok.process.kill("SIGTERM");
  };

  process.on("SIGINT", () => {
    cleanup();
    process.exit(0);
  });
  process.on("SIGTERM", () => {
    cleanup();
    process.exit(0);
  });
  process.on("exit", cleanup);

  for (let i = 0; i < 40 && !ngrok.state.url; i++) {
    if (ngrok.process.exitCode !== null) {
      err("ngrok exited unexpectedly. Log:");
      err(ngrok.state.lines.join("\n"));
      process.exit(1);
    }
    await Bun.sleep(500);
  }

  const publicUrl = ngrok.state.url;

  if (!publicUrl) {
    err("Could not obtain the ngrok public URL within 20s. Log:");
    err(ngrok.state.lines.join("\n"));
    process.exit(1);
  }

  log(`Public URL: ${publicUrl}`);
  log(`ngrok inspector: http://${ngrok.state.webAddr ?? "127.0.0.1:4040"}`);

  const env: Record<string, string> = {
    ...(process.env as Record<string, string>),
    LINK_TUNNEL_URL: publicUrl,
  };

  if (options.projectId) {
    env.LINK_TUNNEL_AUTOLOGIN_PROJECT_ID = options.projectId;
    env.LINK_TUNNEL_AUTOLOGIN_STORAGE = JSON.stringify(options.storage);
  }

  const fileValues = options.envFile
    ? readEnvFile(path.resolve(root, options.envFile))
    : {};

  for (const key of options.rewriteEnv) {
    const current = process.env[key] ?? fileValues[key];
    if (!current) {
      log(`WARNING: ${key} not found, skipped.`);
      continue;
    }

    const rewritten = replaceOrigin(current, publicUrl);
    if (!rewritten) {
      log(`WARNING: ${key} is not a URL, skipped.`);
      continue;
    }

    env[key] = rewritten;
    log(`  ${key} -> ${rewritten}`);
  }

  if (options.projectId) {
    process.stdout.write(
      `
  WARNING: auto-login is ON — ANYONE who opens this URL is signed in as OWNER
  via admin/admin. Drop --project-id to disable it.

`
    );
  }

  process.stdout.write(
    `
  Note: this URL changes on every run. To test OAuth sign-in, the redirect URIs
  in the Google/GitHub console have to be updated too.
  On the ngrok free plan the first visit shows an interstitial — click "Visit Site".

`
  );

  if (options.dryRun) {
    log("--dry-run — dev stack not started.");
    cleanup();
    process.exit(0);
  }

  log(`Starting dev stack (${options.run})...`);
  child = spawn(options.run, { cwd: root, shell: true, stdio: "inherit", env });

  child.on("exit", (code) => {
    cleanup();
    process.exit(code ?? 0);
  });
}

if (import.meta.main) {
  await main();
}
