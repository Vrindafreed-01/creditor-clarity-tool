import { useState, ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Send,
  ChevronDown,
  ChevronRight,
  FileText,
  ClipboardList,
  Building2,
  MapPin,
  BookOpen,
  UserRound,
  ShieldCheck,
  Download,
  RotateCcw,
  FileCheck,
} from "lucide-react";
import { ScrubTask, ScrubStatus, SCRUB_STATUS_CONFIG, CAN_REREQUREST_SCRUB } from "@/types/scrub";

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

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

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
}: RightPanelProps) => {
  const [noteText, setNoteText] = useState("");
  const [requestInfoOpen, setRequestInfoOpen] = useState(false);
  const [scrubSectionOpen, setScrubSectionOpen] = useState(true);

  const notes = [
    "Call Nature : Manual-Outbound| Call start time: 2025-03-10 10:30",
    "Call Nature : Manual-Outbound| Call start time: 2025-03-09 14:15",
    "Call Nature : Manual-Outbound| Call start time: 2025-03-08 11:45",
  ];

  const handleAddNote = () => {
    if (noteText.trim()) setNoteText("");
  };

  // Latest scrub task (most recent)
  const latestScrub = scrubTasks.length > 0 ? scrubTasks[scrubTasks.length - 1] : null;
  const latestCfg = latestScrub ? SCRUB_STATUS_CONFIG[latestScrub.status] : null;

  // Can re-request scrub?
  const canRerequest =
    !latestScrub || CAN_REREQUREST_SCRUB.includes(latestScrub.status as ScrubStatus);
  const isFirstRequest = !latestScrub;

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
      <Card className="shadow-none">
        <CardContent className="p-3">
          <button
            onClick={() => setRequestInfoOpen(!requestInfoOpen)}
            className="flex items-center w-full text-left"
          >
            <span className="text-sm font-medium text-foreground flex-1">
              Request Information
            </span>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                requestInfoOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {requestInfoOpen && (
            <div className="mt-3 border-t pt-3 space-y-1">
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
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
              </button>

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
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
              </button>
            </div>
          )}
        </CardContent>
      </Card>

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

      {/* Scrub */}
      <Card className={`shadow-none ${latestScrub ? "border-violet-200" : ""}`}>
        <CardContent className="p-3 space-y-3">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setScrubSectionOpen(!scrubSectionOpen)}
              className="flex items-center gap-2 flex-1 text-left"
            >
              <div className="h-6 w-6 rounded-md bg-violet-100 flex items-center justify-center">
                <ShieldCheck className="h-3.5 w-3.5 text-violet-600" />
              </div>
              <span className="text-sm font-medium text-foreground">Scrub</span>
              {latestScrub && latestCfg && (
                <Badge variant="outline" className={`text-[10px] h-4 px-1.5 border ${latestCfg.badgeClass}`}>
                  {latestCfg.label}
                </Badge>
              )}
              <ChevronDown
                className={`h-3.5 w-3.5 text-muted-foreground ml-auto transition-transform ${scrubSectionOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Actions dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 gap-1 text-xs ml-2 shrink-0">
                  Actions
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={onRequestScrub}
                  disabled={!isFirstRequest && !canRerequest}
                  className="gap-2 text-sm cursor-pointer"
                >
                  {canRerequest && !isFirstRequest ? (
                    <RotateCcw className="h-4 w-4 text-violet-600" />
                  ) : (
                    <ShieldCheck className="h-4 w-4 text-violet-600" />
                  )}
                  {canRerequest && !isFirstRequest ? "Re-request Scrub" : "Request Scrub"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  Download Login Sheet
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Expanded content */}
          {scrubSectionOpen && (
            <>
              {/* Current stage */}
              {latestScrub && latestCfg && (
                <div className={`rounded-lg p-2.5 ${latestCfg.bgClass} border ${latestCfg.badgeClass.split(" ").find(c => c.startsWith("border-")) || ""}`}>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
                    Client File Stage
                  </p>
                  <p className={`text-sm font-semibold ${latestCfg.colorClass}`}>
                    {latestCfg.clientStage}
                  </p>
                  {latestScrub.comment && (
                    <p className="text-[11px] text-muted-foreground mt-1 italic">
                      &quot;{latestScrub.comment}&quot;
                    </p>
                  )}
                </div>
              )}

              {/* Scrub files list */}
              {scrubTasks.length > 0 ? (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                    Scrub Files ({scrubTasks.length})
                  </p>
                  {[...scrubTasks].reverse().map((task, idx) => {
                    const cfg = SCRUB_STATUS_CONFIG[task.status];
                    return (
                      <button
                        key={task.id}
                        onClick={() => onScrubFileClick(task)}
                        className="flex items-start gap-2.5 w-full rounded-lg p-2.5 text-left border hover:border-primary/30 hover:bg-primary/5 transition-colors group"
                      >
                        <div className="h-7 w-7 rounded-md bg-violet-100 flex items-center justify-center shrink-0 mt-0.5">
                          <FileCheck className="h-3.5 w-3.5 text-violet-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-xs font-medium text-foreground leading-none">
                              Scrub #{scrubTasks.length - idx}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-[9px] h-3.5 px-1 border ${cfg.badgeClass}`}
                            >
                              {cfg.label}
                            </Badge>
                          </div>
                          <p className="text-[10px] text-muted-foreground leading-none">
                            {formatDate(task.requestedAt)}
                          </p>
                          <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
                            Sales Rep: {task.assignedTL}
                          </p>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0 group-hover:text-primary mt-1.5" />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-3">
                  <ShieldCheck className="h-6 w-6 text-muted-foreground/30 mx-auto mb-1" />
                  <p className="text-[11px] text-muted-foreground">No scrub requested yet</p>
                  <p className="text-[10px] text-muted-foreground/60">
                    Use Actions to Request Scrub
                  </p>
                </div>
              )}
            </>
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
