"use client";

import { useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Check } from "lucide-react";
import { AiFillOpenAI } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { SiAnthropic, SiMeta } from "react-icons/si";
import { RiRobot2Line } from "react-icons/ri";
import { FaXTwitter } from "react-icons/fa6";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AVAILABLE_MODELS } from "@meowww/shared";

const PROVIDER_ICONS = {
  openai: AiFillOpenAI,
  google: FcGoogle,
  anthropic: SiAnthropic,
  meta: SiMeta,
  mistral: RiRobot2Line,
  xai: FaXTwitter,
};

interface ChatInputProps {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: (message: string, modelId: string) => void;
  disabled?: boolean;
  selectedProvider: string;
  onProviderChange: (modelId: string) => void;
  onStop?: () => void;
}

export function ChatInput({
  value,
  onValueChange,
  onSubmit,
  disabled = false,
  selectedProvider,
  onProviderChange,
  onStop,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [value]);

  const handleSubmit = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed, selectedProvider);
    onValueChange("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled) {
        handleSubmit(e);
      }
    }
  };

  const selectedModel = AVAILABLE_MODELS.find((m) => m.id === selectedProvider);
  const SelectedIcon = selectedModel
    ? PROVIDER_ICONS[selectedModel.provider]
    : RiRobot2Line;

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={"Type your message here..."}
          rows={1}
          className="min-h-[52px] max-h-[200px] resize-none border-0 bg-transparent text-white placeholder:text-zinc-500 focus-visible:ring-0 px-6 py-4 text-base leading-6"
        />

        <div className="flex items-center justify-between px-4 pb-3 pt-1">
          <DropdownMenu>
            <DropdownMenuTrigger
              disabled={disabled}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SelectedIcon className="h-5 w-5" />
              <span className="font-medium">
                {selectedModel?.name || "Select Model"}
              </span>
              <svg
                className="h-4 w-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-[280px] bg-zinc-900/95 backdrop-blur-xl border-zinc-800 rounded-2xl p-2 shadow-2xl"
            >
              {AVAILABLE_MODELS.map((model) => {
                const Icon = PROVIDER_ICONS[model.provider];
                const isSelected = model.id === selectedProvider;
                return (
                  <DropdownMenuItem
                    key={model.id}
                    onClick={() => onProviderChange(model.id)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer focus:bg-zinc-800 focus:text-white data-[highlighted]:bg-zinc-800 data-[highlighted]:text-white transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {isSelected ? (
                        <Check className="h-5 w-5 text-white flex-shrink-0" />
                      ) : (
                        <div className="h-5 w-5 flex-shrink-0" />
                      )}
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <div className="flex flex-col items-start">
                        <span className="font-medium text-white">
                          {model.name}
                        </span>
                        <span className="text-xs text-zinc-500 capitalize">
                          {model.provider}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-2">
            {disabled && onStop && (
              <Button
                type="button"
                size="icon"
                onClick={onStop}
                className="h-10 w-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white transition-all flex-shrink-0"
              >
                ■
              </Button>
            )}
            <Button
              type="submit"
              size="icon"
              onClick={handleSubmit}
              disabled={!canSend}
              className="h-10 w-10 rounded-xl bg-white hover:bg-zinc-200 text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
