export type Verdict = "APPLY" | "MAYBE" | "LOW_PRIORITY" | "SKIP";
export type UserStatus = "new" | "saved" | "applied" | "dismissed";

export interface HardFilter {
  name: string;
  pass: boolean;
}

export interface SoftSignal {
  name: string;
  effect: string;
}

export interface Job {
  id: string;
  company: string;
  title: string;
  location: string;
  job_url: string;
  posted_date: string;
  verdict: Verdict;
  score: number;
  one_liner: string;
  match_reasons: string[];
  risks: string[];
  hard_filters: HardFilter[];
  soft_signals: SoftSignal[];
  user_status: UserStatus;
}

export const VERDICT_ORDER: Verdict[] = ["APPLY", "MAYBE", "LOW_PRIORITY", "SKIP"];

export const VERDICT_LABEL: Record<Verdict, string> = {
  APPLY: "Apply",
  MAYBE: "Maybe",
  LOW_PRIORITY: "Low",
  SKIP: "Skip",
};

export const jobs: Job[] = [
  {
    id: "job_001",
    company: "Northwind Health",
    title: "Business Analyst, Revenue Operations",
    location: "Los Angeles, CA (Hybrid)",
    job_url: "https://example.com/job/001",
    posted_date: "2026-09-14",
    verdict: "APPLY",
    score: 88,
    one_liner:
      "Entry-level BA role in healthcare with a SQL/Tableau stack that closely matches your background.",
    match_reasons: [
      "Requires SQL and Tableau, both core skills on your resume",
      "Healthcare IT context matches your BI Analyst internship",
      "Title and responsibilities fit early-career analyst level",
    ],
    risks: ["Prefers 1-2 years of full-time experience; you have internships only"],
    hard_filters: [
      { name: "Full-time", pass: true },
      { name: "Entry / early-career level", pass: true },
      { name: "US location", pass: true },
    ],
    soft_signals: [{ name: "Large company", effect: "+5" }],
    user_status: "new",
  },
  {
    id: "job_002",
    company: "Crestline Bank",
    title: "Associate, Financial Planning & Analysis",
    location: "Charlotte, NC (Onsite)",
    job_url: "https://example.com/job/002",
    posted_date: "2026-09-13",
    verdict: "APPLY",
    score: 84,
    one_liner:
      "Early-career FP&A role at a large bank that builds directly on your financial analyst experience.",
    match_reasons: [
      "Banking FP&A experience from your Financial Analyst internship",
      "Accounting and finance degree matches the core requirements",
      "Excel/VBA modeling listed as a key skill",
    ],
    risks: ["Onsite in Charlotte; requires relocation"],
    hard_filters: [
      { name: "Full-time", pass: true },
      { name: "Entry / early-career level", pass: true },
      { name: "US location", pass: true },
    ],
    soft_signals: [{ name: "Large company", effect: "+5" }],
    user_status: "saved",
  },
  {
    id: "job_003",
    company: "Paylane",
    title: "Product Analyst, Payments",
    location: "San Francisco, CA (Hybrid)",
    job_url: "https://example.com/job/003",
    posted_date: "2026-09-15",
    verdict: "APPLY",
    score: 81,
    one_liner:
      "Payments product analytics role that combines your fintech product and A/B testing experience.",
    match_reasons: [
      "Global payments product internship is directly relevant",
      "A/B testing and SQL are listed as must-haves",
      "Python for analysis is a plus you already have",
    ],
    risks: ["Mid-size company; less brand recognition than large firms"],
    hard_filters: [
      { name: "Full-time", pass: true },
      { name: "Entry / early-career level", pass: true },
      { name: "US location", pass: true },
    ],
    soft_signals: [{ name: "Company size", effect: "0" }],
    user_status: "new",
  },
  {
    id: "job_004",
    company: "Orbital Retail Group",
    title: "Strategy & Operations Analyst",
    location: "Seattle, WA (Hybrid)",
    job_url: "https://example.com/job/004",
    posted_date: "2026-09-12",
    verdict: "MAYBE",
    score: 72,
    one_liner:
      "Good level and function fit, but retail operations is outside your core industry experience.",
    match_reasons: [
      "Strategy/operations analyst title fits your target functions",
      "Requires SQL and dashboarding (Power BI)",
    ],
    risks: [
      "No retail or supply chain experience on your resume",
      "Emphasizes consulting-style case work",
    ],
    hard_filters: [
      { name: "Full-time", pass: true },
      { name: "Entry / early-career level", pass: true },
      { name: "US location", pass: true },
    ],
    soft_signals: [{ name: "Large company", effect: "+5" }],
    user_status: "new",
  },
  {
    id: "job_005",
    company: "Sentinel Compliance Partners",
    title: "Risk Analyst, AML",
    location: "New York, NY (Hybrid)",
    job_url: "https://example.com/job/005",
    posted_date: "2026-09-11",
    verdict: "MAYBE",
    score: 68,
    one_liner:
      "AML background is a strong match, but the role leans toward investigations rather than analytics.",
    match_reasons: [
      "AML Business Analyst internship is directly relevant",
      "Banking domain knowledge is required",
    ],
    risks: ["Mostly case review work with limited data analysis", "Smaller consulting firm"],
    hard_filters: [
      { name: "Full-time", pass: true },
      { name: "Entry / early-career level", pass: true },
      { name: "US location", pass: true },
    ],
    soft_signals: [{ name: "Small company", effect: "-3" }],
    user_status: "new",
  },
  {
    id: "job_006",
    company: "Brightpath Media",
    title: "Data Analyst, Growth",
    location: "Remote (US)",
    job_url: "https://example.com/job/006",
    posted_date: "2026-09-10",
    verdict: "MAYBE",
    score: 63,
    one_liner: "Skills match well, but the posting hints at a 2+ year experience bar.",
    match_reasons: [
      "SQL, Python, and A/B testing all match your skills",
      "Internet/consumer product context matches your product internship",
    ],
    risks: [
      "Lists 2+ years of experience as preferred",
      "Heavy focus on marketing attribution, which is new to you",
    ],
    hard_filters: [
      { name: "Full-time", pass: true },
      { name: "Entry / early-career level", pass: true },
      { name: "US location", pass: true },
    ],
    soft_signals: [{ name: "Company size", effect: "0" }],
    user_status: "new",
  },
  {
    id: "job_007",
    company: "Keystone Logistics",
    title: "Sales Operations Analyst",
    location: "Dallas, TX (Onsite)",
    job_url: "https://example.com/job/007",
    posted_date: "2026-09-09",
    verdict: "LOW_PRIORITY",
    score: 52,
    one_liner:
      "Analyst title, but the work is mostly CRM administration with little analytical depth.",
    match_reasons: ["Excel reporting overlaps with your skills"],
    risks: [
      "Main tool is Salesforce admin, not SQL or BI",
      "Limited growth toward product or strategy roles",
    ],
    hard_filters: [
      { name: "Full-time", pass: true },
      { name: "Entry / early-career level", pass: true },
      { name: "US location", pass: true },
    ],
    soft_signals: [{ name: "Company size", effect: "0" }],
    user_status: "new",
  },
  {
    id: "job_008",
    company: "Harborview Insurance",
    title: "Business Analyst I",
    location: "Hartford, CT (Onsite)",
    job_url: "https://example.com/job/008",
    posted_date: "2026-08-28",
    verdict: "LOW_PRIORITY",
    score: 45,
    one_liner:
      "Level fits, but the posting is over two weeks old and focuses on requirements documentation.",
    match_reasons: ["Entry-level Business Analyst title matches your primary target"],
    risks: [
      "Posted 19 days ago; likely already has many applicants",
      "Mostly requirements writing with little data work",
    ],
    hard_filters: [
      { name: "Full-time", pass: true },
      { name: "Entry / early-career level", pass: true },
      { name: "US location", pass: true },
    ],
    soft_signals: [{ name: "Large company", effect: "+5" }],
    user_status: "dismissed",
  },
  {
    id: "job_009",
    company: "Atlas Capital",
    title: "Senior Business Analyst",
    location: "Chicago, IL (Hybrid)",
    job_url: "https://example.com/job/009",
    posted_date: "2026-09-14",
    verdict: "SKIP",
    score: 28,
    one_liner: "Senior role requiring 5+ years of experience; outside your target level.",
    match_reasons: ["Finance domain overlaps with your background"],
    risks: ["Requires 5+ years of full-time experience"],
    hard_filters: [
      { name: "Full-time", pass: true },
      { name: "Entry / early-career level", pass: false },
      { name: "US location", pass: true },
    ],
    soft_signals: [{ name: "Large company", effect: "+5" }],
    user_status: "new",
  },
  {
    id: "job_010",
    company: "Lumen Analytics",
    title: "Data Analytics Intern, Summer 2027",
    location: "Austin, TX (Onsite)",
    job_url: "https://example.com/job/010",
    posted_date: "2026-09-15",
    verdict: "SKIP",
    score: 20,
    one_liner: "Internship, not a full-time role.",
    match_reasons: ["Skills requirements match well"],
    risks: ["Internship only; you are looking for full-time roles"],
    hard_filters: [
      { name: "Full-time", pass: false },
      { name: "Entry / early-career level", pass: true },
      { name: "US location", pass: true },
    ],
    soft_signals: [{ name: "Company size", effect: "0" }],
    user_status: "new",
  },
];

export function formatPosted(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
