import { ChatBubbleOutline } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  TextField,
  Tooltip,
} from "@mui/material";

import {
  CodeEditor,
  type ContextEntry,
  type SchemaClass,
} from "../CodeEditor";
import React from "react";
import ViewPanel from "../ViewPanel";
import SpeedIcon from "@mui/icons-material/Speed";
import { useNavigate } from "react-router-dom";

type LanguageOption = {
  value: string;
  extension: string;
  starterCode: string;
};

const languageOptions: LanguageOption[] = [
  {
    value: "python",
    extension: "py",
    starterCode: `expensive_items = Item.filter(item => item.price > 500)

for item of expensive_items:
    print(item.name, item.price)`,
  },
  {
    value: "typescript",
    extension: "ts",
    starterCode: `type Agent = { id: string; name: string; status: "active" | "paused" };
const agents: Agent[] = [
  { id: "a-1", name: "SupportAgent", status: "active" },
  { id: "a-2", name: "SalesAgent", status: "paused" }
];
export const activeAgents = (list: Agent[]) => list.filter((a) => a.status === "active");`,
  },
  {
    value: "javascript",
    extension: "js",
    starterCode: `const agents = [
  { id: "a-1", name: "SupportAgent", status: "active" },
  { id: "a-2", name: "SalesAgent", status: "paused" }
];
const activeAgents = (list) => list.filter((a) => a.status === "active");
console.log(activeAgents(agents));`,
  },
  {
    value: "go",
    extension: "go",
    starterCode: `package main

import "fmt"

type Agent struct {
  ID string
  Name string
  Status string
}

func activeAgents(items []Agent) []Agent {
  result := []Agent{}
  for _, a := range items {
    if a.Status == "active" {
      result = append(result, a)
    }
  }
  return result
}

func main() {
  agents := []Agent{
    {ID: "a-1", Name: "SupportAgent", Status: "active"},
    {ID: "a-2", Name: "SalesAgent", Status: "paused"},
  }
  fmt.Println(activeAgents(agents))
}`,
  },
  {
    value: "java",
    extension: "java",
    starterCode: `import java.util.List;
import java.util.stream.Collectors;

record Agent(String id, String name, String status) {}

class Main {
  public static void main(String[] args) {
    List<Agent> agents = List.of(
      new Agent("a-1", "SupportAgent", "active"),
      new Agent("a-2", "SalesAgent", "paused")
    );
    System.out.println(activeAgents(agents));
  }

  static List<Agent> activeAgents(List<Agent> items) {
    return items.stream().filter(a -> "active".equals(a.status())).collect(Collectors.toList());
  }
}`,
  },
  {
    value: "json",
    extension: "json",
    starterCode: `{
  "agents": [
    { "id": "a-1", "name": "SupportAgent", "status": "active" },
    { "id": "a-2", "name": "SalesAgent", "status": "paused" }
  ]
}`,
  },
  {
    value: "markdown",
    extension: "md",
    starterCode: `# Agent Notes

- SupportAgent: active
- SalesAgent: paused`,
  },
];

const defaultLanguage = languageOptions[0];

