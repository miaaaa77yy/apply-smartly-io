import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { JobCard } from "@/components/JobCard";
import { useJobs } from "@/lib/jobs-store";
import { VERDICT_LABEL, VERDICT_ORDER, type Verdict } from "@/data/jobs";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ApplyWise — Ranked jobs worth applying to" },
      {
        name: "description",
        content:
          "See every job scored against your resume and ranked Apply, Maybe, Low priority, or Skip.",
      },
      { property: "og:title", content: "ApplyWise — Ranked jobs worth applying to" },
      {
        property: "og:description",
        content: "Job postings scored and ranked so early-career job seekers apply where it counts.",
      },
    ],
  }),
  component: Results,
});

const FILTER_CLASS: Record<Verdict, string> = {
  APPLY: "border-verdict-apply/30 bg-verdict-apply/10 text-verdict-apply",
  MAYBE: "border-verdict-maybe/30 bg-verdict-maybe/10 text-verdict-maybe",
  LOW_PRIORITY: "border-verdict-low/30 bg-verdict-low/10 text-verdict-low",
  SKIP: "border-verdict-skip/30 bg-verdict-skip/10 text-verdict-skip",
};

function Results() {
  const { rankedJobs } = useJobs();
  const [filter, setFilter] = useState<Verdict | "ALL">("ALL");

  const shown = filter === "ALL" ? rankedJobs : rankedJobs.filter((j) => j.verdict === filter);

  return (
    <AppShell>
      <section className="pt-10 pb-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          Ranked · {rankedJobs.length} jobs scored
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
          Which jobs are worth your time?
        </h1>
        <p className="mt-3 max-w-[46ch] text-[15px] text-pretty text-muted">
          Every posting scored against your resume. Judge each in two seconds, then open the ones
          that matter.
        </p>
      </section>

      <div className="sticky top-[61px] z-20 -mx-5 mb-4 border-b border-border/50 bg-background/70 px-5 py-3 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold ${
              filter === "ALL"
                ? "bg-foreground text-surface"
                : "border border-border bg-surface/60 text-muted"
            }`}
          >
            All · {rankedJobs.length}
          </button>
          {VERDICT_ORDER.map((verdict) => {
            const count = rankedJobs.filter((j) => j.verdict === verdict).length;
            return (
              <button
                key={verdict}
                type="button"
                onClick={() => setFilter(verdict)}
                className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold ${FILTER_CLASS[verdict]} ${
                  filter === verdict ? "ring-2 ring-foreground/20" : ""
                }`}
              >
                {VERDICT_LABEL[verdict]} · {count}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        {shown.map((job, i) => (
          <JobCard key={job.id} job={job} index={i} />
        ))}
        {shown.length === 0 && (
          <p className="rounded-2xl border border-border bg-surface/70 p-8 text-center text-[14px] text-muted">
            No jobs with this verdict yet.
          </p>
        )}
      </div>

      <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
        Showing {shown.length} of {rankedJobs.length} · sorted by verdict, then score
      </p>
    </AppShell>
  );
}
