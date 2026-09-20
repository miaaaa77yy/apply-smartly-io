import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "Results" },
  { to: "/profile", label: "Profile" },
  { to: "/add-job", label: "Add Job" },
  { to: "/tracker", label: "Tracker" },
] as const;

export function AppShell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background font-display text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-surface/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-lg bg-foreground text-[13px] font-bold text-surface">
              A
            </span>
            <span className="text-[15px] font-bold tracking-tight">ApplyWise</span>
            <span className="ml-1 hidden rounded-full border border-border bg-surface/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted sm:inline">
              Triage
            </span>
          </div>
          <nav className="flex items-center gap-1 text-[13px] font-medium text-muted">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-lg px-3 py-1.5 transition-colors hover:bg-foreground/5 hover:text-foreground"
                activeProps={{ className: "bg-foreground text-surface hover:bg-foreground" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className={`mx-auto px-5 pb-20 ${wide ? "max-w-[1500px]" : "max-w-5xl"}`}>{children}</main>
    </div>
  );
}
