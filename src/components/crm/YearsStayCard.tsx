import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const YearsStayCard = () => {
  const [presentYears, setPresentYears] = useState("");
  const [permanentYears, setPermanentYears] = useState("");

  return (
    <div className="bg-card rounded-lg border p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="crm-field-label">Total no of years stay at present address</Label>
          <Input value={presentYears} onChange={(e) => setPresentYears(e.target.value)} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Total no of years stay at permanent address</Label>
          <Input value={permanentYears} onChange={(e) => setPermanentYears(e.target.value)} className="h-9 text-sm" />
        </div>
      </div>
    </div>
  );
};

export default YearsStayCard;
