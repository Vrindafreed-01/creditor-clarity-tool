import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FOIRCalculator = () => {
  const [netSalary, setNetSalary] = useState(85000);
  const [totalEMI, setTotalEMI] = useState(29000);
  const [proposedEMI, setProposedEMI] = useState(15000);

  const calculations = useMemo(() => {
    const foirPercent = netSalary > 0 ? ((totalEMI + proposedEMI) / netSalary) * 100 : 0;
    const maxEligibleEMI = netSalary * 0.5 - totalEMI;
    const eligibleLoanAmount = maxEligibleEMI > 0 ? maxEligibleEMI * 60 : 0;
    return { foirPercent, maxEligibleEMI, eligibleLoanAmount };
  }, [netSalary, totalEMI, proposedEMI]);

  const foirColor =
    calculations.foirPercent <= 40
      ? "text-status-eligible-foreground bg-status-eligible-bg"
      : calculations.foirPercent <= 55
      ? "text-status-conditional-foreground bg-status-conditional-bg"
      : "text-status-ineligible-foreground bg-status-ineligible-bg";

  return (
    <div className="bg-card rounded-lg border p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">FOIR Calculator</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label className="crm-field-label">Net Salary (₹)</Label>
          <Input type="number" value={netSalary} onChange={(e) => setNetSalary(Number(e.target.value))} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Total EMI (₹)</Label>
          <Input type="number" value={totalEMI} onChange={(e) => setTotalEMI(Number(e.target.value))} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Proposed EMI (₹)</Label>
          <Input type="number" value={proposedEMI} onChange={(e) => setProposedEMI(Number(e.target.value))} className="h-9 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-5">
        <div className={`rounded-lg p-3 text-center ${foirColor}`}>
          <p className="text-xs font-medium opacity-70">FOIR %</p>
          <p className="text-xl font-bold">{calculations.foirPercent.toFixed(1)}%</p>
        </div>
        <div className="rounded-lg p-3 text-center bg-muted">
          <p className="text-xs font-medium text-muted-foreground">Max Eligible EMI</p>
          <p className="text-xl font-bold text-foreground">₹{calculations.maxEligibleEMI.toLocaleString()}</p>
        </div>
        <div className="rounded-lg p-3 text-center bg-muted">
          <p className="text-xs font-medium text-muted-foreground">Eligible Loan Amount</p>
          <p className="text-xl font-bold text-foreground">₹{calculations.eligibleLoanAmount.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default FOIRCalculator;
