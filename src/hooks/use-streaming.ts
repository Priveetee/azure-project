"use client";

import { useCallback, useRef } from "react";
import { useChatStore } from "@/stores/chat-store";

export function useStreaming() {
  const appendToStreamingMessage = useChatStore(
    (state) => state.appendToStreamingMessage,
  );
  const endStreaming = useChatStore((state) => state.endStreaming);
  const updateMessage = useChatStore((state) => state.updateMessage);

  const abortControllerRef = useRef<AbortController | null>(null);

  const streamResponse = useCallback(
    async (
      messageId: string,
      conversationId: string,
      userMessage: string,
      model: string,
      allMessages: Array<{
        role: "user" | "assistant" | "system";
        content: string;
      }>,
    ) => {
      abortControllerRef.current = new AbortController();

      try {
        const body = {
          model,
          messages: allMessages,
        };

        const response = await fetch("/api/chat/stream", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Stream request failed: ${response.status} - ${errorText}`,
          );
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("No reader available");
        }

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);

              try {
                const parsed = JSON.parse(data);

                if (parsed.content) {
                  appendToStreamingMessage(parsed.content);
                }

                if (parsed.usage) {
                  updateMessage(messageId, {
                    tokens: {
                      prompt: parsed.usage.promptTokens,
                      completion: parsed.usage.completionTokens,
                    },
                    modelUsed: model,
                  });
                }

                if (parsed.done) {
                  endStreaming();
                  break;
                }
              } catch {}
            }
          }
        }
      } catch (error: any) {
        if (error.name !== "AbortError") {
          updateMessage(messageId, {
            content: "Error: Failed to get response from AI",
          });
        }
        endStreaming();
      }
    },
    [appendToStreamingMessage, endStreaming, updateMessage],
  );

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    endStreaming();
  }, [endStreaming]);

  return {
    streamResponse,
    stopStreaming,
  };
}
