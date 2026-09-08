import Iconify from "../Iconify/Iconify";
import React from "react";
import { handleDataAttrs } from "../Flow/connectors/handleAttrs";

import { alpha, styled } from "@mui/material/styles";

const FieldsPanel = styled("div")(({ theme }) => ({
  position: "absolute",
  top: "calc(100% + 10px)",
  left: 0,
  width: "100%",
  minWidth: 260,
  display: "flex",
  gap: 10,
  padding: 10,
  borderRadius: 12,
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 6px 18px rgba(0,0,0,0.5)"
      : "0 6px 18px rgba(0,0,0,0.12)",
  zIndex: 25,
  cursor: "default",
}));

const FieldColumn = styled("div", {
  shouldForwardProp: (prop) => prop !== "align",
})(({ align, theme }) => ({
  flex: 1,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: 2,
  ...(align === "right" && {
    paddingLeft: 10,
    borderLeft: `1px solid ${theme.palette.divider}`,
  }),
}));

const ColumnLabel = styled("div", {
  shouldForwardProp: (prop) => prop !== "align",
})(({ align, theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 4,
  justifyContent: align === "right" ? "flex-end" : "flex-start",
  marginBottom: 4,
  fontSize: 9,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: theme.palette.text.disabled,
}));

const FieldRow = styled("div", {
  shouldForwardProp: (prop) => prop !== "align",
})(({ align, theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "3px 4px",
  borderRadius: 6,
  flexDirection: align === "right" ? "row-reverse" : "row",
  transition: "background-color 0.15s ease",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const Dot = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "variant" && prop !== "bound" && prop !== "interactive",
})(({ variant, bound, interactive, theme }) => {
  const isBound = bound === "true";
  const disabled = interactive === "false";
  const accent =
    variant === "out"
      ? theme.palette.secondary.main
      : theme.palette.primary.main;

  return {
    position: "relative",
    flexShrink: 0,
    boxSizing: "content-box",
    width: 9,
    height: 9,
    borderRadius: "50%",
    background: isBound ? accent : theme.palette.background.paper,
    border: `2px solid ${isBound ? accent : theme.palette.grey[400]}`,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    cursor: disabled ? "default" : "crosshair",
    opacity: disabled ? 0.35 : 1,
    pointerEvents: "auto",
    transition:
      "transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
    ...(!disabled && {
      "&:hover": {
        transform: "scale(1.35)",
        borderColor: accent,
        boxShadow: `0 0 0 2px ${
          theme.palette.background.paper
        }, 0 0 0 5px ${alpha(accent, 0.22)}`,
      },
    }),
  };
});

const FieldLabel = styled("div", {
  shouldForwardProp: (prop) => prop !== "align" && prop !== "bound",
})(({ align, bound, theme }) => ({
  flex: 1,
  minWidth: 0,
  fontSize: 11,
  fontWeight: bound === "true" ? 600 : 400,
  color:
    bound === "true"
      ? theme.palette.text.primary
      : theme.palette.text.secondary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  textAlign: align,
}));

export { handleDataAttrs };

const ConnectionsPanel = ({
  inputs = [],
  outputs = [],
  inputsLabel = "Inputs",
  outputsLabel = "Outputs",
  renderLabel,
  nodeId,
  sx,
}) => {
  const label = (name, side) => (renderLabel ? renderLabel(name, side) : name);

  const attrsFor = (side, field) => {
    if (field.dataAttrs) return field.dataAttrs;
    if (nodeId) return handleDataAttrs(side, nodeId, field.name);
    return undefined;
  };

  return (
    <FieldsPanel sx={sx} onMouseDown={(e) => e.stopPropagation()}>
      <FieldColumn align="left">
        <ColumnLabel align="left">
          <Iconify icon="mdi:arrow-down-left" width={10} height={10} />
          {inputsLabel}
        </ColumnLabel>
        {inputs.map((field) => {
          const bound = field.bound ? "true" : "false";
          const interactive = field.interactive === false ? "false" : "true";
          return (
            <FieldRow key={`in-${field.name}`} align="left">
              <Dot
                variant="in"
                bound={bound}
                interactive={interactive}
                title={field.title}
                onMouseDown={field.onHandleMouseDown}
                {...attrsFor("in", field)}
              />
              <FieldLabel align="left" bound={bound} title={field.name}>
                {label(field.name, "in")}
              </FieldLabel>
            </FieldRow>
          );
        })}
      </FieldColumn>

      <FieldColumn align="right">
        <ColumnLabel align="right">
          {outputsLabel}
          <Iconify icon="mdi:arrow-up-right" width={10} height={10} />
        </ColumnLabel>
        {outputs.map((field) => {
          const interactive = field.interactive === false ? "false" : "true";
          return (
            <FieldRow key={`out-${field.name}`} align="right">
              <Dot
                variant="out"
                interactive={interactive}
                title={field.title}
                onMouseDown={field.onHandleMouseDown}
                {...attrsFor("out", field)}
              />
              <FieldLabel align="right" title={field.name}>
                {label(field.name, "out")}
              </FieldLabel>
            </FieldRow>
          );
        })}
      </FieldColumn>
    </FieldsPanel>
  );
};

export default ConnectionsPanel;
