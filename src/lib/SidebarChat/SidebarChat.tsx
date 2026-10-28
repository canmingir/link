import ChatDrawer from "./ChatDrawer";
import MessageSfx from "./messageSFX.mp3";
import { useEvent } from "@nucleoidai/react-event";
import useSound from "use-sound";

import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { ToolDecision, ToolRenderers } from "../ChatMessage/ToolMessage";

type Message = { id?: string; content: string; role: string };

interface SidebarChatProps {
  selectedConversationId?: string;
  sessionId?: string;
  title: string;
  open: boolean;
  handleToggle: () => void;
  handleNewUserMessage: (message: string) => void;
  history?: Message[];
  readOnly?: boolean;
  sound?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Presets?: any[];
  selectedPreset?: string;
  onPresetChange?: (preset: string) => void;
  onNewSession?: () => void;
  toolRenderers?: ToolRenderers;
  onToolDecision?: (toolCallId: string, decision: ToolDecision) => void;
  embedded?: boolean;
  footer?: React.ReactNode;
}

const SidebarChat = ({
  selectedConversationId,
  title,
  open,
  handleToggle,
  handleNewUserMessage,
  history = [],
  readOnly,
  sound,
  Presets = [],
  selectedPreset,
  onPresetChange,
  onNewSession,
  toolRenderers,
  onToolDecision,
  embedded,
  footer,
}: SidebarChatProps) => {
  const [aiResponded] = useEvent("AI_RESPONDED", null);
  const [conversationSent] = useEvent("CONVERSATION_SENT", null);

  const [mute, setMute] = useState(false);
  const [loading, setLoading] = useState(false);
  const [play] = useSound(MessageSfx);

  const messagesEndRef = useRef(null);
  const highlightedMessage = useRef(null);

  const scrollToBottom = useCallback(() => {
    highlightedMessage.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, []);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, open]);

  useEffect(() => {
    scrollToBottom();
  }, [aiResponded, scrollToBottom]);

  useEffect(() => {
    if (selectedConversationId) scrollToBottom();
  }, [selectedConversationId, scrollToBottom]);

  useEffect(() => {
    if (!sound) {
      setLoading(false);
      return;
    } else if (aiResponded !== null) {
      setLoading(false);
      !mute && play();
    }
    // eslint-disable-next-line
  }, [aiResponded, mute, play]);

  const handleSend = useCallback(
    (content: string) => {
      if (!content.trim()) return;
      handleNewUserMessage(content);
      !mute && play();
      setLoading(true);
    },
    [handleNewUserMessage, mute, play]
  );

  const showLoading = useCallback(() => {
    if (conversationSent?.createdAt > aiResponded?.createdAt) return true;
    if (loading) return true;
    if (conversationSent && aiResponded === null) return true;
    return false;
  }, [conversationSent, aiResponded, loading]);

  return (
    <ChatDrawer
      title={title}
      open={open}
      onClose={handleToggle}
      history={history}
      selectedConversationId={selectedConversationId}
      readOnly={readOnly}
      mute={mute}
      onMuteToggle={() => setMute((prev) => !prev)}
      showLoading={showLoading()}
      onSend={handleSend}
      Presets={Presets}
      selectedPreset={selectedPreset}
      onPresetChange={onPresetChange}
      messagesEndRef={messagesEndRef}
      highlightedMessage={highlightedMessage}
      onNewSession={onNewSession}
      toolRenderers={toolRenderers}
      onToolDecision={onToolDecision}
      embedded={embedded}
      footer={footer}
    />
  );
};

export default memo(SidebarChat);
