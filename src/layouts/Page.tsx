import { Helmet } from "react-helmet-async";
import type { ReactNode } from "react";

function Page({ children, title }: { children?: ReactNode; title?: string }) {
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
