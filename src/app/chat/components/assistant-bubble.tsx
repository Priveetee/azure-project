"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { useChatActions } from "@/hooks/use-chat-actions";
import {
  getProviderFromModel,
  PROVIDER_COLORS,
  PROVIDER_ICONS,
  stripMarkdown,
} from "@meowww/shared";
import { AssistantContent } from "./assistant-content";
import { AssistantActions } from "./assistant-actions";

export interface AssistantBubbleProps {
  id: string;
  content: string;
  timestamp?: Date;
  modelDisplayName?: string;
  isStreaming?: boolean;
}

export function AssistantBubble({
  id,
  content,
  timestamp,
  modelDisplayName,
  isStreaming = false,
}: AssistantBubbleProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedLabel, setCopiedLabel] = useState<"md" | "plain" | null>(null);
  const { regenerateMessage } = useChatActions();

  const provider = getProviderFromModel(modelDisplayName);
  const Icon = PROVIDER_ICONS[provider];
  const gradientColors = PROVIDER_COLORS[provider];
  const showTyping = isStreaming && !content;

  const copyWithMarkdown = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopiedLabel("md");
    toast.success("Message copied (with Markdown)");
    setTimeout(() => setCopiedLabel(null), 2000);
  };

  const copyWithoutMarkdown = async () => {
    if (!content) return;
    const plain = stripMarkdown(content);
    await navigator.clipboard.writeText(plain);
    setCopiedLabel("plain");
    toast.success("Message copied (plain text)");
    setTimeout(() => setCopiedLabel(null), 2000);
  };

  const handleCopyCode = async (code: string, language: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`${language} code copied to clipboard`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCopyTable = async (markdown: string) => {
    await navigator.clipboard.writeText(markdown);
    toast.success("Table copied to clipboard");
  };

  const handleRegenerate = async (modelId: string) => {
    await regenerateMessage(id, modelId);
  };

  return (
    <div className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div
        className={cn(
          "w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 shadow-lg",
          gradientColors,
        )}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1 max-w-3xl">
        {showTyping ? (
          <div className="inline-flex flex-col gap-2 px-4 py-3 rounded-2xl bg-zinc-800/70 border border-zinc-700">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-400 animate-bounce" />
            </div>
          </div>
        ) : (
          <>
            <AssistantContent
              content={content}
              onCopyTable={handleCopyTable}
              onCopyCode={handleCopyCode}
              copiedCode={copiedCode}
            />
            <AssistantActions
              timestamp={timestamp}
              modelDisplayName={modelDisplayName}
              copiedLabel={copiedLabel}
              onCopyMarkdown={copyWithMarkdown}
              onCopyPlain={copyWithoutMarkdown}
              onRegenerate={handleRegenerate}
            />
          </>
        )}
      </div>
    </div>
  );
}
