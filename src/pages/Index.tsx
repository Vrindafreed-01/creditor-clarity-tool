import { useState, useRef, ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ClientHeader from "@/components/crm/ClientHeader";
import LeftSidebar from "@/components/crm/LeftSidebar";
import RightPanel from "@/components/crm/RightPanel";
import RequestDetailsView from "@/components/crm/RequestDetailsView";
import RequestDocumentsView from "@/components/crm/RequestDocumentsView";
import AssignSalesRepView from "@/components/crm/AssignSalesRepView";
import EmployerListModal from "@/components/crm/EmployerListModal";
import ServiceabilityListModal from "@/components/crm/ServiceabilityListModal";
import LenderPolicyModal from "@/components/crm/LenderPolicyModal";
import TLScrubTasksView from "@/components/crm/TLScrubTasksView";
import ScrubApprovalModal from "@/components/crm/ScrubApprovalModal";
import PortalPage from "@/components/crm/PortalPage";
import DashboardTab from "@/components/crm/DashboardTab";
import SecondaryLoginTab from "@/components/crm/SecondaryLoginTab";
import { Download, ShieldCheck, ArrowRight } from "lucide-react";
import { ScrubTask, ScrubStatus, SCRUB_STATUS_CONFIG } from "@/types/scrub";
import { Creditor, INITIAL_INCLUDED, INITIAL_EXCLUDED } from "@/types/creditor";

const CLIENT_KFS_ID = "KFSAPP-INH-0226-2362704";
const CLIENT_MOBILE = "77210 69734";
const CLIENT_COMPANY = "Infosys Technologies";
const CLIENT_CATEGORY = "IT / Software";
const CLIENT_LOCATION = "Pune";
const ASSIGNED_TL = "rajesh.sharma";

type ActiveView = "main" | "request-details" | "request-documents" | "assign-sales-rep" | "tl-tasks" | "portal";

const StatBox = ({ label, displayValue, valueClass = "text-foreground" }: { label: string; displayValue: string; valueClass?: string }) => (
  <div className="border-2 rounded-xl px-5 py-3 bg-card min-w-[160px] border-border">
    <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-xl font-bold leading-tight ${valueClass}`}>{displayValue}</p>
  </div>
);

const Index = () => {
  const [activeView, setActiveView] = useState<ActiveView>("main");
  const [activeTab, setActiveTab] = useState("overview");
  const [employerModalOpen, setEmployerModalOpen] = useState(false);
  const [serviceabilityModalOpen, setServiceabilityModalOpen] = useState(false);
  const [lenderPolicyModalOpen, setLenderPolicyModalOpen] = useState(false);
  const [editPanelContent] = useState<ReactNode>(null);
  const [totalOutstanding] = useState(1432155);
  const [cibilScore] = useState(751);
  const [included, setIncluded] = useState<Creditor[]>(INITIAL_INCLUDED);
  const [excluded, setExcluded] = useState<Creditor[]>(INITIAL_EXCLUDED);
  const [stcIds, setStcIds] = useState<Set<string>>(new Set());
  const [scrubTasks, setScrubTasks] = useState<ScrubTask[]>([]);
  const [approvalOpen, setApprovalOpen] = useState(false);
  const [selectedScrubTask, setSelectedScrubTask] = useState<ScrubTask | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [repActionStatus, setRepActionStatus] = useState<null | "rejected" | "scrub">(null);
  const [repActionReason, setRepActionReason] = useState("");
  const [requestDetailsStatus, setRequestDetailsStatus] = useState<"none" | "pending" | "completed">("none");
  const [requestDocsStatus, setRequestDocsStatus] = useState<"none" | "pending" | "completed">("none");
  const [sentDocRequests, setSentDocRequests] = useState<Array<{docLabel: string; months: string[]; comment: string}>>([]);
  const [sentDetailItems, setSentDetailItems] = useState<string[]>([]);

  const handleToggleStc = (id: string) => {
    setStcIds((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  };

  const latestScrub = scrubTasks.length > 0 ? scrubTasks[scrubTasks.length - 1] : null;
  const latestCfg = latestScrub ? SCRUB_STATUS_CONFIG[latestScrub.status] : null;
  const pendingCount = scrubTasks.filter((t) => t.status === "scrub-check-pending").length;

  const displayStage = repActionStatus === "rejected" ? "File Rejected"
    : repActionStatus === "scrub" ? "Scrub Requested"
    : latestScrub ? SCRUB_STATUS_CONFIG[latestScrub.status].clientStage
    : "DCP_AGREEMENT_SIGNED";

  const handleCheckLenderMatch = () => { const el = document.getElementById("lender-match"); if (el) el.scrollIntoView({ behavior: "smooth" }); };
  const handleRepActionSubmit = (action: "rejected" | "scrub", reason?: string) => { setRepActionStatus(action); if (reason) setRepActionReason(reason); };

  const handleRequestScrub = () => {
    setScrubTasks((prev) => [...prev, {
      id: Date.now().toString(), kfsId: CLIENT_KFS_ID, mobileNumber: CLIENT_MOBILE,
      companyName: CLIENT_COMPANY, companyCategory: CLIENT_CATEGORY, location: CLIENT_LOCATION,
      status: "scrub-check-pending", requestedAt: new Date().toISOString(), assignedTL: ASSIGNED_TL,
    }]);
  };

  const handleScrubApproval = (taskId: string, status: ScrubStatus, comment: string) => {
    setScrubTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status, comment: comment || undefined, updatedAt: new Date().toISOString() } : t));
    setApprovalOpen(false);
    setSelectedScrubTask(null);
  };

  const handleScrubFileClick = (task: ScrubTask) => { setActiveView("main"); setActiveTab("overview"); setSelectedScrubTask(task); setApprovalOpen(true); };
  const handleTLViewClient = (_task: ScrubTask) => { setActiveView("main"); setActiveTab("overview"); setSelectedScrubTask(null); };

  const cibilScoreClass = cibilScore >= 750 ? "text-green-600" : cibilScore >= 650 ? "text-amber-600" : "text-red-600";

  const renderMainContent = () => {
    switch (activeView) {
      case "request-details": return <RequestDetailsView onClose={() => setActiveView("main")} />;
      case "request-documents": return <RequestDocumentsView onClose={() => setActiveView("main")} />;
      case "assign-sales-rep": return <AssignSalesRepView onClose={() => setActiveView("main")} />;
      case "tl-tasks": return <TLScrubTasksView tasks={scrubTasks} onClose={() => setActiveView("main")} onViewClient={handleTLViewClient} onApprove={handleScrubApproval} />;
      case "portal": return <PortalPage onBack={() => setActiveView("main")} />;
      default:
        return (
          <div className="w-full px-6 pt-5 pb-8">
            <div className="flex items-center gap-4 mb-5">
              <StatBox label="Total Outstanding" displayValue={`₹${totalOutstanding.toLocaleString()}`} />
              <StatBox label="CIBIL Score" displayValue={String(cibilScore)} valueClass={cibilScoreClass} />
              <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs h-9 text-muted-foreground hover:text-foreground" onClick={() => {}}>
                  <Download className="h-3.5 w-3.5" /> Download CSV
                </Button>
              </div>
            </div>
            {latestScrub && latestCfg && (
              <div className={`mb-5 flex items-center gap-3 rounded-xl border px-4 py-3 ${latestCfg.bgClass}`}>
                <ShieldCheck className={`h-5 w-5 shrink-0 ${latestCfg.colorClass}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">Scrub Approval Flow &amp; Client File Stage</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className={`text-xs border ${latestCfg.badgeClass}`}>{latestCfg.label}</Badge>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className={`text-sm font-semibold ${latestCfg.colorClass}`}>{latestCfg.clientStage}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="h-7 text-xs shrink-0" onClick={() => setActiveView("tl-tasks")}>Review</Button>
              </div>
            )}
            <div ref={tabsRef}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex justify-center mb-5">
                  <TabsList className="bg-card border h-10 p-1">
                    <TabsTrigger value="overview" className="text-xs font-medium px-5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">QUALIFICATION DETAILS</TabsTrigger>
                    <TabsTrigger value="secondary-login" className="text-xs font-medium px-5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">PRE LOGIN DETAILS</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="overview">
                  <DashboardTab included={included} setIncluded={setIncluded} excluded={excluded} setExcluded={setExcluded} stcIds={stcIds} onToggleStc={handleToggleStc} />
                </TabsContent>
                <TabsContent value="secondary-login">
                  <SecondaryLoginTab />
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
        <ClientHeader clientName="Saurabh Deshpande" clientId="KFSAPP-INH-0226-2362704" stage={displayStage} phone="77210 69734" channel="DCP" onCheckLenderMatch={handleCheckLenderMatch} onPortalClick={() => setActiveView("portal")} />
        {activeView === "portal" ? (
          <main className="flex-1 overflow-y-auto">{renderMainContent()}</main>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            <LeftSidebar pendingScrubCount={pendingCount} onTLTasksClick={() => setActiveView("tl-tasks")} />
            <main className="flex-1 overflow-y-auto">{renderMainContent()}</main>
            <RightPanel
              editContent={editPanelContent}
              onRequestDetails={() => setActiveView("request-details")}
              onRequestDocuments={() => setActiveView("request-documents")}
              onAssignSalesRep={() => setActiveView("assign-sales-rep")}
              onEmployerList={() => setEmployerModalOpen(true)}
              onServiceability={() => setServiceabilityModalOpen(true)}
              onLenderPolicy={() => setLenderPolicyModalOpen(true)}
              scrubTasks={scrubTasks}
              onRequestScrub={handleRequestScrub}
              onScrubFileClick={handleScrubFileClick}
              onRepActionSubmit={handleRepActionSubmit}
              requestDetailsStatus={requestDetailsStatus}
              requestDocsStatus={requestDocsStatus}
              sentDocRequests={sentDocRequests}
              sentDetailItems={sentDetailItems}
            />
          </div>
        )}
        <EmployerListModal open={employerModalOpen} onOpenChange={setEmployerModalOpen} />
        <ServiceabilityListModal open={serviceabilityModalOpen} onOpenChange={setServiceabilityModalOpen} />
        <LenderPolicyModal open={lenderPolicyModalOpen} onOpenChange={setLenderPolicyModalOpen} />
        <ScrubApprovalModal open={approvalOpen} onOpenChange={setApprovalOpen} task={selectedScrubTask} onSubmit={handleScrubApproval} />
      </div>
    </TooltipProvider>
  );
};

export default Index;
