import Box from "@mui/material/Box";
import type { ElementType } from "react";

import { alpha, styled } from "@mui/material/styles";

type LabelColor =
  | "default"
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warning"
  | "error";

export interface LabelOwnerState {
  color?: LabelColor;
  variant?: "filled" | "outlined" | "soft";
}

export const StyledLabel = styled(Box)<{
  ownerState: LabelOwnerState;
  component?: ElementType;
}>(({ theme, ownerState }) => {
  const lightMode = theme.palette.mode === "light";

  const filledVariant = ownerState.variant === "filled";

  const outlinedVariant = ownerState.variant === "outlined";

  const softVariant = ownerState.variant === "soft";

  const defaultStyle = {
    ...(ownerState.color === "default" && {
      ...(filledVariant && {
        color: lightMode ? theme.palette.common.white : theme.palette.grey[800],
        backgroundColor: theme.palette.text.primary,
      }),
      ...(outlinedVariant && {
        backgroundColor: "transparent",
        color: theme.palette.text.primary,
        border: `2px solid ${theme.palette.text.primary}`,
      }),
      ...(softVariant && {
        color: theme.palette.text.secondary,
        backgroundColor: alpha(theme.palette.grey[500], 0.16),
      }),
    }),
  };

  const paletteColor =
    ownerState.color && ownerState.color !== "default"
      ? theme.palette[ownerState.color]
      : undefined;

  const colorStyle = {
    ...(paletteColor && {
      ...(filledVariant && {
        color: paletteColor.contrastText,
        backgroundColor: paletteColor.main,
      }),
      ...(outlinedVariant && {
        backgroundColor: "transparent",
        color: paletteColor.main,
        border: `2px solid ${paletteColor.main}`,
      }),
      ...(softVariant && {
        color: paletteColor[lightMode ? "dark" : "light"],
        backgroundColor: alpha(paletteColor.main, 0.16),
      }),
    }),
  };

  return {
    height: 24,
    minWidth: 24,
    lineHeight: 0,
    borderRadius: 6,
    cursor: "default",
    alignItems: "center",
    whiteSpace: "nowrap",
    display: "inline-flex",
    justifyContent: "center",
    textTransform: "capitalize",
    padding: theme.spacing(0, 0.75),
    fontSize: theme.typography.pxToRem(12),
    fontWeight: theme.typography.fontWeightBold,
    transition: theme.transitions.create("all", {
      duration: theme.transitions.duration.shorter,
    }),
    ...defaultStyle,
    ...colorStyle,
  };
});
