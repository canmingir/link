import { useState } from "react";

import { Box, ClickAwayListener, IconButton } from "@mui/material";
import type { MouseEvent, ReactNode } from "react";

interface ToggleableMenuProps {
  defaultIcon: ReactNode;
  children: ReactNode;
}

function ToggleableMenu({ defaultIcon, children }: ToggleableMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDefaultIconClick = (event: MouseEvent) => {
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleMenuItemClick = (event: MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box>
        {isOpen ? (
          <Box onClick={handleMenuItemClick}>{children}</Box>
        ) : (
          <IconButton size="small" onClick={handleDefaultIconClick}>
            {defaultIcon}
          </IconButton>
        )}
      </Box>
    </ClickAwayListener>
  );
}

export default ToggleableMenu;
