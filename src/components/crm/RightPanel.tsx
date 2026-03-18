import { useState, ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Send,
  ChevronRight,
  FileText,
  ClipboardList,
  Building2,
  MapPin,
  BookOpen,
  UserRound,
  ShieldCheck,
  X,
  Check,
} from "lucide-react";
import { ScrubTask } from "@/types/scrub";

interface RightPanelProps {
  editContent?: ReactNode;
  onRequestDetails: () => void;
  onRequestDocuments: () => void;
  onAssignSalesRep: () => void;
  onEmployerList: () => void;
  onServiceability: () => void;
  onLenderPolicy: () => void;
  // Scrub
  scrubTasks: ScrubTask[];
  onRequestScrub: () => void;
  onScrubFileClick: (task: ScrubTask) => void;
  // Sales Rep Actions
  onRepActionSubmit: (action: "rejected" | "scrub", reason?: string) => void;
  // Request status
  requestDetailsStatus: "none" | "pending" | "completed";
  requestDocsStatus: "none" | "pending" | "completed";
  sentDocRequests: Array<{docLabel: string; months: string[]; comment: string}>;
  sentDetailItems: string[];
}

interface ActionRowProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  iconBg?: string;
}

const ActionRow = ({ icon, label, onClick, iconBg = "bg-muted" }: ActionRowProps) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-left hover:bg-muted/60 transition-colors group"
  >
    <div className={`h-7 w-7 rounded-md flex items-center justify-center shrink-0 ${iconBg}`}>
      {icon}
    </div>
    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors flex-1">
      {label}
    </span>
    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
  </button>
);

