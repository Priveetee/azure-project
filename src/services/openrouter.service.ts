import { OpenRouter } from "@openrouter/sdk";
import type { ChatGenerationParams } from "@openrouter/sdk/models/chatgenerationparams";

const client = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY ?? "",
});

export interface StreamChunk {
  content: string;
  done: boolean;
  model?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export async function* streamChatCompletion(
  params: ChatGenerationParams,
): AsyncGenerator<StreamChunk> {
  console.log("[OPENROUTER] Starting stream with params:", params);

  const response = await client.chat.send({
    ...params,
    stream: true,
  });

  console.log("[OPENROUTER] Response received, starting iteration");

  try {
    for await (const chunk of response as any) {
      console.log("[OPENROUTER] Raw chunk:", chunk);

      const content = chunk.choices?.[0]?.delta?.content || "";
      const usage = chunk.usage;
      const model = chunk.model;
      const finishReason = chunk.choices?.[0]?.finish_reason;

      if (content) {
        console.log("[OPENROUTER] Yielding content:", content);
        yield {
          content,
          done: false,
          model,
        };
      }

      if (usage) {
        console.log("[OPENROUTER] Yielding usage:", usage);
        yield {
          content: "",
          done: false,
          model,
          usage: {
            promptTokens: usage.prompt_tokens,
            completionTokens: usage.completion_tokens,
            totalTokens: usage.total_tokens,
          },
        };
      }

      if (finishReason === "stop") {
        console.log("[OPENROUTER] Stream finished");
        yield { content: "", done: true };
        return;
      }
    }
  } catch (error) {
    console.error("[OPENROUTER] Streaming error:", error);
    throw error;
  }

  console.log("[OPENROUTER] Stream completed normally");
  yield { content: "", done: true };
}

export async function sendChatMessage(params: ChatGenerationParams) {
  return client.chat.send({
    ...params,
    stream: false,
  });
}

export async function listModels() {
  return client.models.list({});
}
