import AppLayout from "../layouts/AppLayout";
import Callback from "../pages/callback";
import Login from "../pages/login";
import Page from "../layouts/Page";
import React from "react";
import { Route, Routes } from "react-router-dom";

export default function RouteManager({ routes }) {
  return (
    <Routes>
      <Route>
        <Route path={`/login`} index element={<Login />} />
        <Route path={`/callback`} element={<Callback />} />
      </Route>
      <Route element={<AppLayout />}>
        {routes.map((route) => (
          <Route
            key={route.url}
            path={`${route.url}`}
            element={
              <Page title={route.title}>
                <route.element />
              </Page>
            }
          />
        ))}
      </Route>
      <Route path="*" element={<>not found</>} />
    </Routes>
  );
}
