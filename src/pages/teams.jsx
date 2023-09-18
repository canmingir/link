import { Helmet } from "react-helmet-async";
import SingleScorllableLayout from "../layouts/SingleScrollableLayout";
import TeamsWidget from "../widgets/TeamsWidget/TeamsWidget";
import config from "../../config";
import { useContext } from "../context/ContextProvider";
import { useNavigate } from "react-router-dom";

import React, { useEffect } from "react";

export default function Teams() {
  const [state] = useContext();
  const navigate = useNavigate();

  useEffect(() => {
    state.teamId && navigate("/teams/colleagues");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title> {config.name} - Teams </title>
      </Helmet>
      <SingleScorllableLayout>
        <TeamsWidget />
      </SingleScorllableLayout>
    </>
  );
}
