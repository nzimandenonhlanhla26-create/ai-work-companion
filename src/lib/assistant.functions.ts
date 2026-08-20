import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { streamText } from "ai";
import { getAssistantModel } from "./ai-gateway.server";
import { TOOL_SYSTEM, CHAT_SYSTEM, type ToolId } from "./prompts";

const ToolInput = z.object({
  tool: z.enum(["email", "notes", "planner", "research"]),
  prompt: z.string().min(1).max(20000),
});

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(20000),
      }),
    )
    .min(1)
    .max(40),
});

function toGatewayError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("402")) {
    return new Error("AI credits are exhausted. Add credits in Lovable to keep generating.");
  }
  if (message.includes("429")) {
    return new Error("Too many requests right now. Wait a moment and try again.");
  }
  return new Error(message || "The assistant could not complete this request.");
}

export const generateWithTool = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ToolInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const result = streamText({
        model: getAssistantModel(),
        system: TOOL_SYSTEM[data.tool as ToolId],
        prompt: data.prompt,
      });
      return { text: await result.text };
    } catch (error) {
      throw toGatewayError(error);
    }
  });

export const chatWithAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const result = streamText({
        model: getAssistantModel(),
        system: CHAT_SYSTEM,
        messages: data.messages,
      });
      return { text: await result.text };
    } catch (error) {
      throw toGatewayError(error);
    }
  });
