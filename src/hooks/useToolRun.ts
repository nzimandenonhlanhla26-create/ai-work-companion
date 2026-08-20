import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateWithTool } from "@/lib/assistant.functions";
import type { ToolId } from "@/lib/prompts";

export function useToolRun(tool: ToolId) {
  const run = useServerFn(generateWithTool);
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate(prompt: string) {
    setLoading(true);
    setError(null);
    setOutput(null);
    try {
      const result = await run({ data: { tool, prompt } });
      setOutput(result.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return { output, loading, error, generate };
}
