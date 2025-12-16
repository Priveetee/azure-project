export const AVAILABLE_MODELS = [
  {
    id: "openai/gpt-5.1-codex-mini",
    name: "GPT-5.1 Codex Mini",
    provider: "openai",
    icon: "openai",
  },
  {
    id: "google/gemini-2.5-flash-lite",
    name: "Gemini 2.5 Flash Lite",
    provider: "google",
    icon: "google",
  },
  {
    id: "anthropic/claude-haiku-4.5",
    name: "Claude Haiku 4.5",
    provider: "anthropic",
    icon: "anthropic",
  },
  {
    id: "mistralai/mistral-7b-instruct",
    name: "Mistral 7B Instruct",
    provider: "mistral",
    icon: "mistral",
  },
  {
    id: "meta-llama/llama-3.2-3b-instruct:free",
    name: "Llama 3.2 3B",
    provider: "meta",
    icon: "meta",
  },
  {
    id: "x-ai/grok-4-fast",
    name: "Grok 4 Fast",
    provider: "xai",
    icon: "xai",
  },
] as const;

export const DEFAULT_MODEL = "google/gemini-2.5-flash-lite";

export type ProviderType =
  | "openai"
  | "anthropic"
  | "google"
  | "mistral"
  | "meta"
  | "xai";

export function getModelById(id: string) {
  return AVAILABLE_MODELS.find((m) => m.id === id);
}

export function getModelName(id: string) {
  return getModelById(id)?.name || id;
}

export function getModelProvider(id: string): ProviderType {
  const model = getModelById(id);
  return model?.provider || "google";
}
