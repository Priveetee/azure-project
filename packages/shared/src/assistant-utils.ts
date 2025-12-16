import { AiFillOpenAI } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { SiAnthropic, SiMeta } from "react-icons/si";
import { RiRobot2Line } from "react-icons/ri";
import { FaXTwitter } from "react-icons/fa6";

export const PROVIDER_ICONS = {
  openai: AiFillOpenAI,
  google: FcGoogle,
  anthropic: SiAnthropic,
  meta: SiMeta,
  mistral: RiRobot2Line,
  xai: FaXTwitter,
};

export const PROVIDER_COLORS: Record<string, string> = {
  openai: "from-black to-zinc-900",
  google: "from-blue-500 to-red-500",
  anthropic: "from-orange-500 to-amber-600",
  meta: "from-blue-600 to-indigo-600",
  mistral: "from-purple-500 to-pink-600",
  xai: "from-gray-900 to-black",
};

export type ProviderKey = keyof typeof PROVIDER_ICONS;

export function getProviderFromModel(modelName?: string): ProviderKey {
  if (!modelName) return "google";
  const lower = modelName.toLowerCase();
  if (lower.includes("gpt") || lower.includes("openai")) return "openai";
  if (lower.includes("gemini") || lower.includes("google")) return "google";
  if (lower.includes("claude") || lower.includes("anthropic"))
    return "anthropic";
  if (lower.includes("llama") || lower.includes("meta")) return "meta";
  if (lower.includes("mistral")) return "mistral";
  if (lower.includes("grok") || lower.includes("xai")) return "xai";
  return "google";
}

export function stripMarkdown(input: string): string {
  let s = input;

  s = s.replace(/```[\s\S]*?```/g, (block) => {
    return block.replace(/```[a-zA-Z0-9-]*\n?/, "").replace(/```$/, "");
  });

  s = s.replace(/`([^`]+)`/g, "$1");
  s = s.replace(/\*\*([^*]+)\*\*/g, "$1");
  s = s.replace(/\*([^*]+)\*/g, "$1");
  s = s.replace(/__([^_]+)__/g, "$1");
  s = s.replace(/_([^_]+)_/g, "$1");
  s = s.replace(/^>+\s?/gm, "");
  s = s.replace(/^\s*[-*+]\s+/gm, "- ");
  s = s.replace(/^\s*\d+\.\s+/gm, (m) => m.replace(/\d+\./, "-"));
  s = s.replace(/\[(.*?)\]\((.*?)\)/g, "$1 ($2)");
  s = s.replace(/!\[(.*?)\]\((.*?)\)/g, "$1 ($2)");
  s = s.replace(/^\s*#{1,6}\s+/gm, "");
  s = s.replace(/\n{3,}/g, "\n\n");
  return s.trim();
}

/**
 * children are current React nodes (tr/td). Instead of manipulating React types, we
 * reconstruct minimal HTML and parse it with DOMParser to produce Markdown.
 */
export function tableNodeToMarkdown(children: unknown): string {
  const html = renderTableChildrenToHtml(children);
  if (!html) return "";

  // DOMParser exists in the browser (client-side component) – not used on the server side.
  if (
    typeof window === "undefined" ||
    typeof window.DOMParser === "undefined"
  ) {
    return "";
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<table>${html}</table>`, "text/html");
  const table = doc.querySelector("table");
  if (!table) return "";

  const rows = Array.from(table.querySelectorAll("tr")).map((tr) =>
    Array.from(tr.querySelectorAll("th,td")).map((cell) =>
      cell.textContent ? cell.textContent.trim().replace(/\s+/g, " ") : "",
    ),
  );

  if (rows.length === 0) return "";

  const header = rows[0];
  const body = rows.slice(1);

  const headerLine = `| ${header.join(" | ")} |`;
  const separatorLine = `| ${header.map(() => "---").join(" | ")} |`;
  const bodyLines = body.map((r) => `| ${r.join(" | ")} |`);

  return [headerLine, separatorLine, ...bodyLines].join("\n");
}

// converts React children into minimal HTML <tr><td>...</td>...</tr>
function renderTableChildrenToHtml(children: unknown): string {
  if (!children) return "";

  const nodes = Array.isArray(children) ? children : [children];
  return nodes
    .map((row: unknown) => {
      if (
        !row ||
        typeof row !== "object" ||
        !("props" in (row as any)) ||
        (row as any).type !== "tr"
      ) {
        return "";
      }

      const rowProps = (row as any).props as { children?: unknown };
      const cells = Array.isArray(rowProps.children)
        ? rowProps.children
        : [rowProps.children];

      const cellsHtml = cells
        .map((cell: unknown) => {
          if (
            !cell ||
            typeof cell !== "object" ||
            !("props" in (cell as any)) ||
            ((cell as any).type !== "td" && (cell as any).type !== "th")
          ) {
            return "";
          }

          const cellProps = (cell as any).props as { children?: unknown };
          const text = extractText(cellProps.children);
          const tag = (cell as any).type === "th" ? "th" : "td";
          return `<${tag}>${escapeHtml(text)}</${tag}>`;
        })
        .join("");

      return `<tr>${cellsHtml}</tr>`;
    })
    .join("");
}

function extractText(node: unknown): string {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractText).join("");
  }
  if (typeof node === "object" && "props" in (node as any)) {
    const props = (node as any).props as { children?: unknown };
    return extractText(props.children);
  }
  return "";
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
