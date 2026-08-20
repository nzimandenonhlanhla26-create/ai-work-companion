import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Field, ToolWorkspace } from "@/components/ToolWorkspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectBox } from "./email";
import { useToolRun } from "@/hooks/useToolRun";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workplace AI" },
      {
        name: "description",
        content: "Get a structured research brief with insights, trade-offs and next steps.",
      },
      { property: "og:title", content: "AI Research Assistant — Workplace AI" },
      {
        property: "og:description",
        content: "Executive summary, key insights and recommended next steps on any work topic.",
      },
    ],
  }),
  component: ResearchPage,
});

const DEPTH = ["Quick scan", "Standard brief", "Deep dive"];

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState("Standard brief");
  const [audience, setAudience] = useState("Leadership team");
  const [questions, setQuestions] = useState("");
  const { output, loading, error, generate } = useToolRun("research");

  function submit() {
    generate(
      [
        `Topic: ${topic}`,
        `Depth: ${depth}`,
        `Brief is for: ${audience}`,
        questions ? `Specific questions to answer:\n${questions}` : "No specific questions supplied.",
      ].join("\n"),
    );
  }

  return (
    <AppShell title="AI Research Assistant" breadcrumb="Tools">
      <ToolWorkspace
        heading="Research a topic"
        description="A structured brief you can forward, with uncertainty flagged rather than hidden."
        emptyHint="Executive summary, key insights, trade-offs and next steps will appear here."
        loading={loading}
        error={error}
        output={output}
        form={
          <>
            <Field label="Topic">
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Moving our support team to an AI-assisted triage workflow"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Depth">
                <SelectBox value={depth} onChange={setDepth} options={DEPTH} />
              </Field>
              <Field label="Audience">
                <Input value={audience} onChange={(e) => setAudience(e.target.value)} />
              </Field>
            </div>
            <Field label="Questions to answer">
              <Textarea
                rows={8}
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
                placeholder={"What are the main risks?\nWhat does a 90-day rollout look like?"}
              />
            </Field>
            <Button className="w-full" disabled={loading || topic.trim().length < 5} onClick={submit}>
              {loading ? "Researching…" : "Generate brief"}
            </Button>
          </>
        }
      />
    </AppShell>
  );
}
