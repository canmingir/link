import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import DevTool from "../lib/DevTool/DevTool";
import { Iconify } from "@canmingir/link/platform/components";
import React from "react";
import SidebarChat from "../lib/SidebarChat/SidebarChat";

import { ThemeProvider, createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
  palette: { mode: "light", primary: { main: "#1976d2" } },
});

const now = Date.now();

const makeMessages = (n) =>
  Array.from({ length: n }, (_, i) => ({
    id: `m-${i}`,
    role: i % 2 === 0 ? "user" : "assistant",
    content:
      i % 2 === 0
        ? `Question number ${i / 2 + 1}?`
        : `Answer number ${Math.ceil(i / 2)}. Lorem ipsum dolor sit amet.`,
  }));

const storedSessions = [
  {
    sessionId: "sess-1",
    messages: makeMessages(6),
    lastUpdated: now - 1000 * 60 * 20,
    agentName: "Planner",
  },
  {
    sessionId: "sess-2",
    messages: makeMessages(3),
    lastUpdated: now - 1000 * 60 * 5,
    agentIcon: "solar:rocket-bold-duotone",
    agentName: "Builder",
  },
  {
    sessionId: "sess-3",
    messages: makeMessages(11),
    lastUpdated: now - 1000 * 60,
    agentName: "Reviewer",
  },
];

const noop = () => {};

const Frame = ({ children, theme = lightTheme }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minWidth: 640,
        minHeight: 520,
        border: "1px dashed",
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.default",
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 3, color: "text.secondary", fontSize: 13 }}>
        App content — the DevTool docks to the right edge.
      </Box>
      {children}
    </Box>
  </ThemeProvider>
);

export default {
  title: "Lib/DevTool",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
\`DevTool\` is the top-level right-side shell. It has **two modes in one component**:

- **Slot mode** (no \`children\`, or \`children\` is a node) — a plain glass box with
  \`header\` / \`content\` / \`footer\` slots. Used internally by \`SidebarSessionList\`
  to draw the rail.
- **Shell mode** (\`children\` is a **function**) — renders the collapsed session
  rail + session popover and hosts the chat surface as the wide drawer.

In shell mode \`children\` is a **render prop**: DevTool owns the session state and
passes it to the function, which returns the chat element (typically
\`<SidebarChat />\`):

\`\`\`jsx
<DevTool open={open} sessionId={id} history={history} storedSessions={...}>
  {({ open, handleToggle, selectedConversationId, sessionId, history, onNewSession }) => (
    <SidebarChat
      title="Assistant"
      open={open}
      handleToggle={handleToggle}
      selectedConversationId={selectedConversationId}
      sessionId={sessionId}
      history={history}
      onNewSession={onNewSession}
      handleNewUserMessage={send}
    />
  )}
</DevTool>
\`\`\`

Pass \`open\` to toggle between the collapsed rail and the open chat drawer.
        `,
      },
    },
  },
};

const renderChat =
  (extra = {}) =>
  (ctx) =>
    (
      <SidebarChat
        title="Assistant"
        handleNewUserMessage={noop}
        open={ctx.open}
        handleToggle={ctx.handleToggle}
        selectedConversationId={ctx.selectedConversationId}
        sessionId={ctx.sessionId}
        history={ctx.history}
        onNewSession={ctx.onNewSession}
        {...extra}
      />
    );

export const SlotMode = {
  name: "Slot mode — header / content / footer",
  render: () => (
    <Frame>
      <DevTool
        open
        width={62}
        height={280}
        header={<Box sx={{ fontSize: 11, fontWeight: 700, py: 0.5 }}>TOP</Box>}
        content={
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, py: 1 }}>
            {["A", "B", "C", "D"].map((x) => (
              <Box
                key={x}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "action.hover",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {x}
              </Box>
            ))}
          </Box>
        }
        footer={
          <Iconify icon="solar:trash-bin-2-bold" width={18} height={18} />
        }
      />
    </Frame>
  ),
};

