import PreQualificationCard from "./PreQualificationCard";
import IncomeSourcesCard from "./IncomeSourcesCard";
import YearsStayCard from "./YearsStayCard";
import LenderMatchTable from "./LenderMatchTable";

interface ProfileTabProps {
  onCheckLenderMatch: () => void;
}

const ProfileTab = ({ onCheckLenderMatch }: ProfileTabProps) => {
  return (
    <div className="space-y-5">
      <PreQualificationCard onCheckLenderMatch={onCheckLenderMatch} />
      <IncomeSourcesCard />
      <YearsStayCard />
      <LenderMatchTable />
    </div>
  );
};

export default ProfileTab;
