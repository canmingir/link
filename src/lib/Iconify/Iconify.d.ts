import type { BoxProps } from "@mui/material/Box";
import * as React from "react";

export interface IconifyProps extends Omit<BoxProps, "ref"> {
  icon: string;
  width?: number | string;
  height?: number | string;
}

declare const Iconify: React.ForwardRefExoticComponent<
  IconifyProps & React.RefAttributes<HTMLElement>
>;

export default Iconify;
