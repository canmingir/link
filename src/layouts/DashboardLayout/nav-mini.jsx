import Box from "@mui/material/Box";
import Logo from "../../components/logo";
import { NAV } from "../config-layout";
import { NavSectionMini } from "../../components/nav-section";
import NavToggleButton from "../common/nav-toggle-button";
import React from "react";
import Stack from "@mui/material/Stack";
import { hideScroll } from "../../theme/css";
import { useConfig } from "../../context/ConfigContext";
import { useUser } from "../../hooks/use-user";
// ----------------------------------------------------------------------

export default function NavMini({ only }) {
  const { user } = useUser();

  const { sideMenu } = useConfig();
  return (
    <Box
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
      </Stack>
    </Box>
  );
}
