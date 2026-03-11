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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
  AlertTriangle,
  Bell,
} from "lucide-react";
import { ScrubTask, ScrubStatus, SCRUB_STATUS_CONFIG } from "@/types/scrub";

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
  {
    value: "credit-pending",
    label: "Credit Pending",
    description: "Credit officer & loan advisor to recheck lender fitment",
    icon: CreditCard,
    iconClass: "text-blue-600",
  },
  {
    value: "invalid",
    label: "Invalid",
    description: "Scrub request is invalid",
    icon: AlertTriangle,
    iconClass: "text-gray-500",
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

  const handleSubmit = () => {
    if (!task || !selectedStatus) return;
    onSubmit(task.id, selectedStatus as ScrubStatus, comment);
    setSelectedStatus("");
    setComment("");
    onOpenChange(false);
  };

  const handleClose = () => {
    setSelectedStatus("");
    setComment("");
    onOpenChange(false);
  };

  const selectedConfig = selectedStatus ? SCRUB_STATUS_CONFIG[selectedStatus as ScrubStatus] : null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
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

            {/* Notification preview */}
            {selectedConfig && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/40 border border-dashed">
                <Bell className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-medium text-foreground">Mail + Notification</span> will be sent to:{" "}
                  {selectedConfig.recipients.map((r, i) => (
                    <span key={r}>
                      <span className="font-medium text-foreground">{r}</span>
                      {i < selectedConfig.recipients.length - 1 ? ", " : ""}
                    </span>
                  ))}
                  <br />
                  Client stage → <span className="font-medium text-foreground">{selectedConfig.clientStage}</span>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 pt-2">
          <Button variant="ghost" size="sm" onClick={handleClose}>Cancel</Button>
          <Button
            size="sm"
            disabled={!selectedStatus}
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
