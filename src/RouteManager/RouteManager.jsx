import Callback from "../pages/Callback";
import CompactLayout from "../layouts/CompactLayout";
import ConfigError from "../pages/ConfigError";
import { HelmetProvider } from "react-helmet-async";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/404";
import React from "react";
import classicLoginLayout from "../layouts/auth/classic";
import config from "../config/config";
import modernLoginLayout from "../layouts/auth/modern";

import { Route, Routes } from "react-router-dom";

export default function RouteManager({ routes }) {
  const loginConfig = config().template?.login;

  const isLoginConfigured = config().project && loginConfig;

  const LoginLayout =
    loginConfig?.variant === "classic" ? classicLoginLayout : modernLoginLayout;

  return (
    <HelmetProvider>
      <Routes>
        {isLoginConfigured && (
          <>
            <Route
              path="/login"
              element={<LoginLayout image={loginConfig.image} />}
            >
              <Route index element={<LoginPage />} />
            </Route>
            <Route path="/callback" element={<Callback />} />
          </>
        )}

        {routes.map((route, i) => (
          <Route key={i} path="/" element={route.container}>
            {route.childs.map((child, j) => (
              <Route key={j} path="/" element={child.layout}>
                {child.pages.map((page, k) => (
                  <Route key={k} path={page.path} element={page.element} />
                ))}
              </Route>
            ))}
          </Route>
        ))}

        <Route path="*" element={<CompactLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/config-error" element={<ConfigError />} />
      </Routes>
    </HelmetProvider>
  );
}
