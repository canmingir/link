import AppLayout from "./layouts/AppLayout";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "./context/ConfigContext";
import ContextProvider from "./ContextProvider/ContextProvider";
import GlobalSnackMessage from "./GlobalSnackMessage/GlobalSnackMessage";
import Loading from "./Loading/Loading";
import RouteManager from "./RouteManager/RouteManager";
import { SnackbarProvider } from "notistack";
import globalConfig from "./config";

import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import React, { useEffect } from "react";
import { initialState, reducer } from "./context/reducer";

const Platform = ({ routes, theme, config }) => {
  useEffect(() => {
    globalConfig(config);
  }, []);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <ConfigProvider value={config}>
            <ContextProvider reducer={reducer} state={initialState}>
              <SnackbarProvider
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <AppLayout>
                  <Loading />
                  <GlobalSnackMessage />
                  <RouteManager routes={routes} />
                </AppLayout>
              </SnackbarProvider>
            </ContextProvider>
          </ConfigProvider>
        </BrowserRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default Platform;
