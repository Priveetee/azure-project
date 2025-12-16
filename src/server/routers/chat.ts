import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const chatRouter = router({
  sendMessage: publicProcedure
    .input(
      z.object({
        conversationId: z.string(),
        message: z.string(),
        model: z.string(),
        messages: z
          .array(
            z.object({
              role: z.enum(["user", "assistant", "system"]),
              content: z.string(),
            }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return {
        conversationId: input.conversationId,
        model: input.model,
      };
    }),
});
