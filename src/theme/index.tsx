"use client";

import CssBaseline from "@mui/material/CssBaseline";
import RTL from "./options/right-to-left";
import type { ThemeOptions } from "@mui/material/styles";
import { componentsOverrides } from "./overrides";
import { createContrast } from "./options/contrast";
import { createPresets } from "./options/presets";
import { customShadows } from "./custom-shadows";
import merge from "lodash/merge";
import { palette } from "./palette";
import { shadows } from "./shadows";
import { typography } from "./typography";
import { useSettingsContext } from "../components/settings";

import { MotionConfig } from "framer-motion";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import React, { useEffect, useMemo } from "react";

export default function ThemeProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const settings = useSettingsContext();
  const contrast = createContrast(settings.themecontrast, settings.thememode);
  const presets = createPresets(settings.themecolorpresets);

  const theme = useMemo(() => {
    const baseOptions: ThemeOptions & Record<string, unknown> = {
      palette: {
        ...palette(settings.thememode),
        ...presets.palette,
        ...contrast.palette,
      },
      customShadows: {
        ...customShadows(settings.thememode),
        ...presets.customShadows,
      },
      direction: settings.themedirection,
      shadows: shadows(settings.thememode),
      shape: { borderRadius: 8 },
      typography,
    };

    const tempTheme = createTheme(baseOptions);

    baseOptions.components = merge(
      componentsOverrides(tempTheme),
      contrast.components,
      {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              scrollbarColor:
                tempTheme.palette.mode === "dark"
                  ? `${tempTheme.palette.grey[700]} ${tempTheme.palette.background.default}`
                  : `${tempTheme.palette.grey[500]} ${tempTheme.palette.background.default}`,
              scrollbarWidth: "thin",
              "&::-webkit-scrollbar": { width: 10, height: 10 },
              "&::-webkit-scrollbar-track": {
                backgroundColor: tempTheme.palette.background.default,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor:
                  tempTheme.palette.mode === "dark"
                    ? tempTheme.palette.grey[700]
                    : tempTheme.palette.grey[500],
                borderRadius: 8,
                border: `2px solid ${tempTheme.palette.background.default}`,
              },
            },
          },
        },
      }
    );

    return createTheme(baseOptions);
  }, [
    settings.thememode,
    settings.themedirection,
    settings.themecontrast, // Added this to the dependency array
    presets.palette,
    presets.customShadows,
    contrast.palette,
    contrast.components,
  ]);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "disable-animations",
      !settings.animation
    );
  }, [settings.animation]);

  return (
    <MuiThemeProvider theme={theme}>
      <RTL themedirection={settings.themedirection}>
        <CssBaseline />
        <MotionConfig reducedMotion={settings.animation ? "never" : "always"}>
          {children}
        </MotionConfig>
      </RTL>
    </MuiThemeProvider>
  );
}
