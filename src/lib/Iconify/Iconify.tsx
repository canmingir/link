import Box from "@mui/material/Box";
import type { BoxProps } from "@mui/material/Box";
import { Icon } from "@iconify/react";
import { forwardRef } from "react";

const Iconify = forwardRef<
  SVGElement,
  Omit<BoxProps, "children"> & { icon: string; width?: number }
>(({ icon, width = 20, sx, ...other }, ref) => (
  <Box
    ref={ref}
    component={Icon}
    className="component-iconify"
    icon={icon}
    sx={{ width, height: width, ...sx }}
    {...other}
  />
));

export default Iconify;
