import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
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

type ActiveView = "main" | "request-details" | "request-documents" | "assign-sales-rep";

const Index = () => {
  const [activeView, setActiveView] = useState<ActiveView>("main");
  const [employerModalOpen, setEmployerModalOpen] = useState(false);
  const [serviceabilityModalOpen, setServiceabilityModalOpen] = useState(false);

  const handleCheckLenderMatch = () => {
    const el = document.getElementById("lender-match");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const renderMainContent = () => {
    switch (activeView) {
      case "request-details":
        return <RequestDetailsView onClose={() => setActiveView("main")} />;
      case "request-documents":
        return <RequestDocumentsView onClose={() => setActiveView("main")} />;
      case "assign-sales-rep":
        return <AssignSalesRepView onClose={() => setActiveView("main")} />;
      default:
        return (
          <div className="max-w-[1100px] mx-auto px-6 py-5">
            <Tabs defaultValue="profile" className="w-full">
              <div className="flex justify-center mb-5">
                <TabsList className="bg-card border h-10 p-1">
                  <TabsTrigger value="profile" className="text-xs font-medium px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">PROFILE</TabsTrigger>
                  <TabsTrigger value="creditor" className="text-xs font-medium px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">CREDITOR</TabsTrigger>
                  <TabsTrigger value="documents" className="text-xs font-medium px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">DOCUMENTS</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="profile"><ProfileTab onCheckLenderMatch={handleCheckLenderMatch} /></TabsContent>
              <TabsContent value="creditor"><CreditorCalculatorTab /></TabsContent>
              <TabsContent value="documents"><DocumentsTab /></TabsContent>
            </Tabs>
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
          <LeftSidebar />
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
          />
        </div>

        <EmployerListModal open={employerModalOpen} onOpenChange={setEmployerModalOpen} />
        <ServiceabilityListModal open={serviceabilityModalOpen} onOpenChange={setServiceabilityModalOpen} />
      </div>
    </TooltipProvider>
  );
};

export default Index;
