import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Logo from "../../components/logo";
import { Outlet } from "react-router";
import React from "react";
import Stack from "@mui/material/Stack";
import { useResponsive } from "../../hooks/use-responsive";

// ----------------------------------------------------------------------

export default function AuthModernLayout({ image }) {
  const mdUp = useResponsive("up", "md");

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        mx: "auto",
        maxWidth: 480,
        px: { xs: 2, md: 8 },
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Logo
        sx={{
          mt: { xs: 2, md: 8 },
          mb: { xs: 10, md: 8 },
        }}
      />

      <Card
        sx={{
          py: { xs: 5, md: 0 },
          px: { xs: 3, md: 0 },
          boxShadow: { md: "none" },
          overflow: { md: "unset" },
          bgcolor: { md: "background.default" },
        }}
      >
        <Outlet />
      </Card>
    </Stack>
  );

  const renderSection = (
    <Stack flexGrow={1} sx={{ position: "relative" }}>
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
