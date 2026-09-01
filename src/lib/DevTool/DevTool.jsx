import SessionPopover from "../SidebarChat/SessionPopover";
import SidebarSessionList from "../SidebarChat/SidebarSessionList";

import { Box, Divider } from "@mui/material";
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
    if (openProp === false) return null;
    return (
      <Box
        component="aside"
        sx={{
          position: "fixed",
          top,
          right: 0,
          transform: "translateY(-50%)",
          width,
          height,
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "background.paper"
              : "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          border: (theme) =>
            `1px solid ${
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.07)"
                : "rgba(0,0,0,0.07)"
            }`,
          borderRadius: "4px",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)"
              : "0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
          zIndex: (theme) => theme.zIndex.modal + 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 1.5,
          overflowY: "hidden",
          overflowX: "hidden",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          ...(sx || {}),
        }}
      >
        {header && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            {header}
          </Box>
        )}

        <Box
          sx={{
            flex: 1,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflowY: "auto",
            overflowX: "hidden",
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          {content}
        </Box>

        {footer && (
          <>
            <Divider
              flexItem
              sx={{
                borderColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.07)"
                    : "rgba(0,0,0,0.07)",
                width: "100%",
                flexShrink: 0,
              }}
            />
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexShrink: 0,
                pt: 0.5,
              }}
            >
              {footer}
            </Box>
          </>
        )}
      </Box>
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
