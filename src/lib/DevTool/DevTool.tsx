import DevToolFrame from "./DevToolFrame";
import type { DevToolFrameProps } from "./DevToolFrame";
import type { DevToolTopAction } from "../SidebarChat/SidebarSessionList";
import SessionPopover from "../SidebarChat/SessionPopover";
import SidebarSessionList from "../SidebarChat/SidebarSessionList";

import type { Message, StoredSession } from "../SidebarChat/types";
import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

interface DevToolShellRenderArgs {
  open: boolean;
  handleToggle?: () => void;
  selectedConversationId?: string;
  sessionId?: string;
  history: Message[];
  onNewSession?: () => void;
}

interface DevToolShellProps {
  open: boolean;
  handleToggle?: () => void;
  selectedConversationId?: string;
  sessionId?: string;
  history?: Message[];
  storedSessions?: StoredSession[];
  refreshSessions?: () => void;
  clearAllSessions?: () => void;
  onSessionSelect?: (sessionId: string, messages?: Message[]) => void;
  onNewSession?: () => void;
  beta?: boolean;
  topActions?: DevToolTopAction[];
  children: (args: DevToolShellRenderArgs) => ReactNode;
}

type DevToolProps = DevToolFrameProps &
  Partial<Omit<DevToolShellProps, "open" | "children">> & {
    open?: boolean;
    children?: DevToolShellProps["children"] | ReactNode;
  };

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
  topActions,
}: DevToolProps) => {
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
      topActions={topActions}
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
  history = [],
  storedSessions = [],
  refreshSessions = () => {},
  clearAllSessions = () => {},
  onSessionSelect,
  onNewSession,
  beta,
  topActions,
  children,
}: DevToolShellProps) => {
  const currentSessionId = sessionId || selectedConversationId;

  const [unreadCount, setUnreadCount] = useState(0);
  const lastSeenCountRef = useRef(0);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
  const [activeLogSessionId, setActiveLogSessionId] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const highlightedMessage = useRef<HTMLDivElement>(null);

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
    (event: ReactMouseEvent<HTMLElement>, sid: string) => {
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
        (s: StoredSession) => s.sessionId === activeLogSessionId
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
          topActions={topActions}
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
