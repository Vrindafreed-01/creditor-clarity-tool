import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, FileText } from "lucide-react";
import PreQualificationCard from "./PreQualificationCard";
import PersonalDetailsAccordion from "./PersonalDetailsAccordion";
import AddressCard from "./AddressCard";
import EmploymentDetailsCard from "./EmploymentDetailsCard";
import IncomeSourcesCard from "./IncomeSourcesCard";
import BankAccountCard from "./BankAccountCard";
import YearsStayCard from "./YearsStayCard";
import ReferencePersonCard from "./ReferencePersonCard";
import LenderMatchTable from "./LenderMatchTable";
import EmployerListModal from "./EmployerListModal";
import ServiceabilityListModal from "./ServiceabilityListModal";

interface ProfileTabProps {
  onCheckLenderMatch: () => void;
}

const ProfileTab = ({ onCheckLenderMatch }: ProfileTabProps) => {
  const [employerModalOpen, setEmployerModalOpen] = useState(false);
  const [serviceabilityModalOpen, setServiceabilityModalOpen] = useState(false);

  return (
    <div className="space-y-5">
      {/* CTA buttons row */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={() => setEmployerModalOpen(true)}
        >
          <Building2 className="h-3.5 w-3.5" />
          Employer List
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={() => setServiceabilityModalOpen(true)}
        >
          <MapPin className="h-3.5 w-3.5" />
          Serviceability
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          disabled
        >
          <FileText className="h-3.5 w-3.5" />
          Lender Policy
        </Button>
      </div>

      <PreQualificationCard onCheckLenderMatch={onCheckLenderMatch} />
      <PersonalDetailsAccordion />
      <AddressCard />
      <EmploymentDetailsCard />
      <IncomeSourcesCard />
      <BankAccountCard />
      <YearsStayCard />
      <ReferencePersonCard personNumber={1} />
      <ReferencePersonCard personNumber={2} />
      <LenderMatchTable />

      <EmployerListModal open={employerModalOpen} onOpenChange={setEmployerModalOpen} />
      <ServiceabilityListModal open={serviceabilityModalOpen} onOpenChange={setServiceabilityModalOpen} />
    </div>
  );
};

export default ProfileTab;
