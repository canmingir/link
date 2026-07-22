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
