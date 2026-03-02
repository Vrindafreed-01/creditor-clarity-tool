import { useState } from "react";
import FOIRCalculator from "./FOIRCalculator";
import CreditorTable from "./CreditorTable";

const CreditorTab = () => {
  const [totalEMI, setTotalEMI] = useState(29000);

  return (
    <div className="space-y-5">
      <FOIRCalculator totalEMI={totalEMI} />
      <CreditorTable onEMIChange={setTotalEMI} />
    </div>
  );
};

export default CreditorTab;
