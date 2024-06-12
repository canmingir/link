import "./global.css";

import ContextProvider from "./ContextProvider/ContextProvider";
import GlobalSnackMessage from "./GlobalSnackMessage/GlobalSnackMessage";
import Loading from "./Loading/Loading";
import React from "react";
import RouteManager from "./RouteManager/RouteManager";

import { SettingsDrawer } from "./components/settings";
import { SettingsProvider } from "./components/settings";
import { SnackbarProvider } from "notistack";
import ThemeProvider from "./theme";
import config from "./config/config";

import { BrowserRouter, Navigate } from "react-router-dom";
import { initialState, reducer } from "./context/reducer";
import { publish, subscribe, useEvent } from "@nucleoidai/react-event";

window["@nucleoidai"] = {
  Event: { publish, subscribe, useEvent },
};

config.init();

const Platform = ({ routes, dialogs }) => {
  const [configInitError] = useEvent("CONFIG_INITIALIZE_FAILED", {
    error: "",
    file: "",
  });

  const { base, template } = config.get();
  return (
    <>
      <SettingsProvider
        defaultSettings={{
          themeMode: template.theme.mode || "dark",
          themeDirection: "ltr",
          themeContrast: "default",
          themeLayout: "vertical",
          themeColorPresets: template.theme.colorPresets || "default",
          themeStretch: false,
        }}
      >
        <ThemeProvider>
          <BrowserRouter basename={base}>
            {configInitError && (
              <Navigate to="/config-error" state={configInitError} />
            )}
            <ContextProvider reducer={reducer} state={initialState}>
              <SnackbarProvider
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                {dialogs && dialogs()}
                <SettingsDrawer />
                <Loading />
                <GlobalSnackMessage />
                <RouteManager routes={routes} />
              </SnackbarProvider>
            </ContextProvider>
          </BrowserRouter>
        </ThemeProvider>
      </SettingsProvider>
    </>
  );
};

export default Platform;
