import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { Conversation, Message } from "@meowww/shared";

interface ChatStore {
  conversations: Record<string, Conversation>;
  currentConversationId: string | null;
  streamingMessageId: string | null;
  streamingBuffer: string;
  fullResponseBuffer: string;
  theme: "light" | "dark";

  getCurrentConversation: () => Conversation | null;
  getMessageById: (id: string) => Message | null;

  setCurrentConversation: (id: string) => void;
  setConversationTitle: (id: string, title: string) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (messageId: string) => void;

  createConversation: (title?: string) => string;
  deleteConversation: (id: string) => void;
  pinConversation: (id: string) => void;
  tagConversation: (id: string, tags: string[]) => void;

  startStreaming: (messageId: string) => void;
  setFullResponseBuffer: (content: string) => void;
  appendToStreamingMessage: (chunk: string) => void;
  flushStreamingBuffer: () => void;
  endStreaming: () => void;

  toggleTheme: () => void;
}

export const useChatStore = create<ChatStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        conversations: {},
        currentConversationId: null,
        streamingMessageId: null,
        streamingBuffer: "",
        fullResponseBuffer: "",
        theme: "dark",

        getCurrentConversation: () => {
          const id = get().currentConversationId;
          return id ? get().conversations[id] : null;
        },

        getMessageById: (id) => {
          const convs = get().conversations;
          for (const conv of Object.values(convs)) {
            const msg = conv.messages.find((m) => m.id === id);
            if (msg) return msg;
          }
          return null;
        },

        setCurrentConversation: (id) => set({ currentConversationId: id }),

        setConversationTitle: (id, title) =>
          set((state) => {
            if (state.conversations[id]) {
              state.conversations[id].title = title;
              state.conversations[id].updatedAt = new Date();
            }
          }),

        addMessage: (conversationId, message) =>
          set((state) => {
            if (!state.conversations[conversationId]) return;
            state.conversations[conversationId].messages.push(message);
            state.conversations[conversationId].updatedAt = new Date();
          }),

        updateMessage: (messageId, updates) =>
          set((state) => {
            for (const conv of Object.values(state.conversations)) {
              const msg = conv.messages.find((m) => m.id === messageId);
              if (msg) {
                Object.assign(msg, updates);
                conv.updatedAt = new Date();
                break;
              }
            }
          }),

        deleteMessage: (messageId) =>
          set((state) => {
            for (const conv of Object.values(state.conversations)) {
              const index = conv.messages.findIndex((m) => m.id === messageId);
              if (index !== -1) {
                conv.messages.splice(index, 1);
                conv.updatedAt = new Date();
                break;
              }
            }
          }),

        createConversation: (title) => {
          const id = crypto.randomUUID();
          set((state) => {
            state.conversations[id] = {
              id,
              title: title || "New Chat",
              messages: [],
              createdAt: new Date(),
              updatedAt: new Date(),
              isPinned: false,
              tags: [],
            };
          });
          return id;
        },

        deleteConversation: (id) =>
          set((state) => {
            delete state.conversations[id];
            if (state.currentConversationId === id) {
              state.currentConversationId = null;
            }
          }),

        pinConversation: (id) =>
          set((state) => {
            if (state.conversations[id]) {
              state.conversations[id].isPinned =
                !state.conversations[id].isPinned;
            }
          }),

        tagConversation: (id, tags) =>
          set((state) => {
            if (state.conversations[id]) {
              state.conversations[id].tags = tags;
            }
          }),

        startStreaming: (messageId) =>
          set({
            streamingMessageId: messageId,
            streamingBuffer: "",
            fullResponseBuffer: "",
          }),

        setFullResponseBuffer: (content) =>
          set(() => ({
            fullResponseBuffer: content,
            streamingBuffer: content,
          })),

        appendToStreamingMessage: (chunk) =>
          set((state) => {
            state.streamingBuffer += chunk;
          }),

        flushStreamingBuffer: () =>
          set((state) => {
            const msgId = state.streamingMessageId;
            if (!msgId || !state.streamingBuffer) return;

            for (const conv of Object.values(state.conversations)) {
              const msg = conv.messages.find((m) => m.id === msgId);
              if (msg) {
                msg.content += state.streamingBuffer;
                state.streamingBuffer = "";
                break;
              }
            }
          }),

        endStreaming: () =>
          set((state) => {
            const msgId = state.streamingMessageId;
            if (msgId && state.streamingBuffer) {
              for (const conv of Object.values(state.conversations)) {
                const msg = conv.messages.find((m) => m.id === msgId);
                if (msg) {
                  msg.content += state.streamingBuffer;
                  break;
                }
              }
            }
            state.streamingMessageId = null;
            state.streamingBuffer = "";
            state.fullResponseBuffer = "";
          }),

        toggleTheme: () =>
          set((state) => {
            state.theme = state.theme === "dark" ? "light" : "dark";
          }),
      })),
      {
        name: "meowww-chat",
        partialize: (state) => ({
          conversations: state.conversations,
          theme: state.theme,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            Object.values(state.conversations).forEach((conv) => {
              conv.createdAt = new Date(conv.createdAt);
              conv.updatedAt = new Date(conv.updatedAt);
              conv.messages.forEach((msg) => {
                msg.timestamp = new Date(msg.timestamp);
              });
            });
          }
        },
      },
    ),
    { name: "ChatStore" },
  ),
);
