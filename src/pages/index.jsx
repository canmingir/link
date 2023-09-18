import Page from "../layouts/Page";
import React from "react";
import { storage } from "@nucleoidjs/webstorage";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    storage.get("dashboard", "teamId")
      ? navigate("/teams/colleagues")
      : navigate("/teams");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Page title={"Index"}></Page>;
}
