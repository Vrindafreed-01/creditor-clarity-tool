import PreQualificationCard from "./PreQualificationCard";
import PersonalDetailsAccordion from "./PersonalDetailsAccordion";
import AddressCard from "./AddressCard";
import EmploymentDetailsCard from "./EmploymentDetailsCard";
import IncomeSourcesCard from "./IncomeSourcesCard";
import BankAccountCard from "./BankAccountCard";
import YearsStayCard from "./YearsStayCard";
import ReferencePersonCard from "./ReferencePersonCard";
import LenderMatchTable from "./LenderMatchTable";

interface ProfileTabProps {
  onCheckLenderMatch: () => void;
}

const ProfileTab = ({ onCheckLenderMatch }: ProfileTabProps) => {
  return (
    <div className="space-y-5">
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
    </div>
  );
};

export default ProfileTab;