const detectLanguage = (text: string): string => {
  const trimmed = text.trim();
  if (!trimmed) return "python";

  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    return "json";
  }

  const isPythonStatement = /^\s*[A-Za-z_]\w*\s*(?:=\s*[A-Za-z_][\w.]*)?\s*\(/m;
  if (
    /^\s*def\s+\w+\(/m.test(text) ||
    /^\s*import\s+\w+/m.test(text) ||
    /^\s*from\s+\w+\s+import\s+/m.test(text) ||
    /:\s*\n\s+/.test(text) ||
    (isPythonStatement.test(text) && !/[;{}]|=>|\bconst\b|\blet\b/.test(text))
  ) {
    return "python";
  }

  if (
    /^#{1,6}\s/m.test(text) ||
    /```/.test(text) ||
    /^\s*[-*]\s+/m.test(text)
  ) {
    return "markdown";
  }

  if (
    /^\s*package\s+\w+/m.test(text) ||
    /^\s*func\s+\w+\(/m.test(text) ||
    /:=/.test(text)
  ) {
    return "go";
  }

  if (
    /^\s*public\s+class\s+\w+/m.test(text) ||
    /^\s*class\s+\w+\s*\{/m.test(text) ||
    /System\.out\.println/.test(text)
  ) {
    return "java";
  }

  if (
    /(^|\n)\s*(interface|type)\s+\w+/m.test(text) ||
    /:\s*(string|number|boolean|unknown|any)\b/.test(text)
  ) {
    return "typescript";
  }

  return "python";
};

const getExtension = (language: string): string => {
  return (
    languageOptions.find((item) => item.value === language)?.extension || "txt"
  );
};

export type PlatformLowCodeEditorProps = {
  initialCode?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSave?: (value: string) => void;
  onRun?: (value: string) => void;
  showPromptDialogTrigger?: boolean;
  showDownload?: boolean;
  onToggleDownload?: () => void;
  showRunButton?: boolean;
  readOnly?: boolean;
  editorHeight?: string | number;
  autoHeight?: boolean;
  minHeight?: number;
  maxHeight?: number;
  onLogicChatToggle?: () => void;
  logicChatOpen?: boolean;
  panelContent?: string;
  showPanel?: boolean;
  panelLoading?: boolean;
  panelTitle?: string;
  contextEntries?: ContextEntry[];
  schemaClasses?: SchemaClass[];
  /** When provided, overrides auto-detection and locks the editor to this language. */
  language?: string;
};

const PlatformLowCodeEditor = ({
  initialCode = defaultLanguage.starterCode,
  value: controlledValue,
  onChange: onChangeProp,
  onSave,
  onRun,
  showRunButton = true,
  readOnly = false,
  editorHeight = "60vh",
  autoHeight = false,
  minHeight,
  maxHeight,
  onLogicChatToggle,
  logicChatOpen = false,
  panelContent,
  showPanel = false,
  panelLoading = false,
  panelTitle,
  showDownload,
  onToggleDownload,
  contextEntries,
  schemaClasses,
  language: forcedLanguage,
}: PlatformLowCodeEditorProps) => {
  const isControlled = controlledValue !== undefined;
  const isLanguageLocked = forcedLanguage !== undefined;
  const navigate = useNavigate();
  const instanceId = React.useId().replace(/:/g, "");
  const [internalCode, setInternalCode] = React.useState(initialCode);
  const code = isControlled ? controlledValue : internalCode;
  const [open, setOpen] = React.useState(false);

  const initialLang = isLanguageLocked
    ? forcedLanguage
    : detectLanguage(isControlled ? controlledValue : initialCode);
  const [language, setLanguage] = React.useState(initialLang);
  const [path, setPath] = React.useState(
    `logic/${instanceId}/main.${getExtension(initialLang)}`
  );
  const languageRef = React.useRef(initialLang);

  const applyLanguage = React.useCallback(
    (detected: string) => {
      if (detected !== languageRef.current) {
        languageRef.current = detected;
        setLanguage(detected);
        setPath(`logic/${instanceId}/main.${getExtension(detected)}`);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  React.useEffect(
    () => {
      if (!isControlled) {
        setInternalCode(initialCode);
        if (!isLanguageLocked) {
          applyLanguage(detectLanguage(initialCode));
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initialCode, isControlled, isLanguageLocked]
  );

  React.useEffect(() => {
    if (forcedLanguage !== undefined) {
       applyLanguage(forcedLanguage);
    } else if (controlledValue !== undefined) {
       applyLanguage(detectLanguage(controlledValue));
    }
   }, [controlledValue, forcedLanguage, applyLanguage]);

  const handleCodeChange = (value: string) => {
    if (!isControlled) {
      setInternalCode(value);
    }
    if (!isLanguageLocked) {
      applyLanguage(detectLanguage(value));
    }
    onChangeProp?.(value);
  };

  return (
    <Box
      sx={{
        overflow: "hidden",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {showPanel && (
        <ViewPanel
          title={panelTitle}
          content={panelContent}
          loading={panelLoading}
          height={"auto"}
        />
      )}

      <Box sx={{ position: "relative", flex: 1, minHeight: 0 }}>
        {onLogicChatToggle && (
          <Tooltip
            title={logicChatOpen ? "Close Logic Chat" : "Open Logic Chat"}
            placement="left"
          >
            <Fab
              color="inherit"
              onClick={onLogicChatToggle}
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                zIndex: 2,
                boxShadow: "none",
                border: "1px solid",
                bgcolor: "common.white",
                color: "background.paper",
              }}
            >
              <ChatBubbleOutline sx={{ fontSize: 18 }} />
            </Fab>
          </Tooltip>
        )}
        {onToggleDownload && (
          <Tooltip title={showDownload ? "Hide" : "Show"} placement="top">
            <Fab
              onClick={onToggleDownload}
              color="inherit"
              sx={{
                position: "absolute",
                bottom: 12,
                right: 56,
              }}
            >
              <SpeedIcon sx={{ fontSize: 18 }} />
            </Fab>
          </Tooltip>
        )}
        <CodeEditor
          value={code}
          onChange={handleCodeChange}
          onSave={(value) => {
            onSave?.(value);
            console.debug("Editor saved", value.length);
          }}
          language={language}
          path={path}
          readOnly={readOnly}
          themeMode="dark"
          backgroundColor="#000000"
          height={editorHeight}
          autoHeight={autoHeight}
          minHeight={minHeight}
          maxHeight={maxHeight}
          contextEntries={contextEntries}
          schemaClasses={schemaClasses}
          onRun={
            showRunButton
              ? (value) => {
                  onRun?.(value);
                }
              : undefined
          }
        />
      </Box>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle>Prompt Logic Statement</DialogTitle>
        <DialogContent>
          <TextField label="Prompt" fullWidth multiline rows={4} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              setOpen(false);
              navigate("/no-code-editor");
            }}
          >
            Generate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlatformLowCodeEditor;
