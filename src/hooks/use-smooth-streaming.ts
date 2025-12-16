import { useEffect, useRef } from "react";
import { useChatStore } from "@/stores/chat-store";

const TYPING_TICK_MS = 60;
const CHARS_PER_TICK = 40;

export function useSmoothStreaming() {
  const streamingMessageId = useChatStore((state) => state.streamingMessageId);

  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!streamingMessageId) {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    const tick = () => {
      const buffer = useChatStore.getState().streamingBuffer;

      if (buffer.length > 0) {
        const sliceLength = Math.min(CHARS_PER_TICK, buffer.length);

        useChatStore.setState((state) => {
          const msgId = state.streamingMessageId;
          if (!msgId) return;

          const currentBuffer = state.streamingBuffer;
          if (!currentBuffer.length) return;

          const textToAdd = currentBuffer.slice(0, sliceLength);
          state.streamingBuffer = currentBuffer.slice(sliceLength);

          for (const conv of Object.values(state.conversations)) {
            const msg = conv.messages.find((m) => m.id === msgId);
            if (msg) {
              msg.content += textToAdd;
              break;
            }
          }
        });
      }

      if (useChatStore.getState().streamingMessageId) {
        timeoutRef.current = window.setTimeout(tick, TYPING_TICK_MS);
      } else {
        if (timeoutRef.current !== null) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    };

    timeoutRef.current = window.setTimeout(tick, TYPING_TICK_MS);

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [streamingMessageId]);
}
