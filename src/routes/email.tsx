import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Field, ToolWorkspace } from "@/components/ToolWorkspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToolRun } from "@/hooks/useToolRun";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      {
        name: "description",
        content: "Generate professional workplace emails tailored to a specific tone and audience.",
      },
      { property: "og:title", content: "Smart Email Generator — Workplace AI" },
      {
        property: "og:description",
        content: "Tone- and audience-aware email drafts in seconds.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Professional", "Friendly", "Concise", "Persuasive", "Apologetic", "Urgent"];
const AUDIENCES = ["External client", "Manager / Executive", "Teammate", "Vendor", "Candidate"];
const LENGTHS = ["Short", "Standard", "Detailed"];

function EmailPage() {
  const [tone, setTone] = useState("Professional");
  const [audience, setAudience] = useState("External client");
  const [length, setLength] = useState("Standard");
  const [recipient, setRecipient] = useState("");
  const [context, setContext] = useState("");
  const { output, loading, error, generate } = useToolRun("email");

  function submit() {
    generate(
      [
        `Tone: ${tone}`,
        `Audience: ${audience}`,
        `Length: ${length}`,
        recipient ? `Recipient name: ${recipient}` : "Recipient name: unknown, use a neutral greeting",
        `Purpose and context:\n${context}`,
      ].join("\n"),
    );
  }

  return (
    <AppShell title="Smart Email Generator" breadcrumb="Tools">
      <ToolWorkspace
        heading="Compose an email"
        description="Describe the situation. The assistant handles structure, tone and the ask."
        emptyHint="Your generated draft will appear here, with a subject line and a clear call to action."
        loading={loading}
        error={error}
        output={output}
        form={
          <>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Tone">
                <SelectBox value={tone} onChange={setTone} options={TONES} />
              </Field>
              <Field label="Audience">
                <SelectBox value={audience} onChange={setAudience} options={AUDIENCES} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Length">
                <SelectBox value={length} onChange={setLength} options={LENGTHS} />
              </Field>
              <Field label="Recipient">
                <Input
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Sarah Patel"
                />
              </Field>
            </div>
            <Field label="Context & intent">
              <Textarea
                rows={7}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Follow up on the proposal sent Tuesday, flag that pricing is valid until the 30th, and ask for a 20-minute call this week."
              />
            </Field>
            <Button className="w-full" disabled={loading || context.trim().length < 5} onClick={submit}>
              {loading ? "Generating…" : "Generate draft"}
            </Button>
          </>
        }
      />
    </AppShell>
  );
}

export function SelectBox({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
