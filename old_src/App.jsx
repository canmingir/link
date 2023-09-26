import ContextProvider from "./context/ContextProvider";
import GlobalSnackMessage from "./components/GlobalSnackMessage/GlobalSnackMessage";
import Loading from "./components/Loading/Loading";
import React from "react";
import RouteManager from "./routes/RouteManager";
import { SnackbarProvider } from "notistack";
import theme from "./theme";

import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import { initialState, reducer } from "./context/reducer";

export default function App() {
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
            <RouteManager />
          </SnackbarProvider>
        </ContextProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
