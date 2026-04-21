"use client";

import CssBaseline from "@mui/material/CssBaseline";
import RTL from "./options/right-to-left";
import { componentsOverrides } from "./overrides";
import { createContrast } from "./options/contrast";
import { createPresets } from "./options/presets";
import { customShadows } from "./custom-shadows";
import merge from "lodash/merge";
import { palette } from "./palette";
import { shadows } from "./shadows";
import { typography } from "./typography";
import { useSettingsContext } from "../components/settings";

import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import React, { useMemo } from "react";

export default function ThemeProvider({ children }) {
  const settings = useSettingsContext();
  const contrast = createContrast(settings.themeContrast, settings.themeMode);
  const presets = createPresets(settings.themeColorPresets);

  const theme = useMemo(() => {
    // 1. Define the base configuration
    const baseOptions = {
      palette: {
        ...palette(settings.themeMode),
        ...presets.palette,
        ...contrast.palette,
      },
      customShadows: {
        ...customShadows(settings.themeMode),
        ...presets.customShadows,
      },
      direction: settings.themeDirection,
      shadows: shadows(settings.themeMode),
      shape: { borderRadius: 8 },
      typography,
    };

    // 2. Create a temporary theme instance to generate overrides
    // (Overrides often need access to the palette/spacing of the theme)
    const tempTheme = createTheme(baseOptions);

    // 3. Merge components into the configuration
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

    // 4. Return the final, complete theme
    return createTheme(baseOptions);
  }, [
    settings.themeMode,
    settings.themeDirection,
    settings.themeContrast, // Added this to the dependency array
    presets.palette,
    presets.customShadows,
    contrast.palette,
    contrast.components,
  ]);

  return (
    <MuiThemeProvider theme={theme}>
      <RTL themeDirection={settings.themeDirection}>
        <CssBaseline />
        {children}
      </RTL>
    </MuiThemeProvider>
  );
}
