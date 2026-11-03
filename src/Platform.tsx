import "./global.css";
import "./widgets/Login/amplifyAuth";

import type { AppRoute } from "./RouteManager/RouteManager";
import GlobalSnackMessage from "./GlobalSnackMessage/GlobalSnackMessage";
import RouteManager from "./RouteManager/RouteManager";
import { SettingsDrawer } from "./components/settings";
import { SettingsProvider } from "./components/settings";
import { SnackbarProvider } from "notistack";
import ThemeProvider from "./theme";
import config from "./config/config";
import { configureAmplify } from "./widgets/Login/amplifyConfig";
import http from "./http";
import { init } from "./config/config";
import oauth from "./http/oauth";

import { BrowserRouter, Navigate } from "react-router-dom";
import { publish, subscribe, useEvent } from "@nucleoidai/react-event";

init();

if (config().credentials?.provider === "COGNITO") {
  configureAmplify();
}

(window as unknown as Record<string, unknown>)["@nucleoidai"] = {
  Event: { publish, subscribe, useEvent },
};

setTimeout(() => {
  const { api } = config();

  oauth.defaults.baseURL = api;
  http.defaults.baseURL = api;
}, 0);

const Platform = ({ routes }: { routes: AppRoute[] }) => {
  const [configInitError] = useEvent("CONFIG_INITIALIZE_FAILED", {
    error: "",
    file: "",
  });

  const { base, template } = config();
  return (
    <>
      <SettingsProvider
        defaultSettings={{
          thememode: template.theme.mode || "dark",
          themedirection: "ltr",
          themecontrast: "default",
          themelayout: "vertical",
          themecolorpresets: template.theme.colorPresets || "default",
          themestretch: false,
          beta: false,
          animation: true,
        }}
      >
        <ThemeProvider>
          <BrowserRouter basename={base}>
            {configInitError.error !== "" && (
              <Navigate to="/config-error" state={configInitError} />
            )}
            <SnackbarProvider
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <SettingsDrawer />
              <GlobalSnackMessage />
              <RouteManager routes={routes} />
            </SnackbarProvider>
          </BrowserRouter>
        </ThemeProvider>
      </SettingsProvider>
    </>
  );
};

export default Platform;
