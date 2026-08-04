import {
  ThemeProvider,
  alpha,
  createTheme,
  useTheme,
} from "@mui/material/styles";

import Box from "@mui/material/Box";
import Logo from "../../components/logo";
import { Outlet } from "react-router";
import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import config from "../../config/config";
import { useResponsive } from "../../hooks/use-responsive";

const PAPER = "#e7decb";
const ACCENT = "#ce4a25";
const ACCENT_DARK = "#8c2f14";
const ACCENT_LIGHT = "#e8794f";
const DISPLAY_FONT = '"Poiret One", cursive';
const TITLE_FONT = '"DM Mono", monospace';

export default function AuthSpecialLayout({ image, title }) {
  const { name } = config();

  const mdUp = useResponsive("up", "md");

  const outerTheme = useTheme();

  const loginTheme = React.useMemo(
    () =>
      createTheme(outerTheme, {
        palette: {
          primary: {
            lighter: "#F7DDD2",
            light: ACCENT_LIGHT,
            main: ACCENT,
            dark: ACCENT_DARK,
            darker: "#5c1c07",
            contrastText: "#FFFFFF",
          },
        },
        customShadows: { primary: `0 8px 16px 0 ${alpha(ACCENT, 0.24)}` },
      }),
    [outerTheme],
  );

  const renderSection = (
    <Stack
      spacing={6}
      sx={{
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        bgcolor: alpha(ACCENT, 0.06),
        borderRight: `1px solid ${alpha(ACCENT, 0.14)}`,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${alpha(
            ACCENT,
            0.14,
          )} 1px, transparent 1px)`,
          backgroundSize: "18px 18px",
          pointerEvents: "none",
        }}
      />

      <Stack
        spacing={2}
        sx={{ px: 6, maxWidth: 520, textAlign: "center", zIndex: 1 }}
      >
        <Typography
          sx={{
            fontFamily: DISPLAY_FONT,
            fontSize: { md: "3.25rem", lg: "4rem" },
            lineHeight: 1.05,
            color: ACCENT_DARK,
          }}
        >
          {title || name}
        </Typography>

        <Typography
          sx={{
            fontFamily: TITLE_FONT,
            fontSize: "0.8rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: alpha(ACCENT, 0.75),
          }}
        >
          Learn · Explore · Grow
        </Typography>
      </Stack>

      {image && (
        <Box
          component="img"
          alt="auth"
          src={image}
          sx={{
            zIndex: 1,
            maxWidth: { md: 360, lg: 440 },
            width: "100%",
            objectFit: "contain",
          }}
        />
      )}
    </Stack>
  );

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        mx: "auto",
        maxWidth: 480,
        justifyContent: "center",
        px: { xs: 3, md: 8 },
        py: { xs: 8, md: 0 },
        position: "relative",
        zIndex: 1,
      }}
    >
      <Logo
        isLogin={true}
        maxSize={120}
        sx={{ mb: 4, alignSelf: { xs: "center", md: "flex-start" } }}
      />

      <Box
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          bgcolor: alpha("#ffffff", 0.4),
          border: `1px solid ${alpha(ACCENT, 0.18)}`,
          boxShadow: `0 12px 32px -12px ${alpha(ACCENT_DARK, 0.28)}`,
          "& .MuiTypography-root": { fontFamily: TITLE_FONT, color: ACCENT },
          "& .MuiTypography-h3, & .MuiTypography-h4": {
            fontFamily: DISPLAY_FONT,
            color: ACCENT_DARK,
          },
          "& .MuiButtonBase-root": {
            fontFamily: TITLE_FONT,
            color: PAPER,
            backgroundColor: ACCENT,
            "&:hover": {
              backgroundColor: ACCENT_DARK,
            },
          },
          "& .MuiOutlinedInput-root, & .MuiFilledInput-root": {
            fontFamily: TITLE_FONT,
          },
        }}
      >
        <ThemeProvider theme={loginTheme}>
          <Outlet />
        </ThemeProvider>
      </Box>
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction="row"
      sx={{ minHeight: "100vh", bgcolor: PAPER }}
    >
      {mdUp && renderSection}

      {renderContent}
    </Stack>
  );
}
