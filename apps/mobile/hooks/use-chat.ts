import { useState } from "react";
import { Platform, Alert } from "react-native";
import { DEFAULT_MODEL } from "@meowww/shared";
import type { Conversation, Message } from "@meowww/shared";
import Toast from "react-native-toast-message";
import Constants from "expo-constants";
import { streamChat } from "../lib/streaming";

type SortOrder = "desc" | "asc";
const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl;

let idCounter = 0;
function createId() {
  idCounter += 1;
  return `${Platform.OS}-${Date.now()}-${idCounter}`;
}

export function useChat() {
  const [conversations, setConversations] = useState<
    Record<string, Conversation>
  >({});
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null,
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const currentConversation = currentConversationId
    ? conversations[currentConversationId]
    : null;

  const handleNewChat = () => {
    setCurrentConversationId(null);
  };

  const handleSelectThread = (id: string) => {
    setCurrentConversationId(id);
  };

  const handleDeleteThread = (id: string) => {
    setConversations((prev) => {
      const newConversations = { ...prev };
      delete newConversations[id];
      return newConversations;
    });
    if (currentConversationId === id) {
      setCurrentConversationId(null);
    }
    Toast.show({
      type: "success",
      text1: "Deleted!",
      position: "top",
      visibilityTime: 1500,
    });
  };

  const handleDeleteAll = () => {
    Alert.alert(
      "Delete All History",
      "Are you sure you want to delete all conversations?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setConversations({});
            setCurrentConversationId(null);
            Toast.show({
              type: "success",
              text1: "All chats deleted!",
              position: "top",
            });
          },
        },
      ],
    );
  };

  const handleRenameThread = (id: string, newTitle: string) => {
    setConversations((prev) => ({
      ...prev,
      [id]: { ...prev[id], title: newTitle },
    }));
  };

  const handleSend = (text: string, modelId: string) => {
    if (!API_BASE_URL) {
      Toast.show({ type: "error", text1: "API URL not configured" });
      return;
    }
    const trimmed = text.trim();
    if (!trimmed || streamingMessageId) return;

    let convId = currentConversationId;
    if (!convId) {
      const newId = createId();
      const newConversation: Conversation = {
        id: newId,
        title: trimmed.substring(0, 40),
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isPinned: false,
        tags: [],
      };
      setConversations((prev) => ({ ...prev, [newId]: newConversation }));
      convId = newId;
      setCurrentConversationId(newId);
    }

    const finalConvId = convId;
    const userId = createId();
    const assistantId = createId();
    const userMsg: Message = {
      id: userId,
      content: trimmed,
      role: "user",
      timestamp: new Date(),
    };
    const assistantMsg: Message = {
      id: assistantId,
      content: "",
      role: "assistant",
      timestamp: new Date(),
      modelUsed: modelId,
    };

    const currentHistory =
      conversations[finalConvId]?.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })) || [];

    setConversations((prev) => ({
      ...prev,
      [finalConvId]: {
        ...prev[finalConvId],
        messages: [...prev[finalConvId].messages, userMsg, assistantMsg],
        updatedAt: new Date(),
      },
    }));
    setInput("");
    setStreamingMessageId(assistantId);

    streamChat.start({
      apiBaseUrl: API_BASE_URL,
      model: modelId,
      history: [...currentHistory, { role: "user", content: trimmed }],
      onChunk: (chunk) => {
        setConversations((prev) => {
          if (!prev[finalConvId]) return prev;
          const newMessages = prev[finalConvId].messages.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m,
          );
          return {
            ...prev,
            [finalConvId]: { ...prev[finalConvId], messages: newMessages },
          };
        });
      },
      onDone: () => setStreamingMessageId(null),
      onError: (error) => {
        setConversations((prev) => {
          if (!prev[finalConvId]) return prev;
          const newMessages = prev[finalConvId].messages.map((m) =>
            m.id === assistantId ? { ...m, content: `Error: ${error}` } : m,
          );
          return {
            ...prev,
            [finalConvId]: { ...prev[finalConvId], messages: newMessages },
          };
        });
        setStreamingMessageId(null);
      },
    });
  };

  const regenerateAssistantMessage = (
    assistantMessageId: string,
    modelId: string,
  ) => {
    if (!API_BASE_URL) {
      Toast.show({ type: "error", text1: "API URL not configured" });
      return;
    }
    if (!currentConversation) return;
    if (streamingMessageId) return;

    const messages = currentConversation.messages;
    const index = messages.findIndex((m) => m.id === assistantMessageId);
    if (index === -1) return;

    const prevMessages = messages.slice(0, index);
    let lastUserIndex = -1;
    for (let i = prevMessages.length - 1; i >= 0; i -= 1) {
      if (prevMessages[i].role === "user") {
        lastUserIndex = i;
        break;
      }
    }
    if (lastUserIndex === -1) {
      Toast.show({
        type: "error",
        text1: "No user message to regenerate from",
        position: "top",
      });
      return;
    }

    const historyMessages = prevMessages.slice(0, lastUserIndex);
    const userMessage = prevMessages[lastUserIndex];
    const history = historyMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const newAssistantId = createId();
    const newAssistantMsg: Message = {
      id: newAssistantId,
      content: "",
      role: "assistant",
      timestamp: new Date(),
      modelUsed: modelId,
    };

    const convId = currentConversation.id;

    setConversations((prev) => {
      const conv = prev[convId];
      if (!conv) return prev;
      const newMessages = [...conv.messages];
      newMessages.splice(index, 1, newAssistantMsg);
      return {
        ...prev,
        [convId]: { ...conv, messages: newMessages, updatedAt: new Date() },
      };
    });
    setStreamingMessageId(newAssistantId);

    streamChat.start({
      apiBaseUrl: API_BASE_URL,
      model: modelId,
      history: [...history, { role: "user", content: userMessage.content }],
      onChunk: (chunk) => {
        setConversations((prev) => {
          const conv = prev[convId];
          if (!conv) return prev;
          const newMessages = conv.messages.map((m) =>
            m.id === newAssistantId ? { ...m, content: m.content + chunk } : m,
          );
          return {
            ...prev,
            [convId]: { ...conv, messages: newMessages },
          };
        });
      },
      onDone: () => setStreamingMessageId(null),
      onError: (error) => {
        setConversations((prev) => {
          const conv = prev[convId];
          if (!conv) return prev;
          const newMessages = conv.messages.map((m) =>
            m.id === newAssistantId ? { ...m, content: `Error: ${error}` } : m,
          );
          return {
            ...prev,
            [convId]: { ...conv, messages: newMessages },
          };
        });
        setStreamingMessageId(null);
      },
    });
  };

  const handleStop = () => {
    streamChat.stop();
    setStreamingMessageId(null);
  };

  const setSelectedModelFromOutside = (modelId: string) => {
    setSelectedModel(modelId);
  };

  return {
    conversations,
    currentConversationId,
    currentConversation,
    input,
    setInput,
    selectedModel,
    setSelectedModel,
    setSelectedModelFromOutside,
    streamingMessageId,
    sortOrder,
    setSortOrder,
    handleNewChat,
    handleSelectThread,
    handleDeleteThread,
    handleDeleteAll,
    handleRenameThread,
    handleSend,
    regenerateAssistantMessage,
    handleStop,
  };
}
