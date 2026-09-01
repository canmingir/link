import DevToolFrame from "./DevToolFrame";
import SessionPopover from "../SidebarChat/SessionPopover";
import SidebarSessionList from "../SidebarChat/SidebarSessionList";

import React, { useCallback, useEffect, useRef, useState } from "react";

const DevTool = ({
  width = 62,
  height = "auto",
  top = "50%",
  open: openProp,
  content,
  header,
  footer,
  sx,
  children,
  handleToggle,
  selectedConversationId,
  sessionId,
  history = [],
  storedSessions = [],
  refreshSessions = () => {},
  clearAllSessions = () => {},
  onSessionSelect,
  onNewSession,
  beta,
  topAction,
}) => {
  const isShell = typeof children === "function";

  if (!isShell) {
    return (
      <DevToolFrame
        width={width}
        height={height}
        top={top}
        open={openProp}
        content={content}
        header={header}
        footer={footer}
        sx={sx}
      />
    );
  }

  return (
    <DevToolShell
      open={!!openProp}
      handleToggle={handleToggle}
      selectedConversationId={selectedConversationId}
      sessionId={sessionId}
      history={history}
      storedSessions={storedSessions}
      refreshSessions={refreshSessions}
      clearAllSessions={clearAllSessions}
      onSessionSelect={onSessionSelect}
      onNewSession={onNewSession}
      beta={beta}
      topAction={topAction}
    >
      {children}
    </DevToolShell>
  );
};

const DevToolShell = ({
  open,
  handleToggle,
  selectedConversationId,
  sessionId,
  history,
  storedSessions,
  refreshSessions,
  clearAllSessions,
  onSessionSelect,
  onNewSession,
  beta,
  topAction,
  children,
}) => {
  const currentSessionId = sessionId || selectedConversationId;

  const [unreadCount, setUnreadCount] = useState(0);
  const lastSeenCountRef = useRef(0);
  const sidebarRef = useRef(null);

  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [activeLogSessionId, setActiveLogSessionId] = useState("");

  const messagesEndRef = useRef(null);
  const highlightedMessage = useRef(null);

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

  const handleSessionClick = useCallback(
    (event, sid) => {
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
    if (!open) handleToggle?.();
  }, [
    handleToggle,
    open,
    activeLogSessionId,
    currentSessionId,
    onSessionSelect,
    storedSessions,
  ]);

  const chat = children({
    open,
    handleToggle,
    selectedConversationId,
    sessionId,
    history,
    onNewSession,
  });

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
          topAction={topAction}
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

      {chat}
    </>
  );
};

export default DevTool;
