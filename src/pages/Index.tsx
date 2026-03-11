import { useState, useRef, useEffect, ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ClientHeader from "@/components/crm/ClientHeader";
import LeftSidebar from "@/components/crm/LeftSidebar";
import RightPanel from "@/components/crm/RightPanel";
import ProfileTab from "@/components/crm/ProfileTab";
import CreditorTab from "@/components/crm/CreditorTab";
import CalculatorTab from "@/components/crm/CalculatorTab";
import DocumentsTab from "@/components/crm/DocumentsTab";
import RequestDetailsView from "@/components/crm/RequestDetailsView";
import RequestDocumentsView from "@/components/crm/RequestDocumentsView";
import AssignSalesRepView from "@/components/crm/AssignSalesRepView";
import EmployerListModal from "@/components/crm/EmployerListModal";
import ServiceabilityListModal from "@/components/crm/ServiceabilityListModal";
import TLScrubTasksView from "@/components/crm/TLScrubTasksView";
import ScrubApprovalModal from "@/components/crm/ScrubApprovalModal";
import { ChevronDown, Download, Pencil, Check, ShieldCheck, ArrowRight, X } from "lucide-react";
import { ScrubTask, ScrubStatus, SCRUB_STATUS_CONFIG } from "@/types/scrub";
import { Creditor, INITIAL_INCLUDED, INITIAL_EXCLUDED } from "@/types/creditor";

// ── Mock client data ───────────────────────────────────────────────────────────
const CLIENT_KFS_ID     = "KFSAPP-INH-0226-2362704";
const CLIENT_MOBILE     = "77210 69734";
const CLIENT_COMPANY    = "Infosys Technologies";
const CLIENT_CATEGORY   = "IT / Software";
const CLIENT_LOCATION   = "Pune";
const ASSIGNED_TL       = "rajesh.sharma";

type ActiveView =
  | "main"
  | "request-details"
  | "request-documents"
  | "assign-sales-rep"
  | "tl-tasks";

/* ── Stat edit panel — rendered inside RightPanel ── */
interface StatEditPanelProps {
  label: string;
  initialValue: number;
  prefix?: string;
  onSave: (value: number) => void;
  onClose: () => void;
}

const StatEditPanel = ({
  label,
  initialValue,
  prefix,
  onSave,
  onClose,
}: StatEditPanelProps) => {
  const [value, setValue] = useState(String(initialValue));

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
        <h3 className="text-sm font-semibold">Edit {label}</h3>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4 space-y-3 flex-1">
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          <div className="relative">
            {prefix && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                {prefix}
              </span>
            )}
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoFocus
              className={`h-9 w-full text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                prefix ? "pl-7 pr-3" : "px-3"
              }`}
            />
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-t shrink-0">
        <Button
          className="w-full h-9 text-sm"
          onClick={() => {
            const v = parseFloat(value);
            if (!isNaN(v)) onSave(Math.round(v));
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

/* ── Stat box ── */
const StatBox = ({
  label,
  value,
  valueClass = "text-foreground",
  isEditing = false,
  isSelected = false,
  onClick,
}: {
  label: string;
  value: string;
  valueClass?: string;
  isEditing?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}) => (
  <div
    className={`border-2 rounded-xl px-5 py-3 bg-card min-w-[160px] transition-colors ${
      isSelected
        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
        : isEditing
        ? "border-primary/30 cursor-pointer hover:border-primary/60 hover:bg-primary/5"
        : "border-border"
    }`}
    onClick={isEditing ? onClick : undefined}
  >
    <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-widest mb-1">
      {label}
    </p>
    <p className={`text-xl font-bold leading-tight ${valueClass}`}>{value}</p>
    {isEditing && (
      <p className="text-[9px] text-primary/60 mt-0.5">Click to edit</p>
    )}
  </div>
);

const Index = () => {
  const [activeView, setActiveView]         = useState<ActiveView>("main");
  const [activeTab, setActiveTab]           = useState("profile");
  const [employerModalOpen, setEmployerModalOpen]             = useState(false);
  const [serviceabilityModalOpen, setServiceabilityModalOpen] = useState(false);
  const [isEditingCreditors, setIsEditingCreditors]           = useState(false);

  // ── Edit panel (shown in RightPanel) ──────────────────────────────────────
  const [editPanelContent, setEditPanelContent] = useState<ReactNode>(null);

  // ── Editable stat box values ──────────────────────────────────────────────
  const [totalOutstanding, setTotalOutstanding] = useState(1432155);
  const [cibilScore, setCibilScore]             = useState(751);
  const [selectedStat, setSelectedStat]         = useState<
    "totalOutstanding" | "cibilScore" | null
  >(null);

  // ── Shared creditor state (passed to both CreditorTab and CalculatorTab) ──
  const [included, setIncluded] = useState<Creditor[]>(INITIAL_INCLUDED);
  const [excluded, setExcluded] = useState<Creditor[]>(INITIAL_EXCLUDED);
  const [stcIds, setStcIds]     = useState<Set<string>>(new Set());

  const handleToggleStc = (id: string) => {
    setStcIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Clear edit panel when leaving edit mode
  useEffect(() => {
    if (!isEditingCreditors) {
      setSelectedStat(null);
      setEditPanelContent(null);
    }
  }, [isEditingCreditors]);

  // Open stat edit panel in RightPanel
  const openStatEdit = (stat: "totalOutstanding" | "cibilScore") => {
    const currentValue =
      stat === "totalOutstanding" ? totalOutstanding : cibilScore;
    setSelectedStat(stat);
    setEditPanelContent(
      <StatEditPanel
        key={stat}
        label={
          stat === "totalOutstanding" ? "Total Outstanding" : "CIBIL Score"
        }
        initialValue={currentValue}
        prefix={stat === "totalOutstanding" ? "₹" : undefined}
        onSave={(v) => {
          if (stat === "totalOutstanding") setTotalOutstanding(v);
          else setCibilScore(v);
          setSelectedStat(null);
          setEditPanelContent(null);
        }}
        onClose={() => {
          setSelectedStat(null);
          setEditPanelContent(null);
        }}
      />
    );
  };

  // ── Scrub state ────────────────────────────────────────────────────────────
  const [scrubTasks, setScrubTasks]               = useState<ScrubTask[]>([]);
  const [approvalOpen, setApprovalOpen]           = useState(false);
  const [selectedScrubTask, setSelectedScrubTask] = useState<ScrubTask | null>(null);
  const tabsRef                                   = useRef<HTMLDivElement>(null);

  // Derived scrub values
  const latestScrub  = scrubTasks.length > 0 ? scrubTasks[scrubTasks.length - 1] : null;
  const latestCfg    = latestScrub ? SCRUB_STATUS_CONFIG[latestScrub.status] : null;
  const pendingCount = scrubTasks.filter((t) => t.status === "scrub-check-pending").length;

  // Dynamic stage for header — auto-updates from scrub status
  const displayStage = latestScrub
    ? SCRUB_STATUS_CONFIG[latestScrub.status].clientStage
    : "DCP_AGREEMENT_SIGNED";

  const handleCheckLenderMatch = () => {
    const el = document.getElementById("lender-match");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // ── Scrub handlers ─────────────────────────────────────────────────────────
  const handleRequestScrub = () => {
    const newTask: ScrubTask = {
      id: Date.now().toString(),
      kfsId:           CLIENT_KFS_ID,
      mobileNumber:    CLIENT_MOBILE,
      companyName:     CLIENT_COMPANY,
      companyCategory: CLIENT_CATEGORY,
      location:        CLIENT_LOCATION,
      status:          "scrub-check-pending",
      requestedAt:     new Date().toISOString(),
      assignedTL:      ASSIGNED_TL,
    };
    setScrubTasks((prev) => [...prev, newTask]);
  };

  const handleScrubApproval = (
    taskId: string,
    status: ScrubStatus,
    comment: string
  ) => {
    setScrubTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status,
              comment: comment || undefined,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
    setApprovalOpen(false);
    setSelectedScrubTask(null);
  };

  const handleScrubFileClick = (task: ScrubTask) => {
    setActiveView("main");
    setActiveTab("profile");
    setSelectedScrubTask(task);
    setApprovalOpen(true);
  };

  const handleTLViewClient = (_task: ScrubTask) => {
    setActiveView("main");
    setActiveTab("profile");
    setSelectedScrubTask(null);
  };

  const cibilScoreClass =
    cibilScore >= 750
      ? "text-green-600"
      : cibilScore >= 650
      ? "text-amber-600"
      : "text-red-600";

  // ── Render ─────────────────────────────────────────────────────────────────
  const renderMainContent = () => {
    switch (activeView) {
      case "request-details":
        return <RequestDetailsView onClose={() => setActiveView("main")} />;
      case "request-documents":
        return <RequestDocumentsView onClose={() => setActiveView("main")} />;
      case "assign-sales-rep":
        return <AssignSalesRepView onClose={() => setActiveView("main")} />;
      case "tl-tasks":
        return (
          <TLScrubTasksView
            tasks={scrubTasks}
            onClose={() => setActiveView("main")}
            onViewClient={handleTLViewClient}
            onApprove={handleScrubApproval}
          />
        );
      default:
        return (
          <div className="w-full px-6 pt-5 pb-8">

            {/* ── Stat boxes + global actions row ── */}
            <div className="flex items-center gap-4 mb-5">
              <StatBox
                label="Total Outstanding"
                value={`₹${totalOutstanding.toLocaleString()}`}
                isEditing={isEditingCreditors}
                isSelected={selectedStat === "totalOutstanding"}
                onClick={() => {
                  if (selectedStat === "totalOutstanding") {
                    setSelectedStat(null);
                    setEditPanelContent(null);
                  } else {
                    openStatEdit("totalOutstanding");
                  }
                }}
              />
              <StatBox
                label="CIBIL Score"
                value={String(cibilScore)}
                valueClass={cibilScoreClass}
                isEditing={isEditingCreditors}
                isSelected={selectedStat === "cibilScore"}
                onClick={() => {
                  if (selectedStat === "cibilScore") {
                    setSelectedStat(null);
                    setEditPanelContent(null);
                  } else {
                    openStatEdit("cibilScore");
                  }
                }}
              />

              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`gap-1.5 text-xs h-9 ${
                        isEditingCreditors
                          ? "border-primary text-primary bg-primary/5"
                          : ""
                      }`}
                    >
                      Actions <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem
                      className="gap-2 text-sm cursor-pointer"
                      onClick={() =>
                        setIsEditingCreditors(!isEditingCreditors)
                      }
                    >
                      {isEditingCreditors ? (
                        <>
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-green-700 font-medium">
                            Save Changes
                          </span>
                        </>
                      ) : (
                        <>
                          <Pencil className="h-4 w-4" />
                          Edit
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs h-9 text-muted-foreground hover:text-foreground"
                  onClick={() => {}}
                >
                  <Download className="h-3.5 w-3.5" />
                  Download CSV
                </Button>
              </div>
            </div>

            {/* ── Scrub Approval Flow Banner ── */}
            {latestScrub && latestCfg && (
              <div
                className={`mb-5 flex items-center gap-3 rounded-xl border px-4 py-3 ${latestCfg.bgClass}`}
              >
                <ShieldCheck
                  className={`h-5 w-5 shrink-0 ${latestCfg.colorClass}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                    Scrub Approval Flow &amp; Client File Stage
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className={`text-xs border ${latestCfg.badgeClass}`}
                    >
                      {latestCfg.label}
                    </Badge>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span
                      className={`text-sm font-semibold ${latestCfg.colorClass}`}
                    >
                      {latestCfg.clientStage}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs shrink-0"
                  onClick={() => setActiveView("tl-tasks")}
                >
                  Review
                </Button>
              </div>
            )}

            {/* ── Tabs ── */}
            <div ref={tabsRef}>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <div className="flex justify-center mb-5">
                  <TabsList className="bg-card border h-10 p-1">
                    <TabsTrigger
                      value="profile"
                      className="text-xs font-medium px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      PROFILE
                    </TabsTrigger>
                    <TabsTrigger
                      value="creditor"
                      className="text-xs font-medium px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      CREDITOR
                    </TabsTrigger>
                    <TabsTrigger
                      value="calculator"
                      className="text-xs font-medium px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      CALCULATOR
                    </TabsTrigger>
                    <TabsTrigger
                      value="documents"
                      className="text-xs font-medium px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      DOCUMENTS
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="profile">
                  <ProfileTab onCheckLenderMatch={handleCheckLenderMatch} />
                </TabsContent>

                <TabsContent value="creditor">
                  <CreditorTab
                    included={included}
                    setIncluded={setIncluded}
                    excluded={excluded}
                    setExcluded={setExcluded}
                    isEditing={isEditingCreditors}
                    onSetEditPanel={setEditPanelContent}
                  />
                </TabsContent>

                <TabsContent value="calculator">
                  <CalculatorTab
                    included={included}
                    setIncluded={setIncluded}
                    excluded={excluded}
                    setExcluded={setExcluded}
                    stcIds={stcIds}
                    onToggleStc={handleToggleStc}
                  />
                </TabsContent>

                <TabsContent value="documents">
                  <DocumentsTab
                    isEditing={isEditingCreditors}
                    onSetEditPanel={setEditPanelContent}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        );
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <ClientHeader
          clientName="Saurabh Deshpande"
          clientId="KFSAPP-INH-0226-2362704"
          stage={displayStage}
          phone="77210 69734"
          channel="DCP"
          onCheckLenderMatch={handleCheckLenderMatch}
        />

        <div className="flex flex-1 overflow-hidden">
          <LeftSidebar
            pendingScrubCount={pendingCount}
            onTLTasksClick={() => setActiveView("tl-tasks")}
          />
          <main className="flex-1 overflow-y-auto">
            {renderMainContent()}
          </main>
          <RightPanel
            editContent={editPanelContent}
            onRequestDetails={() => setActiveView("request-details")}
            onRequestDocuments={() => setActiveView("request-documents")}
            onAssignSalesRep={() => setActiveView("assign-sales-rep")}
            onEmployerList={() => setEmployerModalOpen(true)}
            onServiceability={() => setServiceabilityModalOpen(true)}
            onLenderPolicy={() => {}}
            scrubTasks={scrubTasks}
            onRequestScrub={handleRequestScrub}
            onScrubFileClick={handleScrubFileClick}
          />
        </div>

        <EmployerListModal
          open={employerModalOpen}
          onOpenChange={setEmployerModalOpen}
        />
        <ServiceabilityListModal
          open={serviceabilityModalOpen}
          onOpenChange={setServiceabilityModalOpen}
        />

        <ScrubApprovalModal
          open={approvalOpen}
          onOpenChange={setApprovalOpen}
          task={selectedScrubTask}
          onSubmit={handleScrubApproval}
        />
      </div>
    </TooltipProvider>
  );
};

export default Index;
