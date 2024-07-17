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
import http from "./http";
import { init } from "./config/config";
import oauth from "./http/oauth";

import { BrowserRouter, Navigate } from "react-router-dom";
import { initialState, reducer } from "./context/reducer";
import { publish, subscribe, useEvent } from "@nucleoidai/react-event";

init();

window["@nucleoidai"] = {
  Event: { publish, subscribe, useEvent },
};

setTimeout(() => {
  const { api } = config();

  oauth.defaults.baseURL = api;
  http.defaults.baseURL = api;
}, 0);

const Platform = ({ routes }) => {
  const [configInitError] = useEvent("CONFIG_INITIALIZE_FAILED", {
    error: "",
    file: "",
  });

  const { base, template } = config();
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
            {configInitError.error !== "" && (
              <Navigate to="/config-error" state={configInitError} />
            )}
            <ContextProvider reducer={reducer} state={initialState}>
              <SnackbarProvider
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
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
