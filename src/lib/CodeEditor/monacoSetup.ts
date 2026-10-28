import type * as Monaco from "monaco-editor";

export const severityMap: Record<
  "error" | "warning" | "info" | "hint",
  Monaco.MarkerSeverity
> = {
  error: 8,
  warning: 4,
  info: 2,
  hint: 1,
};

let validatorsSilenced = false;

export function silenceBuiltInValidators(monaco: typeof Monaco) {
  if (validatorsSilenced) return;
  validatorsSilenced = true;

  const languages = monaco.languages as unknown as {
    typescript?: Record<
      "typescriptDefaults" | "javascriptDefaults",
      { setDiagnosticsOptions: (options: unknown) => void } | undefined
    >;
    json?: {
      jsonDefaults?: { setDiagnosticsOptions: (options: unknown) => void };
    };
  };

  const off = { noSemanticValidation: true, noSyntaxValidation: true };
  languages.typescript?.typescriptDefaults?.setDiagnosticsOptions(off);
  languages.typescript?.javascriptDefaults?.setDiagnosticsOptions(off);
  languages.json?.jsonDefaults?.setDiagnosticsOptions({ validate: false });
}
