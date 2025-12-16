import { fetch } from "expo/fetch";

type StreamChatParams = {
  apiBaseUrl: string;
  model: string;
  history: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  onChunk: (chunk: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
};

let abortController: AbortController | null = null;

export const streamChat = {
  async start({
    apiBaseUrl,
    model,
    history,
    onChunk,
    onDone,
    onError,
  }: StreamChatParams) {
    abortController = new AbortController();

    try {
      const response = await fetch(`${apiBaseUrl}/api/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, messages: history }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const body = response.body;
      if (!body) {
        throw new Error("Could not get reader from response body");
      }

      const reader = body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.substring(6);
            if (data.trim()) {
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) onChunk(parsed.content);
                if (parsed.done) {
                  onDone();
                  return;
                }
              } catch {}
            }
          }
        }
      }

      onDone();
    } catch (error: any) {
      if (error.name !== "AbortError") {
        onError(error.message || "An unknown error occurred");
      }
    } finally {
      abortController = null;
    }
  },

  stop() {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
  },
};
