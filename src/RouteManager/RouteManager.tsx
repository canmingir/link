import Callback from "../pages/Callback";
import CompactLayout from "../layouts/CompactLayout";
import ConfigError from "../pages/ConfigError";
import { HelmetProvider } from "react-helmet-async";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/404";
import classicLoginLayout from "../layouts/auth/classic";
import config from "../config/config";
import modernLoginLayout from "../layouts/auth/modern";
import specialLoginLayout from "../layouts/auth/special";

import type { ComponentType, ReactElement, ReactNode } from "react";
import { Route, Routes } from "react-router-dom";

type LoginLayoutComponent = ComponentType<{ image?: string; title?: string }>;

const loginLayouts: Record<string, LoginLayoutComponent> = {
  classic: classicLoginLayout as LoginLayoutComponent,
  modern: modernLoginLayout as LoginLayoutComponent,
  special: specialLoginLayout as LoginLayoutComponent,
};

interface RoutePage {
  path: string;
  element: ReactNode;
}

interface RouteChild {
  layout: ReactElement;
  pages: RoutePage[];
}

export interface AppRoute {
  container: ReactElement;
  childs: RouteChild[];
}

export default function RouteManager({ routes }: { routes: AppRoute[] }) {
  const loginConfig = config().template?.login;

  const isLoginConfigured = config().project && loginConfig;

  const LoginLayout =
    loginLayouts[loginConfig?.variant ?? ""] || modernLoginLayout;

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

        {routes.map((route, i: number) => (
          <Route key={i} path="/" element={route.container}>
            {route.childs.map((child, j: number) => (
              <Route key={j} path="/" element={child.layout}>
                {child.pages.map((page, k: number) => (
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
