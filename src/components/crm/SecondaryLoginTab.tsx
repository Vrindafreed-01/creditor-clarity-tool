import PersonalDetailsAccordion from "./PersonalDetailsAccordion";
import AddressCard from "./AddressCard";
import EmploymentDetailsCard from "./EmploymentDetailsCard";
import BankAccountCard from "./BankAccountCard";
import ReferencePersonCard from "./ReferencePersonCard";
import {
  PersonalData,
  AddressData,
  EmploymentData,
  BankData,
  RefPersonData,
} from "@/types/client";

interface SecondaryLoginTabProps {
  personalData: PersonalData;
  onPersonalChange: (data: PersonalData) => void;
  addressData: AddressData;
  onAddressChange: (data: AddressData) => void;
  employmentData: EmploymentData;
  onEmploymentChange: (data: EmploymentData) => void;
  bankData: BankData;
  onBankChange: (data: BankData) => void;
  ref1Data: RefPersonData;
  onRef1Change: (data: RefPersonData) => void;
  ref2Data: RefPersonData;
  onRef2Change: (data: RefPersonData) => void;
  requestedDetailIds?: string[];
}

const SecondaryLoginTab = ({
  personalData,
  onPersonalChange,
  addressData,
  onAddressChange,
  employmentData,
  onEmploymentChange,
  bankData,
  onBankChange,
  ref1Data,
  onRef1Change,
  ref2Data,
  onRef2Change,
  requestedDetailIds = [],
}: SecondaryLoginTabProps) => {
  return (
    <div className="space-y-5">
      <PersonalDetailsAccordion
        data={personalData}
        onChange={onPersonalChange}
        requestedDetailIds={requestedDetailIds}
      />
      <AddressCard
        data={addressData}
        onChange={onAddressChange}
        requestedDetailIds={requestedDetailIds}
      />
      <EmploymentDetailsCard
        data={employmentData}
        onChange={onEmploymentChange}
        requestedDetailIds={requestedDetailIds}
      />
      <BankAccountCard
        data={bankData}
        onChange={onBankChange}
        requestedDetailIds={requestedDetailIds}
      />
      <ReferencePersonCard
        personNumber={1}
        data={ref1Data}
        onChange={onRef1Change}
        requestedDetailIds={requestedDetailIds}
      />
      <ReferencePersonCard
        personNumber={2}
        data={ref2Data}
        onChange={onRef2Change}
        requestedDetailIds={requestedDetailIds}
      />
    </div>
  );
};

export default SecondaryLoginTab;
