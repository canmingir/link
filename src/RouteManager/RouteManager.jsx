import { Route, Routes } from "react-router-dom";

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

export default function RouteManager({ routes }) {
  const { image, variant } = config.get().template.login;

  const LoginElement =
    variant === "classic" ? classicLoginLayout : modernLoginLayout;

  return (
    <HelmetProvider>
      <Routes>
        <Route path="/login" element={<LoginElement image={image} />}>
          <Route path={`/login`} index element={<LoginPage />} />
        </Route>

        <Route path={`/callback`} element={<Callback />} />
        {routes.map((route, i) => (
          <Route key={i} path="/" element={route.container}>
            {route.childs.map((child, j) => (
              <Route key={j} path="/" element={child.element}>
                {child.children.map((subChild, k) => (
                  <Route
                    key={k}
                    path={subChild.path}
                    element={subChild.element}
                  />
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
