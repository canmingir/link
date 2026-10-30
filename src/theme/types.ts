import type { Components } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";

type ThemeOverrideFn = (theme: Theme) => Components<Theme>;

export const PALETTE_COLORS: (
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warning"
  | "error"
)[] = ["primary", "secondary", "info", "success", "warning", "error"];
