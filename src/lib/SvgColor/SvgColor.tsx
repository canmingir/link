import Box from "@mui/material/Box";
import type { BoxProps } from "@mui/material/Box";
import { forwardRef } from "react";

interface SvgColorProps extends Omit<BoxProps, "children"> {
  src: string;
  variant?: string;
}

const SvgColor = forwardRef<HTMLSpanElement, SvgColorProps>(
  ({ src, sx, ...other }, ref) => (
    <Box
      component="span"
      className="svg-color"
      ref={ref}
      sx={{
        width: 24,
        height: 24,
        display: "inline-block",
        bgcolor: "currentColor",
        mask: `url(${src}) no-repeat center / contain`,
        WebkitMask: `url(${src}) no-repeat center / contain`,
        ...sx,
      }}
      {...other}
    />
  )
);

export default SvgColor;
