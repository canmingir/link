import Callback from "../pages/callback.jsx";
import Center from "../layouts/Center.jsx";
import Console from "../layouts/Console";
import Login from "../pages/login";
import React from "react";
import routes from "./routes";

import { Route, Routes } from "react-router-dom";

export default function RouteManager() {
  return (
    <Routes>
      <Route element={<Center />}>
        <Route path={`/login`} index element={<Login />} />
        <Route path={`/callback`} element={<Callback />} />
      </Route>
      <Route element={<Console />}>
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
  );
}
