import PreQualificationCard from "./PreQualificationCard";
import PersonalDetailsAccordion from "./PersonalDetailsAccordion";
import AddressCard from "./AddressCard";
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
      <LenderMatchTable />
    </div>
  );
};

export default ProfileTab;
