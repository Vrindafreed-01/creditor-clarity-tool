export type ScrubStatus =
  | "scrub-check-pending"
  | "approved"
  | "rejected"
  | "rep-pending";

export interface ScrubTask {
  id: string;
  kfsId: string;
  mobileNumber: string;
  companyName: string;
  companyCategory: string;
  location: string;
  status: ScrubStatus;
  requestedAt: string;       // ISO string
  assignedTL: string;
  comment?: string;
  updatedAt?: string;        // ISO string — when TL last acted
}

// ── Maps ──────────────────────────────────────────────────────────────────────

export const SCRUB_STATUS_CONFIG: Record<
  ScrubStatus,
  {
    label: string;
    clientStage: string;
    colorClass: string;          // tailwind text-* class
    bgClass: string;             // tailwind bg-* class
    badgeClass: string;          // full badge className
    recipients: string[];
  }
> = {
  "scrub-check-pending": {
    label: "Scrub Check Pending",
    clientStage: "Scrub Requested",
    colorClass: "text-amber-700",
    bgClass: "bg-amber-50",
    badgeClass: "border-amber-300 bg-amber-50 text-amber-700",
    recipients: ["Loan Advisor", "TL"],
  },
  approved: {
    label: "Approved",
    clientStage: "Scrub Approved",
    colorClass: "text-green-700",
    bgClass: "bg-green-50",
    badgeClass: "border-green-300 bg-green-50 text-green-700",
    recipients: ["Loan Advisor", "Ops", "TL", "Credit Officer"],
  },
  rejected: {
    label: "Rejected",
    clientStage: "Scrub Rejected",
    colorClass: "text-red-700",
    bgClass: "bg-red-50",
    badgeClass: "border-red-300 bg-red-50 text-red-700",
    recipients: ["Loan Advisor", "TL"],
  },
  "rep-pending": {
    label: "Rep Pending",
    clientStage: "Under Review – Rep Pending",
    colorClass: "text-orange-700",
    bgClass: "bg-orange-50",
    badgeClass: "border-orange-300 bg-orange-50 text-orange-700",
    recipients: ["Loan Advisor", "TL"],
  },
};

/** Statuses that allow the loan advisor to re-request a scrub */
export const CAN_REREQUREST_SCRUB: ScrubStatus[] = ["rep-pending", "rejected"];
