import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Field, ToolWorkspace } from "@/components/ToolWorkspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectBox } from "./email";
import { useToolRun } from "@/hooks/useToolRun";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workplace AI" },
      {
        name: "description",
        content: "Prioritise your task list and get a realistic schedule that protects deep work.",
      },
      { property: "og:title", content: "AI Task Planner — Workplace AI" },
      {
        property: "og:description",
        content: "Priority order, a time-blocked schedule, and what to defer or delegate.",
      },
    ],
  }),
  component: PlannerPage,
});

const HORIZONS = ["Today", "Tomorrow", "This week"];
const ENERGY = ["Morning person", "Afternoon peak", "Evening focus"];

function PlannerPage() {
  const [horizon, setHorizon] = useState("Today");
  const [energy, setEnergy] = useState("Morning person");
  const [hours, setHours] = useState("09:00–17:00");
  const [tasks, setTasks] = useState("");
  const { output, loading, error, generate } = useToolRun("planner");

  function submit() {
    generate(
      [
        `Planning horizon: ${horizon}`,
        `Working hours: ${hours}`,
        `Energy pattern: ${energy}`,
        `Tasks, one per line (with deadlines where known):\n${tasks}`,
      ].join("\n"),
    );
  }

  return (
    <AppShell title="AI Task Planner" breadcrumb="Tools">
      <ToolWorkspace
        heading="Plan your work"
        description="Dump the task list. Get priorities, a schedule, and what to let go of."
        emptyHint="A prioritised list, a time-blocked schedule table, and deferral suggestions appear here."
        loading={loading}
        error={error}
        output={output}
        form={
          <>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Horizon">
                <SelectBox value={horizon} onChange={setHorizon} options={HORIZONS} />
              </Field>
              <Field label="Working hours">
                <Input value={hours} onChange={(e) => setHours(e.target.value)} />
              </Field>
            </div>
            <Field label="Energy pattern">
              <SelectBox value={energy} onChange={setEnergy} options={ENERGY} />
            </Field>
            <Field label="Tasks">
              <Textarea
                rows={12}
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                placeholder={
                  "Finish quarterly report — due Friday\nReview 3 pull requests\nPrep sprint planning deck\nCall supplier about invoice"
                }
              />
            </Field>
            <Button className="w-full" disabled={loading || tasks.trim().length < 10} onClick={submit}>
              {loading ? "Planning…" : "Build my plan"}
            </Button>
          </>
        }
      />
    </AppShell>
  );
}
