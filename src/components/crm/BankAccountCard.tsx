import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BankAccountCard = () => {
  const [data, setData] = useState({
    bankName: "",
    ifscCode: "",
    accountNumber: "",
  });

  const update = (key: string, value: string) => setData({ ...data, [key]: value });

  return (
    <div className="bg-card rounded-lg border p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Bank Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <Label className="crm-field-label">Bank Name</Label>
          <Input value={data.bankName} onChange={(e) => update("bankName", e.target.value)} className="h-9 text-sm" placeholder="e.g. HDFC Bank" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">IFSC Code</Label>
          <Input value={data.ifscCode} onChange={(e) => update("ifscCode", e.target.value)} className="h-9 text-sm" placeholder="e.g. HDFC0001234" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Account No</Label>
          <Input value={data.accountNumber} onChange={(e) => update("accountNumber", e.target.value)} className="h-9 text-sm" />
        </div>
      </div>
    </div>
  );
};

export default BankAccountCard;
