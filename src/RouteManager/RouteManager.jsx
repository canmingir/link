import React from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function RouteManager({ routes, config }) {
  return (
    //normalde browserrouter main'in içerisinde dashboard'da.
    <BrowserRouter>
      <Routes>
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
  );
}
