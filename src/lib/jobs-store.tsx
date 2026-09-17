import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { jobs as seedJobs, meta, type Job, type JobStatus } from "@/data/jobs";

const STATUS_KEY = "applywise:statuses";
const ADDED_KEY = "applywise:added-jobs";

interface AddJobInput {
  company: string;
  title: string;
  location: string;
  description: string;
}

interface JobsContextValue {
  jobs: Job[];
  setStatus: (id: string, status: JobStatus) => void;
  addJob: (input: AddJobInput) => Job;
}

const JobsContext = createContext<JobsContextValue | null>(null);

function sortJobs(list: Job[]) {
  return [...list].sort((a, b) => {
    const aScore = a.scores.priority ?? -1;
    const bScore = b.scores.priority ?? -1;
    return bScore - aScore || a.title.localeCompare(b.title);
  });
}

export function JobsProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(seedJobs);

  useEffect(() => {
    try {
      const statuses = JSON.parse(localStorage.getItem(STATUS_KEY) ?? "{}") as Record<string, JobStatus>;
      const added = JSON.parse(localStorage.getItem(ADDED_KEY) ?? "[]") as Job[];
      setJobs([...seedJobs.map((job) => ({ ...job, status: statuses[job.id] ?? job.status })), ...added]);
    } catch {
      setJobs(seedJobs);
    }
  }, []);

  const setStatus = useCallback((id: string, status: JobStatus) => {
    setJobs((current) => {
      const next = current.map((job) => (job.id === id ? { ...job, status, is_new: false } : job));
      const statuses = Object.fromEntries(next.map((job) => [job.id, job.status]));
      localStorage.setItem(STATUS_KEY, JSON.stringify(statuses));
      const addedIds = new Set(JSON.parse(localStorage.getItem(ADDED_KEY) ?? "[]").map((job: Job) => job.id));
      localStorage.setItem(ADDED_KEY, JSON.stringify(next.filter((job) => addedIds.has(job.id))));
      return next;
    });
  }, []);

  const addJob = useCallback((input: AddJobInput) => {
    const newJob: Job = {
      id: `added:${Date.now()}`,
      title: input.title,
      company: input.company,
      location: input.location,
      list_location: input.location,
      role_family: "Awaiting scoring",
      last_seen: "Added manually",
      group: "needs_review",
      verdict: "Not scored",
      scores: { priority: null, match: null, opportunity: null },
      salary: null,
      tags: ["added"],
      is_new: true,
      starred: false,
      status: "not_applied",
      apply_url: null,
      why_fits: null,
      main_risk: null,
      why_passed: null,
      evidence: input.description ? [{ label: "Job description", quote: input.description }] : [],
      flags: ["Scoring coming soon"],
    };
    setJobs((current) => {
      const next = [...current, newJob];
      const added = next.filter((job) => job.id.startsWith("added:"));
      localStorage.setItem(ADDED_KEY, JSON.stringify(added));
      return next;
    });
    return newJob;
  }, []);

  const value = useMemo(() => ({ jobs: sortJobs(jobs), setStatus, addJob }), [jobs, setStatus, addJob]);
  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
}

export function useJobs() {
  const context = useContext(JobsContext);
  if (!context) throw new Error("useJobs must be used inside JobsProvider");
  return context;
}

export { meta };