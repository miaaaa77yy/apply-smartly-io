import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useJobs } from "@/lib/jobs-store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/add-job")({
  head: () => ({
    meta: [
      { title: "Add a job — ApplyWise" },
      {
        name: "description",
        content: "Paste a job posting and add it to your ApplyWise triage list.",
      },
      { property: "og:title", content: "Add a job — ApplyWise" },
      {
        property: "og:description",
        content: "Drop in a company, title, location, and description to queue a posting up.",
      },
    ],
  }),
  component: AddJob,
});

const fieldClass =
  "mt-2 w-full rounded-xl border border-border bg-surface/70 px-3.5 py-2.5 text-[14px] outline-none backdrop-blur-xl placeholder:text-muted/70 focus:ring-2 focus:ring-foreground/15";
const labelClass = "font-mono text-[10px] uppercase tracking-[0.15em] text-muted";

function AddJob() {
  const { addJob } = useJobs();
  const [form, setForm] = useState({ company: "", title: "", location: "", description: "" });
  const [submitted, setSubmitted] = useState(false);

  const update = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <AppShell>
      <section className="pt-10 pb-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Add a job</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-balance">
          Found a posting? Drop it in.
        </h1>
        <p className="mt-3 max-w-[46ch] text-[15px] text-pretty text-muted">
          Paste the details and it joins your list. Scoring comes later.
        </p>
      </section>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addJob(form);
          setSubmitted(true);
        }}
        className="rounded-2xl border border-border bg-surface/70 p-5 ring-1 ring-foreground/5 backdrop-blur-xl"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className={labelClass}>Company</span>
            <input
              required
              value={form.company}
              onChange={update("company")}
              className={fieldClass}
              placeholder="Northwind Health"
            />
          </label>
          <label className="block">
            <span className={labelClass}>Title</span>
            <input
              required
              value={form.title}
              onChange={update("title")}
              className={fieldClass}
              placeholder="Business Analyst, Revenue Operations"
            />
          </label>
        </div>

        <label className="mt-5 block">
          <span className={labelClass}>Location</span>
          <input
            required
            value={form.location}
            onChange={update("location")}
            className={fieldClass}
            placeholder="Los Angeles, CA (Hybrid)"
          />
        </label>

        <label className="mt-5 block">
          <span className={labelClass}>Job description</span>
          <textarea
            rows={10}
            value={form.description}
            onChange={update("description")}
            placeholder="Paste the full job description here…"
            className={`${fieldClass} resize-y font-mono text-[13px] leading-relaxed`}
          />
        </label>

        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border/70 pt-4">
          <Button type="submit" size="sm">
            Add to list
          </Button>
          <span className={`font-mono text-[12px] ${submitted ? "text-verdict-apply" : "text-muted"}`}>
            {submitted ? "Saved · Scoring coming soon" : "Scoring coming soon"}
          </span>
        </div>
      </form>
    </AppShell>
  );
}
