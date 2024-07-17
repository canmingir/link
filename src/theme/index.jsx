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

  const memoizedValue = useMemo(
    () => ({
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
    }),
    [
      settings.themeMode,
      settings.themeDirection,
      presets.palette,
      presets.customShadows,
      contrast.palette,
    ]
  );

  const theme = createTheme(memoizedValue);
  theme.components = merge(componentsOverrides(theme), contrast.components);

  return (
    <MuiThemeProvider theme={theme}>
      <RTL themeDirection={settings.themeDirection}>
        <CssBaseline />
        {children}
      </RTL>
    </MuiThemeProvider>
  );
}
