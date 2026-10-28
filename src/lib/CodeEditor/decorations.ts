import type * as Monaco from "monaco-editor";

import type { ContextEntry, SchemaClass } from "./types";

export function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildSchemaDecorations(
  model: Monaco.editor.ITextModel,
  monaco: typeof Monaco,
  classes: SchemaClass[]
): Monaco.editor.IModelDeltaDecoration[] {
  if (!classes.length) return [];

  const decorations: Monaco.editor.IModelDeltaDecoration[] = [];
  const lines = model.getValue().split("\n");

  for (const cls of classes) {
    const pattern = new RegExp(`\\b${escapeRegex(cls.name)}\\b`, "g");
    lines.forEach((line, lineIdx) => {
      let match: RegExpExecArray | null;
      pattern.lastIndex = 0;
      while ((match = pattern.exec(line)) !== null) {
        const startColumn = match.index + 1;
        decorations.push({
          range: new monaco.Range(
            lineIdx + 1,
            startColumn,
            lineIdx + 1,
            startColumn + cls.name.length
          ),
          options: { inlineClassName: "schema-class-ref" },
        });
      }
    });
  }

  return decorations;
}

let ctxStyleInjected = false;

export function injectContextStyles() {
  if (ctxStyleInjected) return;
  ctxStyleInjected = true;
  const style = document.createElement("style");
  style.textContent = `
    .ctx-var-decl {
      color: #f59e0b !important;
      cursor: help;
    }
    .ctx-var-ref {
      color: #60a5fa !important;
      cursor: help;
    }
    .schema-class-ref {
      color: #c084fc !important;
      font-weight: 600;
      cursor: help;
    }
  `;
  document.head.appendChild(style);
}

export function buildContextDecorations(
  model: Monaco.editor.ITextModel,
  monaco: typeof Monaco,
  contextEntries: ContextEntry[]
): Monaco.editor.IModelDeltaDecoration[] {
  if (!contextEntries.length) return [];

  const text = model.getValue();
  const lines = text.split("\n");
  const decorations: Monaco.editor.IModelDeltaDecoration[] = [];

  for (const { key } of contextEntries) {
    const pattern = new RegExp(`\\b${escapeRegex(key)}\\b`, "g");

    lines.forEach((line, lineIdx) => {
      const lineNumber = lineIdx + 1;
      const eqIdx = line.indexOf("=");
      const isDeclaration =
        eqIdx > 0 &&
        line.slice(0, eqIdx).trim() === key &&
        (line[eqIdx - 1] ?? "") !== "!" &&
        (line[eqIdx - 1] ?? "") !== "<" &&
        (line[eqIdx - 1] ?? "") !== ">" &&
        (line[eqIdx + 1] ?? "") !== "=";

      let match: RegExpExecArray | null;
      pattern.lastIndex = 0;

      while ((match = pattern.exec(line)) !== null) {
        const startColumn = match.index + 1;
        const endColumn = startColumn + key.length;
        decorations.push({
          range: new monaco.Range(
            lineNumber,
            startColumn,
            lineNumber,
            endColumn
          ),
          options: {
            inlineClassName: isDeclaration ? "ctx-var-decl" : "ctx-var-ref",
          },
        });
      }
    });
  }

  return decorations;
}
