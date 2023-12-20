import PsychologyIcon from "@mui/icons-material/Psychology";

const ChatCommands = [
  {
    command: "/learn-url",
    icon: PsychologyIcon,
    description: "Learn from given url.",
    inputs: [
      {
        title: "Select Colleague",
        type: "COLLEAGUE",
      },
      {
        title: "Enter URL",
        type: "TEXT",
      },
    ],
    action: () => {},
  },
  {
    command: "/learn-text",
    icon: PsychologyIcon,
    description: "Learn with text",
    inputs: [
      {
        title: "Select Colleague",
        type: "COLLEAGUE",
      },
      {
        title: "Enter TEXT",
        type: "TEXT",
      },
    ],
    action: () => {},
  },
  {
    command: "/learn-qa",
    icon: PsychologyIcon,
    description: "Learn with Q&A",
    inputs: [
      {
        title: "Select Colleague",
        type: "COLLEAGUE",
      },
      {
        title: "Enter Q&A",
        type: "TEXT",
      },
    ],
    action: () => {},
  },
];

export default ChatCommands;
