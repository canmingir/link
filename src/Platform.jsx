import ContextProvider from "./ContextProvider/ContextProvider";
import GlobalSnackMessage from "./GlobalSnackMessage/GlobalSnackMessage";
import Loading from "./Loading/Loading";
import React from "react";
import RouteManager from "./RouteManager/RouteManager";
import { SnackbarProvider } from "notistack";

import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import { initialState, reducer } from "./context/reducer";

const Platform = ({ routes, theme }) => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
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
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default Platform;
