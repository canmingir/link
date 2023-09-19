import { ConfigProvider } from "./context/ConfigContext";
import ContextProvider from "./ContextProvider/ContextProvider";
import GlobalSnackMessage from "./GlobalSnackMessage/GlobalSnackMessage";
import Loading from "./Loading/Loading";
import RouteManager from "./RouteManager/RouteManager";
import { SnackbarProvider } from "notistack";
import { updateAxiosInstanceConfig as updateFirstAxiosInstanceConfig } from "./http/index";
import { updateAxiosInstanceConfig as updateSecondAxiosInstanceConfig } from "./http/oauth";

import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import React, { useEffect } from "react";
import { initialState, reducer } from "./context/reducer";

const Platform = ({ routes, theme, config }) => {
  useEffect(() => {
    updateFirstAxiosInstanceConfig(config);
    updateSecondAxiosInstanceConfig(config);
  }, [config]);

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
