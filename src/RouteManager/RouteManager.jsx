import Callback from "../pages/callback";
import Dashboard from "../layouts/dashboard";
import { HelmetProvider } from "react-helmet-async";
import Login from "../pages/login";
import React from "react";

import { Route, Routes } from "react-router-dom";

export default function RouteManager({ routes }) {
  return (
    //normalde browserrouter, helmetprovider main'in içerisinde dashboard'da.
    <HelmetProvider>
      <Routes>
        <Route>
          <Route path={`/login`} index element={<Login />} />
          <Route path={`/callback`} element={<Callback />} />
        </Route>
        <Route element={<Dashboard />}>
          {routes.map((each) => (
            <Route
              key={each.url}
              path={`${each.url}`}
              element={<each.element />}
            />
          ))}
        </Route>
        <Route path="*" element={<>not found</>} />
      </Routes>
    </HelmetProvider>
  );
}
