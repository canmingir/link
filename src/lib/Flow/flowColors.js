import { alpha } from "@mui/material/styles";

export function getFlowColors(theme) {
  const isDark = theme.palette.mode === "dark";

  return {
    node: {
      gradFrom: alpha(theme.palette.secondary.light, 0.2),
      gradTo: alpha(theme.palette.primary.main, 0.3),
      condGradFrom: alpha(theme.palette.secondary.light, 0.2),
      condGradTo: alpha(theme.palette.primary.main, 0.3),
    },
    edge: {
      default: alpha(theme.palette.text.secondary, 0.45),
      true: isDark ? "#66bb6a" : "#4caf50",
      false: isDark ? "#ef5350" : "#f44336",
    },
    dot: alpha(theme.palette.divider, 0.08),
  };
}
