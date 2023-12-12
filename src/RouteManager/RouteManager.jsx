import Callback from "../pages/Callback";
import CompactLayout from "../layouts/CompactLayout";
import { HelmetProvider } from "react-helmet-async";
import Login from "../pages/Login";
import LoginLayout from "../layouts/auth/modern-compact";
import NotFoundPage from "../pages/404";
import React from "react";

import { Route, Routes } from "react-router-dom";

export default function RouteManager({ routes }) {
  return (
    <HelmetProvider>
      <Routes>
        <Route path="/login" element={<LoginLayout />}>
          <Route path={`/login`} index element={<Login />} />
        </Route>

        <Route path={`/callback`} element={<Callback />} />
        {routes.map((route, i) => (
          <Route key={i} path="/" element={route.element()}>
            {route.children.map((child, j) => (
              <Route key={j} path={child.path} element={child.element()} />
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
