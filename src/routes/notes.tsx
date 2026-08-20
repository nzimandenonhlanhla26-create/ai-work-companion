import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Field, ToolWorkspace } from "@/components/ToolWorkspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectBox } from "@/components/SelectBox";
import { useToolRun } from "@/hooks/useToolRun";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workplace AI" },
      {
        name: "description",
        content:
          "Turn raw meeting transcripts into key points, owners, action items and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Workplace AI" },
      {
        property: "og:description",
        content: "Structured summaries with action items and deadlines from messy notes.",
      },
    ],
  }),
  component: NotesPage,
});

const STYLES = ["Executive", "Action-oriented", "Detailed minutes"];

function NotesPage() {
  const [title, setTitle] = useState("");
  const [style, setStyle] = useState("Action-oriented");
  const [transcript, setTranscript] = useState("");
  const { output, loading, error, generate } = useToolRun("notes");

  function submit() {
    generate(
      [
        `Meeting title: ${title || "Untitled meeting"}`,
        `Summary style: ${style}`,
        `Raw notes / transcript:\n${transcript}`,
      ].join("\n"),
    );
  }

  return (
    <AppShell title="Meeting Notes Summarizer" breadcrumb="Tools">
      <ToolWorkspace
        heading="Summarise a meeting"
        description="Paste a transcript or messy notes and get a summary your team can act on."
        emptyHint="Summary, key points, action items with owners, and deadlines will appear here."
        loading={loading}
        error={error}
        output={output}
        form={
          <>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Meeting title">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Q3 budget sync"
                />
              </Field>
              <Field label="Style">
                <SelectBox value={style} onChange={setStyle} options={STYLES} />
              </Field>
            </div>
            <Field label="Transcript or notes">
              <Textarea
                rows={14}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder={
                  "Sarah: We need the Q3 budget finalised by Friday.\nAlex: Still waiting on EMEA marketing totals.\nSarah: Can you chase them today?"
                }
              />
            </Field>
            <Button
              className="w-full"
              disabled={loading || transcript.trim().length < 20}
              onClick={submit}
            >
              {loading ? "Summarising…" : "Summarise meeting"}
            </Button>
          </>
        }
      />
    </AppShell>
  );
}
