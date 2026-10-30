import type * as Monaco from "monaco-editor";

import type { ContextEntry } from "./types";

export const ctxCompletionRegistry = new Map<string, ContextEntry[]>();
const ctxProvidersRegistered = new Set<string>();

export function ensureCompletionProvider(
  monaco: typeof Monaco,
  language: string
) {
  if (ctxProvidersRegistered.has(language)) return;
  ctxProvidersRegistered.add(language);

  monaco.languages.registerCompletionItemProvider(language, {
    provideCompletionItems(model, position) {
      const entries = ctxCompletionRegistry.get(model.uri.toString()) ?? [];
      if (!entries.length) return { suggestions: [] };

      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      return {
        suggestions: entries.map((entry) => ({
          label: entry.key,
          kind: monaco.languages.CompletionItemKind.Variable,
          detail:
            entry.value === null
              ? "context · populated at runtime"
              : `context · ${
                  typeof entry.value === "object"
                    ? JSON.stringify(entry.value)
                    : String(entry.value)
                }`,
          documentation: entry.description ?? undefined,
          insertText: entry.key,
          range,
          sortText: `0_${entry.key}`,
        })),
      };
    },
  });
}
