import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Logo from "../../components/logo";
import { Outlet } from "react-router";
import React from "react";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";

// ----------------------------------------------------------------------

export default function AuthModernLayout() {
  return (
    <Stack
      component="main"
      sx={{
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          backgroundImage: (theme) => `
                  radial-gradient(
                    ${alpha(theme.palette.divider, 0.08)} 1px,
                    transparent 1px
                  )
                `,
          backgroundSize: "16px 16px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <Stack
        sx={{
          width: 1,
          mx: "auto",
          maxWidth: 480,
          px: { xs: 3, md: 6 },
          py: { xs: 4, md: 0 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Logo
          isLogin={true}
          maxSize={140}
          sx={{
            mb: 2,
            alignSelf: "center",
          }}
        />

        <Card
          sx={{
            width: 1,
            py: { xs: 5, md: 5 },
            px: { xs: 4, md: 5 },
            boxShadow: (theme) =>
              `0 0 2px ${alpha(
                theme.palette.grey[500],
                0.16
              )}, 0 12px 24px -4px ${alpha(theme.palette.grey[500], 0.12)}`,
            borderRadius: 2,
          }}
        >
          <Outlet />
        </Card>
      </Stack>
    </Stack>
  );
}
