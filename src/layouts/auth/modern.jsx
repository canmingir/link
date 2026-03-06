import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Logo from "../../components/logo";
import { Outlet } from "react-router";
import React from "react";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import { useResponsive } from "../../hooks/use-responsive";

// ----------------------------------------------------------------------

export default function AuthModernLayout({ image }) {
  const mdUp = useResponsive("up", "md");

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        mx: "auto",
        maxWidth: 600,
        px: { xs: 3, md: 10 },
        py: { xs: 4, md: 0 },
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Logo
        maxSize={140}
        sx={{
          mb: 1,
          width: 80,
          height: 80,
        }}
      />

      <Card
        sx={{
          width: 1,
          py: { xs: 6, md: 4 },
          px: { xs: 4, md: 6 },
          boxShadow: {
            xs: (theme) =>
              `0 0 2px ${alpha(
                theme.palette.grey[500],
                0.16
              )}, 0 12px 24px -4px ${alpha(theme.palette.grey[500], 0.12)}`,
            md: "none",
          },
          overflow: { md: "unset" },
          bgcolor: { md: "transparent" },
          borderRadius: 2,
        }}
      >
        <Outlet />
      </Card>
    </Stack>
  );

  const renderSection = (
    <Stack
      flexGrow={1}
      sx={{
        position: "relative",
      }}
    >
      <Box
        component="img"
        alt="auth"
        src={image || "/assets/background/overlay_3.jpg"}
        sx={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          objectFit: "cover",
          position: "absolute",
          width: "calc(60% - 32px)",
          height: "calc(60% - 32px)",
          borderRadius: 3,
        }}
      />
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction="row"
      sx={{
        minHeight: "100vh",
        position: "relative",
        "&:before": {
          width: 1,
          height: 1,
          zIndex: -1,
          content: "''",
          position: "absolute",
          backgroundSize: "cover",
          opacity: { xs: 0.24, md: 0 },
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          backgroundImage:
            "url(https://minimals.cc/assets/background/overlay_4.jpg)",
        },
      }}
    >
      {renderContent}

      {mdUp && renderSection}
    </Stack>
  );
}
