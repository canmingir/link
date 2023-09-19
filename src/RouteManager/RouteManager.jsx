import Callback from "../pages/callback";
import { HelmetProvider } from "react-helmet-async";
import Login from "../pages/login";
import React from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function RouteManager({ routes, config }) {
  return (
    //normalde browserrouter, helmetprovider main'in içerisinde dashboard'da.
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route>
            <Route path={`/login`} index element={<Login />} />
            <Route path={`/callback`} element={<Callback />} />
          </Route>
          <Route>
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
      </BrowserRouter>
    </HelmetProvider>
  );
}
