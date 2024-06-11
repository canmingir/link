import Callback from "../pages/Callback";
import CompactLayout from "../layouts/CompactLayout";
import { HelmetProvider } from "react-helmet-async";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/404";
import React from "react";
import appConfig from "../config";
import classicLoginLayout from "../layouts/auth/classic";
import config from "../../../../config";
import modernLoginLayout from "../layouts/auth/modern";

import { Route, Routes } from "react-router-dom";

export default function RouteManager({ routes }) {
  const variant = config.login.page.variant;
  const image = config.login.page.image;
  console.log(appConfig());
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
          <Route key={i} path="/" element={route.element}>
            {route.children.map((child, j) => (
              <Route key={j} path={child.path} element={child.element} />
            ))}
          </Route>
        ))}
        <Route path="*" element={<CompactLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HelmetProvider>
  );
}
