import PersonalDetailsAccordion from "./PersonalDetailsAccordion";
import AddressCard from "./AddressCard";
import EmploymentDetailsCard from "./EmploymentDetailsCard";
import IncomeSourcesCard from "./IncomeSourcesCard";
import BankAccountCard from "./BankAccountCard";
import YearsStayCard from "./YearsStayCard";
import ReferencePersonCard from "./ReferencePersonCard";

const SecondaryLoginTab = () => {
  return (
    <div className="space-y-5">
      <PersonalDetailsAccordion />
      <AddressCard />
      <EmploymentDetailsCard />
      <IncomeSourcesCard />
      <BankAccountCard />
      <YearsStayCard />
      <ReferencePersonCard personNumber={1} />
      <ReferencePersonCard personNumber={2} />
    </div>
  );
};

export default SecondaryLoginTab;
