import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, ClipboardCheck, ExternalLink } from "lucide-react";
import { ScrubTask, ScrubStatus, SCRUB_STATUS_CONFIG } from "@/types/scrub";
import ScrubApprovalModal from "./ScrubApprovalModal";

interface TLScrubTasksViewProps {
  tasks: ScrubTask[];
  onClose: () => void;
  onViewClient: (task: ScrubTask) => void;
  onApprove: (taskId: string, status: ScrubStatus, comment: string) => void;
}

const StatusBadge = ({ status }: { status: ScrubStatus }) => {
  const cfg = SCRUB_STATUS_CONFIG[status];
  return (
    <Badge variant="outline" className={`text-[10px] px-2 py-0.5 font-medium border ${cfg.badgeClass}`}>
      {cfg.label}
    </Badge>
  );
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
};

const TLScrubTasksView = ({
  tasks,
  onClose,
  onViewClient,
  onApprove,
}: TLScrubTasksViewProps) => {
  const [approvalOpen, setApprovalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ScrubTask | null>(null);

  const openApproval = (task: ScrubTask) => {
    setSelectedTask(task);
    setApprovalOpen(true);
  };

  const pendingCount = tasks.filter((t) => t.status === "scrub-check-pending").length;

  return (
    <div className="min-h-full">
      {/* Breadcrumb */}
      <div className="border-b px-6 py-3 flex items-center gap-2">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <span className="text-muted-foreground text-sm">/</span>
        <span className="text-sm font-medium text-foreground">TL Tasks — Scrub Approvals</span>
      </div>

      <div className="px-6 py-6 max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-9 w-9 rounded-lg bg-violet-100 flex items-center justify-center">
            <ClipboardCheck className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-foreground">Scrub Approval Tasks</h1>
            <p className="text-xs text-muted-foreground">
              {pendingCount} pending review{pendingCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ClipboardCheck className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No scrub tasks yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Scrub requests will appear here</p>
          </div>
        ) : (
          <div className="bg-card rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold">KFS ID</TableHead>
                  <TableHead className="text-xs font-semibold">Mobile</TableHead>
                  <TableHead className="text-xs font-semibold">Company Name</TableHead>
                  <TableHead className="text-xs font-semibold">Lenders</TableHead>
                  <TableHead className="text-xs font-semibold">Location</TableHead>
                  <TableHead className="text-xs font-semibold">Requested</TableHead>
                  <TableHead className="text-xs font-semibold">Last Action</TableHead>
                  <TableHead className="text-xs font-semibold">Assigned TL</TableHead>
                  <TableHead className="text-xs font-semibold">Task Status</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow
                    key={task.id}
                    className="cursor-pointer hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <button
                        onClick={() => onViewClient(task)}
                        className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                      >
                        {task.kfsId}
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{task.mobileNumber}</TableCell>
                    <TableCell className="text-xs font-medium">{task.companyName}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        {task.primaryLender && (
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-medium border-primary/40 text-primary bg-primary/5">
                              Primary
                            </Badge>
                            <span className="text-xs font-medium">{task.primaryLender}</span>
                          </div>
                        )}
                        {task.secondaryLender && (
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-normal border-muted-foreground/30 text-muted-foreground">
                              Secondary
                            </Badge>
                            <span className="text-xs text-muted-foreground">{task.secondaryLender}</span>
                          </div>
                        )}
                        {!task.primaryLender && !task.secondaryLender && (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{task.location}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">{formatDate(task.requestedAt)}</span>
                        <span className="text-[10px] text-muted-foreground/70">{formatTime(task.requestedAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {task.updatedAt ? (
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">{formatDate(task.updatedAt)}</span>
                          <span className="text-[10px] text-muted-foreground/70">{formatTime(task.updatedAt)}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{task.assignedTL}</TableCell>
                    <TableCell>
                      <StatusBadge status={task.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant={task.status === "scrub-check-pending" ? "default" : "outline"}
                        className="h-7 text-xs px-3"
                        onClick={() => openApproval(task)}
                      >
                        {task.status === "scrub-check-pending" ? "Review" : "Update"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Stage reference table */}
        <div className="mt-8 bg-muted/30 rounded-lg border p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Status → Client Stage Reference
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {(Object.entries(SCRUB_STATUS_CONFIG) as [ScrubStatus, (typeof SCRUB_STATUS_CONFIG)[ScrubStatus]][]).map(
              ([status, cfg]) => (
                <div key={status} className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className={`text-[10px] shrink-0 border ${cfg.badgeClass}`}>
                    {cfg.label}
                  </Badge>
                  <span className="text-muted-foreground">→ {cfg.clientStage}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <ScrubApprovalModal
        open={approvalOpen}
        onOpenChange={setApprovalOpen}
        task={selectedTask}
        onSubmit={onApprove}
      />
    </div>
  );
};

export default TLScrubTasksView;
