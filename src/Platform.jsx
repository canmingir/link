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
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default Platform;
