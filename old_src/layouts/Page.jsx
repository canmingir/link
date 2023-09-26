import { Helmet } from "react-helmet-async";
import React from "react";

function Page({ children, title }) {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
      </Helmet>
      {children}
    </>
  );
}

export default Page;
