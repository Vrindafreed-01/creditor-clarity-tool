import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import ClientHeader from "@/components/crm/ClientHeader";
import LeftSidebar from "@/components/crm/LeftSidebar";
import RightPanel from "@/components/crm/RightPanel";
import ProfileTab from "@/components/crm/ProfileTab";
import CreditorTab from "@/components/crm/CreditorTab";
import DocumentsTab from "@/components/crm/DocumentsTab";
import CalculatorTab from "@/components/crm/CalculatorTab";

import RequestDetailsModal from "@/components/crm/RequestDetailsModal";
import RequestDocumentsModal from "@/components/crm/RequestDocumentsModal";

const Index = () => {
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestDocsModalOpen, setRequestDocsModalOpen] = useState(false);

  const handleCheckLenderMatch = () => {
    const el = document.getElementById("lender-match");
    if (el) el.scrollIntoView({ behavior: "smooth" });
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
          onRequestDetails={() => setRequestModalOpen(true)}
          onRequestDocuments={() => setRequestDocsModalOpen(true)}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Left icon sidebar */}
          <LeftSidebar />

          {/* Main content area */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-[1100px] mx-auto px-6 py-5">
              <Tabs defaultValue="profile" className="w-full">
                <div className="flex justify-center mb-5">
                  <TabsList className="bg-card border h-10 p-1">
                    <TabsTrigger value="profile" className="text-xs font-medium px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      PROFILE
                    </TabsTrigger>
                    <TabsTrigger value="creditor" className="text-xs font-medium px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      CREDITOR
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="text-xs font-medium px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      DOCUMENTS
                    </TabsTrigger>
                    <TabsTrigger value="calculator" className="text-xs font-medium px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      CALCULATOR
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="profile">
                  <ProfileTab onCheckLenderMatch={handleCheckLenderMatch} />
                </TabsContent>
                <TabsContent value="creditor">
                  <CreditorTab />
                </TabsContent>
                <TabsContent value="documents">
                  <DocumentsTab />
                </TabsContent>
                <TabsContent value="calculator">
                  <CalculatorTab />
                </TabsContent>
              </Tabs>
            </div>
          </main>

          {/* Right panel */}
          <RightPanel />
        </div>

        <RequestDetailsModal open={requestModalOpen} onOpenChange={setRequestModalOpen} />
        <RequestDocumentsModal open={requestDocsModalOpen} onOpenChange={setRequestDocsModalOpen} />
      </div>
    </TooltipProvider>
  );
};

export default Index;
