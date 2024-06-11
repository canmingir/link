import "./global.css";

import { BrowserRouter } from "react-router-dom";
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

import { initialState, reducer } from "./context/reducer";
import { publish, subscribe, useEvent } from "@nucleoidai/react-event";

window["@nucleoidai"] = {
  Event: { publish, subscribe, useEvent },
};

config.init();

const Platform = ({ routes, dialogs }) => {
  const appConfig = config.get();

  return (
    <>
      <SettingsProvider
        defaultSettings={{
          themeMode: appConfig.settings.mode || "dark",
          themeDirection: "ltr",
          themeContrast: "default",
          themeLayout: "vertical",
          themeColorPresets: appConfig.settings.colorPresets || "default",
          themeStretch: false,
        }}
      >
        <ThemeProvider>
          <BrowserRouter basename={appConfig.base}>
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