export const SlotModeClosed = {
  name: "Slot mode — open={false} renders nothing",
  render: () => (
    <Frame>
      <DevTool open={false} content={<Box>you should not see this</Box>} />
      <Box sx={{ position: "absolute", bottom: 12, left: 12, fontSize: 12 }}>
        DevTool returned null — canvas is empty on the right.
      </Box>
    </Frame>
  ),
};

const shellProps = {
  handleToggle: noop,
  selectedConversationId: "sess-3",
  sessionId: "sess-3",
  history: makeMessages(11),
  storedSessions,
  refreshSessions: noop,
  clearAllSessions: noop,
  onSessionSelect: noop,
  onNewSession: noop,
};

export const ShellCollapsed = {
  name: "Shell — collapsed rail (open={false})",
  render: () => (
    <Frame>
      <DevTool {...shellProps} open={false}>
        {renderChat()}
      </DevTool>
    </Frame>
  ),
};

export const ShellCollapsedBeta = {
  name: "Shell — collapsed rail, beta (no Swagger button)",
  render: () => (
    <Frame>
      <DevTool {...shellProps} open={false} beta>
        {renderChat()}
      </DevTool>
    </Frame>
  ),
};

export const ShellCollapsedWithTopAction = {
  name: "Shell — collapsed rail + topAction button",
  render: () => (
    <Frame>
      <DevTool
        {...shellProps}
        open={false}
        topAction={{
          icon: "solar:folder-with-files-bold-duotone",
          label: "Context",
          tooltip: "Open context panel",
          onClick: noop,
        }}
      >
        {renderChat()}
      </DevTool>
    </Frame>
  ),
};

export const ShellCollapsedNoSessions = {
  name: "Shell — collapsed rail, no sessions",
  render: () => (
    <Frame>
      <DevTool
        {...shellProps}
        open={false}
        storedSessions={[]}
        selectedConversationId={undefined}
        sessionId={undefined}
        history={[]}
      >
        {renderChat()}
      </DevTool>
    </Frame>
  ),
};

export const ShellOpen = {
  name: "Shell — open chat drawer",
  render: () => (
    <Frame>
      <DevTool {...shellProps} open>
        {renderChat()}
      </DevTool>
    </Frame>
  ),
};

export const ShellOpenReadOnly = {
  name: "Shell — open chat drawer, read-only",
  render: () => (
    <Frame>
      <DevTool {...shellProps} open>
        {renderChat({ readOnly: true, title: "Assistant (history)" })}
      </DevTool>
    </Frame>
  ),
};

export const ShellOpenEmpty = {
  name: "Shell — open chat drawer, empty conversation",
  render: () => (
    <Frame>
      <DevTool
        {...shellProps}
        open
        history={[]}
        storedSessions={[]}
        selectedConversationId={undefined}
        sessionId={undefined}
      >
        {renderChat()}
      </DevTool>
    </Frame>
  ),
};

export const ShellInteractive = {
  name: "Shell — interactive (toggle + send)",
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [history, setHistory] = React.useState(makeMessages(4));

    const toggle = () => setOpen((o) => !o);
    const send = (msg) =>
      setHistory((h) => [
        ...h,
        { id: `u-${h.length}`, role: "user", content: msg },
      ]);
    const reset = () => setHistory([]);

    return (
      <Frame>
        <DevTool
          {...shellProps}
          open={open}
          handleToggle={toggle}
          history={history}
          onNewSession={reset}
        >
          {(ctx) => (
            <SidebarChat
              title="Assistant"
              open={ctx.open}
              handleToggle={ctx.handleToggle}
              selectedConversationId={ctx.selectedConversationId}
              sessionId={ctx.sessionId}
              history={ctx.history}
              onNewSession={ctx.onNewSession}
              handleNewUserMessage={send}
            />
          )}
        </DevTool>
      </Frame>
    );
  },
};
