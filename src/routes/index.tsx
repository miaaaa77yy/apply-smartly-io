import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { JobDetail, VerdictBadge } from "@/components/JobDetail";
import { Button } from "@/components/ui/button";
import { GROUP_ORDER, formatScore, meta, STATUS_LABEL, type Job, type JobGroup } from "@/data/jobs";
import { useJobs } from "@/lib/jobs-store";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "ApplyWise — Ranked job opportunities" },
    { name: "description", content: "Scan 49 ranked job opportunities, compare fit scores, and track every application." },
    { property: "og:title", content: "ApplyWise — Ranked job opportunities" },
    { property: "og:description", content: "Scan ranked jobs, compare fit scores, and track every application." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Results,
});

type MainTab = "opportunities" | "applications" | "needs_review" | "passed";
type OpportunityFilter = "to_apply" | "new" | "applied" | "all";

const primaryTabs: Array<{ id: MainTab; label: string }> = [
  { id: "opportunities", label: "Opportunities" },
  { id: "applications", label: "Applications" },
  { id: "needs_review", label: "Needs review" },
  { id: "passed", label: "Passed" },
];

function statusTag(job: Job) {
  return job.status === "not_applied" ? null : STATUS_LABEL[job.status];
}

function Results() {
  const { jobs, setStatus } = useJobs();
  const [tab, setTab] = useState<MainTab>("opportunities");
  const [filter, setFilter] = useState<OpportunityFilter>("to_apply");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const handled = useMemo(() => new Set(meta.handled_statuses), []);

  const counts = {
    opportunities: jobs.filter((job) => job.group === "apply_now" || job.group === "also_worth").length,
    applications: jobs.filter((job) => handled.has(job.status)).length,
    needs_review: jobs.filter((job) => job.group === "needs_review").length,
    passed: jobs.filter((job) => job.group === "passed").length,
  };
  const summary = {
    toApply: jobs.filter((job) => (job.group === "apply_now" || job.group === "also_worth") && !handled.has(job.status)).length,
    newJobs: jobs.filter((job) => job.is_new).length,
    review: counts.needs_review,
    applied: counts.applications,
  };

  const visible = jobs.filter((job) => {
    if (tab === "applications") return handled.has(job.status);
    if (tab === "needs_review") return job.group === "needs_review";
    if (tab === "passed") return job.group === "passed";
    const opportunity = job.group === "apply_now" || job.group === "also_worth";
    if (!opportunity) return false;
    if (filter === "to_apply") return !handled.has(job.status);
    if (filter === "new") return job.is_new;
    if (filter === "applied") return handled.has(job.status);
    return true;
  });
  const selected = jobs.find((job) => job.id === selectedId) ?? null;

  useEffect(() => {
    if (selectedId && !jobs.some((job) => job.id === selectedId)) setSelectedId(null);
  }, [jobs, selectedId]);

  const filterCounts: Record<OpportunityFilter, number> = {
    to_apply: jobs.filter((job) => (job.group === "apply_now" || job.group === "also_worth") && !handled.has(job.status)).length,
    new: jobs.filter((job) => (job.group === "apply_now" || job.group === "also_worth") && job.is_new).length,
    applied: jobs.filter((job) => (job.group === "apply_now" || job.group === "also_worth") && handled.has(job.status)).length,
    all: counts.opportunities,
  };

  return (
    <AppShell wide>
      <section className="pt-8 pb-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Ranked · {jobs.length} jobs scored</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">Which jobs are worth your time?</h1>
        <p className="mt-3 max-w-[52ch] text-[15px] text-pretty text-muted">Every posting scored against your resume. Scan the field, inspect the evidence, then act on the ones that matter.</p>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-y border-border py-3">
          {[{ label: "to apply", value: summary.toApply, tone: "bg-verdict-apply" }, { label: "new", value: summary.newJobs, tone: "bg-primary" }, { label: "needs review", value: summary.review, tone: "bg-verdict-maybe" }, { label: "applied", value: summary.applied, tone: "bg-verdict-low" }].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-[12px]"><span className={`size-1.5 rounded-full ${item.tone}`} /><strong className="font-mono text-[13px] tabular-nums">{item.value}</strong><span className="text-muted">{item.label}</span></div>
          ))}
        </div>
      </section>

      <nav aria-label="Result views" className="sticky top-[60px] z-20 -mx-5 border-y border-border/60 bg-background/85 px-5 backdrop-blur-xl">
        <div className="flex gap-1 overflow-x-auto py-2">
          {primaryTabs.map((item) => <Button key={item.id} type="button" size="sm" variant="ghost" onClick={() => setTab(item.id)} className={`rounded-full px-3.5 ${tab === item.id ? "bg-foreground text-surface hover:bg-foreground hover:text-surface" : "text-muted"}`}>{item.label} <span className="font-mono text-[10px]">{counts[item.id]}</span></Button>)}
        </div>
      </nav>

      <div className={`mt-4 grid items-start gap-4 ${selected ? "lg:grid-cols-[minmax(0,1.45fr)_minmax(390px,0.85fr)]" : ""}`}>
        <div className="min-w-0">
          {tab === "opportunities" && <div className="mb-3 flex flex-wrap gap-1.5">{(["to_apply", "new", "applied", "all"] as OpportunityFilter[]).map((id) => <Button key={id} size="sm" variant="outline" onClick={() => setFilter(id)} className={`rounded-full shadow-none ${filter === id ? "border-foreground bg-foreground text-surface hover:bg-foreground hover:text-surface" : "bg-surface/60 text-muted"}`}>{id === "to_apply" ? "To apply" : id === "new" ? "New" : id === "applied" ? "Applied" : "All"} · {filterCounts[id]}</Button>)}</div>}
          <div className="overflow-hidden rounded-2xl border border-border bg-surface/70 ring-1 ring-foreground/5 backdrop-blur-xl">
            <div className="hidden grid-cols-[minmax(0,1fr)_110px_76px_68px] gap-3 border-b border-border bg-foreground/[0.025] px-4 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted sm:grid"><span>Role & company</span><span>Verdict</span><span className="text-right">Priority</span><span className="text-right">Match</span></div>
            {GROUP_ORDER.map((group) => {
              const groupJobs = visible.filter((job) => job.group === group);
              if (groupJobs.length === 0) return null;
              return <section key={group}><div className="flex items-center justify-between border-b border-border bg-background/55 px-4 py-2"><h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">{meta.groups[group as JobGroup]}</h2><span className="font-mono text-[10px] text-muted">{groupJobs.length}</span></div>{groupJobs.map((job) => {
                const active = job.id === selectedId;
                const extraStatus = statusTag(job);
                return <Button key={job.id} type="button" variant="ghost" onClick={() => setSelectedId(job.id)} aria-pressed={active} className={`grid h-auto w-full justify-normal gap-3 whitespace-normal rounded-none border-b border-border/70 px-4 py-3 text-left font-normal shadow-none last:border-b-0 sm:grid-cols-[minmax(0,1fr)_110px_76px_68px] sm:items-center ${active ? "bg-foreground/[0.055] shadow-[inset_3px_0_0_var(--foreground)]" : "hover:bg-foreground/[0.03]"}`}><div className="min-w-0"><div className="flex items-center gap-2"><h3 className="truncate text-[14px] font-semibold">{job.title}</h3>{job.starred && <span className="text-verdict-maybe" aria-label="Starred">★</span>}</div><div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] text-muted"><span>{job.company} · {job.list_location} · {job.role_family}</span>{extraStatus && <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[9px]">{extraStatus}</span>}{job.tags.map((tag) => <span key={tag} className="rounded border border-border px-1.5 py-0.5 font-mono text-[9px]">{tag}</span>)}</div></div><div><VerdictBadge verdict={job.verdict} /></div><div className="flex items-baseline justify-between sm:block sm:text-right"><span className="font-mono text-[9px] uppercase text-muted sm:hidden">Priority</span><span className="font-mono text-[14px] font-semibold tabular-nums">{formatScore(job.scores.priority)}</span></div><div className="flex items-baseline justify-between sm:block sm:text-right"><span className="font-mono text-[9px] uppercase text-muted sm:hidden">Match</span><span className="font-mono text-[14px] tabular-nums text-muted">{formatScore(job.scores.match)}</span></div></Button>;
              })}</section>;
            })}
            {visible.length === 0 && <p className="p-10 text-center text-[13px] text-muted">No jobs in this view.</p>}
          </div>
        </div>
        {selected && <div className="order-first lg:order-none lg:sticky lg:top-[116px] lg:max-h-[calc(100vh-132px)] lg:overflow-y-auto"><JobDetail job={selected} onClose={() => setSelectedId(null)} onStatusChange={(status) => setStatus(selected.id, status)} /></div>}
      </div>
    </AppShell>
  );
}