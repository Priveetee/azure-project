"use client";

interface UserBubbleProps {
  content: string;
  timestamp?: Date;
}

export function UserBubble({ content, timestamp }: UserBubbleProps) {
  return (
    <div className="flex items-start gap-4 justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex-1 max-w-3xl flex flex-col items-end">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white px-5 py-3 rounded-2xl shadow-lg border border-blue-500/20">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        </div>
        {timestamp && (
          <div className="text-xs text-zinc-500 mt-2">
            {timestamp.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}
