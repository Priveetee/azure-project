import { streamChatCompletion } from "@/services/openrouter.service";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  console.log("[STREAM API] Request received");

  try {
    const body = await req.json();
    console.log("[STREAM API] Body:", JSON.stringify(body, null, 2));

    const { model, messages } = body;

    if (!model || !messages) {
      console.error("[STREAM API] Missing model or messages");
      return new Response(
        JSON.stringify({ error: "Missing model or messages" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    console.log("[STREAM API] Starting stream with model:", model);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          console.log("[STREAM API] Stream started");

          for await (const chunk of streamChatCompletion({ model, messages })) {
            console.log("[STREAM API] Chunk received:", chunk);
            const data = `data: ${JSON.stringify(chunk)}\n\n`;
            controller.enqueue(encoder.encode(data));

            if (chunk.done) {
              console.log("[STREAM API] Stream completed");
              controller.close();
              break;
            }
          }
        } catch (error: any) {
          console.error("[STREAM API] Error in stream:", error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: error.message || "Stream failed", done: true })}\n\n`,
            ),
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("[STREAM API] Request error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
