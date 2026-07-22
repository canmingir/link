import { Iconify } from "@canmingir/link/platform/components";
import { alpha } from "@mui/material/styles";

import { Box, Button, Collapse, Stack, Typography } from "@mui/material";
import React, { memo, useMemo, useState } from "react";

export type ToolStatus =
  | "awaiting_approval"
  | "pending"
  | "success"
  | "error"
  | "declined";

export type ToolDecision = "approve" | "decline" | "approve_all";

export interface ToolMessageContent {
  id: string;
  name: string;
  input?: Record<string, unknown>;
  output?: string;
  status: ToolStatus;
}

export interface ToolRendererProps {
  name: string;
  input?: Record<string, unknown>;
  output?: string;
  status: ToolStatus;
}

export type ToolRenderers = Record<
  string,
  React.ComponentType<ToolRendererProps>
>;

function formatLabel(name: string): string {
  return name
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.length ? value.map(formatValue).join(", ") : "—";
  }
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([key, val]) => `${formatLabel(key)}: ${formatValue(val)}`)
      .join(", ");
  }
  return String(value);
}

function statusIcon(status: ToolStatus): string {
  if (status === "success") return "solar:check-circle-bold";
  if (status === "error") return "solar:close-circle-bold";
  if (status === "declined") return "solar:forbidden-circle-bold";
  if (status === "awaiting_approval") return "solar:shield-warning-bold";
  return "svg-spinners:tadpole";
}

function statusColor(
  status: ToolStatus
): "success.main" | "error.main" | "warning.main" | "text.secondary" {
  if (status === "success") return "success.main";
  if (status === "error") return "error.main";
  if (status === "awaiting_approval") return "warning.main";
  return "text.secondary";
}

function FieldRow({ label, value }: { label: string; value: unknown }) {
  return (
    <Stack direction="row" spacing={1} sx={{ py: 0.4 }}>
      <Typography
        sx={{
          fontSize: "0.72rem",
          fontWeight: 600,
          color: "text.secondary",
          minWidth: 90,
          flexShrink: 0,
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ fontSize: "0.78rem", wordBreak: "break-word" }}>
        {formatValue(value)}
      </Typography>
    </Stack>
  );
}

function FieldList({ data }: { data: Record<string, unknown> }) {
  const entries = Object.entries(data);
  if (!entries.length) {
    return (
      <Typography sx={{ fontSize: "0.78rem", color: "text.secondary" }}>
        No fields
      </Typography>
    );
  }

  return (
    <Stack>
      {entries.map(([key, value]) => (
        <FieldRow key={key} label={formatLabel(key)} value={value} />
      ))}
    </Stack>
  );
}

function ResultView({ output }: { output: string }) {
  const parsed = useMemo(() => {
    try {
      return JSON.parse(output);
    } catch {
      return undefined;
    }
  }, [output]);

  if (parsed === undefined) {
    return (
      <Typography sx={{ fontSize: "0.78rem", whiteSpace: "pre-wrap" }}>
        {output}
      </Typography>
    );
  }

  if (Array.isArray(parsed)) {
    if (!parsed.length) {
      return (
        <Typography sx={{ fontSize: "0.78rem", color: "text.secondary" }}>
          Empty result
        </Typography>
      );
    }

    return (
      <Stack spacing={1}>
        {parsed.map((item, index) =>
          item && typeof item === "object" ? (
            <Box
              key={index}
              sx={{
                pl: 1,
                borderLeft: (theme) =>
                  `2px solid ${alpha(theme.palette.grey[500], 0.3)}`,
              }}
            >
              <FieldList data={item as Record<string, unknown>} />
            </Box>
          ) : (
            <Typography key={index} sx={{ fontSize: "0.78rem" }}>
              {formatValue(item)}
            </Typography>
          )
        )}
      </Stack>
    );
  }

  if (parsed && typeof parsed === "object") {
    return <FieldList data={parsed as Record<string, unknown>} />;
  }

  return (
    <Typography sx={{ fontSize: "0.78rem" }}>{formatValue(parsed)}</Typography>
  );
}

