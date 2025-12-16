"use client";

import { useChatStore } from "@/stores/chat-store";
import type { Message } from "@meowww/shared";
import { useStreaming } from "@/hooks/use-streaming";

function generateTitleFromMessage(content: string): string {
  const trimmed = content.trim().replace(/\s+/g, " ");
  if (!trimmed) return "New Chat";

  const noPunct = trimmed.replace(/[.!?]+$/g, "");
  const maxLen = 60;

  if (noPunct.length <= maxLen) return noPunct;

  return noPunct.slice(0, maxLen).trimEnd() + "…";
}

export function useChatActions() {
  const createConversation = useChatStore((state) => state.createConversation);
  const addMessage = useChatStore((state) => state.addMessage);
  const setCurrentConversation = useChatStore(
    (state) => state.setCurrentConversation,
  );
  const startStreaming = useChatStore((state) => state.startStreaming);
  const setConversationTitle = useChatStore(
    (state) => state.setConversationTitle,
  );
  const getCurrentConversation = useChatStore(
    (state) => state.getCurrentConversation,
  );
  const updateMessage = useChatStore((state) => state.updateMessage);
  const { streamResponse } = useStreaming();

  async function sendMessage(
    content: string,
    conversationId?: string,
    model?: string,
  ) {
    let convId = conversationId;

    if (!convId) {
      convId = createConversation();
      setCurrentConversation(convId);
      const title = generateTitleFromMessage(content);
      setConversationTitle(convId, title);
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    addMessage(convId, userMessage);

    const assistantMessageId = crypto.randomUUID();

    const assistantMessage: Message = {
      id: assistantMessageId,
      content: "",
      role: "assistant",
      timestamp: new Date(),
      modelUsed: model,
    };

    addMessage(convId, assistantMessage);
    startStreaming(assistantMessageId);

    return {
      conversationId: convId,
      messageId: assistantMessageId,
    };
  }

  async function regenerateMessage(assistantMessageId: string, model: string) {
    const conv = getCurrentConversation();
    if (!conv) return;

    const idx = conv.messages.findIndex((m) => m.id === assistantMessageId);
    if (idx === -1) return;

    const history: {
      role: "user" | "assistant" | "system";
      content: string;
    }[] = [];
    let lastUserContent: string | null = null;

    for (let i = 0; i < idx; i++) {
      const m = conv.messages[i];
      history.push({
        role: m.role,
        content: m.content,
      });
      if (m.role === "user") {
        lastUserContent = m.content;
      }
    }

    if (!lastUserContent) return;

    updateMessage(assistantMessageId, {
      content: "",
      modelUsed: model,
      timestamp: new Date(),
    });

    startStreaming(assistantMessageId);

    const allMessages = [
      ...history,
      { role: "user" as const, content: lastUserContent },
    ];

    await streamResponse(
      assistantMessageId,
      conv.id,
      lastUserContent,
      model,
      allMessages,
    );
  }

  return { sendMessage, regenerateMessage };
}
