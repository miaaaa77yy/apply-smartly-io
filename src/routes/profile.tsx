import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — ApplyWise" },
      {
        name: "description",
        content: "Paste your resume and set target roles, locations, and job level for scoring.",
      },
      { property: "og:title", content: "Your profile — ApplyWise" },
      {
        property: "og:description",
        content: "Set the resume and targets ApplyWise scores every job posting against.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Profile,
});

const LEVELS = ["Internship", "New grad", "Entry level", "1-3 years"];

const fieldClass =
  "mt-2 w-full rounded-xl border border-border bg-surface/70 px-3.5 py-2.5 text-[14px] outline-none backdrop-blur-xl placeholder:text-muted/70 focus:ring-2 focus:ring-foreground/15";
const labelClass = "font-mono text-[10px] uppercase tracking-[0.15em] text-muted";

function Profile() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ resume: "", roles: "", locations: "", level: "Entry level" });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("applywise:profile");
      if (stored) setForm(JSON.parse(stored) as typeof form);
    } catch {
      // Keep the empty form if browser storage is unavailable.
    }
  }, []);

  return (
    <AppShell>
      <section className="pt-10 pb-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Your profile</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-balance">
          What should we score jobs against?
        </h1>
        <p className="mt-3 max-w-[46ch] text-[15px] text-pretty text-muted">
          Paste your resume and tell us what you're aiming for. Nothing leaves this page yet.
        </p>
      </section>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          localStorage.setItem("applywise:profile", JSON.stringify(form));
          setSaved(true);
        }}
        className="rounded-2xl border border-border bg-surface/70 p-5 ring-1 ring-foreground/5 backdrop-blur-xl"
      >
        <label className="block">
          <span className={labelClass}>Resume text</span>
          <textarea
            rows={10}
            value={form.resume}
            onChange={(event) => setForm((current) => ({ ...current, resume: event.target.value }))}
            placeholder="Paste your resume here…"
            className={`${fieldClass} resize-y font-mono text-[13px] leading-relaxed`}
          />
        </label>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className={labelClass}>Target roles</span>
            <input
              value={form.roles}
              onChange={(event) => setForm((current) => ({ ...current, roles: event.target.value }))}
              className={fieldClass}
              placeholder="Business Analyst, Data Analyst, Product Analyst"
            />
          </label>
          <label className="block">
            <span className={labelClass}>Target locations</span>
            <input
              value={form.locations}
              onChange={(event) => setForm((current) => ({ ...current, locations: event.target.value }))}
              className={fieldClass}
              placeholder="Los Angeles, New York, Remote (US)"
            />
          </label>
        </div>

        <div className="mt-5">
          <span className={labelClass}>Job level</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {LEVELS.map((option) => (
              <Button
                key={option}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setForm((current) => ({ ...current, level: option }))}
                className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold ${
                  form.level === option
                    ? "bg-foreground text-surface"
                    : "border border-border bg-surface/60 text-muted"
                }`}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border/70 pt-4">
          <Button type="submit" size="sm">
            Save profile
          </Button>
          {saved && (
            <span className="font-mono text-[12px] text-verdict-apply">
              Saved on this device
            </span>
          )}
        </div>
      </form>
    </AppShell>
  );
}
