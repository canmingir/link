import ChatDrawer from "./ChatDrawer";
import SessionPopover from "./SessionPopover";
import SidebarSessionList from "./SidebarSessionList";
import { StoredSession } from "./types";
import { ToolDecision, ToolRenderers } from "../ChatMessage/ToolMessage";
import { useEvent } from "@nucleoidai/react-event";
import useSound from "use-sound";

import MessageSfx from "./messageSFX.mp3";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";

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
  agent?: { id: string; name: string; icon: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Presets?: any[];
  selectedPreset?: string;
  onPresetChange?: (preset: string) => void;
  onSessionSelect?: (sessionId: string, cachedMessages?: Message[]) => void;
  onNewSession?: () => void;
  beta?: boolean;
  storedSessions?: StoredSession[];
  refreshSessions?: () => void;
  clearAllSessions?: () => void;
  toolRenderers?: ToolRenderers;
  onToolDecision?: (toolCallId: string, decision: ToolDecision) => void;
}

const SidebarChat = ({
  selectedConversationId,
  sessionId,
  title,
  open,
  handleToggle,
  handleNewUserMessage,
  history = [],
  readOnly,
  sound,
  agent,
  Presets = [],
  selectedPreset,
  onPresetChange,
  onSessionSelect,
  onNewSession,
  beta,
  storedSessions = [],
  refreshSessions = () => {},
  clearAllSessions = () => {},
  toolRenderers,
  onToolDecision,
}: SidebarChatProps) => {
  const [aiResponded] = useEvent("AI_RESPONDED", null);
  const [conversationSent] = useEvent("CONVERSATION_SENT", null);

  const currentSessionId = sessionId || selectedConversationId;

  const [mute, setMute] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [play] = useSound(MessageSfx);

  const messagesEndRef = useRef(null);
  const highlightedMessage = useRef(null);
  const lastSeenCountRef = useRef(0);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
  const [activeLogSessionId, setActiveLogSessionId] = useState("");

  const scrollToBottom = useCallback(() => {
    highlightedMessage.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, []);

  useEffect(() => {
    if (open) {
      lastSeenCountRef.current = history.length;
      setUnreadCount(0);
      setPopoverAnchor(null);
    }
  }, [open, history.length]);

  useEffect(() => {
    if (!open && history.length > lastSeenCountRef.current) {
      setUnreadCount(history.length - lastSeenCountRef.current);
    }
  }, [history, open]);

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

  const handleSessionClick = useCallback(
    (event: React.MouseEvent<HTMLElement>, sid: string) => {
      refreshSessions();
      setActiveLogSessionId(sid);
      setPopoverAnchor(event.currentTarget);
    },
    [refreshSessions]
  );

  const handleOpenFromPopover = useCallback(() => {
    setPopoverAnchor(null);
    if (activeLogSessionId && activeLogSessionId !== currentSessionId) {
      const cached = storedSessions.find(
        (s) => s.sessionId === activeLogSessionId
      );
      onSessionSelect?.(activeLogSessionId, cached?.messages);
    }
    if (!open) handleToggle();
  }, [
    handleToggle,
    open,
    activeLogSessionId,
    currentSessionId,
    onSessionSelect,
    storedSessions,
  ]);

  return (
    <>
      {!open && (
        <SidebarSessionList
          sessions={storedSessions}
          currentSessionId={currentSessionId}
          unreadCount={unreadCount}
          onToggleChat={handleToggle}
          onSessionClick={handleSessionClick}
          onClearAll={clearAllSessions}
          wrapperRef={sidebarRef}
          beta={beta}
          onNewSession={onNewSession}
        />
      )}

      <SessionPopover
        anchorEl={popoverAnchor}
        onClose={() => setPopoverAnchor(null)}
        onOpenFullChat={handleOpenFromPopover}
        sessions={storedSessions}
        activeSessionId={activeLogSessionId}
        currentSessionId={currentSessionId}
        selectedConversationId={selectedConversationId}
        messagesEndRef={messagesEndRef}
        highlightedMessage={highlightedMessage}
      />

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
      />
    </>
  );
};

export default memo(SidebarChat);
