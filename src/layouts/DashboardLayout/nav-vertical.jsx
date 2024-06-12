import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import Iconify from "../../components/iconify/index.js";
import Logo from "../../components/logo";
import { NAV } from "../config-layout";
import { NavSectionVertical } from "../../components/nav-section";
import NavToggleButton from "../common/nav-toggle-button";
import PropTypes from "prop-types";
import React from "react";
import Scrollbar from "../../components/scrollbar";
import Stack from "@mui/material/Stack";
import config from "../../config/config";
import { useEffect } from "react";
import { useEvent } from "@nucleoidai/react-event";
import { useNavigate } from "react-router-dom";
import { usePathname } from "../../routes/hooks/use-pathname";
import { useResponsive } from "../../hooks/use-responsive";
import { useUser } from "../../hooks/use-user";
// ----------------------------------------------------------------------

export default function NavVertical({ openNav, onCloseNav }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const pathname = usePathname();
  const [hideSubheader] = useEvent("PAGE_CHANGED", { subheader: "" });
  const { sideMenu, actionButtons, endItem } = config.get().menu;
  const lgUp = useResponsive("up", "lg");

  useEffect(() => {
    const index = sideMenu.findIndex(
      (item) => item.subheader === hideSubheader.subheader
    );

    if (index !== -1) {
      sideMenu.splice(index, 1);
    }
  }, [hideSubheader]);

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Logo sx={{ mt: 3, ml: 4, mb: 1 }} />
      <NavSectionVertical
        data={sideMenu}
        slotProps={{
          currentRole: user?.role,
        }}
      />
      <Box sx={{ flexGrow: 1 }} />
      <Stack
        direction={"column"}
        alignItems={"center"}
        justifyItems={"center"}
        sx={{ marginBottom: 3 }}
        gap={2}
      >
        {actionButtons &&
          actionButtons?.map((Action, index) => (
            <Box key={index} component={Action}></Box>
          ))}
      </Stack>
      {endItem && (
        <Button
          data-cy="end-item"
          fullWidth={true}
          onClick={() => navigate(endItem.path)}
        >
          <Iconify
            icon={endItem.icon}
            sx={{
              width: 32,
              height: 32,
              color: "text.secondary",
              mx: "auto",
            }}
          />
        </Button>
      )}
    </Scrollbar>
  );
  return (
    <Box
      data-cy="nav-vertical"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_VERTICAL },
      }}
    >
      <NavToggleButton />

      {lgUp ? (
        <Stack
          sx={{
            height: 1,
            position: "fixed",
            width: NAV.W_VERTICAL,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.W_VERTICAL,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

NavVertical.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};
