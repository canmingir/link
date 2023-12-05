import { Suspense } from "react";

import { Route, Routes } from "react-router-dom";

export default function RouteManager({ routes }) {
  console.log(routes);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {routes.map((route, i) => (
          <Route key={i} path="/" element={route.element()}>
            {route.children.map((child, j) => (
              <Route key={j} path={child.path} element={child.element()} />
            ))}
          </Route>
        ))}
      </Routes>
    </Suspense>
  );
}
