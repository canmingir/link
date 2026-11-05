export interface Message {
  id?: string;
  content: string;
  role: string;
}

export interface StoredSession {
  sessionId: string;
  agentId?: string;
  messages: Message[];
  lastUpdated: number;
  agentIcon?: string;
  agentName?: string;
}

export interface ChatInputField {
  name: string;
  type: "string" | "number" | "boolean" | "enum" | "object" | "array";
  required?: boolean;
  description?: string;
  values?: string[];
}

export type ChatInputErrors = Record<string, string>;

export type ChatInputSubmit = (
  values: Record<string, unknown>
) => Promise<ChatInputErrors | string | void> | ChatInputErrors | string | void;

export type ChatJsonSubmit = (
  value: unknown
) => Promise<string | void> | string | void;

export type ChatInputMode = "chat" | "json" | "form";
