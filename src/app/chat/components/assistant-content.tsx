"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check as CheckIcon } from "lucide-react";
import type { ReactNode } from "react";
import { tableNodeToMarkdown } from "@meowww/shared";

interface AssistantContentProps {
  content: string;
  onCopyTable: (markdown: string) => void;
  onCopyCode: (code: string, language: string) => void;
  copiedCode: string | null;
}

export function AssistantContent({
  content,
  onCopyTable,
  onCopyCode,
  copiedCode,
}: AssistantContentProps) {
  return (
    <div className="prose prose-invert prose-sm md:prose-base max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const codeString = String(children).replace(/\n$/, "");

            if (!inline && language) {
              return (
                <div className="relative group my-4 rounded-lg overflow-hidden border border-zinc-700/50 shadow-xl">
                  <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
                    <button
                      onClick={() => onCopyCode(codeString, language)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-zinc-700/90 hover:bg-zinc-600 text-zinc-200 rounded-md transition-colors backdrop-blur-sm"
                    >
                      {copiedCode === codeString ? (
                        <>
                          <CheckIcon className="h-3.5 w-3.5" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div className="text-xs font-medium text-zinc-400 bg-zinc-800/80 px-4 py-2 border-b border-zinc-700/50 backdrop-blur-sm">
                    {language}
                  </div>
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={language}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      background: "rgba(9, 9, 11, 0.8)",
                      fontSize: "0.875rem",
                      lineHeight: "1.5",
                      padding: "1rem",
                    }}
                    {...props}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              );
            }

            return (
              <code
                className="bg-zinc-800/80 text-cyan-300 px-1.5 py-0.5 rounded text-sm font-mono border border-zinc-700/50"
                {...props}
              >
                {children}
              </code>
            );
          },
          table({ children, ...props }) {
            const markdownTable = tableNodeToMarkdown(
              children as unknown as ReactNode,
            );

            return (
              <div className="relative group my-6 rounded-lg overflow-hidden border border-zinc-700/50 shadow-xl">
                <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
                  <button
                    onClick={() => markdownTable && onCopyTable(markdownTable)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-zinc-700/90 hover:bg-zinc-600 text-zinc-200 rounded-md transition-colors backdrop-blur-sm"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse" {...props}>
                    {children}
                  </table>
                </div>
              </div>
            );
          },
          thead({ children, ...props }) {
            return (
              <thead className="bg-zinc-800/80 backdrop-blur-sm" {...props}>
                {children}
              </thead>
            );
          },
          th({ children, ...props }) {
            return (
              <th
                className="border border-zinc-700/50 px-4 py-3 text-left font-semibold text-zinc-200 bg-zinc-800/50"
                {...props}
              >
                {children}
              </th>
            );
          },
          tbody({ children, ...props }) {
            return (
              <tbody className="bg-zinc-900/50" {...props}>
                {children}
              </tbody>
            );
          },
          tr({ children, ...props }) {
            return (
              <tr className="hover:bg-zinc-800/30 transition-colors" {...props}>
                {children}
              </tr>
            );
          },
          td({ children, ...props }) {
            return (
              <td
                className="border border-zinc-700/50 px-4 py-3 text-zinc-300"
                {...props}
              >
                {children}
              </td>
            );
          },
          p({ children, ...props }) {
            return (
              <p className="text-zinc-200 mb-4 leading-relaxed" {...props}>
                {children}
              </p>
            );
          },
          ul({ children, ...props }) {
            return (
              <ul
                className="list-disc list-outside ml-5 text-zinc-200 mb-4 space-y-2"
                {...props}
              >
                {children}
              </ul>
            );
          },
          ol({ children, ...props }) {
            return (
              <ol
                className="list-decimal list-outside ml-5 text-zinc-200 mb-4 space-y-2"
                {...props}
              >
                {children}
              </ol>
            );
          },
          li({ children, ...props }) {
            return (
              <li className="text-zinc-300 leading-relaxed" {...props}>
                {children}
              </li>
            );
          },
          h1({ children, ...props }) {
            return (
              <h1
                className="text-2xl md:text-3xl font-bold text-white mb-4 mt-6"
                {...props}
              >
                {children}
              </h1>
            );
          },
          h2({ children, ...props }) {
            return (
              <h2
                className="text-xl md:text-2xl font-bold text-white mb-3 mt-5"
                {...props}
              >
                {children}
              </h2>
            );
          },
          h3({ children, ...props }) {
            return (
              <h3
                className="text-lg md:text-xl font-bold text-white mb-3 mt-4"
                {...props}
              >
                {children}
              </h3>
            );
          },
          strong({ children, ...props }) {
            return (
              <strong className="font-bold text-white" {...props}>
                {children}
              </strong>
            );
          },
          em({ children, ...props }) {
            return (
              <em className="italic text-zinc-300" {...props}>
                {children}
              </em>
            );
          },
          blockquote({ children, ...props }) {
            return (
              <blockquote
                className="border-l-4 border-zinc-600 pl-4 py-2 my-4 italic text-zinc-400 bg-zinc-800/30 rounded-r"
                {...props}
              >
                {children}
              </blockquote>
            );
          },
          hr({ ...props }) {
            return <hr className="border-zinc-700 my-6" {...props} />;
          },
        }}
      >
        {content || " "}
      </ReactMarkdown>
    </div>
  );
}
