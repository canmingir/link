import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Iconify from "../../components/Iconify";
import Logo from "../../components/logo";
import { NAV } from "../config-layout";
import { NavSectionMini } from "../../components/nav-section";
import NavToggleButton from "../common/nav-toggle-button";
import SettingsDialog from "../../widgets/SettingsDialog";
import Stack from "@mui/material/Stack";
import config from "../../config/config";
import { hideScroll } from "../../theme/css";
import { useResponsive } from "../../hooks/use-responsive";
import { useUser } from "../../hooks/use-user";

import React, { useState } from "react";

export default function NavMini({ only }) {
  const { user } = useUser();
  const { sideMenu, actionButtons } = config().menu;
  const [openSettings, setOpenSettings] = useState(false);
  const lgUp = useResponsive("up", "lg");
  const handleCloseSettings = () => {
    setOpenSettings(false);
  };

  return (
    <Box
      data-cy="nav-mini"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_MINI },
      }}
    >
      {!only && (
        <NavToggleButton
          sx={{
            top: 22,
            left: NAV.W_MINI - 12,
          }}
        />
      )}

      <Stack
        sx={{
          pb: 2,
          height: 1,
          position: "fixed",
          width: NAV.W_MINI,
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          ...hideScroll.x,
        }}
      >
        <Logo sx={{ mx: "auto", my: 2 }} />
        <NavSectionMini
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
          sx={{
            marginBottom: lgUp ? 3 : 0,
            position: lgUp ? "static" : "fixed",
            bottom: lgUp ? "auto" : 66,
            width: "100%",
          }}
          gap={2}
        >
          {actionButtons &&
            actionButtons.map((Action, index) => (
              <Box key={index} component={Action}></Box>
            ))}
          <Button
            onClick={() => setOpenSettings(true)}
            sx={{
              position: lgUp ? "static" : "fixed",
              bottom: lgUp ? "auto" : 16,
              width: "100%",
            }}
          >
            <Iconify
              icon={"ic:baseline-settings"}
              sx={{
                width: 32,
                height: 32,
                color: "text.secondary",
              }}
            />
          </Button>
        </Stack>
        <SettingsDialog open={openSettings} handleClose={handleCloseSettings} />
      </Stack>
    </Box>
  );
}
