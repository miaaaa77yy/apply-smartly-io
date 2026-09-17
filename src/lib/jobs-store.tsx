import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { jobs as seedJobs, VERDICT_ORDER, type Job, type UserStatus } from "@/data/jobs";

interface JobsContextValue {
  jobs: Job[];
  rankedJobs: Job[];
  setStatus: (id: string, status: UserStatus) => void;
  addJob: (input: { company: string; title: string; location: string; description: string }) => void;
}

const JobsContext = createContext<JobsContextValue | null>(null);

function rank(list: Job[]): Job[] {
  return [...list].sort((a, b) => {
    const byVerdict = VERDICT_ORDER.indexOf(a.verdict) - VERDICT_ORDER.indexOf(b.verdict);
    return byVerdict !== 0 ? byVerdict : b.score - a.score;
  });
}

export function JobsProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(seedJobs);

  const setStatus = useCallback((id: string, status: UserStatus) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id
          ? { ...job, user_status: job.user_status === status ? "new" : status }
          : job,
      ),
    );
  }, []);

  const addJob = useCallback(
    (input: { company: string; title: string; location: string; description: string }) => {
      setJobs((prev) => [
        ...prev,
        {
          id: `job_${String(prev.length + 1).padStart(3, "0")}_${Date.now()}`,
          company: input.company,
          title: input.title,
          location: input.location,
          job_url: "",
          posted_date: new Date().toISOString().slice(0, 10),
          verdict: "MAYBE",
          score: 0,
          one_liner: input.description.slice(0, 160) || "Not scored yet.",
          match_reasons: [],
          risks: [],
          hard_filters: [],
          soft_signals: [],
          user_status: "new",
        },
      ]);
    },
    [],
  );

  const value = useMemo(
    () => ({ jobs, rankedJobs: rank(jobs), setStatus, addJob }),
    [jobs, setStatus, addJob],
  );

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
}

export function useJobs() {
  const ctx = useContext(JobsContext);
  if (!ctx) throw new Error("useJobs must be used inside JobsProvider");
  return ctx;
}
