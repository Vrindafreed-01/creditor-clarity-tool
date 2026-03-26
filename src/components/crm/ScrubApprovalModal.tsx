import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UnifiedDatePicker } from "@/components/ui/unified-date-picker";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  X,
} from "lucide-react";
import { ScrubTask, ScrubStatus, SCRUB_STATUS_CONFIG } from "@/types/scrub";

const REJECTION_REASONS = [
  "Insufficient income / high FOIR",
  "Low credit score",
  "Too many active loans",
  "Employment instability",
  "Incomplete / incorrect documents",
  "Address verification failed",
  "Age criteria not met",
  "High existing debt burden",
  "Fraud / misrepresentation suspected",
  "Company not approved",
  "Other",
];

/* ── Documents the TL can request from the rep ── */
const REP_PENDING_DOCUMENTS = [
  { id: "salary_slip", label: "Salary Slip" },
  { id: "bank_statement", label: "Bank Statement" },
  { id: "form_16", label: "Form 16" },
  { id: "itr", label: "ITR" },
  { id: "pan", label: "PAN Card" },
  { id: "aadhaar", label: "Aadhaar Card" },
  { id: "salary_cert", label: "Salary Certificate" },
  { id: "offer_letter", label: "Offer / Appointment Letter" },
  { id: "credit_report", label: "Credit Report" },
  { id: "loan_statement", label: "Existing Loan Statement" },
  { id: "cc_statement", label: "Credit Card Statement" },
  { id: "address_proof", label: "Address Proof" },
  { id: "property_docs", label: "Property Documents" },
  { id: "business_proof", label: "Business Registration Proof" },
  { id: "others", label: "Others" },
];

interface SelectedDoc {
  id: string;
  label: string;
  period: string; // "Mon YYYY" or "Mon YYYY – Mon YYYY"
}

interface ScrubApprovalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: ScrubTask | null;
  onSubmit: (taskId: string, status: ScrubStatus, comment: string) => void;
}

const TL_STATUS_OPTIONS: Array<{
  value: ScrubStatus;
  label: string;
  description: string;
  icon: React.ElementType;
  iconClass: string;
}> = [
  {
    value: "approved",
    label: "Approved",
    description: "Client file is clear — ready for login",
    icon: CheckCircle2,
    iconClass: "text-green-600",
  },
  {
    value: "rejected",
    label: "Rejected",
    description: "Client file cannot proceed for login",
    icon: XCircle,
    iconClass: "text-red-600",
  },
  {
    value: "rep-pending",
    label: "Rep Pending",
    description: "Rep must re-check file or collect more documents",
    icon: Clock,
    iconClass: "text-orange-600",
  },
];

