import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const IncomeSourcesCard = () => {
  const [data, setData] = useState({
    inHandSalary: "39,000",
    businessIncome: "0",
    otherIncome: "18,000",
    familySupport: "0",
  });

  const parseNum = (val: string) => parseInt(val.replace(/,/g, ""), 10) || 0;
  const total = parseNum(data.inHandSalary) + parseNum(data.businessIncome) + parseNum(data.otherIncome) + parseNum(data.familySupport);

  const update = (key: string, value: string) => setData({ ...data, [key]: value });

  return (
    <div className="bg-card rounded-lg border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Income Sources</h3>
        <Badge className="bg-primary text-primary-foreground text-xs px-3 py-1">
          TOTAL: ₹{total.toLocaleString("en-IN")}
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <Label className="crm-field-label">In hand Salary</Label>
          <div className="relative">
            <span className="absolute left-2.5 top-2 text-sm text-muted-foreground">₹</span>
            <Input value={data.inHandSalary} onChange={(e) => update("inHandSalary", e.target.value)} className="h-9 text-sm pl-6" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Business Income</Label>
          <div className="relative">
            <span className="absolute left-2.5 top-2 text-sm text-muted-foreground">₹</span>
            <Input value={data.businessIncome} onChange={(e) => update("businessIncome", e.target.value)} className="h-9 text-sm pl-6" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Other Income</Label>
          <div className="relative">
            <span className="absolute left-2.5 top-2 text-sm text-muted-foreground">₹</span>
            <Input value={data.otherIncome} onChange={(e) => update("otherIncome", e.target.value)} className="h-9 text-sm pl-6" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Family Support</Label>
          <div className="relative">
            <span className="absolute left-2.5 top-2 text-sm text-muted-foreground">₹</span>
            <Input value={data.familySupport} onChange={(e) => update("familySupport", e.target.value)} className="h-9 text-sm pl-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeSourcesCard;
