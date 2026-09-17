import jobData from "./jobs.json";

export type JobGroup = "apply_now" | "also_worth" | "backup" | "needs_review" | "passed";
export type JobStatus =
  | "not_applied"
  | "planning"
  | "applied"
  | "interview"
  | "rejected"
  | "offer"
  | "withdrawn";

export interface JobScores {
  priority: number | null;
  match: number | null;
  opportunity: number | null;
}

export interface EvidenceItem {
  label: string;
  quote: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  list_location: string;
  role_family: string;
  last_seen: string;
  group: JobGroup;
  verdict: string;
  scores: JobScores;
  salary: string | null;
  tags: string[];
  is_new: boolean;
  starred: boolean;
  status: JobStatus;
  apply_url: string | null;
  why_fits: string | null;
  main_risk: string | null;
  why_passed: string | null;
  evidence: EvidenceItem[];
  flags: string[];
}

export interface JobsData {
  meta: {
    title: string;
    run_date: string;
    sample_data: boolean;
    apply_now_threshold: number;
    status_options: JobStatus[];
    handled_statuses: JobStatus[];
    groups: Record<JobGroup, string>;
    networking_note: string;
    scores_note: string;
  };
  jobs: Job[];
}

export const data = jobData as JobsData;
export const jobs = data.jobs;
export const meta = data.meta;
export const GROUP_ORDER: JobGroup[] = [
  "apply_now",
  "also_worth",
  "backup",
  "needs_review",
  "passed",
];

export const STATUS_LABEL: Record<JobStatus, string> = {
  not_applied: "Not applied",
  planning: "Planning",
  applied: "Applied",
  interview: "Interview",
  rejected: "Rejected",
  offer: "Offer",
  withdrawn: "Withdrawn",
};

export function formatScore(score: number | null): string {
  return score === null ? "—" : score.toFixed(1);
}