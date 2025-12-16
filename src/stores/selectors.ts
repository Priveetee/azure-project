import { useChatStore } from "./chat-store";
import { useMemo } from "react";

export function useCurrentConversation() {
  const currentConversationId = useChatStore(
    (state) => state.currentConversationId,
  );
  const conversation = useChatStore((state) =>
    currentConversationId ? state.conversations[currentConversationId] : null,
  );
  return conversation;
}

export function useConversationsList() {
  const conversations = useChatStore((state) => state.conversations);
  return useMemo(() => Object.values(conversations), [conversations]);
}
