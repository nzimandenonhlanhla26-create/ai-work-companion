import { useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Check, AlertTriangle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DISCLAIMER } from "@/lib/prompts";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

export function Disclaimer() {
  return (
    <p className="flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-[11px] text-muted-foreground">
      <AlertTriangle className="size-3.5 shrink-0" strokeWidth={1.75} />
      {DISCLAIMER}.
    </p>
  );
}

export function ToolWorkspace({
  heading,
  description,
  form,
  output,
  loading,
  error,
  emptyHint,
}: {
  heading: string;
  description: string;
  form: ReactNode;
  output: string | null;
  loading: boolean;
  error: string | null;
  emptyHint: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-px bg-border lg:grid-cols-[minmax(0,26rem)_1fr]">
      <section className="bg-background px-6 py-8 sm:px-8">
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-semibold tracking-tight">{heading}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          <div className="mt-8 space-y-5">{form}</div>
        </div>
      </section>

      <section className="min-h-[60vh] bg-surface px-6 py-8 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Output
            </span>
            {output && <CopyButton value={output} />}
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {loading && <OutputSkeleton />}

          {!loading && !output && !error && (
            <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
              <Sparkles className="mx-auto size-5 text-muted-foreground" strokeWidth={1.5} />
              <p className="mx-auto mt-3 max-w-xs text-sm text-muted-foreground">{emptyHint}</p>
            </div>
          )}

          {!loading && output && (
            <div className="space-y-4">
              <article className="rounded-xl border border-border bg-background p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                <Markdown text={output} />
              </article>
              <Disclaimer />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export function Markdown({ text }: { text: string }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-foreground [&_a]:underline [&_h2]:mt-6 [&_h2]:text-[13px] [&_h2]:font-semibold [&_h2]:uppercase [&_h2]:tracking-[0.12em] [&_h2]:text-muted-foreground [&_h3]:font-semibold [&_li]:my-1 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_strong]:font-semibold [&_table]:w-full [&_table]:text-left [&_td]:border-t [&_td]:border-border [&_td]:py-2 [&_td]:pr-4 [&_th]:pb-2 [&_th]:pr-4 [&_th]:text-[11px] [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-muted-foreground [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
}

function OutputSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border border-border bg-background p-6">
      <Skeleton className="h-4 w-2/5" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-11/12" />
      <Skeleton className="h-3 w-4/5" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-10/12" />
      <Skeleton className="h-3 w-3/5" />
      <p className="pt-2 text-[11px] text-muted-foreground">Generating a professional draft…</p>
    </div>
  );
}

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="outline"
      size="sm"
      className="h-8 gap-1.5 text-xs"
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}
