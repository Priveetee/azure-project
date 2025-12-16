export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  modelUsed?: string;
  tokens?: {
    prompt: number;
    completion: number;
  };
  isEdited?: boolean;
  editHistory?: Array<{
    content: string;
    timestamp: Date;
  }>;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
  tags: string[];
  shareId?: string;
  modelPreset?: string;
}

export interface CachedResponse {
  prompt: string;
  response: string;
  model: string;
  timestamp: Date;
  tokens: number;
}
