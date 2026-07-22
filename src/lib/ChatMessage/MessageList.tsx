import { AIMessage } from "./AIMessage";
import { ErrorMessage } from "./ErrorMessage";
import { HumanMessage } from "./HumanMessage";
import { ToolDecision, ToolMessage, ToolRenderers } from "./ToolMessage";

import React, { memo } from "react";

const MessageList = memo(
  ({
    error,
    messages,
    selectedId,
    messagesEndRef,
    highlightedMessage,
    onErrorClose,
    toolRenderers,
    onToolDecision,
  }: {
    error?: string;
    messages: { id: string; content: string; role: string }[];
    selectedId: string;
    messagesEndRef: { current: HTMLDivElement | null };
    highlightedMessage: { current: HTMLDivElement | null };
    onErrorClose?: () => void;
    toolRenderers?: ToolRenderers;
    onToolDecision?: (toolCallId: string, decision: ToolDecision) => void;
  }) => (
    <>
      {messages.map((item, index) => {
        const isLastMessage = index === messages.length - 1;
        const isSelected = item.id === selectedId;

        if (item.role === "USER") {
          return (
            <HumanMessage
              key={item.id || index}
              message={item}
              selectedId={selectedId}
              messageRef={
                isSelected
                  ? highlightedMessage
                  : isLastMessage
                  ? messagesEndRef
                  : undefined
              }
            />
          );
        }

        if (item.role === "TOOL") {
          return (
            <ToolMessage
              key={item.id || index}
              content={item.content}
              messageRef={isLastMessage ? messagesEndRef : undefined}
              renderers={toolRenderers}
              onDecision={onToolDecision}
            />
          );
        }

        return (
          <AIMessage
            key={item.id || index}
            content={item.content}
            messageRef={isLastMessage ? messagesEndRef : undefined}
          />
        );
      })}
      {error && (
        <ErrorMessage
          key="error-message"
          content={error}
          onClose={onErrorClose}
        />
      )}
    </>
  )
);

export { MessageList };
