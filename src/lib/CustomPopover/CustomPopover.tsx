import Popover from "@mui/material/Popover";
import type { PopoverArrow } from "./utils";
import type { PopoverProps } from "@mui/material/Popover";
import type { ReactNode } from "react";
import { StyledArrow } from "./styles";
import { getPosition } from "./utils";
import { menuItemClasses } from "@mui/material/MenuItem";

import type { SxProps, Theme } from "@mui/material/styles";

interface CustomPopoverProps extends Omit<PopoverProps, "open" | "sx"> {
  open?: HTMLElement | null;
  children?: ReactNode;
  arrow?: PopoverArrow;
  hiddenArrow?: boolean;
  sx?: SxProps<Theme>;
}

export default function CustomPopover({
  open,
  children,
  arrow = "top-right",
  hiddenArrow,
  sx,
  ...other
}: CustomPopoverProps) {
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