const ScrubApprovalModal = ({
  open,
  onOpenChange,
  task,
  onSubmit,
}: ScrubApprovalModalProps) => {
  const [selectedStatus, setSelectedStatus] = useState<ScrubStatus | "">("");
  const [comment, setComment] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [requestedDocs, setRequestedDocs] = useState<SelectedDoc[]>([]);

  const toggleDoc = (docId: string, docLabel: string) => {
    setRequestedDocs((prev) => {
      const exists = prev.find((d) => d.id === docId);
      if (exists) return prev.filter((d) => d.id !== docId);
      return [...prev, { id: docId, label: docLabel, period: "" }];
    });
  };

  const updateDocPeriod = (docId: string, value: string) => {
    setRequestedDocs((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, period: value } : d))
    );
  };

  const handleSubmit = () => {
    if (!task || !selectedStatus) return;
    if (selectedStatus === "rejected" && !rejectionReason) return;
    if (selectedStatus === "rep-pending" && requestedDocs.length === 0) return;

    let fullComment = "";
    if (selectedStatus === "rejected" && rejectionReason) {
      fullComment = `Rejection Reason: ${rejectionReason}${comment ? `\n${comment}` : ""}`;
    } else if (selectedStatus === "rep-pending" && requestedDocs.length > 0) {
      const docLines = requestedDocs.map((d) => {
        const period = d.period ? ` (${d.period})` : "";
        return `• ${d.label}${period}`;
      }).join("\n");
      fullComment = `Documents Requested:\n${docLines}${comment ? `\n\n${comment}` : ""}`;
    } else {
      fullComment = comment;
    }

    onSubmit(task.id, selectedStatus as ScrubStatus, fullComment);
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setSelectedStatus("");
    setComment("");
    setRejectionReason("");
    setRequestedDocs([]);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">Scrub Review</DialogTitle>
        </DialogHeader>

        {task && (
          <div className="space-y-5 pt-1">
            {/* Task info chip row */}
            <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{task.kfsId}</span>
              <span>·</span>
              <span>{task.mobileNumber}</span>
              <span>·</span>
              <span>{task.companyName}</span>
              <span>·</span>
              <span>{task.location}</span>
            </div>

            {/* Status selection */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Mark As
              </Label>
              <RadioGroup
                value={selectedStatus}
                onValueChange={(v) => setSelectedStatus(v as ScrubStatus)}
                className="space-y-1.5"
              >
                {TL_STATUS_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedStatus === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-transparent hover:bg-muted/60"
                      }`}
                    >
                      <RadioGroupItem value={opt.value} className="shrink-0" />
                      <Icon className={`h-4 w-4 shrink-0 ${opt.iconClass}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-none mb-0.5">{opt.label}</p>
                        <p className="text-[11px] text-muted-foreground leading-none">{opt.description}</p>
                      </div>
                    </label>
                  );
                })}
              </RadioGroup>
            </div>

            {/* Rejection reason dropdown */}
            {selectedStatus === "rejected" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Rejection Reason <span className="text-red-500">*</span>
                </Label>
                <Select value={rejectionReason} onValueChange={setRejectionReason}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select rejection reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {REJECTION_REASONS.map((reason) => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Rep Pending — document request list */}
            {selectedStatus === "rep-pending" && (
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Request Documents from Rep <span className="text-red-500">*</span>
                </Label>
                <div className="border rounded-lg max-h-[240px] overflow-y-auto">
                  {REP_PENDING_DOCUMENTS.map((doc) => {
                    const isChecked = requestedDocs.some((d) => d.id === doc.id);
                    const selectedDoc = requestedDocs.find((d) => d.id === doc.id);
                    return (
                      <div key={doc.id} className={`border-b last:border-b-0 transition-colors ${isChecked ? "bg-orange-50/50" : ""}`}>
                        <div className="flex items-center gap-2.5 px-3 py-2">
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => toggleDoc(doc.id, doc.label)}
                            className="h-3.5 w-3.5 shrink-0"
                          />
                          <FileText className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                          <span className="text-xs font-medium text-foreground flex-1">{doc.label}</span>
                        </div>
                        {isChecked && selectedDoc && (
                          <div className="flex items-center gap-2 px-3 pb-2 pl-9">
                            <UnifiedDatePicker
                              mode="month-range"
                              value={selectedDoc.period}
                              onChange={(v) => updateDocPeriod(doc.id, v)}
                              compact
                              placeholder="Select period"
                              className="flex-1"
                            />
                            <button
                              onClick={() => toggleDoc(doc.id, doc.label)}
                              className="ml-auto p-0.5 rounded hover:bg-muted text-muted-foreground/50 hover:text-foreground"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {requestedDocs.length > 0 && (
                  <p className="text-[10px] text-muted-foreground">
                    {requestedDocs.length} document{requestedDocs.length !== 1 ? "s" : ""} selected
                  </p>
                )}
              </div>
            )}

            {/* Comment */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Comment <span className="font-normal normal-case">(reflected in Notes)</span>
              </Label>
              <Textarea
                placeholder="Add comment for loan advisor / credit officer..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="text-sm resize-none min-h-[72px]"
              />
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 pt-2">
          <Button variant="ghost" size="sm" onClick={handleClose}>Cancel</Button>
          <Button
            size="sm"
            disabled={!selectedStatus || (selectedStatus === "rejected" && !rejectionReason) || (selectedStatus === "rep-pending" && requestedDocs.length === 0)}
            onClick={handleSubmit}
          >
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScrubApprovalModal;
