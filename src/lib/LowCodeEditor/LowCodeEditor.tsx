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

import { defaultLanguage, detectLanguage, getExtension } from "./languageOptions";

const LowCodeEditor = ({
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
}: {
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
  language?: string;
}) => {
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

export default LowCodeEditor;
