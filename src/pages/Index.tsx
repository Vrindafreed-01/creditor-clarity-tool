import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientHeader from "@/components/crm/ClientHeader";
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
    <div className="min-h-screen bg-background">
      <ClientHeader
        clientName="Rahul Sharma"
        clientId="CLT-2024-00847"
        stage="Qualified"
        onCheckLenderMatch={handleCheckLenderMatch}
        onRequestDetails={() => setRequestModalOpen(true)}
        onRequestDocuments={() => setRequestDocsModalOpen(true)}
      />

      <div className="max-w-[1400px] mx-auto px-6 py-5">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="bg-card border h-10 p-1 mb-5">
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

          <TabsContent value="profile">
            <ProfileTab onCheckLenderMatch={handleCheckLenderMatch} />
          </TabsContent>
          <TabsContent value="creditor">
            <CreditorTab />
          </TabsContent>
          <TabsContent value="documents">
            <DocumentsTab />
          </TabsContent>
          <TabsContent value="summary">
            <SummaryTab />
          </TabsContent>
          <TabsContent value="calculator">
            <CalculatorTab />
          </TabsContent>
        </Tabs>
      </div>

      <RequestDetailsModal open={requestModalOpen} onOpenChange={setRequestModalOpen} />
      <RequestDocumentsModal open={requestDocsModalOpen} onOpenChange={setRequestDocsModalOpen} />
    </div>
  );
};

export default Index;
