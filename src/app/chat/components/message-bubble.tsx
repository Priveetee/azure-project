"use client";

import { AssistantBubble } from "./assistant-bubble";
import { UserBubble } from "./user-bubble";

interface MessageBubbleProps {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  modelDisplayName?: string;
  isStreaming?: boolean;
}

export function MessageBubble({
  id,
  role,
  content,
  timestamp,
  modelDisplayName,
  isStreaming,
}: MessageBubbleProps) {
  if (role === "assistant") {
    return (
      <AssistantBubble
        id={id}
        content={content}
        timestamp={timestamp}
        modelDisplayName={modelDisplayName}
        isStreaming={isStreaming}
      />
    );
  }

  return <UserBubble content={content} timestamp={timestamp} />;
}
