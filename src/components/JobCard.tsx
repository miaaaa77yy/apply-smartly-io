import { useState } from "react";
import { formatPosted, VERDICT_LABEL, type Job, type UserStatus } from "@/data/jobs";
import { useJobs } from "@/lib/jobs-store";

const VERDICT_CLASS: Record<Job["verdict"], string> = {
  APPLY: "bg-verdict-apply/15 text-verdict-apply",
  MAYBE: "bg-verdict-maybe/15 text-verdict-maybe",
  LOW_PRIORITY: "bg-verdict-low/15 text-verdict-low",
  SKIP: "bg-verdict-skip/15 text-verdict-skip",
};

const STATUS_LABEL: Record<UserStatus, string> = {
  new: "",
  saved: "Saved",
  applied: "Applied",
  dismissed: "Dismissed",
};

export function JobCard({ job, index }: { job: Job; index: number }) {
  const [open, setOpen] = useState(false);
  const { setStatus } = useJobs();

  const actionClass = (status: UserStatus) =>
    job.user_status === status
      ? "rounded-lg bg-foreground px-3.5 py-2 text-[13px] font-semibold text-surface transition-transform hover:-translate-y-0.5"
      : "rounded-lg border border-border bg-surface/50 px-3.5 py-2 text-[13px] font-semibold transition-transform hover:-translate-y-0.5";

  return (
    <article
      className="rounded-2xl border border-border bg-surface/70 p-5 ring-1 ring-foreground/5 backdrop-blur-xl transition-transform hover:-translate-y-0.5"
      style={{
        animation: `rise 500ms cubic-bezier(0.32,0.72,0,1) ${Math.min(index, 8) * 60}ms both`,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start gap-4 text-left"
      >
        <div className="flex shrink-0 flex-col items-center">
          <span className="text-4xl font-extrabold leading-none tracking-tighter tabular-nums">
            {job.score}
          </span>
          <span className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted">
            /100
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${VERDICT_CLASS[job.verdict]}`}
            >
              {VERDICT_LABEL[job.verdict]}
            </span>
            <span className="text-[13px] font-semibold text-foreground">{job.company}</span>
            {job.user_status !== "new" && (
              <span className="ml-auto rounded-full border border-border bg-surface/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
                {STATUS_LABEL[job.user_status]}
              </span>
            )}
          </div>
          <h3 className="mt-1.5 text-[17px] font-semibold leading-snug text-pretty">{job.title}</h3>
          <p className="mt-0.5 font-mono text-[12px] text-muted">
            {job.location} · Posted {formatPosted(job.posted_date)}
          </p>
          <p className="mt-2.5 text-[14px] leading-relaxed text-pretty text-muted">
            {job.one_liner}
          </p>
        </div>
      </button>

      {open && (
        <div className="mt-4 grid gap-5 border-t border-border/70 pt-4 md:grid-cols-2">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
              Why it matches
            </p>
            <ul className="mt-2 space-y-1.5 text-[13px] leading-snug text-pretty">
              {job.match_reasons.length === 0 && (
                <li className="text-muted">Not scored yet.</li>
              )}
              {job.match_reasons.map((reason) => (
                <li key={reason} className="flex gap-2">
                  <span className="text-verdict-apply">✓</span>
                  {reason}
                </li>
              ))}
            </ul>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
              Watch out for
            </p>
            <ul className="mt-2 space-y-1.5 text-[13px] leading-snug text-pretty">
              {job.risks.length === 0 && <li className="text-muted">None flagged.</li>}
              {job.risks.map((risk) => (
                <li key={risk} className="flex gap-2">
                  <span className="text-verdict-maybe">!</span>
                  {risk}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
              Hard filters
            </p>
            <ul className="mt-2 space-y-1.5 text-[13px]">
              {job.hard_filters.length === 0 && <li className="text-muted">None recorded.</li>}
              {job.hard_filters.map((filter) => (
                <li key={filter.name} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <span className={filter.pass ? "text-verdict-apply" : "text-verdict-skip"}>
                      {filter.pass ? "✓" : "✕"}
                    </span>
                    {filter.name}
                  </span>
                  <span
                    className={`font-mono text-[11px] font-semibold ${filter.pass ? "text-verdict-apply" : "text-verdict-skip"}`}
                  >
                    {filter.pass ? "PASS" : "FAIL"}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
              Soft signals
            </p>
            <div className="mt-2 space-y-1.5">
              {job.soft_signals.length === 0 && (
                <p className="text-[13px] text-muted">None recorded.</p>
              )}
              {job.soft_signals.map((signal) => (
                <div key={signal.name} className="flex items-center justify-between text-[13px]">
                  <span>{signal.name}</span>
                  <span
                    className={`font-mono text-[11px] font-semibold ${
                      signal.effect.startsWith("+")
                        ? "text-verdict-apply"
                        : signal.effect.startsWith("-")
                          ? "text-verdict-skip"
                          : "text-muted"
                    }`}
                  >
                    {signal.effect}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/70 pt-4">
        <button type="button" onClick={() => setStatus(job.id, "saved")} className={actionClass("saved")}>
          Save
        </button>
        <button
          type="button"
          onClick={() => setStatus(job.id, "applied")}
          className={actionClass("applied")}
        >
          Applied
        </button>
        <button
          type="button"
          onClick={() => setStatus(job.id, "dismissed")}
          className={`${actionClass("dismissed")} ${job.user_status === "dismissed" ? "" : "text-muted"}`}
        >
          Dismiss
        </button>
        {job.job_url ? (
          <a
            href={job.job_url}
            target="_blank"
            rel="noreferrer"
            className="ml-auto font-mono text-[12px] text-muted underline-offset-4 hover:underline"
          >
            Open posting →
          </a>
        ) : (
          <span className="ml-auto font-mono text-[12px] text-muted">
            {open ? "Tap to collapse" : "Tap to expand"}
          </span>
        )}
      </div>
    </article>
  );
}
