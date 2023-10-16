import AppLayout from "../layouts/AppLayout";
import Callback from "../pages/callback";
import Login from "../pages/login";
import Page from "../layouts/Page";
import React from "react";
import { storage } from "@nucleoidjs/webstorage";
import { Route, Routes } from "react-router-dom";

export default function RouteManager({ config }) {
  const check = () => {
    if (!storage.get("accessToken") && !storage.get("refreshToken")) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Routes>
      {!check() && (
        <Route element={<AppLayout config={config} />}>
          {config?.routes?.map((route) => (
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
          <Route path="*" element={<>not found</>} />
        </Route>
      )}
      {check() && (
        <Route>
          <Route path={`/login`} index element={<Login />} />
          <Route path={`/callback`} element={<Callback />} />
          <Route path={"*"} element={<Login />} />
        </Route>
      )}
    </Routes>
  );
}
