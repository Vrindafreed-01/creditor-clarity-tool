import { useState, useRef } from "react";
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
import CreditorCalculatorTab from "@/components/crm/CreditorCalculatorTab";
import DocumentsTab from "@/components/crm/DocumentsTab";
import RequestDetailsView from "@/components/crm/RequestDetailsView";
import RequestDocumentsView from "@/components/crm/RequestDocumentsView";
import AssignSalesRepView from "@/components/crm/AssignSalesRepView";
import EmployerListModal from "@/components/crm/EmployerListModal";
import ServiceabilityListModal from "@/components/crm/ServiceabilityListModal";
import TLScrubTasksView from "@/components/crm/TLScrubTasksView";
import ScrubApprovalModal from "@/components/crm/ScrubApprovalModal";
import { ChevronDown, Download, Pencil, Check, ShieldCheck, ArrowRight } from "lucide-react";
import { ScrubTask, ScrubStatus, SCRUB_STATUS_CONFIG } from "@/types/scrub";

// ── Mock client data (used when creating scrub tasks) ─────────────────────────
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

const TOTAL_OUTSTANDING = 1432155;
const CIBIL_SCORE       = 751;

const StatBox = ({
  label,
  value,
  valueClass = "text-foreground",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) => (
  <div className="border-2 border-border rounded-xl px-5 py-3 bg-card min-w-[160px]">
    <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-widest mb-1">
      {label}
    </p>
    <p className={`text-xl font-bold leading-tight ${valueClass}`}>{value}</p>
  </div>
);

const Index = () => {
  const [activeView, setActiveView]           = useState<ActiveView>("main");
  const [activeTab, setActiveTab]             = useState("profile");
  const [employerModalOpen, setEmployerModalOpen]           = useState(false);
  const [serviceabilityModalOpen, setServiceabilityModalOpen] = useState(false);
  const [isEditingCreditors, setIsEditingCreditors]         = useState(false);

  // ── Scrub state ──────────────────────────────────────────────────────────────
  const [scrubTasks, setScrubTasks]           = useState<ScrubTask[]>([]);
  const [approvalOpen, setApprovalOpen]       = useState(false);
  const [selectedScrubTask, setSelectedScrubTask] = useState<ScrubTask | null>(null);
  const tabsRef                               = useRef<HTMLDivElement>(null);

  // Derived
  const latestScrub    = scrubTasks.length > 0 ? scrubTasks[scrubTasks.length - 1] : null;
  const latestCfg      = latestScrub ? SCRUB_STATUS_CONFIG[latestScrub.status] : null;
  const pendingCount   = scrubTasks.filter((t) => t.status === "scrub-check-pending").length;

  const handleCheckLenderMatch = () => {
    const el = document.getElementById("lender-match");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // ── Scrub handlers ───────────────────────────────────────────────────────────
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

  const handleScrubApproval = (taskId: string, status: ScrubStatus, comment: string) => {
    setScrubTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status, comment: comment || undefined, updatedAt: new Date().toISOString() }
          : t
      )
    );
    setApprovalOpen(false);
    setSelectedScrubTask(null);
  };

  /** Clicking a scrub file in the right panel → navigate to main + profile tab */
  const handleScrubFileClick = (task: ScrubTask) => {
    setActiveView("main");
    setActiveTab("profile");
    // open the approval modal so TL can also act directly
    setSelectedScrubTask(task);
    setApprovalOpen(true);
  };

  const handleTLViewClient = (task: ScrubTask) => {
    setActiveView("main");
    setActiveTab("profile");
    setSelectedScrubTask(null);
  };

  const cibildScoreClass =
    CIBIL_SCORE >= 750 ? "text-green-600" : CIBIL_SCORE >= 650 ? "text-amber-600" : "text-red-600";

  // ── Render ───────────────────────────────────────────────────────────────────
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
          <div className="max-w-[1100px] mx-auto px-6 pt-5 pb-8">

            {/* ── Stat boxes + global actions row ── */}
            <div className="flex items-center gap-4 mb-4">
              <StatBox
                label="Total Outstanding"
                value={`₹${TOTAL_OUTSTANDING.toLocaleString()}`}
              />
              <StatBox
                label="CIBIL Score"
                value={String(CIBIL_SCORE)}
                valueClass={cibildScoreClass}
              />

              <div className="ml-auto flex items-center gap-2">
                {/* Edit dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`gap-1.5 text-xs h-9 ${
                        isEditingCreditors ? "border-primary text-primary bg-primary/5" : ""
                      }`}
                    >
                      Actions <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem
                      className="gap-2 text-sm cursor-pointer"
                      onClick={() => setIsEditingCreditors(!isEditingCreditors)}
                    >
                      {isEditingCreditors ? (
                        <>
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-green-700 font-medium">Save Changes</span>
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

                {/* Download CSV */}
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

            {/* ── Scrub Approval Flow Banner (shown when scrub task exists) ── */}
            {latestScrub && latestCfg && (
              <div className={`mb-5 flex items-center gap-3 rounded-xl border px-4 py-3 ${latestCfg.bgClass}`}>
                <ShieldCheck className={`h-5 w-5 shrink-0 ${latestCfg.colorClass}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                    Scrub Approval Flow &amp; Client File Stage
                    <span className="ml-1.5 font-normal normal-case text-muted-foreground/60">(WIP)</span>
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className={`text-xs border ${latestCfg.badgeClass}`}>
                      {latestCfg.label}
                    </Badge>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className={`text-sm font-semibold ${latestCfg.colorClass}`}>
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
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                  <CreditorCalculatorTab isEditing={isEditingCreditors} />
                </TabsContent>
                <TabsContent value="documents">
                  <DocumentsTab isEditing={isEditingCreditors} />
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
          stage="DCP_AGREEMENT_SIGNED"
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

        <EmployerListModal open={employerModalOpen} onOpenChange={setEmployerModalOpen} />
        <ServiceabilityListModal open={serviceabilityModalOpen} onOpenChange={setServiceabilityModalOpen} />

        {/* Global scrub approval modal (triggered from scrub file click or TL tasks) */}
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
