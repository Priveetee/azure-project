"use client";

import { Copy, RotateCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AVAILABLE_MODELS } from "@meowww/shared";
import { PROVIDER_ICONS } from "@meowww/shared";

interface AssistantActionsProps {
  timestamp?: Date;
  modelDisplayName?: string;
  copiedLabel: "md" | "plain" | null;
  onCopyMarkdown: () => void;
  onCopyPlain: () => void;
  onRegenerate: (modelId: string) => void;
}

export function AssistantActions({
  timestamp,
  modelDisplayName,
  copiedLabel,
  onCopyMarkdown,
  onCopyPlain,
  onRegenerate,
}: AssistantActionsProps) {
  return (
    <div className="mt-3 flex items-center justify-between gap-2">
      {timestamp && (
        <div className="text-xs text-zinc-500 flex items-center gap-2">
          <span>{timestamp.toLocaleTimeString()}</span>
          {modelDisplayName && (
            <>
              <span>•</span>
              <span className="text-zinc-600">{modelDisplayName}</span>
            </>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-800/80 hover:bg-zinc-700 text-xs border border-zinc-700/60">
              <Copy className="h-3 w-3" />
              {copiedLabel === "md"
                ? "Copied (MD)"
                : copiedLabel === "plain"
                  ? "Copied (Plain)"
                  : "Copy"}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[220px] bg-zinc-900 border-zinc-800 text-zinc-100"
          >
            <DropdownMenuItem
              onClick={onCopyMarkdown}
              className="px-3 py-2 text-sm"
            >
              Copy with Markdown
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onCopyPlain}
              className="px-3 py-2 text-sm"
            >
              Copy without Markdown
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-800/80 hover:bg-zinc-700 text-xs border border-zinc-700/60">
              <RotateCcw className="h-3 w-3" />
              Regenerate
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[280px] bg-zinc-900/95 backdrop-blur-xl border-zinc-800 rounded-2xl p-2 shadow-2xl text-zinc-100"
          >
            {AVAILABLE_MODELS.map((model) => {
              const Icon = PROVIDER_ICONS[model.provider];
              return (
                <DropdownMenuItem
                  key={model.id}
                  onClick={() => onRegenerate(model.id)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer focus:bg-zinc-800 data-[highlighted]:bg-zinc-800 data-[highlighted]:text-white transition-colors"
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <div className="flex flex-col items-start flex-1">
                    <span className="font-medium text-white">{model.name}</span>
                    <span className="text-xs text-zinc-500 capitalize">
                      {model.provider}
                    </span>
                  </div>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
