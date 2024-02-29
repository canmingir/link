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
import menuConfig from "../../../config.menu.js";

import React, { useEffect } from "react";
import { initialState, reducer } from "./context/reducer";

const Platform = ({ routes }) => {
  useEffect(() => {
    globalConfig(config);
  }, []);
  console.log(menuConfig);
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
