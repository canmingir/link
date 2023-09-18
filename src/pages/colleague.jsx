import { Box } from "@mui/material";
import ChatWidget from "../widgets/ChatWidget/ChatWidget";
import ColleagueWidget from "../widgets/ColleagueWidget/ColleagueWidget";
import DoubleScrollableLayout from "../layouts/DoubleScrollableLayout";
import { Helmet } from "react-helmet-async";
import MetaHumanStream from "../widgets/MetaHumanStream";
import PerformanceCard from "../widgets/PerformanceCard/PerformanceCard";
import VoiceGeneratorWidget from "../widgets/VoiceGeneratorWidget/VoiceGeneratorWidget";
import config from "../../config";
import { useContext } from "../context/ContextProvider";
import { useParams } from "react-router-dom";

export default function Colleague() {
  const params = useParams();
  const [state] = useContext();

  const teamId = state.teamId;
  const colleagueId = params?.colleagueId;

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title> {config.name} - Colleague </title>
      </Helmet>
      <DoubleScrollableLayout
        leftPanel={
          <>
            <Box sx={{ marginBottom: 2, position: "relative" }}>
              <ColleagueWidget colleagueId={colleagueId} />
              <Box position="absolute" right={75} top={90}>
                <ChatWidget colleagueId={colleagueId} teamId={teamId} />
              </Box>
            </Box>
            <PerformanceCard colleagueId={colleagueId} />
          </>
        }
        rightPanel={
          <>
            <MetaHumanStream />
            <VoiceGeneratorWidget />
          </>
        }
      ></DoubleScrollableLayout>
    </>
  );
}
