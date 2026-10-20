import type * as Monaco from "monaco-editor";

import Editor, { OnMount } from "@monaco-editor/react";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { Fab } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Tooltip from "@mui/material/Tooltip";

import { ctxCompletionRegistry, ensureCompletionProvider } from "./contextProvider";
import {
  buildContextDecorations,
  buildSchemaDecorations,
  escapeHtml,
  injectContextStyles,
} from "./decorations";
import { severityMap, silenceBuiltInValidators } from "./monacoSetup";
import { ensureSchemaProviders, schemaRegistry } from "./schemaProvider";
import type { ContextEntry, SchemaClass } from "./types";

export type { ContextEntry, SchemaClass } from "./types";

export function CodeEditor({
  value,
  onChange,
  onSave,
  onRun,
  readOnly = false,
  path,
  language = "typescript",
  height = "70vh",
  minHeight,
  maxHeight,
  autoHeight = false,
  themeMode = "light",
  backgroundColor,
  contentPaddingTop = 16,
  runButtonLabel = <PlayArrowIcon fontSize="small" />,
  lintAdapter,
  formatAdapter,
  contextEntries = [],
  schemaClasses = [],
  showDiagnostics = Boolean(lintAdapter),
}: {
  value: string;
  onChange: (value: string) => void;
  onSave?: (value: string) => void;
  onRun?: (value: string) => void;
  readOnly?: boolean;
  path?: string;
  language?: string;
  height?: string | number;
  minHeight?: number;
  maxHeight?: number;
  autoHeight?: boolean;
  themeMode?: "light" | "dark";
  backgroundColor?: string;
  contentPaddingTop?: number;
  runButtonLabel?: React.ReactNode;
  lintAdapter?: (params: {
    value: string;
    model: Monaco.editor.ITextModel;
  }) => Promise<
    {
      startLineNumber: number;
      startColumn: number;
      endLineNumber: number;
      endColumn: number;
      message: string;
      severity?: "error" | "warning" | "info" | "hint";
    }[]
  >;
  formatAdapter?: (params: {
    value: string;
    language: string;
  }) => Promise<string>;
  contextEntries?: ContextEntry[];
  schemaClasses?: SchemaClass[];
  showDiagnostics?: boolean;
}) {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof Monaco | null>(null);
  const lintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const decorationsRef =
    useRef<Monaco.editor.IEditorDecorationsCollection | null>(null);
  const contextEntriesRef = useRef<ContextEntry[]>(contextEntries);
  const schemaClassesRef = useRef<SchemaClass[]>(schemaClasses);
  const tooltipNodeRef = useRef<HTMLDivElement | null>(null);
  const tooltipPositionRef =
    useRef<Monaco.editor.IContentWidgetPosition | null>(null);
  const modelUriRef = useRef<string>("");
  const [autoHeightPx, setAutoHeightPx] = useState<number>(0);
  const [hasSelection, setHasSelection] = useState(false);

  const baseTheme = themeMode === "dark" ? "vs-dark" : "vs-light";
  const defineThemeBase: Monaco.editor.BuiltinTheme =
    themeMode === "dark" ? "vs-dark" : "vs";
  const theme = useMemo(
    () => (backgroundColor ? "reusable-code-editor-custom" : baseTheme),
    [backgroundColor, baseTheme]
  );

  const updateDecorations = () => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    const model = editor.getModel();
    if (!model) return;

    const newDecorations = [
      ...buildContextDecorations(model, monaco, contextEntriesRef.current),
      ...buildSchemaDecorations(model, monaco, schemaClassesRef.current),
    ];

    if (decorationsRef.current) {
      decorationsRef.current.set(newDecorations);
    } else {
      decorationsRef.current =
        editor.createDecorationsCollection(newDecorations);
    }
  };

  useEffect(() => {
    contextEntriesRef.current = contextEntries;
    if (modelUriRef.current) {
      ctxCompletionRegistry.set(modelUriRef.current, contextEntries);
    }
    updateDecorations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextEntries]);

  useEffect(() => {
    schemaClassesRef.current = schemaClasses;
    if (modelUriRef.current) {
      schemaRegistry.set(modelUriRef.current, schemaClasses);
    }
    updateDecorations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemaClasses]);

  useEffect(() => {
    const monaco = monacoRef.current;
    if (!monaco) return;
    ensureCompletionProvider(monaco, language);
    ensureSchemaProviders(monaco, language);
  }, [language]);

  useEffect(() => {
    return () => {
      if (modelUriRef.current) {
        ctxCompletionRegistry.delete(modelUriRef.current);
        schemaRegistry.delete(modelUriRef.current);
      }
    };
  }, []);

  const runLint = async () => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    const model = editor.getModel();
    if (!model || !lintAdapter) return;

    const diagnostics = await lintAdapter({
      value: model.getValue(),
      model,
    });

    monaco.editor.setModelMarkers(
      model,
      "reusable-code-editor",
      diagnostics.map((item) => ({
        startLineNumber: item.startLineNumber,
        startColumn: item.startColumn,
        endLineNumber: item.endLineNumber,
        endColumn: item.endColumn,
        message: item.message,
        severity: severityMap[item.severity || "warning"],
      }))
    );
  };

  const runFormat = async () => {
    const editor = editorRef.current;
    if (!editor || !formatAdapter) return;
    const currentValue = editor.getValue();
    const formatted = await formatAdapter({ value: currentValue, language });

    if (typeof formatted === "string" && formatted !== currentValue) {
      editor.setValue(formatted);
    }
  };

  const applyCustomTheme = () => {
    const monaco = monacoRef.current;
    if (!monaco || !backgroundColor) return;
    monaco.editor.defineTheme("reusable-code-editor-custom", {
      base: defineThemeBase,
      inherit: true,
      rules: [],
      colors: { "editor.background": backgroundColor },
    });
    monaco.editor.setTheme("reusable-code-editor-custom");
  };

  useEffect(() => {
    applyCustomTheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backgroundColor, defineThemeBase]);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    decorationsRef.current = null;

    applyCustomTheme();
    injectContextStyles();
    if (!showDiagnostics) {
      silenceBuiltInValidators(monaco);
    }
    ensureCompletionProvider(monaco, language);
    ensureSchemaProviders(monaco, language);

    const syncModelUri = () => {
      const uri = editor.getModel()?.uri.toString() ?? "";
      if (uri !== modelUriRef.current) {
        if (modelUriRef.current) {
          ctxCompletionRegistry.delete(modelUriRef.current);
          schemaRegistry.delete(modelUriRef.current);
        }
        modelUriRef.current = uri;
        if (uri) {
          ctxCompletionRegistry.set(uri, contextEntriesRef.current);
          schemaRegistry.set(uri, schemaClassesRef.current);
        }
      }
    };

    syncModelUri();

    editor.onDidChangeModel(() => {
      decorationsRef.current = null;
      syncModelUri();
      updateDecorations();
    });

    editor.onDidChangeModelContent(() => {
      updateDecorations();
    });

    const tooltipNode = document.createElement("div");
    tooltipNode.style.cssText = [
      "background:#1e1e2e",
      "border:1px solid #3c3c5c",
      "border-radius:6px",
      "padding:8px 12px",
      "font-size:12px",
      "font-family:'JetBrains Mono','Fira Code',monospace",
      "color:#cdd6f4",
      "pointer-events:none",
      "min-width:260px",
      "max-width:520px",
      "line-height:1.6",
      "box-shadow:0 4px 12px rgba(0,0,0,.4)",
      "z-index:100",
    ].join(";");
    tooltipNodeRef.current = tooltipNode;

    const tooltipWidget: Monaco.editor.IContentWidget = {
      getId: () => "ctx.var.tooltip",
      getDomNode: () => tooltipNode,
      getPosition: () => tooltipPositionRef.current,
    };
    editor.addContentWidget(tooltipWidget);

    const hideTooltip = () => {
      tooltipPositionRef.current = null;
      editor.layoutContentWidget(tooltipWidget);
    };

    editor.onMouseMove((e) => {
      const pos = e.target.position;
      if (!pos) {
        hideTooltip();
        return;
      }

      const range = new monaco.Range(
        pos.lineNumber,
        pos.column,
        pos.lineNumber,
        pos.column + 1
      );
      const decorations = editor.getModel()?.getDecorationsInRange(range) ?? [];
      const hit = decorations.find(
        (d) =>
          d.options.inlineClassName === "ctx-var-decl" ||
          d.options.inlineClassName === "ctx-var-ref"
      );

      if (!hit) {
        hideTooltip();
        return;
      }

      const tokenText = editor.getModel()?.getValueInRange(hit.range) ?? "";
      const entry = contextEntriesRef.current.find((c) => c.key === tokenText);
      if (!entry) {
        hideTooltip();
        return;
      }

      const isDecl = hit.options.inlineClassName === "ctx-var-decl";
      const valueHtml =
        entry.value === null
          ? `<span style="color:#6c7086;font-style:italic">populated at runtime</span>`
          : `<span style="color:#a6e3a1">${escapeHtml(
              typeof entry.value === "object"
                ? JSON.stringify(entry.value)
                : String(entry.value)
            )}</span>`;

      tooltipNode.innerHTML = [
        `<div><span style="color:#89b4fa;font-weight:600">ctx</span> <span style="color:#f38ba8">${escapeHtml(
          entry.key
        )}</span></div>`,
        `<div style="color:#a6adc8;margin-top:2px">value: ${valueHtml}</div>`,
        entry.description
          ? `<div style="color:#6c7086;margin-top:2px;font-size:11px">${escapeHtml(
              entry.description
            )}</div>`
          : "",
        `<div style="color:#6c7086;margin-top:2px;font-size:11px">${
          isDecl ? "declared here" : "from context store"
        }</div>`,
      ]
        .filter(Boolean)
        .join("");

      tooltipPositionRef.current = {
        position: {
          lineNumber: hit.range.startLineNumber,
          column: hit.range.startColumn,
        },
        preference: [monaco.editor.ContentWidgetPositionPreference.BELOW],
      };
      editor.layoutContentWidget(tooltipWidget);
    });

    editor.onMouseLeave(hideTooltip);

    editor.onDidChangeCursorSelection(({ selection }) =>
      setHasSelection(!selection.isEmpty())
    );

    editor.addAction({
      id: "saveEvent",
      label: "Save",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      run: async () => {
        await runFormat();
        onSave?.(editor.getValue());
      },
    });

    if (autoHeight) {
      const syncHeight = () => {
        const contentHeight = editor.getContentHeight();
        const clamped = Math.max(
          minHeight ?? 0,
          maxHeight !== undefined
            ? Math.min(contentHeight, maxHeight)
            : contentHeight
        );
        setAutoHeightPx(clamped);
        editor.layout({
          width: editor.getLayoutInfo().width,
          height: clamped,
        });
      };
      editor.onDidContentSizeChange(syncHeight);
      syncHeight();
    }

    void runLint();
    updateDecorations();
  };

  const handleRun = () => {
    const editor = editorRef.current;
    const model = editor?.getModel();
    const selection = editor?.getSelection();

    const selected =
      model && selection && !selection.isEmpty()
        ? model.getValueInRange(selection)
        : "";

    onRun?.(selected.trim() ? selected : editor?.getValue() ?? value);
  };

  const resolvedHeight = autoHeight && autoHeightPx > 0 ? autoHeightPx : height;

  return (
    <div style={{ position: "relative", height: resolvedHeight }}>
      {onRun ? (
        <Tooltip
          title={hasSelection ? "Run selection" : "Run"}
          placement="top"
          arrow
        >
          <Fab
            onClick={handleRun}
            color="inherit"
            sx={{
              background: "#2e7d32",
              color: "#fff",
              "&:hover": {
                background: "#388e3c",
              },
              position: "absolute",
              right: 12,
              bottom: 12,
            }}
          >
            {runButtonLabel}
          </Fab>
        </Tooltip>
      ) : null}

      <Editor
        path={path}
        language={language}
        value={value}
        onChange={(nextValue) => {
          const resolved = nextValue || "";
          onChange(resolved);
          if (lintTimerRef.current) {
            clearTimeout(lintTimerRef.current);
          }
          lintTimerRef.current = setTimeout(() => {
            void runLint();
          }, 350);
        }}
        onMount={handleMount}
        height="100%"
        theme={theme}
        options={{
          tabSize: 2,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: 13,
          lineHeight: 22,
          minimap: { enabled: false },
          scrollbar: {
            vertical: autoHeight ? "hidden" : "auto",
            horizontal: "hidden",
            alwaysConsumeMouseWheel: !autoHeight,
            verticalScrollbarSize: 4,
          },
          scrollBeyondLastLine: false,
          overviewRulerLanes: 0,
          readOnly,
          renderValidationDecorations: showDiagnostics ? "editable" : "off",
          renderLineHighlightOnlyWhenFocus: true,
          selectOnLineNumbers: true,
          padding: { top: contentPaddingTop, bottom: 16 },
          lineDecorationsWidth: 4,
          glyphMargin: false,
          fixedOverflowWidgets: true,
          hover: { above: false },
        }}
      />
    </div>
  );
}
