import type { Components } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";

/** A single MUI component-overrides factory: takes the base theme, returns a
 * `components` fragment that gets merged into the final theme. */
export type ThemeOverrideFn = (theme: Theme) => Components<Theme>;

/** The intent-based palette color slots the app's overrides index into
 * dynamically (`COLORS.map(color => theme.palette[color])`). */
export type PaletteColorName =
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warning"
  | "error";

export const PALETTE_COLORS: PaletteColorName[] = [
  "primary",
  "secondary",
  "info",
  "success",
  "warning",
  "error",
];

export type { Theme };
