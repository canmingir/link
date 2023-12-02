import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "./context/ConfigContext";
import ContextProvider from "./ContextProvider/ContextProvider";
import GlobalSnackMessage from "./GlobalSnackMessage/GlobalSnackMessage";
import Loading from "./Loading/Loading";
import RouteManager from "./RouteManager/RouteManager";
import { SettingsProvider } from "./components/settings";
import { SnackbarProvider } from "notistack";
import ThemeProvider from "./theme";
import globalConfig from "./config";

import React, { useEffect } from "react";
import { initialState, reducer } from "./context/reducer";

const Platform = ({ routes, config }) => {
  useEffect(() => {
    globalConfig(config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <SettingsProvider
        defaultSettings={{
          themeMode: "light", // 'light' | 'dark'
          themeDirection: "ltr", //  'rtl' | 'ltr'
          themeContrast: "default", // 'default' | 'bold'
          themeLayout: "vertical", // 'vertical' | 'horizontal' | 'mini'
          themeColorPresets: "default", // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
          themeStretch: false,
        }}
      >
        <ThemeProvider>
          <BrowserRouter>
            <ConfigProvider value={config}>
              <ContextProvider reducer={reducer} state={initialState}>
                <SnackbarProvider
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <Loading />
                  <GlobalSnackMessage />
                  <RouteManager routes={routes} />
                </SnackbarProvider>
              </ContextProvider>
            </ConfigProvider>
          </BrowserRouter>
        </ThemeProvider>
      </SettingsProvider>
    </>
  );
};

export default Platform;
