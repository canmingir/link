import "../styles/chat.css";

import Page from "../layouts/Page";
import React from "react";
import Users from "../components/Users/Users";
import chat from "../http/chat";
import config from "../../config";
import { storage } from "@nucleoidjs/webstorage";
import useChatState from "../hooks/useChatState";

import { Alert, Avatar, Grid } from "@mui/material";
import {
  Avatar as Av,
  ChatContainer,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

function MyChat() {
  const [messages, setMessages] = React.useState([
    { message: "Hello my friend", sentTime: "just now", sender: "Joe" },
  ]);
  const [isTyping, setIsTyping] = React.useState(false);

  const handleSendRequest = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "User",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsTyping(true);
    const response = await processMessageToFlowise([...messages, newMessage]);
    if (response) {
      const flowiceResponse = {
        message: response,
        sender: "Joe",
      };
      setMessages((prevMessages) => [...prevMessages, flowiceResponse]);
      setIsTyping(false);
    }
  };

  async function processMessageToFlowise(chatMessages) {
    const apiMessages = chatMessages.map((messageObject) => {
      return { question: messageObject.message };
    });
    const response = await chat.post(
      config.flowise.url,
      apiMessages.slice(-1)[0]
    );
    return response.data;
  }

  return (
    <MainContainer>
      <ChatContainer>
        <MessageList
          typingIndicator={
            isTyping ? <TypingIndicator content="typing" /> : null
          }
        >
          {messages.map((message, index) => (
            <Message key={index} model={message}>
              <Av>
                <Avatar
                  style={{ backgroundColor: "#060F12", color: "#45CCB4" }}
                >
                  {message.sender.charAt(0)}
                </Avatar>
              </Av>
            </Message>
          ))}
        </MessageList>
        <MessageInput
          placeholder="Type message here"
          onSend={handleSendRequest}
        />
      </ChatContainer>
    </MainContainer>
  );
}

const Error = React.memo(({ error }) => {
  if (error) {
    return (
      <Alert severity="error" variant="outlined">
        {error}
      </Alert>
    );
  }
  return null;
});

export default function Chat() {
  const { chatState, fetchChatUser, chatError, chatLoading } = useChatState();
  const teamId = storage.get("dashboard", "teamId");
  React.useEffect(() => {
    fetchChatUser(teamId);
    chatError();
    chatLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page title={`${config.name} - Chat`}>
      <Error error={chatState?.error} />
      <Grid container spacing={2} sx={{ height: "100%" }}>
        <Grid item lg={9} sm={8} xs={12} sx={{ height: "100%" }}>
          {!chatState?.error && !chatState?.loading && <MyChat />}
        </Grid>
        <Grid item lg={3} sm={4} xs={12} sx={{ height: "100%" }}>
          <Users users={chatState?.users} />
        </Grid>
      </Grid>
    </Page>
  );
}
