import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useJobs } from "@/lib/jobs-store";
import { formatPosted, VERDICT_LABEL, type Job, type UserStatus } from "@/data/jobs";

export const Route = createFileRoute("/tracker")({
  head: () => ({
    meta: [
      { title: "Tracker — ApplyWise" },
      {
        name: "description",
        content: "Track which jobs you saved, applied to, and dismissed in one simple board.",
      },
      { property: "og:title", content: "Tracker — ApplyWise" },
      {
        property: "og:description",
        content: "A board of your saved, applied, and dismissed job postings.",
      },
    ],
  }),
  component: Tracker,
});

const COLUMNS: { status: UserStatus; label: string }[] = [
  { status: "saved", label: "Saved" },
  { status: "applied", label: "Applied" },
  { status: "dismissed", label: "Dismissed" },
];

const VERDICT_CLASS: Record<Job["verdict"], string> = {
  APPLY: "bg-verdict-apply/15 text-verdict-apply",
  MAYBE: "bg-verdict-maybe/15 text-verdict-maybe",
  LOW_PRIORITY: "bg-verdict-low/15 text-verdict-low",
  SKIP: "bg-verdict-skip/15 text-verdict-skip",
};

function Tracker() {
  const { rankedJobs } = useJobs();

  return (
    <AppShell>
      <section className="pt-10 pb-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Tracker</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-balance">
          Where every job stands
        </h1>
        <p className="mt-3 max-w-[46ch] text-[15px] text-pretty text-muted">
          Grouped by what you decided on the results page.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map((column) => {
          const items = rankedJobs.filter((job) => job.user_status === column.status);
          return (
            <section
              key={column.status}
              className="rounded-2xl border border-border bg-surface/70 p-4 ring-1 ring-foreground/5 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-bold tracking-tight">{column.label}</h2>
                <span className="font-mono text-[11px] text-muted">{items.length}</span>
              </div>
              <div className="mt-3 space-y-2">
                {items.length === 0 && (
                  <p className="rounded-xl border border-dashed border-border p-4 text-center text-[13px] text-muted">
                    Nothing here yet
                  </p>
                )}
                {items.map((job) => (
                  <article key={job.id} className="rounded-xl border border-border bg-surface/60 p-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${VERDICT_CLASS[job.verdict]}`}
                      >
                        {VERDICT_LABEL[job.verdict]}
                      </span>
                      <span className="ml-auto font-mono text-[13px] font-semibold tabular-nums">
                        {job.score}
                      </span>
                    </div>
                    <h3 className="mt-1.5 text-[14px] font-semibold leading-snug text-pretty">
                      {job.title}
                    </h3>
                    <p className="mt-0.5 text-[13px] text-muted">{job.company}</p>
                    <p className="mt-1 font-mono text-[11px] text-muted">
                      {job.location} · {formatPosted(job.posted_date)}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
