import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, NotebookPen, ListChecks, Telescope, MessagesSquare, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Disclaimer } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Workplace AI — AI Productivity Assistant for Professionals" },
      {
        name: "description",
        content:
          "Draft emails, summarise meetings, plan tasks and research topics with a professional AI assistant built for daily work.",
      },
      { property: "og:title", content: "Workplace AI — AI Productivity Assistant" },
      {
        property: "og:description",
        content: "Automate daily work tasks: emails, meeting notes, task planning and research.",
      },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email",
    label: "Smart Email Generator",
    icon: Mail,
    copy: "Tone- and audience-aware drafts with a clear call to action.",
  },
  {
    to: "/notes",
    label: "Meeting Notes Summarizer",
    icon: NotebookPen,
    copy: "Key points, owners, action items and deadlines from raw notes.",
  },
  {
    to: "/planner",
    label: "AI Task Planner",
    icon: ListChecks,
    copy: "Prioritised task order and a realistic schedule for your day.",
  },
  {
    to: "/research",
    label: "AI Research Assistant",
    icon: Telescope,
    copy: "Structured briefs with insights, trade-offs and next steps.",
  },
  {
    to: "/chat",
    label: "Assistant Chat",
    icon: MessagesSquare,
    copy: "Open-ended help across writing, planning and problem-solving.",
  },
] as const;

function Dashboard() {
  return (
    <AppShell title="Dashboard">
      <div className="px-6 py-10 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-semibold tracking-tight">Good day — what are we automating?</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Five focused assistants for the work that eats your calendar. Each one uses a structured
            prompt so output arrives in a consistent, professional format.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map(({ to, label, icon: Icon, copy }) => (
              <Link
                key={to}
                to={to}
                className="group rounded-xl border border-border bg-surface p-5 transition-colors hover:border-brand/40"
              >
                <span className="grid size-9 place-items-center rounded-lg bg-brand-soft text-accent-foreground">
                  <Icon className="size-4" strokeWidth={1.75} />
                </span>
                <h2 className="mt-4 text-sm font-semibold">{label}</h2>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{copy}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-accent-foreground">
                  Open
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-8 max-w-xl">
            <Disclaimer />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
