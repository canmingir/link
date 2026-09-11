import type { BoxProps } from "@mui/material/Box";
import * as React from "react";

// Temporary ambient types for the JS component. Remove when Iconify.jsx
// becomes Iconify.tsx (JS→TS migration, Faz 1 / Dalga H).
export interface IconifyProps extends Omit<BoxProps, "ref"> {
  icon: string;
  width?: number | string;
  height?: number | string;
}

declare const Iconify: React.ForwardRefExoticComponent<
  IconifyProps & React.RefAttributes<HTMLElement>
>;

export default Iconify;
