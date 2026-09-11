import Box from "@mui/material/Box";
import type { LabelOwnerState } from "./styles";
import { StyledLabel } from "./styles";
import { forwardRef } from "react";

import type { HTMLAttributes, ReactNode } from "react";
import type { SxProps, Theme } from "@mui/material/styles";

interface LabelProps extends Omit<HTMLAttributes<HTMLSpanElement>, "color"> {
  children?: ReactNode;
  color?: LabelOwnerState["color"];
  variant?: LabelOwnerState["variant"];
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  sx?: SxProps<Theme>;
}

const Label = forwardRef<HTMLSpanElement, LabelProps>(
  (
    {
      children,
      color = "default",
      variant = "soft",
      startIcon,
      endIcon,
      sx,
      ...other
    },
    ref
  ) => {
    const iconStyles = {
      width: 16,
      height: 16,
      "& svg, img": { width: 1, height: 1, objectFit: "cover" },
    };

    return (
      <StyledLabel
        ref={ref}
        component="span"
        ownerState={{ color, variant }}
        sx={[
          {
            ...(startIcon && { pl: 0.75 }),
            ...(endIcon && { pr: 0.75 }),
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        {startIcon && <Box sx={{ mr: 0.75, ...iconStyles }}> {startIcon} </Box>}

        {children}

        {endIcon && <Box sx={{ ml: 0.75, ...iconStyles }}> {endIcon} </Box>}
      </StyledLabel>
    );
  }
);

export default Label;
