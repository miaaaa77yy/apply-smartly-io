import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { VerdictBadge } from "@/components/JobDetail";
import { formatScore, meta, STATUS_LABEL, type JobStatus } from "@/data/jobs";
import { useJobs } from "@/lib/jobs-store";

export const Route = createFileRoute("/tracker")({
  head: () => ({ meta: [
    { title: "Application tracker — ApplyWise" },
    { name: "description", content: "Track planning, applications, interviews, offers, rejections, and withdrawals." },
    { property: "og:title", content: "Application tracker — ApplyWise" },
    { property: "og:description", content: "See every active and completed job application by status." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Tracker,
});

const columns: JobStatus[] = ["planning", ...meta.handled_statuses];

function Tracker() {
  const { jobs } = useJobs();
  return <AppShell wide>
    <section className="pt-10 pb-6"><p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Tracker</p><h1 className="mt-2 text-4xl font-extrabold tracking-tight text-balance">Where every application stands</h1><p className="mt-3 max-w-[46ch] text-[15px] text-muted">Status changes on the results page appear here instantly.</p></section>
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {columns.map((status) => {
        const items = jobs.filter((job) => job.status === status);
        return <section key={status} className="rounded-2xl border border-border bg-surface/70 p-4 ring-1 ring-foreground/5 backdrop-blur-xl"><div className="flex items-center justify-between"><h2 className="text-[14px] font-bold">{STATUS_LABEL[status]}</h2><span className="font-mono text-[11px] text-muted">{items.length}</span></div><div className="mt-3 space-y-2">{items.length === 0 && <p className="rounded-xl border border-dashed border-border p-4 text-center text-[12px] text-muted">Nothing here yet</p>}{items.map((job) => <article key={job.id} className="rounded-xl border border-border bg-surface/70 p-3"><div className="flex items-center gap-2"><VerdictBadge verdict={job.verdict} /><span className="ml-auto font-mono text-[13px] font-semibold">{formatScore(job.scores.priority)}</span></div><h3 className="mt-2 text-[13px] font-semibold leading-snug">{job.title}</h3><p className="mt-1 text-[11px] text-muted">{job.company} · {job.list_location}</p></article>)}</div></section>;
      })}
    </div>
  </AppShell>;
}