import { CacheProvider } from "@emotion/react";
import React from "react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { useEffect } from "react";

export default function RTL({ children, themeDirection }) {
  useEffect(() => {
    document.dir = themeDirection;
  }, [themeDirection]);

  const cacheRtl = createCache({
    key: "rtl",
    prepend: true,
    // https://github.com/styled-components/stylis-plugin-rtl/issues/35
    stylisPlugins: [rtlPlugin],
  });

  if (themeDirection === "rtl") {
    return <CacheProvider value={cacheRtl}>{children}</CacheProvider>;
  }

  return <>{children}</>;
}
