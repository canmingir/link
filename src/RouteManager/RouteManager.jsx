import Callback from "../pages/Callback";
import CompactLayout from "../layouts/CompactLayout";
import { HelmetProvider } from "react-helmet-async";
import Login from "../pages/Login";
import NotFoundPage from "../pages/404";
import { Suspense } from "react";
import { LoadingScreen } from "../components/loading-screen";
import { Route, Routes } from "react-router-dom";

export default function RouteManager({ routes }) {
  return (
    <HelmetProvider>
      <Routes>
        <Route path={`/login`} index element={<Login />} />
        <Route path={`/callback`} element={<Callback />} />
        {routes.map((route, i) => (
          <Route key={i} path="/" element={route.element()}>
            {route.children.map((child, j) => (
              <Route
                key={j}
                path={child.path}
                element={
                  <Suspense fallback={<LoadingScreen />}>
                    {child.element()}
                  </Suspense>
                }
              />
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
