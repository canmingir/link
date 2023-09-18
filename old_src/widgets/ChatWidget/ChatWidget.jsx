import ChatIcon from "@mui/icons-material/Chat";
import CircularSkeleton from "../../components/Skeletons/CircularSkeleton";
import chat from "../../http/chat";
import config from "../../../config";
import { publish } from "@nucleoidjs/synapses";
import useColleagueState from "../../hooks/useColleagueState";
import useTeamsState from "../../hooks/useTeamsState";

import { Badge, Fab } from "@mui/material";
import PopChat, { handleAddResponseMessage } from "../../components/PopChat";
import React, { useCallback, useEffect, useState } from "react";

const ChatWidget = ({ colleagueId, teamId }) => {
  const [loading, setLoading] = useState(true);
  const { colleagueState, getColleagueById } = useColleagueState(teamId);
  const { teamState, getTeamDataById } = useTeamsState();

  const fetchData = useCallback(async () => {
    await getTeamDataById(teamId);
    await getColleagueById(colleagueId);
    setLoading(false);
  }, [getTeamDataById, getColleagueById, colleagueId, teamId]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [open, setOpen] = React.useState(false);
  const [unreadMessages, setUnreadMessages] = React.useState(false);
  const [messages, setMessages] = React.useState([
    { message: "Hello", user: false },
  ]);

  const handleNewUserMessage = async (message) => {
    const newMessage = {
      message,
      user: true,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    const response = await processMessageToFlowise([...messages, newMessage]);
    if (response) {
      const flowiceResponse = {
        message: response,
        user: false,
      };
      setMessages((prevMessages) => [...prevMessages, flowiceResponse]);
      publish("TYPED", { loading: false });

      handleAddResponseMessage(flowiceResponse.message);
    }
  };
  async function processMessageToFlowise(chatMessages) {
    publish("TYPED", { loading: true });
    const apiMessages = chatMessages.map((messageObject) => {
      return {
        question: messageObject.message,
        overrideConfig: {
          systemMessagePrompt: `Your name is ${colleagueState?.colleagueToEdit?.name}, you are a member of ${teamState?.teamToEdit?.name} and ${colleagueState?.colleagueToEdit.systemMessage}`,
        },
      };
    });
    const response = await chat.post(
      config.flowise.url,
      apiMessages.slice(-1)[0]
    );
    setUnreadMessages(true);
    return response.data;
  }
  const handleClose = () => {
    setOpen(false);
    setUnreadMessages(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    teamState.teamToEdit && (
      <>
        <PopChat
          title={`${teamState?.teamToEdit?.name} - ${colleagueState?.colleagueToEdit?.name}`}
          open={open}
          handleClose={handleClose}
          closeButton={true}
          history={messages}
          handleNewUserMessage={handleNewUserMessage}
          color="appTheme"
          position="graycollar"
        />
        {!open &&
          (loading ? (
            <CircularSkeleton />
          ) : (
            <Fab onClick={handleOpen} cursor="pointer">
              <Badge
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                color="error"
                variant="dot"
                invisible={!unreadMessages}
              >
                <ChatIcon />
              </Badge>
            </Fab>
          ))}
      </>
    )
  );
};

export default ChatWidget;
