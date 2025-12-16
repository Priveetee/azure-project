"use client";

import { useState } from "react";
import { ChatMessages } from "./components/chat-messages";
import { ChatInput } from "./components/chat-input";
import { ChatSidebar } from "./components/chat-sidebar";
import { ChatHeader } from "./components/chat-header";
import { useChatStore } from "@/stores/chat-store";
import {
  useCurrentConversation,
  useConversationsList,
} from "@/stores/selectors";
import { useChatActions } from "@/hooks/use-chat-actions";
import { useStreaming } from "@/hooks/use-streaming";
import { useSmoothStreaming } from "@/hooks/use-smooth-streaming";
import { DEFAULT_MODEL } from "@meowww/shared";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);

  const conversations = useConversationsList();
  const currentConversationId = useChatStore(
    (state) => state.currentConversationId,
  );
  const createConversation = useChatStore((state) => state.createConversation);
  const setCurrentConversation = useChatStore(
    (state) => state.setCurrentConversation,
  );
  const deleteConversation = useChatStore((state) => state.deleteConversation);
  const streamingMessageId = useChatStore((state) => state.streamingMessageId);

  const currentConversation = useCurrentConversation();
  const { sendMessage } = useChatActions();
  const { streamResponse, stopStreaming } = useStreaming();

  useSmoothStreaming();

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
  };

  const handleNewChat = () => {
    const newId = createConversation();
    setCurrentConversation(newId);
  };

  const handleSelectThread = (threadId: string) => {
    setCurrentConversation(threadId);
  };

  const handleDeleteThread = (threadId: string) => {
    deleteConversation(threadId);
  };

  const handleSubmit = async (message: string, model: string) => {
    if (!message.trim()) return;

    const result = await sendMessage(
      message,
      currentConversationId || undefined,
      model,
    );

    if (!result) return;

    const conv = conversations.find((c) => c.id === result.conversationId);

    const allMessages = [
      ...(conv?.messages || []).map((m) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      })),
      {
        role: "user" as const,
        content: message,
      },
    ];

    await streamResponse(
      result.messageId,
      result.conversationId,
      message,
      model,
      allMessages,
    );

    setInput("");
  };

  const showHeader =
    !currentConversationId || !currentConversation?.messages.length;
  const isLoading = streamingMessageId !== null;

  const threads = conversations
    .slice()
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .map((conv) => ({
      id: conv.id,
      title: conv.title,
      timestamp: conv.updatedAt,
      messages: conv.messages.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
        modelDisplayName: msg.modelUsed || undefined,
      })),
    }));

  return (
    <div className="flex h-screen bg-zinc-950">
      <ChatSidebar
        onNewChat={handleNewChat}
        onSelectThread={handleSelectThread}
        onDeleteThread={handleDeleteThread}
        currentThreadId={currentConversationId || undefined}
        threads={threads}
      />

      <div className="flex-1 flex flex-col bg-zinc-950">
        {showHeader && <ChatHeader onPromptClick={handlePromptClick} />}

        {!showHeader && currentConversation && (
          <ChatMessages
            messages={currentConversation.messages.map((msg) => ({
              id: msg.id,
              role: msg.role,
              content: msg.content,
              timestamp: msg.timestamp,
              modelDisplayName: msg.modelUsed || undefined,
            }))}
            showTyping={isLoading}
          />
        )}

        <div className="px-6 pb-6">
          <ChatInput
            value={input}
            onValueChange={setInput}
            onSubmit={handleSubmit}
            disabled={isLoading}
            selectedProvider={selectedModel}
            onProviderChange={handleModelChange}
            onStop={stopStreaming}
          />
        </div>
      </div>
    </div>
  );
}
