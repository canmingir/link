import Box from "@mui/material/Box";
import Iconify from "../../../../components/Iconify";
import Link from "@mui/material/Link";
import ListItemButton from "@mui/material/ListItemButton";
import React from "react";
import { RouterLink } from "../../../../routes/components";
import { forwardRef } from "react";

import { alpha, styled } from "@mui/material/styles";

// ----------------------------------------------------------------------

export const NavItem = forwardRef(
  (
    { title, path, icon, open, active, hasChild, externalLink, ...other },
    ref
  ) => {
    const renderContent = (
      <StyledNavItem ref={ref} open={open} active={active} {...other}>
        <Box component="span" sx={{ mr: 2, display: "inline-flex" }}>
          <Iconify width={16} icon={icon}></Iconify>
        </Box>

        <Box component="span" sx={{ flexGrow: 1 }}>
          {title}
        </Box>

        {hasChild && (
          <Iconify
            width={16}
            icon={
              open
                ? "eva:arrow-ios-downward-fill"
                : "eva:arrow-ios-forward-fill"
            }
          />
        )}
      </StyledNavItem>
    );

    if (hasChild) {
      return renderContent;
    }

    if (externalLink)
      return (
        <Link
          href={path}
          target="_blank"
          rel="noopener"
          color="inherit"
          underline="none"
        >
          {renderContent}
        </Link>
      );

    return (
      <Link component={RouterLink} href={path} color="inherit" underline="none">
        {renderContent}
      </Link>
    );
  }
);

// ----------------------------------------------------------------------

const StyledNavItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "active",
})(({ open, active, theme }) => {
  const opened = open && !active;

  return {
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium,
    height: 48,
    ...(active && {
      color: theme.palette.primary.main,
      fontWeight: theme.typography.fontWeightSemiBold,
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.16),
      },
    }),
    ...(opened && {
      backgroundColor: theme.palette.action.hover,
    }),
  };
});
