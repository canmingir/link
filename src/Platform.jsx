import "./global.css";

import { BrowserRouter } from "react-router-dom";
import ContextProvider from "./ContextProvider/ContextProvider";
import GlobalSnackMessage from "./GlobalSnackMessage/GlobalSnackMessage";
import Loading from "./Loading/Loading";
import RouteManager from "./RouteManager/RouteManager";
import { SettingsDrawer } from "./components/settings";
import { SettingsProvider } from "./components/settings";
import { SnackbarProvider } from "notistack";
import ThemeProvider from "./theme";
import config from "../../../config";
import globalConfig from "./config";

import React, { useEffect } from "react";
import { initialState, reducer } from "./context/reducer";

const Platform = ({ routes, dialogs }) => {
  useEffect(() => {
    globalConfig(config);
  }, []);
  return (
    <>
      <SettingsProvider
        defaultSettings={{
          themeMode: config.settings.mode || "dark",
          themeDirection: "ltr",
          themeContrast: "default",
          themeLayout: "vertical",
          themeColorPresets: config.settings.colorPresets || "default",
          themeStretch: false,
        }}
      >
        <ThemeProvider>
          <BrowserRouter basename={config.base}>
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
