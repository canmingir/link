import { Helmet } from "react-helmet-async";
import { NotFoundView } from "../widgets/error";
import React from "react";

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title> 404 Page Not Found!</title>
      </Helmet>

      <NotFoundView />
    </>
  );
}
