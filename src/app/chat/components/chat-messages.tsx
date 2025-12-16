"use client";

import { MessageBubble } from "./message-bubble";
import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/chat-store";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  modelDisplayName?: string;
}

interface ChatMessagesProps {
  messages: Message[];
  showTyping?: boolean;
}

export function ChatMessages({ messages, showTyping }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const streamingMessageId = useChatStore((state) => state.streamingMessageId);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  useEffect(() => {
    if (autoScrollEnabled) {
      scrollToBottom(false);
    }
  }, [messages, autoScrollEnabled]);

  useEffect(() => {
    if (streamingMessageId && autoScrollEnabled) {
      scrollToBottom(true);
    }
  }, [streamingMessageId, autoScrollEnabled]);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollArea;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      const threshold = 200;

      setShowScrollButton(distanceFromBottom > threshold);
      setAutoScrollEnabled(distanceFromBottom <= threshold);
    };

    handleScroll();

    scrollArea.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollArea.removeEventListener("scroll", handleScroll);
  }, []);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        ref={scrollAreaRef}
        className="h-full overflow-y-auto px-6 py-4 scroll-smooth"
        style={{
          willChange: "scroll-position",
          transform: "translateZ(0)",
        }}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              id={message.id}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
              modelDisplayName={message.modelDisplayName}
              isStreaming={message.id === streamingMessageId}
            />
          ))}
          {showTyping && <div className="h-8" />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {showScrollButton && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Button
            onClick={() => {
              scrollToBottom(true);
            }}
            size="sm"
            className="rounded-full shadow-2xl bg-zinc-800/90 hover:bg-zinc-700 text-white border border-zinc-700 backdrop-blur-sm px-4 py-2 h-auto"
          >
            <ArrowDown className="h-4 w-4 mr-2" />
            Scroll to bottom
          </Button>
        </div>
      )}
    </div>
  );
}
