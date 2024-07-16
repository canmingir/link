import Popover from "@mui/material/Popover";
import React from "react";
import { StyledArrow } from "./styles";
import { getPosition } from "./utils";
import { menuItemClasses } from "@mui/material/MenuItem";

// ----------------------------------------------------------------------

export default function CustomPopover({
  open,
  children,
  arrow = "top-right",
  hiddenArrow,
  sx,
  ...other
}) {
  const { style, anchorOrigin, transformOrigin } = getPosition(arrow);

  return (
    <Popover
      open={Boolean(open)}
      anchorEl={open}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      slotProps={{
        paper: {
          sx: {
            width: "auto",
            overflow: "inherit",
            ...style,
            [`& .${menuItemClasses.root}`]: {
              "& svg": {
                mr: 2,
                flexShrink: 0,
              },
            },
            ...sx,
          },
        },
      }}
      {...other}
    >
      {!hiddenArrow && <StyledArrow arrow={arrow} />}

      {children}
    </Popover>
  );
}
