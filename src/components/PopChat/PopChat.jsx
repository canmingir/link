import "regenerator-runtime";

import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import Draggable from "react-draggable";
import MessageSfx from "./messageSFX.mp3";
import MicIcon from "@mui/icons-material/Mic";
import MicNoneIcon from "@mui/icons-material/MicNone";
import React from "react";
import SendIcon from "@mui/icons-material/Send";
import { TypingIndicator } from "@chatscope/chat-ui-kit-react";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import styles from "./styles";
import theme from "../../theme";
import { useEvent } from "@nucleoidjs/synapses";
import useSound from "use-sound";

import { Box, Container, Fab, IconButton, TextField } from "@mui/material";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const sub = { item: null };
const response = (res) => {
  sub.item = res;
};

export const handleAddResponseMessage = (ret) => {
  sub.item(ret);
};

const PopChat = ({
  title,
  open,
  closeButton,
  handleClose,
  handleNewUserMessage,
  history = [],
}) => {
  const [typing] = useEvent("TYPED", { loading: false });
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState([...history]);
  const [mute, setMute] = React.useState(false);
  const [play] = useSound(MessageSfx);
  const { transcript, browserSupportsSpeechRecognition, resetTranscript } =
    useSpeechRecognition();
  const messagesEndRef = React.useRef(null);
  const [listen, setListen] = React.useState(false);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  React.useEffect(() => {
    response((ret) => {
      setMessages([...messages, { message: ret, user: false }]);
    });
    !mute && play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, open, typing]);

  React.useEffect(() => {
    listen
      ? SpeechRecognition.startListening({
          continuous: true,
          language: "en-US",
        })
      : SpeechRecognition.stopListening();
  }, [listen]);

  const newUserMessage = () => {
    handleNewUserMessage(message, transcript);
    setMessages([...messages, { message: message || transcript, user: true }]);
    setMessage("");
    resetTranscript();
  };

  const changeMute = () => {
    setMute(!mute);
  };

  const chatButtonClick = () => {
    return closeButton ? handleClose() : false;
  };

  const listenUser = () => {
    setListen(!listen);
  };

  if (open) {
    return (
      <Draggable>
        <Box sx={styles.boxHeader}>
          {/* header */}
          <Box
            className="handle"
            sx={styles.header}
            style={{
              borderRadius: "7px 7px 0px 0px",
            }}
          >
            <Box sx={{ marginRight: "auto", color: `white` }}>{title}</Box>
            <IconButton onClick={changeMute}>
              {mute ? (
                <VolumeOffIcon sx={{ color: "white" }} />
              ) : (
                <VolumeUpIcon sx={{ color: "white" }} />
              )}
            </IconButton>
            <IconButton onClick={handleClose}>
              <CloseIcon sx={{ color: "white" }} />
            </IconButton>
          </Box>
          {/* content */}
          <Box sx={styles.content} style={{}}>
            {messages.map((item, index) => (
              <Container
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignSelf: item.user ? "end" : "start",
                  padding: "1px",
                  marginY: 0.5,
                }}
              >
                <div
                  style={{
                    backgroundColor: item.user ? "#818589" : "#525252",
                    alignSelf: item.user ? "end" : "start",
                    color: "white",
                    borderRadius: item.user
                      ? "15px 15px 0px 15px"
                      : "15px 15px 15px 0px",
                    minWidth: "60px",
                    minHeight: "50px",
                    width: "fit-content",
                    display: "flex",
                    alignContent: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      padding: 9,
                      fontSize: "16.5px",
                      alignSelf: "center",
                    }}
                  >
                    {item.message}
                  </div>
                </div>
              </Container>
            ))}
            {typing.loading && (
              <div
                style={{
                  backgroundColor: "#525252",
                  width: "fit-content",
                  alignSelf: "start",
                  color: "white",
                  borderRadius: "15px 15px 15px 0px",
                  marginLeft: "25px",
                  minWidth: "20px",
                }}
              >
                <div style={{ padding: 5 }}>
                  <Container
                    sx={{
                      display: "flex",
                      alignContent: "end",
                      marginY: "10px",
                      justifyContent: "start",
                    }}
                  >
                    <div ref={messagesEndRef}>
                      <TypingIndicator></TypingIndicator>
                    </div>
                  </Container>
                </div>
              </div>
            )}
          </Box>
          {/*footer */}
          <Box
            sx={{
              width: "100%",
              p: 1,
              bgcolor: "white",
              boxShadow: 20,
              borderRadius: "0px 0px 7px 7px",
            }}
          >
            {browserSupportsSpeechRecognition && (
              <IconButton onClick={listenUser}>
                {listen ? (
                  <MicIcon sx={{ color: theme.buttonColor }} />
                ) : (
                  <MicNoneIcon sx={{ color: theme.buttonColor }} />
                )}
              </IconButton>
            )}
            <TextField
              color="secondary"
              autoComplete="off"
              autoFocus
              value={message || transcript}
              onChange={(e) => {
                if (e.target.value === "") {
                  resetTranscript();
                }
                setMessage(e.target.value || e.currentTarget.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  newUserMessage();
                }
              }}
              placeholder={"Type a message..."}
              size="small"
              sx={{
                width: "80%",
                marginX: "3px",
                input: {
                  color: theme.title,
                },
              }}
            />
            <IconButton onClick={newUserMessage}>
              <SendIcon sx={{ color: theme.buttonColor }} />
            </IconButton>
          </Box>
          {/*button */}
          <Box
            sx={{ width: "100%", p: 1, display: "flex", justifyContent: "end" }}
          >
            <Fab
              className="handle"
              onClick={chatButtonClick}
              sx={{
                color: theme.bar,
                backgroundColor: theme.title,
                ":hover": {
                  color: theme.bar,
                  backgroundColor: theme.title,
                },
              }}
            >
              <ChatIcon />
            </Fab>
          </Box>
        </Box>
      </Draggable>
    );
  } else {
    return null;
  }
};

export default PopChat;
