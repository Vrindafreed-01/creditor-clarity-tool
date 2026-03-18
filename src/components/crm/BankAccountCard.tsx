import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BankData } from "@/types/client";

interface BankAccountCardProps {
  data: BankData;
  onChange: (data: BankData) => void;
  requestedDetailIds?: string[];
}

const BankAccountCard = ({ data, onChange }: BankAccountCardProps) => {
  const update = (key: keyof BankData, value: string) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="bg-card rounded-lg border p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Bank &amp; Residence Duration</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <Label className="crm-field-label">Total Years at Present Address</Label>
          <Input value={data.yearsAtPresentAddress} onChange={(e) => update("yearsAtPresentAddress", e.target.value)} className="h-9 text-sm" placeholder="e.g. 3" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Total Years at Permanent Address</Label>
          <Input value={data.yearsAtPermanentAddress} onChange={(e) => update("yearsAtPermanentAddress", e.target.value)} className="h-9 text-sm" placeholder="e.g. 10" />
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