const RightPanel = ({
  editContent,
  onRequestDetails,
  onRequestDocuments,
  onAssignSalesRep,
  onEmployerList,
  onServiceability,
  onLenderPolicy,
  scrubTasks,
  onRequestScrub,
  onScrubFileClick,
  onRepActionSubmit,
  requestDetailsStatus,
  requestDocsStatus,
  sentDocRequests,
  sentDetailItems,
}: RightPanelProps) => {
  const [noteText, setNoteText] = useState("");

  // Sales Rep Actions state
  const [repAction, setRepAction] = useState<null | "rejected" | "scrub">(null);
  const [rejectReason, setRejectReason] = useState("");
  const [repComment, setRepComment] = useState("");
  const [repSubmitted, setRepSubmitted] = useState(false);

  const notes = [
    "Call Nature : Manual-Outbound| Call start time: 2025-03-10 10:30",
    "Call Nature : Manual-Outbound| Call start time: 2025-03-09 14:15",
    "Call Nature : Manual-Outbound| Call start time: 2025-03-08 11:45",
  ];

  const handleAddNote = () => {
    if (noteText.trim()) setNoteText("");
  };

  // Normal sidebar content
  const normalContent = (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">

      {/* Sales Rep / RM */}
      <Card className="shadow-none">
        <CardContent className="p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Sales Rep :</span>
            <Badge variant="outline" className="text-xs font-normal border-primary text-primary">
              chandan.pandey
            </Badge>
          </div>
          <div className="flex items-center justify-between border-t pt-2">
            <span className="text-sm text-muted-foreground">RM :</span>
            <span className="text-sm text-muted-foreground">—</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-none">
        <CardContent className="p-2 space-y-0.5">
          <ActionRow
            icon={<Building2 className="h-3.5 w-3.5 text-blue-600" />}
            label="Employers List"
            onClick={onEmployerList}
            iconBg="bg-blue-50"
          />
          <ActionRow
            icon={<MapPin className="h-3.5 w-3.5 text-emerald-600" />}
            label="Serviceability List"
            onClick={onServiceability}
            iconBg="bg-emerald-50"
          />
          <ActionRow
            icon={<BookOpen className="h-3.5 w-3.5 text-violet-600" />}
            label="Lender Policy"
            onClick={onLenderPolicy}
            iconBg="bg-violet-50"
          />
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="shadow-none">
        <CardHeader className="p-3 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Notes</CardTitle>
            <Tabs defaultValue="notes">
              <TabsList className="h-7 p-0.5 bg-muted">
                <TabsTrigger value="notes" className="text-[10px] px-2 h-6 data-[state=active]:bg-card">
                  Notes
                </TabsTrigger>
                <TabsTrigger value="highlighted" className="text-[10px] px-2 h-6 data-[state=active]:bg-card">
                  Highlighted
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-2">
          <div className="relative">
            <Textarea
              placeholder="Add Note (Ctrl + Enter)"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="min-h-[60px] pr-10 text-xs resize-none bg-muted/50"
              onKeyDown={(e) => {
                if (e.ctrlKey && e.key === "Enter") handleAddNote();
              }}
            />
            <button
              onClick={handleAddNote}
              className="absolute bottom-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-0">
            {notes.map((note, i) => (
              <div key={i} className="py-2 border-b last:border-0">
                <p className="text-xs text-muted-foreground truncate">{note}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Request Information */}
      {(() => {
        const hasPending = requestDetailsStatus !== "none" || requestDocsStatus !== "none";
        const StatusChip = ({ label, status }: { label: string; status: "none" | "pending" | "completed" }) => {
          if (status === "none") return null;
          const isPending = status === "pending";
          return (
            <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${isPending ? "bg-amber-100 text-amber-700 border border-amber-300" : "bg-green-100 text-green-700 border border-green-300"}`}>
              {label} · {isPending ? "Pending" : "Completed"}
            </span>
          );
        };
        return (
          <Card className="shadow-none">
            <CardContent className="p-3">
              <div className="flex items-center w-full mb-3">
                <span className="text-sm font-medium text-foreground flex-1">
                  Request Information
                </span>
                {hasPending && (
                  <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
                )}
              </div>

              {hasPending && (
                <div className="flex flex-wrap gap-1 mb-3">
                  <StatusChip label="Request Details" status={requestDetailsStatus} />
                  <StatusChip label="Request Documents" status={requestDocsStatus} />
                </div>
              )}

              <div className="border-t pt-3 space-y-1">
                <button
                  onClick={onRequestDetails}
                  className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-left hover:bg-muted/60 transition-colors group"
                >
                  <div className="h-7 w-7 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                    <ClipboardList className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary leading-none mb-0.5">
                      Request Details
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-none">
                      Request client information
                    </p>
                  </div>
                  {requestDetailsStatus !== "none" ? (
                    <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full shrink-0 ${requestDetailsStatus === "pending" ? "bg-amber-100 text-amber-700 border border-amber-300" : "bg-green-100 text-green-700 border border-green-300"}`}>
                      {requestDetailsStatus === "pending" ? "Pending" : "Completed"}
                    </span>
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                  )}
                </button>
                {sentDetailItems.length > 0 && (
                  <div className="ml-10 mt-1 space-y-0.5 pb-1">
                    {sentDetailItems.map((label, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <span className="h-1 w-1 rounded-full bg-amber-400 shrink-0" />
                        {label}
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={onRequestDocuments}
                  className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-left hover:bg-muted/60 transition-colors group"
                >
                  <div className="h-7 w-7 rounded-md bg-violet-50 flex items-center justify-center shrink-0">
                    <FileText className="h-3.5 w-3.5 text-violet-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary leading-none mb-0.5">
                      Request Document
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-none">
                      Request client documents
                    </p>
                  </div>
                  {requestDocsStatus !== "none" ? (
                    <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full shrink-0 ${requestDocsStatus === "pending" ? "bg-amber-100 text-amber-700 border border-amber-300" : "bg-green-100 text-green-700 border border-green-300"}`}>
                      {requestDocsStatus === "pending" ? "Pending" : "Completed"}
                    </span>
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                  )}
                </button>
                {sentDocRequests.length > 0 && (
                  <div className="ml-10 mt-1 space-y-1 pb-1">
                    {sentDocRequests.map((req, i) => (
                      <div key={i} className="text-[10px] text-muted-foreground">
                        <span className="font-medium text-foreground/70">{req.docLabel}</span>
                        {req.months.length > 0 && (
                          <span className="text-muted-foreground"> · {req.months.join(", ")}</span>
                        )}
                        {req.comment && (
                          <span className="italic text-muted-foreground/60"> ({req.comment})</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })()}

      {/* Assign Sales Rep */}
      <Card className="shadow-none">
        <CardContent className="p-2">
          <ActionRow
            icon={<UserRound className="h-3.5 w-3.5 text-primary" />}
            label="Assign Sales Rep"
            onClick={onAssignSalesRep}
            iconBg="bg-primary/10"
          />
        </CardContent>
      </Card>

      {/* Sales Rep Actions */}
      <Card className={`shadow-none ${repSubmitted ? (repAction === "rejected" ? "border-red-200" : "border-amber-200") : ""}`}>
        <CardContent className="p-3 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">Sales Rep Actions</span>
              {repSubmitted && (
                <Badge variant="outline" className={`text-[10px] h-4 px-1.5 border ${repAction === "rejected" ? "border-red-300 text-red-700 bg-red-50" : "border-amber-300 text-amber-700 bg-amber-50"}`}>
                  {repAction === "rejected" ? "Rejected" : "Scrub Requested"}
                </Badge>
              )}
            </div>
            {repSubmitted && (
              <button onClick={() => { setRepSubmitted(false); setRepAction(null); setRejectReason(""); setRepComment(""); }}
                className="text-[10px] text-muted-foreground hover:text-foreground underline">Reset</button>
            )}
          </div>

          {repSubmitted ? (
            <div className={`rounded-lg px-3 py-2.5 text-xs ${repAction === "rejected" ? "bg-red-50 border border-red-200 text-red-800" : "bg-amber-50 border border-amber-200 text-amber-800"}`}>
              {repAction === "rejected"
                ? `File rejected${rejectReason ? ` — ${rejectReason.replace(/-/g, " ")}` : ""}.`
                : "Scrub requested successfully."}
              {repComment && <p className="mt-1 italic text-muted-foreground">"{repComment}"</p>}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Action toggle buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setRepAction(repAction === "rejected" ? null : "rejected")}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border font-medium transition-colors ${repAction === "rejected" ? "bg-red-50 border-red-300 text-red-700" : "border-border text-muted-foreground hover:bg-muted/60"}`}>
                  <X className="h-3 w-3" /> Reject Fill
                </button>
                <button
                  onClick={() => setRepAction(repAction === "scrub" ? null : "scrub")}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border font-medium transition-colors ${repAction === "scrub" ? "bg-amber-50 border-amber-300 text-amber-700" : "border-border text-muted-foreground hover:bg-muted/60"}`}>
                  <ShieldCheck className="h-3 w-3" /> Request Scrub
                </button>
              </div>

              {/* Reject reason — shown when rejected */}
              {repAction === "rejected" && (
                <div className="space-y-1">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Rejection Reason</p>
                  <Select value={rejectReason} onValueChange={setRejectReason}>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="incomplete-docs">Incomplete Documents</SelectItem>
                      <SelectItem value="low-cibil">Low CIBIL Score</SelectItem>
                      <SelectItem value="high-foir">High FOIR</SelectItem>
                      <SelectItem value="income-insufficient">Insufficient Income</SelectItem>
                      <SelectItem value="existing-defaults">Existing Defaults</SelectItem>
                      <SelectItem value="wrong-info">Incorrect Information</SelectItem>
                      <SelectItem value="duplicate">Duplicate Application</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Comment */}
              <div className="space-y-1">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Comment</p>
                <Textarea
                  value={repComment}
                  onChange={(e) => setRepComment(e.target.value)}
                  placeholder="Add notes..."
                  className="min-h-[50px] text-xs resize-none bg-muted/50"
                  rows={2}
                />
              </div>

              {/* Submit */}
              <Button
                size="sm"
                className="w-full h-7 text-xs gap-1.5"
                disabled={!repAction || (repAction === "rejected" && !rejectReason)}
                onClick={() => {
                  if (repAction === "scrub") onRequestScrub();
                  onRepActionSubmit(repAction!, rejectReason || undefined);
                  setRepSubmitted(true);
                }}
              >
                <Check className="h-3 w-3" />
                {repAction === "rejected" ? "Confirm Rejection" : repAction === "scrub" ? "Request Scrub" : "Submit"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );

  return (
    <aside className="sticky top-0 h-screen w-[300px] bg-card border-l shrink-0 z-30 flex flex-col">
      {editContent ? (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {editContent}
        </div>
      ) : normalContent}
    </aside>
  );
};

export default RightPanel;