function ApprovalActions({
  toolCallId,
  onDecision,
}: {
  toolCallId: string;
  onDecision: (toolCallId: string, decision: ToolDecision) => void;
}) {
  return (
    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
      <Button
        size="small"
        variant="contained"
        color="success"
        onClick={() => onDecision(toolCallId, "approve")}
        sx={{ fontSize: "0.7rem", py: 0.25 }}
      >
        Approve
      </Button>
      <Button
        size="small"
        variant="outlined"
        color="error"
        onClick={() => onDecision(toolCallId, "decline")}
        sx={{ fontSize: "0.7rem", py: 0.25 }}
      >
        Decline
      </Button>
      <Button
        size="small"
        variant="text"
        onClick={() => onDecision(toolCallId, "approve_all")}
        sx={{ fontSize: "0.7rem", py: 0.25 }}
      >
        Approve All
      </Button>
    </Stack>
  );
}

const ToolMessage: React.FC<{
  content: string;
  messageRef?: React.RefObject<HTMLDivElement>;
  renderers?: ToolRenderers;
  onDecision?: (toolCallId: string, decision: ToolDecision) => void;
}> = memo(({ content, messageRef, renderers, onDecision }) => {
  const [expanded, setExpanded] = useState(false);

  const tool = useMemo<ToolMessageContent | null>(() => {
    try {
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed.name === "string") return parsed;
      return null;
    } catch {
      return null;
    }
  }, [content]);

  if (!tool) return null;

  const CustomBody = renderers?.[tool.name];
  const awaitingApproval = tool.status === "awaiting_approval";
  const alwaysShowBody = CustomBody || awaitingApproval;

  return (
    <Stack
      ref={messageRef}
      sx={{
        p: 1.5,
        mt: 1.5,
        borderRadius: 2,
        backgroundColor: (theme) => alpha(theme.palette.grey[800], 0.4),
        border: (theme) =>
          `1px solid ${alpha(
            awaitingApproval ? theme.palette.warning.main : theme.palette.grey[500],
            awaitingApproval ? 0.4 : 0.2
          )}`,
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        onClick={alwaysShowBody ? undefined : () => setExpanded((e) => !e)}
        sx={{ cursor: alwaysShowBody ? "default" : "pointer" }}
      >
        <Iconify
          icon="solar:widget-bold-duotone"
          sx={{ width: 18, height: 18, color: "text.secondary" }}
        />
        <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, flex: 1 }}>
          {formatLabel(tool.name)}
        </Typography>
        <Iconify
          icon={statusIcon(tool.status)}
          sx={{ width: 16, height: 16, color: statusColor(tool.status) }}
        />
        {!alwaysShowBody && (
          <Iconify
            icon={expanded ? "mdi:chevron-up" : "mdi:chevron-down"}
            sx={{ width: 16, height: 16, color: "text.secondary" }}
          />
        )}
      </Stack>

      {CustomBody ? (
        <Box sx={{ mt: 1 }}>
          <CustomBody
            name={tool.name}
            input={tool.input}
            output={tool.output}
            status={tool.status}
          />
        </Box>
      ) : awaitingApproval ? (
        <Box sx={{ mt: 1 }}>
          {tool.input && <FieldList data={tool.input} />}
        </Box>
      ) : (
        <Collapse in={expanded}>
          <Box sx={{ mt: 1 }}>
            {tool.input && (
              <>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    color: (theme) => alpha(theme.palette.text.secondary, 0.7),
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Arguments
                </Typography>
                <FieldList data={tool.input} />
              </>
            )}

            {tool.output !== undefined && (
              <>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 1,
                    color: (theme) => alpha(theme.palette.text.secondary, 0.7),
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Result
                </Typography>
                <ResultView output={tool.output} />
              </>
            )}
          </Box>
        </Collapse>
      )}

      {awaitingApproval && onDecision && (
        <ApprovalActions toolCallId={tool.id} onDecision={onDecision} />
      )}
    </Stack>
  );
});

export { ToolMessage };
