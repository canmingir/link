import ColleaguesWidget from "../widgets/ColleaguesWidget/ColleaguesWidget";
import { Helmet } from "react-helmet-async";
import SingleScorllableLayout from "../layouts/SingleScrollableLayout";
import config from "../../config";
import { useContext } from "../context/ContextProvider";
import useTeamsState from "../hooks/useTeamsState";

import React, { useEffect } from "react";

function Colleagues() {
  const { teamState, getTeamDataById } = useTeamsState();
  const [state] = useContext();

  useEffect(() => {
    getTeamDataById(state.teamId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.teamId]);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title> {config.name} - Colleagues </title>
      </Helmet>
      <SingleScorllableLayout title={teamState?.teamToEdit?.name}>
        <ColleaguesWidget teamId={teamState?.teamToEdit?.id} />
      </SingleScorllableLayout>
    </>
  );
}
export default Colleagues;
