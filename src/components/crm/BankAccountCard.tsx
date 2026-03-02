import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BankAccountCard = () => {
  const [data, setData] = useState({
    accountNumber: "",
    ifscCode: "",
    city: "",
  });

  const update = (key: string, value: string) => setData({ ...data, [key]: value });

  return (
    <div className="bg-card rounded-lg border p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Bank Account Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label className="crm-field-label">Bank Account Number</Label>
          <Input value={data.accountNumber} onChange={(e) => update("accountNumber", e.target.value)} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Bank IFSC Code</Label>
          <Input value={data.ifscCode} onChange={(e) => update("ifscCode", e.target.value)} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">City</Label>
          <Select value={data.city} onValueChange={(v) => update("city", v)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bangalore">Bangalore</SelectItem>
              <SelectItem value="Mumbai">Mumbai</SelectItem>
              <SelectItem value="Delhi">Delhi</SelectItem>
              <SelectItem value="Chennai">Chennai</SelectItem>
              <SelectItem value="Hyderabad">Hyderabad</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default BankAccountCard;
