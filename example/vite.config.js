import config from "./config";
import { defineConfig } from "vite";
import { vite } from "../vite/vite";

export default defineConfig(vite(config));
