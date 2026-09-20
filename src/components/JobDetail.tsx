import { ExternalLink, Linkedin, X } from "lucide-react";
import { formatScore, meta, STATUS_LABEL, type Job, type JobStatus } from "@/data/jobs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const scoreColor: Record<keyof Job["scores"], string> = {
  priority: "bg-verdict-apply",
  match: "bg-primary",
  opportunity: "bg-verdict-maybe",
};

function linkedinSearch(company: string, qualifier = "") {
  const query = [company, qualifier].filter(Boolean).join(" ");
  return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(query)}`;
}

export function VerdictBadge({ verdict }: { verdict: string }) {
  const tone = verdict === "Apply"
    ? "bg-verdict-apply/15 text-verdict-apply"
    : verdict === "Also worth" || verdict === "Review"
      ? "bg-verdict-maybe/15 text-verdict-maybe"
      : verdict === "Blocked" || verdict === "Passed"
        ? "bg-verdict-skip/15 text-verdict-skip"
        : "bg-verdict-low/15 text-verdict-low";
  return <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${tone}`}>{verdict}</span>;
}

export function JobDetail({ job, onStatusChange, onClose }: {
  job: Job;
  onStatusChange: (status: JobStatus) => void;
  onClose: () => void;
}) {
  return (
    <aside aria-label={`Details for ${job.title}`} className="overflow-hidden rounded-2xl border border-border bg-surface/90 ring-1 ring-foreground/5 backdrop-blur-xl">
      <div className="border-b border-border p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{job.company}</p>
            <h2 className="mt-1.5 text-xl font-bold leading-tight text-pretty">{job.title}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close job details" title="Close details" className="-mr-2 -mt-2 shrink-0">
            <X />
          </Button>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">{job.location} · {job.role_family} · {job.last_seen}</p>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <VerdictBadge verdict={job.verdict} />
          {job.salary && <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px]">{job.salary}</span>}
          {job.tags.map((tag) => <span key={tag} className="rounded-full border border-border bg-background/50 px-2 py-0.5 font-mono text-[10px] text-muted">{tag}</span>)}
        </div>
      </div>

      <div className="grid grid-cols-3 border-b border-border">
        {(Object.keys(job.scores) as Array<keyof Job["scores"]>).map((key) => {
          const score = job.scores[key];
          return (
            <div key={key} className="border-r border-border p-4 last:border-r-0">
              <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">{key}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{score === null ? "Not scored" : formatScore(score)}</p>
              <progress aria-label={`${key} score`} className={`score-progress mt-2 ${scoreColor[key]}`} max="10" value={score ?? 0} />
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border p-4">
        {job.apply_url ? (
          <Button asChild size="sm">
            <a href={job.apply_url} target="_blank" rel="noreferrer">Apply <ExternalLink /></a>
          </Button>
        ) : <Button size="sm" disabled>Posting unavailable</Button>}
        <Select value={job.status} onValueChange={(value) => onStatusChange(value as JobStatus)}>
          <SelectTrigger aria-label="Application status" className="ml-auto w-[155px] bg-surface text-[12px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {meta.status_options.map((status) => <SelectItem key={status} value={status}>{STATUS_LABEL[status]}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="divide-y divide-border">
        {job.why_passed ? (
          <section className="bg-verdict-skip/5 p-5">
            <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-verdict-skip">Why this was passed</h3>
            <p className="mt-2 text-[13px] leading-relaxed">{job.why_passed}</p>
          </section>
        ) : (
          <>
            {job.why_fits && <section className="bg-verdict-apply/5 p-5"><h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-verdict-apply">Why this fits</h3><p className="mt-2 text-[13px] leading-relaxed">{job.why_fits}</p></section>}
            {job.main_risk && <section className="bg-verdict-maybe/5 p-5"><h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-verdict-maybe">Main risk</h3><p className="mt-2 text-[13px] leading-relaxed">{job.main_risk}</p></section>}
          </>
        )}

        <section className="p-5">
          <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Networking</h3>
          <div className="mt-2 grid gap-2">
            {[{ label: "USC Marshall alumni", qualifier: "USC Marshall" }, { label: "Waterloo alumni", qualifier: "University of Waterloo" }, { label: `${job.company} people`, qualifier: "" }].map((link) => (
              <a key={link.label} href={linkedinSearch(job.company, link.qualifier)} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-[12px] font-semibold transition-colors hover:bg-foreground/5">
                <span className="flex items-center gap-2"><Linkedin className="size-3.5" />{link.label}</span><ExternalLink className="size-3 text-muted" />
              </a>
            ))}
          </div>
        </section>

        <details className="group p-5">
          <summary className="cursor-pointer list-none font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Evidence & decision details <span className="ml-1 group-open:hidden">+</span><span className="ml-1 hidden group-open:inline">−</span></summary>
          <div className="mt-4 space-y-4">
            {job.flags.length > 0 && <div className="flex flex-wrap gap-1.5">{job.flags.map((flag) => <span key={flag} className="rounded-md bg-verdict-maybe/10 px-2 py-1 text-[10px] font-medium text-verdict-maybe">{flag}</span>)}</div>}
            {job.evidence.map((item) => <div key={`${item.label}:${item.quote}`}><h4 className="text-[12px] font-semibold">{item.label}</h4><blockquote className="mt-1 border-l-2 border-border pl-3 text-[12px] leading-relaxed text-muted">“{item.quote}”</blockquote></div>)}
          </div>
        </details>
      </div>
    </aside>
  );
}