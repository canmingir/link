import { CacheProvider } from "@emotion/react";
import React from "react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { useEffect } from "react";

export default function RTL({
  children,
  themedirection,
}: {
  children: React.ReactNode;
  themedirection: "ltr" | "rtl";
}) {
  useEffect(() => {
    document.dir = themedirection;
  }, [themedirection]);

  const cacheRtl = createCache({
    key: "rtl",
    prepend: true,
    // https://github.com/styled-components/stylis-plugin-rtl/issues/35
    stylisPlugins: [rtlPlugin],
  });

  if (themedirection === "rtl") {
    return <CacheProvider value={cacheRtl}>{children}</CacheProvider>;
  }

  return <>{children}</>;
}
